package com.skillgapguide.sgg.Entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
@Data
@Entity
@Table(name = "job_des_file")
public class JobDesFile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private Integer userId;
    private String fileName;
    private String filePath;
    private String fileType;
    private LocalDateTime uploadDate;
}
