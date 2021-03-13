package com.css436.program5.service;

import com.amazonaws.services.dynamodbv2.xspec.N;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3URI;
import com.amazonaws.services.s3.model.ObjectListing;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.S3ObjectSummary;
import com.css436.program5.model.*;
import com.css436.program5.repository.MainRepository;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.io.StringWriter;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class MainService {

    @Value("${amazon.access.bucket}")
    private String awsBucket;

    @Value("${amazon.given.s3.url}")
    private String s3Url;

    @Value("${nyt.base.url}")
    private String nytBaseUrl;

    @Value("${nyt.api.key}")
    private String nytApiKey;

    @Autowired
    private AmazonS3 s3Client;

    @Autowired
    private MainRepository repository;

    private static Set<Integer> badStatusCodes = new HashSet<Integer>(Arrays.asList(408, 425, 429, 500, 503, 504));

    public List<Movie> getMovies(){
        List<Movie> movies = repository.getMovies();
        return movies;
    }

    public MoviesAndGenres getMoviesByGenre(List<Movie> movies, String genre) {
        Set<String> genres = new HashSet<>();
        List<Movie> subMovies = new ArrayList<>();
        for(Movie movie : movies) {
            for(String item : movie.getGenres()) {
                genres.add(item);
                if(item.toLowerCase().equals(genre)) {
                    subMovies.add(movie);
                }
            }
        }
        genres.add("All");
        if(subMovies.isEmpty()) {
            return new MoviesAndGenres(movies, genres);
        }
        return new MoviesAndGenres(subMovies, genres);
    }

    public Movie getMovieByName(String name) {
        //logic
        name = name.replace("%3A", ":");
        name = name.replace("%2C", ",");
        return repository.getMovieByName(name);
    }

    public Movie updateMovieWithReview(Movie movie){
        repository.updateMovie(movie);
        return movie;
    }

    public NytReview getNewYorkTimesReview(String name){
        String url = makeNytExternalApiUrl(name);
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
        JsonObject rawReviewObj = gson.fromJson(rawData, JsonObject.class);
        if(!rawReviewObj.has("results") || rawReviewObj.get("results").isJsonNull()) return null;
        JsonArray results = rawReviewObj.get("results").getAsJsonArray();
        if(results.size() == 0) return null ;
        JsonObject rawSingleReviewObj = results.get(0).getAsJsonObject();
        NytReview nytReview = new NytReview();
        if(rawSingleReviewObj.has("byline")){
            nytReview.setByline(rawSingleReviewObj.get("byline").getAsString());
        }
        if(rawSingleReviewObj.has("headline")){
            nytReview.setHeadline(rawSingleReviewObj.get("headline").getAsString());
        }
        if(rawSingleReviewObj.has("summary_short")){
            nytReview.setSummary(rawSingleReviewObj.get("summary_short").getAsString());
        }
        if(rawSingleReviewObj.has("publication_date")){
            nytReview.setPublicationDate(rawSingleReviewObj.get("publication_date").getAsString());
        }
        if(rawSingleReviewObj.has("link") && rawSingleReviewObj.get("link").getAsJsonObject().has("url")){
            nytReview.setUrl(rawSingleReviewObj.get("link").getAsJsonObject().get("url").getAsString());
        }
        return nytReview;
    }

    private String makeNytExternalApiUrl(String name){
        StringBuilder builder = new StringBuilder();
        builder.append(nytBaseUrl);
        builder.append("?query=");
        builder.append(name.replace(" ", "%20"));
        builder.append("&");
        builder.append("api-key=");
        builder.append(nytApiKey);
        return builder.toString().replace("%%", "%");
    }

    private boolean isBadStatusCode(int code) {
        return badStatusCodes.contains(code);
    }

    private HttpClient getClient() {
        HttpClient client = HttpClient.newBuilder()
                .followRedirects(HttpClient.Redirect.ALWAYS).build();
        return client;
    }

//    public List<Person> getPersonsByFilter(String firstName, String lastName) {
//        Person person = repository.getPerson(firstName,lastName);
//        return null;
//    }
//
//    public void loadDataFromCloud(){
//        String content;
//        try {
//            content = downloadDataFromCloud();
//        } catch (IOException  | URISyntaxException e) {
//            System.out.println("Unable to process given data.");
//            return;
//        }
//        if(content.isEmpty()){
//            System.out.println("Empty given data.");
//            return;
//        }
//        //saveToS3(content);
//        //saveToDb(content);
//    }
//
//    public void deleteData() {
//        //deleteDataFromS3();
//        //deleteDataFromDb();
//    }
//
//    /** s3 download txt */
//    private String downloadDataFromCloud() throws IOException, URISyntaxException {
//        URI fileToBeDownloaded = new URI(s3Url);
//
//        AmazonS3URI s3URI = new AmazonS3URI(fileToBeDownloaded);
//
//        S3Object object = s3Client.getObject(s3URI.getBucket(), s3URI.getKey());
//        InputStream objectData = object.getObjectContent();
//        StringWriter writer = new StringWriter();
//        IOUtils.copy(objectData, writer);
//        String content = writer.toString();
//        objectData.close();
//        return content;
//    }
//
//    private void saveToS3(String content){
////        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd-HH-mm-ss-SSS");
////        Date date = new Date();
////        String strDate = dateFormat.format(date);
////        String stringObjKeyName = date + ".txt";
//        String stringObjKeyName = "program4-file.txt";
//
//        s3Client.putObject(awsBucket, stringObjKeyName, content);
//    }
//
//    /** save s3 data into database*/
//    private void saveToDb(String content){
//        List<Person> persons = new ArrayList<>();
//        String[] rawPersonInfos = content.split("\\r?\\n");
//        for(String item : rawPersonInfos) {
//            String rawPersonInfo = item.trim();
//            String[] rawPerson = rawPersonInfo.split("\\s+");
//            if(rawPerson.length<2){
//                System.out.println("Less information for the person.");
//                continue;
//            }
//            String firstName = rawPerson[0];
//            String lastName = rawPerson[1];
//            LinkedHashMap<String, String> information = new LinkedHashMap<>();
//            if(rawPerson.length>2) {
//                for(int i=2; i<rawPerson.length; i++){
//                    String rawInfo = rawPerson[i];
//                    if(!rawInfo.contains("=")){
//                        continue;
//                    }
//                    String[] rawInfoParts = rawInfo.split("=");
//                    information.put(rawInfoParts[0].trim(), rawInfoParts[1].trim());
//                }
//            }
//            String name = firstName + "," + lastName;
//            //Person newPerson = new Person(name, firstName, lastName);
//            Person newPerson = new Person(firstName, lastName);
//            newPerson.setInformation(information);
//            persons.add(newPerson);
//        }
//        if(persons.isEmpty()) {
//            return;
//        }
//            repository.savePersons(persons);
//    }
//
//    private void deleteDataFromS3() {
//        ObjectListing objectListing = s3Client.listObjects(awsBucket);
//        while (true) {
//            Iterator<S3ObjectSummary> objIter = objectListing.getObjectSummaries().iterator();
//            while (objIter.hasNext()) {
//                s3Client.deleteObject(awsBucket, objIter.next().getKey());
//            }
//            if (objectListing.isTruncated()) {
//                objectListing = s3Client.listNextBatchOfObjects(objectListing);
//            } else {
//                break;
//            }
//        }
//    }
//
//    private void deleteDataFromDb(){
//        List<Person> persons = repository.getAll();
//        repository.deleteAll(persons);
//    }

}
