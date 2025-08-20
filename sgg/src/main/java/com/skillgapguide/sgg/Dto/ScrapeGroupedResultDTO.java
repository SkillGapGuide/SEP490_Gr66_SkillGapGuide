// ScrapeGroupedResultDTO.java
package com.skillgapguide.sgg.Dto;

import com.skillgapguide.sgg.Entity.Course;
import java.util.List;
import java.util.Map;

public class ScrapeGroupedResultDTO {
    private Map<String, List<Course>> data;
    private String message;

    public ScrapeGroupedResultDTO(Map<String, List<Course>> data, String message) {
        this.data = data;
        this.message = message;
    }

    public Map<String, List<Course>> getData() {
        return data;
    }

    public void setData(Map<String, List<Course>> data) {
        this.data = data;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
