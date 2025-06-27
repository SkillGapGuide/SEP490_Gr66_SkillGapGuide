package com.skillgapguide.sgg.Repository;

import com.skillgapguide.sgg.Entity.OccupationGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface OccupationGroupRepository extends JpaRepository<OccupationGroup, Integer> {
    List<OccupationGroup> findAllByStatusIgnoreCase(String status);
    Optional<OccupationGroup> findByNameIgnoreCase(String name);
    Optional<OccupationGroup> findById(Integer id);
}
