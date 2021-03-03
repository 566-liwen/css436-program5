package com.css436.program4.model;

import com.amazonaws.services.dynamodbv2.datamodeling.*;
import org.springframework.beans.factory.annotation.Value;

import java.io.Serializable;
import java.util.LinkedHashMap;
import java.util.Map;

@DynamoDBTable(tableName = "persons")
public class Person implements Serializable {
    private static final long serialVersionUID = 1L;

    //private String name;
    private String firstName;

    private String lastName;

    private LinkedHashMap<String, String> information;

    //@DynamoDBHashKey(attributeName = "name")
    //@DynamoDBRangeKey(attributeName = "name")
    //@DynamoDBAttribute

//    public Person(String name, String firstName, String lastName) {
//        this.name = name;
//        this.firstName = firstName;
//        this.lastName = lastName;
//    }
    public Person(){}

    public Person(String firstName, String lastName) {
        //this.name = name;
        this.firstName = firstName;
        this.lastName = lastName;
    }

//    @DynamoDBHashKey(attributeName = "name")
//    public String getName() {
//        return name;
//    }
//
//    public void setName(String name) {
//        this.name = name;
//    }

    @DynamoDBHashKey(attributeName = "firstName")
    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    @DynamoDBRangeKey(attributeName = "lastName")
    @DynamoDBIndexHashKey(globalSecondaryIndexName = "lastName-index")
    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    @DynamoDBAttribute
    public LinkedHashMap<String, String> getInformation() {
        return information;
    }

    public void setInformation(LinkedHashMap<String, String> information) {
        this.information = information;
    }
}
