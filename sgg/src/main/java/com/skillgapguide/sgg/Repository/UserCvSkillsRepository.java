package com.skillgapguide.sgg.Repository;

import com.skillgapguide.sgg.Entity.UserCvSkills;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserCvSkillsRepository extends JpaRepository<UserCvSkills,Integer> {
}
