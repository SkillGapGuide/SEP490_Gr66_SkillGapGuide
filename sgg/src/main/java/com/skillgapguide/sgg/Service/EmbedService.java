package com.skillgapguide.sgg.Service;

import com.skillgapguide.sgg.Entity.JobDesSkillsEmbedding;
import com.skillgapguide.sgg.Entity.UserCvSkillsEmbedding;
import com.skillgapguide.sgg.Repository.JobDesSkillsEmbeddingRepository;
import com.skillgapguide.sgg.Repository.UserCvSkillsEmbeddingRepository;
import com.skillgapguide.sgg.Repository.UserCvSkillsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.configurationprocessor.json.JSONArray;
import org.springframework.boot.configurationprocessor.json.JSONException;
import org.springframework.boot.configurationprocessor.json.JSONObject;
import org.springframework.stereotype.Service;

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
    public static double[] fetchEmbedding(String text) throws JSONException, IOException, InterruptedException {
        HttpClient client = HttpClient.newHttpClient();
        String requestBody = "{\"text\":\"" + text + "\"}";
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("http://localhost:8000/embed"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(requestBody, StandardCharsets.UTF_8))
                .build();
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        JSONObject json = new JSONObject(response.body());
        JSONArray arr = json.getJSONArray("embedding");
        double[] vector = new double[arr.length()];
        for (int i = 0; i < arr.length(); i++) {
            vector[i] = arr.getDouble(i);
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
}
