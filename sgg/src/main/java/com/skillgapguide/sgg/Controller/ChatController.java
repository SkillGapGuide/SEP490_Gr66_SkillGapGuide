package com.skillgapguide.sgg.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private WebClient webClient;

    @PostMapping
    public Mono<String> chat(@RequestBody Map<String, String> payload) {
        String userInput = payload.get("input");
        Map<String, Object> requestBody = Map.of(
                "model", "mistralai/mistral-7b-instruct-v0.3",
                "messages", List.of(Map.of("role", "user", "content", userInput)),
                "temperature", 0.7,
                "max_tokens", 2048,  // Thêm giới hạn token
                "stream", false
        );

        return webClient.post()
                .uri("http://localhost:1234/v1/chat/completions")
                .header("Authorization", "Bearer lm-studio")
                .header("Accept", "application/json")  // Thêm header Accept
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .timeout(Duration.ofSeconds(120))
                .onErrorResume(e -> Mono.just("Lỗi: " + e.getMessage()));  // Xử lý lỗi
    }
}
