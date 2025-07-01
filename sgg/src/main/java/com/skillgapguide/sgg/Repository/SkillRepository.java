package com.skillgapguide.sgg.Repository;

import com.skillgapguide.sgg.Entity.Skill;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SkillRepository extends JpaRepository<Skill, Integer> {

}
