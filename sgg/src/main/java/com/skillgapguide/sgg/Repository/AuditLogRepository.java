package com.skillgapguide.sgg.Repository;

import com.skillgapguide.sgg.Entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AuditLogRepository extends JpaRepository<AuditLog,Integer> {
    List<AuditLog> findAuditLogByUserIdAndAction(int userId, String action);
}
