package com.skillgapguide.sgg.Dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;
@Getter
@Setter
public class ExtractJDSkillDTO {
    private List<String> skills;
    private String title;
    private String description;
    private String company;
}
