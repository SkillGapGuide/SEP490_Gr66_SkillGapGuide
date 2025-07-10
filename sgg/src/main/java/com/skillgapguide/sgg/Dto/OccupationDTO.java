package com.skillgapguide.sgg.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OccupationDTO {
    private Integer id;
    private String name;
    private Integer groupId;
    private String groupName;
    private String status;
}
