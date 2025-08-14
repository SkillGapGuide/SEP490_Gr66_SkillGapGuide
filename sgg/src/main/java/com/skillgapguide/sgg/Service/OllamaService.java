package com.skillgapguide.sgg.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.skillgapguide.sgg.Response.AIResponse;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.List;
import java.util.Map;

public class OllamaService {
    private final WebClient webClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public OllamaService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder
                .baseUrl("http://localhost:1234")
                .build();
    }

    public Mono<String> callMistralApi(String prompt) {
        Map<String, Object> requestBody = Map.of(
                "model", "mistral:7b-instruct-v0.3-q4_0",
                "messages", List.of(
                        Map.of("role", "user", "content", prompt)
                ),
                "options", Map.of(
                        "temperature", 0.2,
                        "num_predict", 8192
                ),
                "stream", false
        );
        return webClient.post()
                .uri("/api/chat")
                .header("Accept", MediaType.APPLICATION_JSON_VALUE)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .flatMap(this::parseOllamaResponse)
                .timeout(Duration.ofMinutes(4))
                .onErrorResume(e -> Mono.just("Lỗi: " + e.getMessage()));
    }
    public Mono<String> callNomicApi(String prompt) {
        // Note: Ollama doesn't have embedding endpoint, this might need separate service
        // For now, keeping similar structure but may need external embedding service
        Map<String, Object> requestBody = Map.of(
                "model", "nomic-embed-text",
                "prompt", prompt
        );
        return webClient.post()
                .uri("/api/embeddings")
                .header("Accept", MediaType.APPLICATION_JSON_VALUE)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .timeout(Duration.ofMinutes(2))
                .onErrorResume(e -> Mono.just("Lỗi: " + e.getMessage()));
    }

    private Mono<String> parseOllamaResponse(String json) {
        return Mono.fromCallable(() -> {
            // Ollama response format might be different, try both formats
            try {
                AIResponse response = objectMapper.readValue(json, AIResponse.class);
                if (response.getChoices() != null && !response.getChoices().isEmpty()) {
                    return response.getChoices().get(0).getMessage().getContent();
                }
            } catch (Exception e) {
                // Try Ollama format: {"message":{"content":"response"}}
                @SuppressWarnings("unchecked")
                Map<String, Object> ollamaResponse = objectMapper.readValue(json, Map.class);
                Object messageObj = ollamaResponse.get("message");
                if (messageObj instanceof Map) {
                    @SuppressWarnings("unchecked")
                    Map<String, Object> message = (Map<String, Object>) messageObj;
                    if (message.containsKey("content")) {
                        return (String) message.get("content");
                    }
                }
            }
            return "Không có phản hồi từ AI";
        }).onErrorResume(e -> Mono.just("Lỗi parse JSON: " + e.getMessage()));
    }
}
