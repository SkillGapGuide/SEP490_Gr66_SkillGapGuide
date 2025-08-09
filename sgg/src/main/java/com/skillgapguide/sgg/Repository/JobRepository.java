package com.skillgapguide.sgg.Repository;

import com.skillgapguide.sgg.Entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JobRepository extends JpaRepository<Job, Integer> {
    boolean existsBySourceUrl(String sourceUrl);
    List<Job> getJobsByCvId(int cvId);
    void deleteAllByCvId(int cvId);
    boolean existsByCvId(Integer cvId);
    void deleteByCvId(Integer cvId);
    Optional<Job> findBySourceUrl(String sourceUrl);
}
