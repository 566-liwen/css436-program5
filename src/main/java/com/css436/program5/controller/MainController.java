package com.css436.program5.controller;

import com.css436.program5.model.Movie;
import com.css436.program5.model.Person;
import com.css436.program5.service.MainService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
//@CrossOrigin(origins = "http://ec2-52-42-101-9.us-west-2.compute.amazonaws.com:5000")
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/movies")
public class MainController {

    @Autowired
    private MainService service;

    @GetMapping
    public ResponseEntity<List<Movie>> getMovies() {
        List<Movie> movies = service.getMovies();
        System.out.println(movies.get(0).getName());
        return new ResponseEntity<>(movies, HttpStatus.OK);
    }

    @GetMapping(value = "/{name}")
    public ResponseEntity<Movie> getMovieByName(@PathVariable String name) {
        Movie movie = service.getMovieByName(name);
        return new ResponseEntity<>(movie, HttpStatus.OK);
    }

//    @GetMapping
//    public ResponseEntity<List<Person>> getPerson(@RequestParam String firstName, @RequestParam String lastName) {
//        List<Person> persons = service.getPersonsByFilter(firstName, lastName);
//        return new ResponseEntity<>(persons, HttpStatus.OK);
//    }

//    @PostMapping
//    public void loadDataFromCloud(){
//        service.loadDataFromCloud();
//    }
//
//    @PostMapping(value = "/remover")
//    public void deleteData(){
//        service.deleteData();
//    }
}
