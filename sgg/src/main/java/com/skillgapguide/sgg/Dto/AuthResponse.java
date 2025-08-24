package com.skillgapguide.sgg.Dto;

public record AuthResponse(String token) {
    public String getToken() {
        return token;
    }
}


