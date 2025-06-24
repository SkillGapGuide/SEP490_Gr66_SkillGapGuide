package com.skillgapguide.sgg.Repository;

import com.skillgapguide.sgg.Entity.Course;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseRepository extends JpaRepository<Course, Integer> {
    Course findCourseByCourseId(Integer courseId);

}
