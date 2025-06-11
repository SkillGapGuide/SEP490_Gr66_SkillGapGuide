package com.skillgapguide.sgg.Entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "Course")
public class Course {

    @Id
    @Column(name = "course_id")
    private Integer courseId;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private String provider;

    @Column(nullable = false)
    private String url;
}

