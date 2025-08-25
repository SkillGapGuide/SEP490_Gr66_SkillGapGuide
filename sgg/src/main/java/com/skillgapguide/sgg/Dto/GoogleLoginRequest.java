package com.skillgapguide.sgg.Dto;

import lombok.*;

@Data
@Builder
@AllArgsConstructor
@Getter
@NoArgsConstructor
public class GoogleLoginRequest {
    private String email;
    private String name;
    private String avatar;
    private String accessToken;
    private String supabaseId;

    public GoogleLoginRequest(String s, String testUser, String image) {
        this.email = s;
        this.name = testUser;
        this.avatar = image;
    }
}
