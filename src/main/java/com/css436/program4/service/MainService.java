package com.css436.program4.service;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.auth.profile.ProfileCredentialsProvider;
import com.amazonaws.regions.Region;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBScanExpression;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.AmazonS3URI;
import com.amazonaws.services.s3.model.GetObjectRequest;
import com.amazonaws.services.s3.model.ObjectListing;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.S3ObjectSummary;
import com.css436.program4.model.Person;
import com.css436.program4.repository.MainRepository;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.io.StringWriter;
import java.net.URI;
import java.net.URISyntaxException;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class MainService {

    @Value("${amazon.access.bucket}")
    private String awsBucket;

    @Value("${amazon.given.s3.url}")
    private String s3Url;

//    @Value("${amazon.s3.url}")
//    private String url;
//
//    @Value("${amazon.s3.url.bucket}")
//    private String bucket;
//
//    @Value("${amazon.s3.url.key}")
//    private String key;
    @Autowired
    private AmazonS3 s3Client;

    @Autowired
    private MainRepository repository;

    public List<Person> getPersonsByFilter(String firstName, String lastName) {
        if(firstName.isEmpty() && lastName.isEmpty()) {
            return new ArrayList<>();
        }
        if(firstName.isEmpty()) {
            return repository.getPersonByLastName(lastName);
        }
        if(lastName.isEmpty()) {
            return repository.getPersonByFirstName(firstName);
        }
        Person person = repository.getPerson(firstName,lastName);
        if(person == null) {
            return new ArrayList<>();
        }
        return new ArrayList<>(Arrays. asList(person));
    }

    public void loadDataFromCloud(){
        String content;
        try {
            content = downloadDataFromCloud();
        } catch (IOException  | URISyntaxException e) {
            System.out.println("Unable to process given data.");
            return;
        }
        if(content.isEmpty()){
            System.out.println("Empty given data.");
            return;
        }
        saveToS3(content);
        saveToDb(content);
    }

    public void deleteData() {
        deleteDataFromS3();
        deleteDataFromDb();
    }

    /** s3 download txt */
    private String downloadDataFromCloud() throws IOException, URISyntaxException {
        URI fileToBeDownloaded = new URI(s3Url);

        AmazonS3URI s3URI = new AmazonS3URI(fileToBeDownloaded);

        S3Object object = s3Client.getObject(s3URI.getBucket(), s3URI.getKey());
        InputStream objectData = object.getObjectContent();
        StringWriter writer = new StringWriter();
        IOUtils.copy(objectData, writer);
        String content = writer.toString();
        objectData.close();
        return content;
    }

    private void saveToS3(String content){
//        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd-HH-mm-ss-SSS");
//        Date date = new Date();
//        String strDate = dateFormat.format(date);
//        String stringObjKeyName = date + ".txt";
        String stringObjKeyName = "program4-file.txt";

        s3Client.putObject(awsBucket, stringObjKeyName, content);
    }

    /** save s3 data into database*/
    private void saveToDb(String content){
        List<Person> persons = new ArrayList<>();
        String[] rawPersonInfos = content.split("\\r?\\n");
        for(String item : rawPersonInfos) {
            String rawPersonInfo = item.trim();
            String[] rawPerson = rawPersonInfo.split("\\s+");
            if(rawPerson.length<2){
                System.out.println("Less information for the person.");
                continue;
            }
            String firstName = rawPerson[0];
            String lastName = rawPerson[1];
            LinkedHashMap<String, String> information = new LinkedHashMap<>();
            if(rawPerson.length>2) {
                for(int i=2; i<rawPerson.length; i++){
                    String rawInfo = rawPerson[i];
                    if(!rawInfo.contains("=")){
                        continue;
                    }
                    String[] rawInfoParts = rawInfo.split("=");
                    information.put(rawInfoParts[0].trim(), rawInfoParts[1].trim());
                }
            }
            String name = firstName + "," + lastName;
            //Person newPerson = new Person(name, firstName, lastName);
            Person newPerson = new Person(firstName, lastName);
            newPerson.setInformation(information);
            persons.add(newPerson);
        }
        if(persons.isEmpty()) {
            return;
        }
            repository.savePersons(persons);
    }

    private void deleteDataFromS3() {
        ObjectListing objectListing = s3Client.listObjects(awsBucket);
        while (true) {
            Iterator<S3ObjectSummary> objIter = objectListing.getObjectSummaries().iterator();
            while (objIter.hasNext()) {
                s3Client.deleteObject(awsBucket, objIter.next().getKey());
            }
            if (objectListing.isTruncated()) {
                objectListing = s3Client.listNextBatchOfObjects(objectListing);
            } else {
                break;
            }
        }
    }

    private void deleteDataFromDb(){
        List<Person> persons = repository.getAll();
        repository.deleteAll(persons);
    }

}
