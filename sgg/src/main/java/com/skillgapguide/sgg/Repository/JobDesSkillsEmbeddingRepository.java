package com.skillgapguide.sgg.Repository;

import com.skillgapguide.sgg.Entity.JobDesSkills;
import com.skillgapguide.sgg.Entity.JobDesSkillsEmbedding;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface JobDesSkillsEmbeddingRepository extends JpaRepository<JobDesSkillsEmbedding,Integer> {
    Optional<JobDesSkillsEmbedding> findBySkill(String skill);
}
