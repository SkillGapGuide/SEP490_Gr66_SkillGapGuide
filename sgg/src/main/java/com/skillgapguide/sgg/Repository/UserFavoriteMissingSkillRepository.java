package com.skillgapguide.sgg.Repository;

import com.skillgapguide.sgg.Entity.UserFavoriteCourse;
import com.skillgapguide.sgg.Entity.UserFavoriteMissingSkill;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserFavoriteMissingSkillRepository extends JpaRepository<UserFavoriteMissingSkill, Integer> {
    // In `UserFavoriteMissingSkillRepository.java`
    @Query("SELECT ufc FROM UserFavoriteMissingSkill ufc WHERE ufc.userId = :userId AND ufc.skill.skillId = :skillId")
    Optional<UserFavoriteMissingSkill> findByUserIdAndSkillId(@Param("userId") Integer userId, @Param("skillId") Integer skillId);
    Page<UserFavoriteMissingSkill> findUserFavoriteMissingSkillsByUserId(Integer userId, Pageable pageable);
}
