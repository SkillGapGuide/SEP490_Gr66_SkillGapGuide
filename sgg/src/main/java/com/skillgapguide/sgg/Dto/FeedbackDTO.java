package com.skillgapguide.sgg.Dto;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.sql.Timestamp;
@Data
public class FeedbackDTO {
    @NotNull
    private Integer userId;
    @NotBlank
    private String content;
    @Min(1)
    @Max(5)
    private Integer star;
    private Timestamp createAt;
}
