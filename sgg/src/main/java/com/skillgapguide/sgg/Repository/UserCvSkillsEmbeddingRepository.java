package com.skillgapguide.sgg.Repository;

import com.skillgapguide.sgg.Entity.UserCvSkills;
import com.skillgapguide.sgg.Entity.UserCvSkillsEmbedding;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserCvSkillsEmbeddingRepository extends JpaRepository<UserCvSkillsEmbedding,Integer> {
    Optional<UserCvSkillsEmbedding> findBySkill(String skill);
}
