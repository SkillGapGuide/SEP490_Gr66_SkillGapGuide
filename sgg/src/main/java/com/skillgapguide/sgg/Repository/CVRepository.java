package com.skillgapguide.sgg.Repository;

import com.skillgapguide.sgg.Entity.Cv;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CVRepository extends JpaRepository<Cv,Integer> {
    Cv findByUserId(int userId);
}
