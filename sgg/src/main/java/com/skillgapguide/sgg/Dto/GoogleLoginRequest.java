package com.skillgapguide.sgg.Dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder

public class GoogleLoginRequest {
    private String email;
    private String name;
    private String avatar;
    private String accessToken;
    private String supabaseId;

}
