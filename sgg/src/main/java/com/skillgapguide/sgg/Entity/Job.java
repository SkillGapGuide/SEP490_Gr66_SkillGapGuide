package com.skillgapguide.sgg.Entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "Job")
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "job_id")
    private Integer jobId;
    @Column(name = "cv_id")
    private Integer cvId;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private String company;
    @Column(nullable = false)
    private String status;
    @Column(name = "source_url", unique = true, nullable = false, length = 512)
    private String sourceUrl;
}

