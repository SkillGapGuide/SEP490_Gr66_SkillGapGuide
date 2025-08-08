package com.skillgapguide.sgg.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AddSpecializationRequestDTO {
    private String name;
    private Integer occupationId;
    private String status;
    private String url;
}
