package com.skillgapguide.sgg.Repository;

import com.skillgapguide.sgg.Entity.Specializations;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SpecializationRepository extends JpaRepository<Specializations, Integer> {
    Optional<List<Specializations>> findAllByStatusIgnoreCase(String status);
}
