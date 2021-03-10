package com.css436.program5.helper;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBScanExpression;
import com.amazonaws.services.s3.AmazonS3;
import com.css436.program5.model.Movie;
import com.css436.program5.model.MovieGenre;
import com.css436.program5.model.RawMovieData;
import com.google.gson.JsonArray;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.*;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

@Component
public class DataHelper {
    @Autowired
    private AmazonS3 s3;

    @Autowired
    private DynamoDBMapper mapper;

    @Value("${tmdb.api.key}")
    private String tmdbKey;

    @Value("${tmdb.movie.params.base}")
    private String tmdbMovieBaseUrl;

    @Value("${tmdb.genre.params.base}")
    private String tmdbGenreBaseUrl;

    @Value("${tmdb.video.params.base.prefix}")
    private String tmdbVideoBasePrefixUrl;

    @Value("${tmdb.video.params.base.suffix}")
    private String tmdbVideoBaseSuffixUrl;

    @Value("${tmdb.params.language}")
    private String tmdbLanguage;

    @Value("${tmdb.params.year}")
    private String tmdbYear;

    @Value("${tmdb.params.region}")
    private String tmdbRegion;

    @Value("${tmdb.params.sortby}")
    private String tmdbSortBy;

    @Value("${tmdb.params.watchregion}")
    private String tmdbWatchRegion;

    @Value("${tmdb.numofpages}")
    private int numberOfPages;

    @Value("${tmdb.config.img.base}")
    private String movieImgBase;

    @Value("${tmdb.comfig.video.base}")
    private String movieVideoBase;

    private static Set<Integer> badStatusCodes = new HashSet<Integer>(Arrays.asList(408, 425, 429, 500, 503, 504));

    @EventListener(ContextRefreshedEvent.class)
    public void configDataAfterStartup() {
        System.out.println("Setting up data sets...");
        boolean isDataEmpty = checkEmptyData();
        if(!isDataEmpty){
            System.out.println("Database not empty. Finished.");
            return;
        }
        getAndConfigData();
        System.out.println("Database configured. Finished.");
    }

    private boolean checkEmptyData() {
        DynamoDBScanExpression scanExpression = new DynamoDBScanExpression();
        List<Movie> movies = mapper.scan(Movie.class, scanExpression);
        if(movies.size() == 0) return true;
        return false;
    }

    private void getAndConfigData() {
        //get genre from external api
        Map<Integer, String> genres = getGenre();
        //get data from external api
        List<RawMovieData.Result> rawData = new ArrayList<>();
        for(int i=1; i<=numberOfPages; i++) {

            RawMovieData rawMovieData = getData(i);
            if(rawMovieData == null || rawMovieData.getResults().size() == 0)  continue;
            rawData.addAll(rawMovieData.getResults());
        }
        if(rawData.isEmpty()) return;
        //massage data into entity
        List<Movie> movies = toMovieEntity(rawData, genres);
        //save data to db
        saveToDatabase(movies);
        //save data to s3
    }

    private RawMovieData getData(int numberOfPages){
        String url = makeExternalApiUrl(numberOfPages);
        HttpClient client = getClient();

        HttpResponse<String> response;
        int statusCode = 500;

        HttpRequest.Builder builder = HttpRequest.newBuilder()
            .uri(URI.create(url));
        HttpRequest request = builder
                .GET()
                .build();
        try {
            response = client.send(request,
                    HttpResponse.BodyHandlers.ofString());
            if(response!=null) {
                statusCode = response.statusCode();
            }
        } catch (IOException | InterruptedException e) {
            System.out.println("Unable to get data sets from api.");
            return null;
        }
        if(isBadStatusCode(statusCode)) {
            System.out.println("Unable to get data sets from api.");
            return null;
        }
        String rawData = response.body();
        Gson gson = new Gson();
        RawMovieData rawMovieData = gson.fromJson(rawData, RawMovieData.class );
        return rawMovieData;
    }

    public Map<Integer, String> getGenre(){
        String url = makeGenreExternalApiUrl();
        HttpClient client = getClient();

        HttpResponse<String> response;
        int statusCode = 500;

        HttpRequest.Builder builder = HttpRequest.newBuilder()
                .uri(URI.create(url));
        HttpRequest request = builder
                .GET()
                .build();
        try {
            response = client.send(request,
                    HttpResponse.BodyHandlers.ofString());
            if(response!=null) {
                statusCode = response.statusCode();
            }
        } catch (IOException | InterruptedException e) {
            System.out.println("Unable to get data sets from api.");
            return null;
        }
        if(isBadStatusCode(statusCode)) {
            System.out.println("Unable to get data sets from api.");
            return null;
        }
        String rawData = response.body();
        Gson gson = new Gson();
        MovieGenre genreObj = gson.fromJson(rawData, MovieGenre.class );
        Map<Integer, String> genreMap = new HashMap<>();
        for(MovieGenre.Genre genre : genreObj.getGenres()){
            genreMap.put(genre.getId(), genre.getName());
        }
        return genreMap;
    }

    public List<Movie> toMovieEntity(List<RawMovieData.Result> rawData, Map<Integer, String> genreMap) {
        List<Movie> movies = new ArrayList<>();
        for(RawMovieData.Result raw : rawData) {
            Movie movie = new Movie();
            movie.setTitle(raw.getTitle());
            movie.setOverview(raw.getOverview());
            movie.setOriginalLanguage(raw.getOriginal_language());
            movie.setReleaseDate(raw.getRelease_date());
            movie.setPosterPath(movieImgBase + raw.getPoster_path());
            List<String> genres = new ArrayList<>();
            for(int genreId : raw.getGenre_ids()){
                if(genreMap.containsKey(genreId)){
                    genres.add(genreMap.get(genreId));
                }
            }
            movie.setGenres(genres);
            int externalMovieId = raw.getId();
            String movieVideoUrl = getMovieVideoUrl(externalMovieId);
            if(!movieVideoUrl.isEmpty()) {
                movie.setVideoPath(movieVideoBase + movieVideoUrl);
            }
            movies.add(movie);
        }
        return movies;
    }

    public void saveToDatabase(List<Movie> movies) {
        mapper.batchSave(movies);
    }

    private String getMovieVideoUrl(int movieId) {
        String url = makeVideoExternalApiUrl(movieId);
        HttpClient client = getClient();

        HttpResponse<String> response;
        int statusCode = 500;

        HttpRequest.Builder builder = HttpRequest.newBuilder()
                .uri(URI.create(url));
        HttpRequest request = builder
                .GET()
                .build();
        try {
            response = client.send(request,
                    HttpResponse.BodyHandlers.ofString());
            if(response!=null) {
                statusCode = response.statusCode();
            }
        } catch (IOException | InterruptedException e) {
            System.out.println("Unable to get data sets from api.");
            return null;
        }
        if(isBadStatusCode(statusCode)) {
            System.out.println("Unable to get data sets from api.");
            return null;
        }
        String rawData = response.body();
        Gson gson = new Gson();
        JsonObject videoObj = gson.fromJson(rawData, JsonObject.class);
        if(videoObj == null) return "";
        JsonArray contentArray = videoObj.get("results").getAsJsonArray();
        if(contentArray.size() == 0) return "";
        String firstVideokey = contentArray.get(0).getAsJsonObject().get("key").getAsString();
        return firstVideokey;
    }

    private String makeExternalApiUrl(int pageNumber){
        StringBuilder builder = new StringBuilder();
        builder.append(tmdbMovieBaseUrl);
        builder.append("?");
        builder.append("api_key=" + tmdbKey);
        builder.append("&");
        builder.append("language=" + tmdbLanguage);
        builder.append("&");
        builder.append("region=" + tmdbRegion);
        builder.append("&");
        builder.append("sort_by=" + tmdbSortBy);
        builder.append("&");
        builder.append("year=" + tmdbYear);
        builder.append("&");
        builder.append("watch_region=" + tmdbWatchRegion);
        builder.append("&");
        builder.append("page=" + pageNumber);
        return builder.toString();
    }

    private String makeGenreExternalApiUrl(){
        StringBuilder builder = new StringBuilder();
        builder.append(tmdbGenreBaseUrl);
        builder.append("?");
        builder.append("api_key=" + tmdbKey);
        builder.append("&");
        builder.append("language=" + tmdbLanguage);
        return builder.toString();
    }

    private String makeVideoExternalApiUrl(int movieId){
        StringBuilder builder = new StringBuilder();
        builder.append(tmdbVideoBasePrefixUrl);
        builder.append(movieId);
        builder.append(tmdbVideoBaseSuffixUrl);
        builder.append("?");
        builder.append("api_key=" + tmdbKey);
        builder.append("&");
        builder.append("language=" + tmdbLanguage);
        return builder.toString();
    }

    private boolean isBadStatusCode(int code) {
        return badStatusCodes.contains(code);
    }

    private HttpClient getClient() {
        HttpClient client = HttpClient.newBuilder()
                .followRedirects(HttpClient.Redirect.ALWAYS).build();
        return client;
    }
}
