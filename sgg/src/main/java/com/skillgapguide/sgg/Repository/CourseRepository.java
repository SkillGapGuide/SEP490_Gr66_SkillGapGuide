package com.skillgapguide.sgg.Repository;

import com.skillgapguide.sgg.Entity.Course;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CourseRepository extends JpaRepository<Course, Integer> {
    Course findCourseByCourseId(Integer courseId);

    Optional<Course> findCourseByUrl(String url);

    boolean existsCourseByUrl(String url);
    @Query(value = "SELECT DISTINCT job.skill " +
            "FROM job_cv_skills_score AS s " +
            "JOIN job_des_skills AS job ON s.job_skill = job.id " +
            "JOIN user_cv_skills AS cv ON s.cv_skill = cv.id " +
            "WHERE cv.cv_id = :cvId AND s.score < 0.7", nativeQuery = true)
    List<String> findJobSkillsByCvId(Integer cvId);
    // Lấy tối đa 30 missing skill cho cvId
    @Query(
            value = "SELECT DISTINCT job.skill " +
                    "FROM job_cv_skills_score AS s " +
                    "JOIN job_des_skills AS job ON s.job_skill = job.id " +
                    "JOIN user_cv_skills AS cv ON s.cv_skill = cv.id " +
                    "WHERE cv.cv_id = :cvId AND s.score < 0.7 " +
                    "ORDER BY job.skill " +
                    "LIMIT 30",
            nativeQuery = true
    )
    List<String> findTop30JobSkillsByCvId(@Param("cvId") Integer cvId);

    // Lấy batch 10 missing skill cho cvId
    @Query(
            value = "SELECT DISTINCT job.skill " +
                    "FROM job_cv_skills_score AS s " +
                    "JOIN job_des_skills AS job ON s.job_skill = job.id " +
                    "JOIN user_cv_skills AS cv ON s.cv_skill = cv.id " +
                    "WHERE cv.cv_id = :cvId AND s.score < 0.7 " +
                    "ORDER BY job.skill " +
                    "LIMIT :limit OFFSET :offset",
            nativeQuery = true
    )
    List<String> findJobSkillsByCvIdWithOffset(
            @Param("cvId") Integer cvId,
            @Param("offset") int offset,
            @Param("limit") int limit
    );
}
