package com.skillgapguide.sgg.Entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "job_des_skills_embedding")
public class JobDesSkillsEmbedding {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String skill;
    @Column(name = "embedding_json")
    private String embeddingJson;

}
