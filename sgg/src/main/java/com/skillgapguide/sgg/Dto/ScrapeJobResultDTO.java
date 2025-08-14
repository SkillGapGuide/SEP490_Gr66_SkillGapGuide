// ScrapeJobResultDTO.java
package com.skillgapguide.sgg.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ScrapeJobResultDTO {
    private List<Map<String, Object>> savedJobs; // chứa thông tin từng job đã lưu
    private List<String> logs;                  // log crawl
    private int totalJobs;                       // tổng số job đã lưu
}
