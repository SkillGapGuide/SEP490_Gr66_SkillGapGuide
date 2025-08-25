package com.skillgapguide.sgg.Service;

import com.skillgapguide.sgg.Dto.UserFileHistoryDTO;
import com.skillgapguide.sgg.Entity.AuditLog;
import com.skillgapguide.sgg.Repository.AuditLogRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FileHistoryServiceTest {

    @Mock
    private AuditLogRepository auditLogRepository;

    @InjectMocks
    private FileHistoryService fileHistoryService;

    @Test
    void getUserFileHistoryReturnsHistory() {
        Integer userId = 1;
        List<AuditLog> cvFiles = Arrays.asList(new AuditLog());
        List<AuditLog> jobFiles = Arrays.asList(new AuditLog());
        when(auditLogRepository.findAuditLogByUserIdAndAction(userId, "Upload CV")).thenReturn(cvFiles);
        when(auditLogRepository.findAuditLogByUserIdAndAction(userId, "UPLOAD_JOB_DESCRIPTION")).thenReturn(jobFiles);

        UserFileHistoryDTO result = fileHistoryService.getUserFileHistory(userId);

        assertNotNull(result);
        assertEquals(cvFiles, result.getCvFiles());
        assertEquals(jobFiles, result.getJobDesFile());
        verify(auditLogRepository).findAuditLogByUserIdAndAction(userId, "Upload CV");
        verify(auditLogRepository).findAuditLogByUserIdAndAction(userId, "UPLOAD_JOB_DESCRIPTION");
    }
}