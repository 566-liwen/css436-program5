package com.css436.program4.controller;

import com.css436.program4.model.Person;
import com.css436.program4.service.MainService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/data")
public class MainController {

    @Autowired
    private MainService service;

    @GetMapping
    public ResponseEntity<List<Person>> getPerson(@RequestParam String firstName, @RequestParam String lastName) {
        List<Person> persons = service.getPersonsByFilter(firstName, lastName);
        return new ResponseEntity<>(persons, HttpStatus.OK);
    }

    @PostMapping
    public void loadDataFromCloud(){
        service.loadDataFromCloud();
    }

    @PostMapping(value = "/remover")
    public void deleteData(){
        service.deleteData();
    }
}
