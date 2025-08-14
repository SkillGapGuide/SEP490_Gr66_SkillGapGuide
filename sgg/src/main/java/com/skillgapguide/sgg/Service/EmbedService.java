package com.skillgapguide.sgg.Service;

import com.skillgapguide.sgg.Entity.JobDesSkillsEmbedding;
import com.skillgapguide.sgg.Entity.JobMatchEmbedding;
import com.skillgapguide.sgg.Entity.UserCvSkillsEmbedding;
import com.skillgapguide.sgg.Repository.JobDesSkillsEmbeddingRepository;
import com.skillgapguide.sgg.Repository.JobMatchEmbeddingRepository;
import com.skillgapguide.sgg.Repository.UserCvSkillsEmbeddingRepository;
import com.skillgapguide.sgg.Repository.UserCvSkillsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
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

    private final ObjectMapper objectMapper = new ObjectMapper();

    public double[] fetchEmbeddingNomicv2(String text) throws IOException, InterruptedException {
        String prompt = "search_query: " + text;
        // Force HTTP/1.1 to avoid upgrade issues with embedding service
        HttpClient client = HttpClient.newBuilder()
                .version(HttpClient.Version.HTTP_1_1)
                .build();

        // Use proper TextInput format as expected by FastAPI service
        var requestObj = new java.util.HashMap<String, String>();
        requestObj.put("text", prompt);
        String requestBody = objectMapper.writeValueAsString(requestObj);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("http://localhost:8000/embed_nomicv2"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(requestBody, StandardCharsets.UTF_8))
                .build();
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        JsonNode responseJson = objectMapper.readTree(response.body());
        JsonNode embeddingArray = responseJson.get("embedding");

        if (embeddingArray == null || !embeddingArray.isArray()) {
            throw new RuntimeException("Invalid response from embedding service: " + response.body());
        }

        double[] vector = new double[embeddingArray.size()];
        for (int i = 0; i < embeddingArray.size(); i++) {
            vector[i] = embeddingArray.get(i).asDouble();
        }
        return vector;
    }

    private void saveCvSkillEmbedding(String skill, double[] vector) throws IOException {
        UserCvSkillsEmbedding te = new UserCvSkillsEmbedding();
        te.setSkill(skill);
        te.setEmbeddingJson(objectMapper.writeValueAsString(vector));
        userCvSkillsEmbeddingRepository.save(te);
    }

    private void saveJobSkillEmbedding(String skill, double[] vector) throws IOException {
        JobDesSkillsEmbedding te = new JobDesSkillsEmbedding();
        te.setSkill(skill);
        te.setEmbeddingJson(objectMapper.writeValueAsString(vector));
        jobDesSkillsEmbeddingRepository.save(te);
    }

    public double[] getCvSkillEmbedding(String skill) throws Exception {
        try {
            Optional<UserCvSkillsEmbedding> opt = userCvSkillsEmbeddingRepository.findBySkill(skill);
            if (opt.isPresent()) {
                double[] vector = objectMapper.readValue(opt.get().getEmbeddingJson(), double[].class);
                return vector;
            } else {
                double[] vector = fetchEmbeddingNomicv15(skill.toLowerCase());
                saveCvSkillEmbedding(skill, vector);
                return vector;
            }
        } catch (Exception ex) {
            throw new Exception(ex.getMessage());
        }

    }

    public double[] getJobDesSkillEmbedding(String skill) throws Exception {
        try {
            Optional<JobDesSkillsEmbedding> opt = jobDesSkillsEmbeddingRepository.findBySkill(skill);
            if (opt.isPresent()) {
                double[] vector = objectMapper.readValue(opt.get().getEmbeddingJson(), double[].class);
                return vector;
            } else {
                double[] vector = fetchEmbeddingNomicv15(skill.toLowerCase());
                saveJobSkillEmbedding(skill, vector);
                return vector;
            }
        } catch (Exception ex) {
            throw new Exception(ex.getMessage());
        }

    }

    public double[] fetchEmbeddingNomicv15(String text) throws IOException, InterruptedException {
        String prompt = "search_query: " + text;

        // Use proper TextInput format as expected by FastAPI service
        var requestObj = new java.util.HashMap<String, String>();
        requestObj.put("text", prompt);
        String requestBody = objectMapper.writeValueAsString(requestObj);

        // Force HTTP/1.1 to avoid upgrade issues with embedding service
        HttpClient client = HttpClient.newBuilder()
                .version(HttpClient.Version.HTTP_1_1)
                .build();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("http://localhost:8000/embed_nomicv1.5"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(requestBody, StandardCharsets.UTF_8))
                .build();
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        JsonNode responseJson = objectMapper.readTree(response.body());
        JsonNode embeddingArray = responseJson.get("embedding");

        if (embeddingArray == null || !embeddingArray.isArray()) {
            throw new RuntimeException("Invalid response from embedding service: " + response.body());
        }

        double[] vector = new double[embeddingArray.size()];
        for (int i = 0; i < embeddingArray.size(); i++) {
            vector[i] = embeddingArray.get(i).asDouble();
        }
        return vector;
    }

    private void saveCvJobMatchEmbedding(String text, double[] vector) throws IOException {
        JobMatchEmbedding te = new JobMatchEmbedding();
        te.setText(text);
        te.setEmbeddingJson(objectMapper.writeValueAsString(vector));
        jobMatchEmbeddingRepository.save(te);
    }
}
