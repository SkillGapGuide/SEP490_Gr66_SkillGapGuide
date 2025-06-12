package com.skillgapguide.sgg.Entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "CV")
public class Cv {

    // Giả định có cột khóa chính này trong DB
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer cv_id;

    @Column(name = "user_id", nullable = false)
    private Integer userId;

    @Column(nullable = false)
    private String skill;

    @Column(nullable = false)
    private Integer exp;

    @Column(nullable = false)
    private String position;
}

