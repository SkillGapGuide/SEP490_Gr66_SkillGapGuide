package com.skillgapguide.sgg.Entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "user_cv_skills_embedding")
public class UserCvSkillsEmbedding {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String skill;
    @Column(name = "embedding_json")
    private String embeddingJson;

}
