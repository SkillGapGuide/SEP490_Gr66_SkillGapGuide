package com.skillgapguide.sgg.Dto;

import lombok.Data;

@Data
public class UserDTO {
    private Integer id;
    private String email;
    private String fullName;
    private String phone;
    private String avatar;
    private String role;
}
