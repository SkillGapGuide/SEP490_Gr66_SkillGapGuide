package com.skillgapguide.sgg.Dto;

public record RegisterRequest(
        String email,

        String password,

        String fullName,

        String phone


    ){}
