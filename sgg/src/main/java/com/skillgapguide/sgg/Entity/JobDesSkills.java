package com.skillgapguide.sgg.Entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "job_des_skills")
public class JobDesSkills {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String skill;
    @Column(name = "job_id")
    private Integer jobId;
}
