package com.css436.program5.model;

import java.util.List;
import java.util.Set;

public class MoviesAndGenres {
    private List<Movie> movies;
    private Set<String> genres;

    public MoviesAndGenres(List<Movie> movies, Set<String> genres){
        this.movies = movies;
        this.genres = genres;
    }

    public List<Movie> getMovies() {
        return movies;
    }

    public void setMovies(List<Movie> movies) {
        this.movies = movies;
    }

    public Set<String> getGenres() {
        return genres;
    }

    public void setGenres(Set<String> genres) {
        this.genres = genres;
    }
}
