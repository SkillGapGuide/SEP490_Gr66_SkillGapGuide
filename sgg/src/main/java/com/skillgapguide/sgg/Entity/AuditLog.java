package com.skillgapguide.sgg.Entity;

import jakarta.persistence.*;
import lombok.Data;

import java.sql.Timestamp;

@Entity
@Data
@jakarta.persistence.Table(name = "audit_log", schema = "skill_gap_guide", catalog = "")
public class AuditLog {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @jakarta.persistence.Column(name = "log_id")
    private Integer logId;
    @Basic
    @Column(name = "user_id")
    private Integer userId;

    @Basic
    @Column(name = "action")
    private String action;

    @Basic
    @Column(name = "entity_type")
    private String entityType;

    @Basic
    @Column(name = "entity_id")
    private Integer entityId;

    @Basic
    @Column(name = "description")
    private String description;

    @Basic
    @Column(name = "created_at")
    private Timestamp createdAt;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        AuditLog auditLog = (AuditLog) o;

        if (logId != auditLog.logId) return false;
        if (userId != null ? !userId.equals(auditLog.userId) : auditLog.userId != null) return false;
        if (action != null ? !action.equals(auditLog.action) : auditLog.action != null) return false;
        if (entityType != null ? !entityType.equals(auditLog.entityType) : auditLog.entityType != null) return false;
        if (entityId != null ? !entityId.equals(auditLog.entityId) : auditLog.entityId != null) return false;
        if (description != null ? !description.equals(auditLog.description) : auditLog.description != null)
            return false;
        if (createdAt != null ? !createdAt.equals(auditLog.createdAt) : auditLog.createdAt != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = logId;
        result = 31 * result + (userId != null ? userId.hashCode() : 0);
        result = 31 * result + (action != null ? action.hashCode() : 0);
        result = 31 * result + (entityType != null ? entityType.hashCode() : 0);
        result = 31 * result + (entityId != null ? entityId.hashCode() : 0);
        result = 31 * result + (description != null ? description.hashCode() : 0);
        result = 31 * result + (createdAt != null ? createdAt.hashCode() : 0);
        return result;
    }
}
