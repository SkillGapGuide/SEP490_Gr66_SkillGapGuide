package com.skillgapguide.sgg.Repository;

import com.skillgapguide.sgg.Entity.Job;
import com.skillgapguide.sgg.Entity.User;
import com.skillgapguide.sgg.Entity.UserFavoriteJob;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserFavoriteJobRepository extends JpaRepository<UserFavoriteJob, Integer> {
    boolean existsByUserAndJob(User user, Job job);
}
