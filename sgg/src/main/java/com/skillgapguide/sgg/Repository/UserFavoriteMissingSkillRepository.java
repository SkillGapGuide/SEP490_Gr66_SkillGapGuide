package com.skillgapguide.sgg.Repository;

import com.skillgapguide.sgg.Dto.UserFavoriteMissingSkillResponse;
import com.skillgapguide.sgg.Entity.UserFavoriteCourse;
import com.skillgapguide.sgg.Entity.UserFavoriteMissingSkill;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserFavoriteMissingSkillRepository extends JpaRepository<UserFavoriteMissingSkill, Integer> {
    @Query("SELECT ufc FROM UserFavoriteMissingSkill ufc WHERE ufc.userId = :userId AND ufc.skillId = :skillId")
    Optional<UserFavoriteMissingSkill> findByUserIdAndSkillId(@Param("userId") Integer userId, @Param("skillId") String skillId);
    @Query("select ufc.id as skillId, ufc.skillId as skillName ,ufc.status as status, ufc.createdAt as createdAt from UserFavoriteMissingSkill ufc where ufc.userId = :userId")
    Page<UserFavoriteMissingSkillResponse> findUserFavoriteMissingSkillsByUserId(Integer userId, Pageable pageable);
    @Query("SELECT ufc FROM UserFavoriteMissingSkill ufc WHERE ufc.userId = :userId AND ufc.id = :id")
    Optional<UserFavoriteMissingSkill> findByUserIdAndId(@Param("userId") Integer userId, @Param("id") Integer id);
}
