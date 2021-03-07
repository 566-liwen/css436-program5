package com.css436.program5.model;

import com.amazonaws.services.dynamodbv2.datamodeling.*;

import java.io.Serializable;
import java.util.LinkedHashMap;

@DynamoDBTable(tableName = "persons")
public class Person implements Serializable {
    private static final long serialVersionUID = 1L;

    //private String name;
    private String firstName;

    private String lastName;

    private LinkedHashMap<String, String> information;

    public Person(){}

    public Person(String firstName, String lastName) {
        //this.name = name;
        this.firstName = firstName;
        this.lastName = lastName;
    }

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
