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
    @Query("SELECT ufc FROM UserFavoriteMissingSkill ufc join JobDesSkills jds on ufc.skillId = jds.id WHERE ufc.userId = :userId AND jds.id = :skillId")
    Optional<UserFavoriteMissingSkill> findByUserIdAndSkillId(@Param("userId") Integer userId, @Param("skillId") Integer skillId);
    @Query("select jds.id as skillId, jds.skill as skillName ,ufc.status as status, ufc.createdAt as createdAt from UserFavoriteMissingSkill ufc join JobDesSkills jds on ufc.skillId = jds.id where ufc.userId = :userId")
    Page<UserFavoriteMissingSkillResponse> findUserFavoriteMissingSkillsByUserId(Integer userId, Pageable pageable);
}
