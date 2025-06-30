package com.skillgapguide.sgg.Repository;
import com.skillgapguide.sgg.Entity.Occupation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

import java.util.List;
@Repository
public interface OccupationRepository extends JpaRepository<Occupation, Integer>{
    List<Occupation> findByStatusIgnoreCase(String status);
    Optional<Occupation> findByNameIgnoreCase(String name);
    List<Occupation> findByOccupationGroupId(Integer groupId);

}
