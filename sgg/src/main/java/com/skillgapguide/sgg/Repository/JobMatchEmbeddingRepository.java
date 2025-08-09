package com.skillgapguide.sgg.Repository;

import com.skillgapguide.sgg.Entity.JobDesSkillsEmbedding;
import com.skillgapguide.sgg.Entity.JobMatchEmbedding;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface JobMatchEmbeddingRepository extends JpaRepository<JobMatchEmbedding,Integer> {
}
