package com.skillgapguide.sgg.Repository;

import com.skillgapguide.sgg.Entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JobRepository extends JpaRepository<Job, Integer> {
    // Spring Data JPA sẽ tự động cung cấp các phương thức CRUD
    boolean existsBySourceUrl(String sourceUrl);
}
