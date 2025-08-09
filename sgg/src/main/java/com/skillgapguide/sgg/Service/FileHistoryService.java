package com.skillgapguide.sgg.Service;

import com.skillgapguide.sgg.Dto.FileInfoDTO;
import com.skillgapguide.sgg.Dto.UserFileHistoryDTO;
import com.skillgapguide.sgg.Entity.AuditLog;
import com.skillgapguide.sgg.Repository.AuditLogRepository;
import com.skillgapguide.sgg.Repository.CVRepository;
import com.skillgapguide.sgg.Repository.JobDesFileRepository;
import jakarta.persistence.criteria.CriteriaBuilder;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FileHistoryService {
    private final AuditLogRepository auditLogRepository;

    public UserFileHistoryDTO getUserFileHistory(Integer userId) {
        List<AuditLog> cvFiles = auditLogRepository.findAuditLogByUserIdAndAction(userId, "Upload CV");
        List<AuditLog> jobDesFile = auditLogRepository.findAuditLogByUserIdAndAction(userId, "UPLOAD_JOB_DESCRIPTION");

        UserFileHistoryDTO userFileHistoryDTO = new UserFileHistoryDTO();
        userFileHistoryDTO.setCvFiles(cvFiles);
        userFileHistoryDTO.setJobDesFile(jobDesFile);
        return userFileHistoryDTO;
    }
}
