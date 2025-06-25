package com.skillgapguide.sgg.Entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "Course")
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "course_id")
    private Integer courseId;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private String provider;
    @Column(name = "status")
    private String status;
    @Column(nullable = false)
    private String url;
    @Column(name = "create_at", nullable = false)
    private java.sql.Timestamp createdAt;
}

