package com.skillgapguide.sgg.Repository;

import com.skillgapguide.sgg.Entity.Course;
import com.skillgapguide.sgg.Entity.UserFavoriteCourse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FavoriteCourseRepository extends JpaRepository<UserFavoriteCourse, Integer> {
    Page<UserFavoriteCourse> findByUserId(Integer userId, Pageable pageable);
}
