package com.skillgapguide.sgg.Entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "user_favorite_missing_skill", schema = "skill_gap_guide", catalog = "")
public class UserFavoriteMissingSkill {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;
    @Column(name = "user_id")
    private Integer userId;
    @Column(name = "skill_id")
    private String skillId;
    @Basic
    @Column(name = "status")
    private String status;
    @Basic
    @Column(name = "created_at")
    private java.sql.Timestamp createdAt;
}
