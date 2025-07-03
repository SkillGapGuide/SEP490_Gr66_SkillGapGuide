package com.skillgapguide.sgg.Controller;

import com.skillgapguide.sgg.Dto.ScrapeRequest;
import com.skillgapguide.sgg.Service.JobScrapingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/scrape")
@RequiredArgsConstructor
public class JobScraperController {
    private final JobScrapingService jobScrapingService;
    @PostMapping("/job")
    public ResponseEntity<String> scrapeSingleJob(@RequestBody ScrapeRequest request) {
        if (request.getUrl() == null || request.getUrl().isEmpty()) {
            return ResponseEntity.badRequest().body("URL không được để trống.");
        }
        try {
            // Gọi service để thực hiện việc cào và lưu
            jobScrapingService.scrapeAndSaveJob(request.getUrl());
            return ResponseEntity.ok("Đã cào và lưu thành công công việc từ URL: " + request.getUrl());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Lỗi xảy ra khi cào dữ liệu: " + e.getMessage());
        }
    }
    @PostMapping("/crawl-10-jobs")
    public ResponseEntity<String> scrapeTop10JobsByCategory(@RequestBody ScrapeRequest request) {
        if (request.getUrl() == null || request.getUrl().isEmpty()) {
            return ResponseEntity.badRequest().body("URL không được để trống.");
        }
        try {
            // Gọi service để thực hiện việc cào và lưu 10 công việc đầu tiên
            jobScrapingService.scrapeAndSaveTop10JobsByCategory(request.getUrl());
            return ResponseEntity.ok("Đã cào và lưu 10 công việc đầu tiên từ URL: " + request.getUrl());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Lỗi xảy ra khi cào dữ liệu: " + e.getMessage());
        }
    }
    @PostMapping("/crawl-sales-logistics")
    public ResponseEntity<String> scrapeTop10SalesLogisticsJobs() {
        try {
            // Gọi service để thực hiện việc cào 10 công việc từ danh mục Sales Logistics
            jobScrapingService.scrapeTop10SalesImportAndExportLogisticsJobs();
            return ResponseEntity.ok("Đã cào và lưu 10 công việc từ danh mục Sales Logistics.");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Lỗi xảy ra khi cào dữ liệu: " + e.getMessage());
        }
    }
}
