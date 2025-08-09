package com.skillgapguide.sgg.Repository;

import com.skillgapguide.sgg.Entity.Specialization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SpecializationRepository extends JpaRepository<Specialization, Integer> {
    Optional<Specialization> findByNameIgnoreCase(String name);
    Optional<Specialization> findByUrlIgnoreCase(String url);
    List<Specialization> findByStatusIgnoreCase(String status);
    List<Specialization> findByNameContainingIgnoreCase(String name);

    @Query("SELECT s FROM Specialization s " +
            "JOIN s.occupation o " +
            "JOIN o.occupationGroup g " +
            "WHERE (:occupationId IS NULL OR o.id = :occupationId) " +
            "AND (:groupId IS NULL OR g.id = :groupId)")
    List<Specialization> findByFilters(@Param("occupationId") Integer occupationId,
                                       @Param("groupId") Integer groupId);
    boolean existsSpecializationByUrl(String sourceUrl);

}
