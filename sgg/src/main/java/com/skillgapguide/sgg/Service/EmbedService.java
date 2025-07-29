package com.skillgapguide.sgg.Service;

import com.skillgapguide.sgg.Entity.JobDesSkillsEmbedding;
import com.skillgapguide.sgg.Entity.JobMatchEmbedding;
import com.skillgapguide.sgg.Entity.UserCvSkillsEmbedding;
import com.skillgapguide.sgg.Repository.JobDesSkillsEmbeddingRepository;
import com.skillgapguide.sgg.Repository.JobMatchEmbeddingRepository;
import com.skillgapguide.sgg.Repository.UserCvSkillsEmbeddingRepository;
import com.skillgapguide.sgg.Repository.UserCvSkillsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.configurationprocessor.json.JSONArray;
import org.springframework.boot.configurationprocessor.json.JSONException;
import org.springframework.boot.configurationprocessor.json.JSONObject;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.Optional;

@Service
public class EmbedService {
    @Autowired
    private UserCvSkillsEmbeddingRepository userCvSkillsEmbeddingRepository;
    @Autowired
    private JobDesSkillsEmbeddingRepository jobDesSkillsEmbeddingRepository;
    @Autowired
    private JobMatchEmbeddingRepository jobMatchEmbeddingRepository;
    public static double[] fetchEmbedding(String text) throws JSONException, IOException, InterruptedException {
        String prompt="search_query: " + text ;
        HttpClient client = HttpClient.newHttpClient();
        String requestBody = "{\"text\": \"" + prompt + "\"}";
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("http://localhost:8000/embed_nomicv2"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(requestBody, StandardCharsets.UTF_8))
                .build();
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        JSONObject embeddingObject = new JSONObject(response.body());
        JSONArray embeddingArray = embeddingObject.getJSONArray("embedding");
        double[] vector = new double[embeddingArray.length()];
        for (int i = 0; i < embeddingArray.length(); i++) {
            vector[i] = embeddingArray.getDouble(i);
        }
        return vector;
    }
    private void saveCvSkillEmbedding( String skill, double[] vector) throws JSONException {
        UserCvSkillsEmbedding te = new UserCvSkillsEmbedding();
        te.setSkill(skill);
        te.setEmbeddingJson(new JSONArray(vector).toString());
        userCvSkillsEmbeddingRepository.save(te);
    }
    private void saveJobSkillEmbedding(String skill, double[] vector) throws JSONException {
        JobDesSkillsEmbedding te = new JobDesSkillsEmbedding();
        te.setSkill(skill);
        te.setEmbeddingJson(new JSONArray(vector).toString());
        jobDesSkillsEmbeddingRepository.save(te);
    }
    public double[] getCvSkillEmbedding(String skill) throws Exception {
        try{
            Optional<UserCvSkillsEmbedding> opt = userCvSkillsEmbeddingRepository.findBySkill(skill);
            if (opt.isPresent()) {
                JSONArray arr = new JSONArray(opt.get().getEmbeddingJson());
                double[] vector = new double[arr.length()];
                for (int i = 0; i < arr.length(); i++) {
                    vector[i] = arr.getDouble(i);
                }
                return vector;
            } else {
                double[] vector = fetchEmbedding(skill);
                saveCvSkillEmbedding(skill, vector);
                return vector;
            }
        } catch (Exception ex){
            throw new Exception(ex.getMessage());
        }

    }
    public double[] getJobDesSkillEmbedding(String skill) throws Exception {
        try{
            Optional<JobDesSkillsEmbedding> opt = jobDesSkillsEmbeddingRepository.findBySkill(skill);
            if (opt.isPresent()) {
                JSONArray arr = new JSONArray(opt.get().getEmbeddingJson());
                double[] vector = new double[arr.length()];
                for (int i = 0; i < arr.length(); i++) {
                    vector[i] = arr.getDouble(i);
                }
                return vector;
            } else {
                double[] vector = fetchEmbedding(skill);
                saveJobSkillEmbedding(skill, vector);
                return vector;
            }
        } catch (Exception ex){
            throw new Exception(ex.getMessage());
        }

    }
    public static double[] fetchEmbeddingNomicv15(String text) throws JSONException, IOException, InterruptedException {
        String prompt = "search_query: " + text;
        JSONObject json = new JSONObject();
        json.put("text", prompt);

        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("http://localhost:8000/embed_nomicv1.5"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(json.toString(), StandardCharsets.UTF_8))
                .build();
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        JSONObject embeddingObject = new JSONObject(response.body());
        JSONArray embeddingArray = embeddingObject.getJSONArray("embedding");
        double[] vector = new double[embeddingArray.length()];
        for (int i = 0; i < embeddingArray.length(); i++) {
            vector[i] = embeddingArray.getDouble(i);
        }
        return vector;
    }
    private void saveCvJobMatchEmbedding( String text, double[] vector) throws JSONException {
        JobMatchEmbedding te = new JobMatchEmbedding();
        te.setText(text);
        te.setEmbeddingJson(new JSONArray(vector).toString());
        jobMatchEmbeddingRepository.save(te);
    }
}
