package com.css436.program5.repository;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBQueryExpression;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBSaveExpression;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBScanExpression;
import com.amazonaws.services.dynamodbv2.model.AttributeValue;
import com.amazonaws.services.dynamodbv2.model.ComparisonOperator;
import com.amazonaws.services.dynamodbv2.model.ExpectedAttributeValue;
import com.css436.program5.model.Movie;
import com.css436.program5.model.Person;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class MainRepository {

    @Autowired
    private DynamoDBMapper mapper;

    @Value("${dynamodb.config.gsi}")
    private String dynamoDbGsiOnLastName;

    public List<Movie> getMovies(){
        DynamoDBScanExpression scanExpression = new DynamoDBScanExpression();
        List<Movie> movies = mapper.scan(Movie.class, scanExpression);
        return movies;
    }

    public Movie getMovieByName(String name) {
        return mapper.load(Movie.class, name);
    }

    public void updateMovie(Movie movie) {
        mapper.save(movie, buildExpression(movie));
    }

//    public Person getPerson(String firstName, String lastName){
//        return mapper.load(Person.class, firstName, lastName);
//    }
//
//    public List<Person> getPersonByFirstName(String firstName) {
//        Person person = new Person();
//        person.setFirstName(firstName);
//
//        DynamoDBQueryExpression<Person> queryExpression = new DynamoDBQueryExpression<Person>()
//                .withHashKeyValues(person)
//                .withConsistentRead(false);
//
//        List<Person> persons = mapper.query(Person.class, queryExpression);
//        return persons;
//    }
//
//    public List<Person> getPersonByLastName(String lastName) {
//        Person person = new Person();
//        person.setLastName(lastName);
//
//        DynamoDBQueryExpression<Person> queryExpression = new DynamoDBQueryExpression<Person>()
//                .withHashKeyValues(person)
//                .withIndexName(dynamoDbGsiOnLastName)
//                .withConsistentRead(false);
//
//        List<Person> persons = mapper.query(Person.class, queryExpression);
//        return persons;
//    }
//
//    public void savePersons(List<Person> persons) {
//        mapper.batchSave(persons);
//    }
//
//    public List<Person> getAll() {
//        DynamoDBScanExpression scanExpression = new DynamoDBScanExpression();
//        List<Person> persons = mapper.scan(Person.class, scanExpression);
//        return persons;
//    }
//
//    public void deleteAll(List<Person> persons) {
//        mapper.batchDelete(persons);
//    }

//    public void updatePerson(Person person) {
//        mapper.save(person, buildExpression(person));
//    }

    public DynamoDBSaveExpression buildExpression(Movie movie) {
        DynamoDBSaveExpression saveExpression = new DynamoDBSaveExpression();
        Map<String, ExpectedAttributeValue> expected = new HashMap<>();
        expected.put("name", new ExpectedAttributeValue(new AttributeValue(movie.getTitle()))
                .withComparisonOperator(ComparisonOperator.EQ)
        );
        saveExpression.setExpected(expected);
        return saveExpression;
    }
}
