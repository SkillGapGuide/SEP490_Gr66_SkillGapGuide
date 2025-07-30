package com.skillgapguide.sgg.Repository;

import com.skillgapguide.sgg.Entity.JobCvScore;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobCvScoreRepository extends JpaRepository<JobCvScore, Integer> {
    List<JobCvScore> findJobCvScoreByCvId(int cvId);
}
