package com.skillgapguide.sgg.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SpecializationDTO {
    private Integer id;
    private String name;
    private Integer occupationId;
    private String occupationName;
    private String status;
}
