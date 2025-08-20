package com.skillgapguide.sgg.Service;

import com.skillgapguide.sgg.Entity.AuditLog;
import com.skillgapguide.sgg.Entity.Cv;
import com.skillgapguide.sgg.Entity.User;
import com.skillgapguide.sgg.Entity.UserCvSkills;
import com.skillgapguide.sgg.Repository.AuditLogRepository;
import com.skillgapguide.sgg.Repository.CVRepository;
import com.skillgapguide.sgg.Repository.UserCvSkillsRepository;
import com.skillgapguide.sgg.Repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.api.io.TempDir;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.io.IOException;
import java.nio.file.Path;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CVServiceTest {

    @Mock
    private CVRepository cvRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserCvSkillsRepository userCvSkillsRepository;

    @Mock
    private AuditLogRepository auditLogRepository;

    @Mock
    private CvSkillService cvSkillService;

    @Mock
    private SecurityContext securityContext;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private CVService cvService;

    @TempDir
    Path tempDir;

    @Test
    void uploadCvCreatesNewCvSuccessfully() throws IOException {
        String email = "test@example.com";
        String fileName = "test.pdf";
        String fileExtension = "pdf";
        MockMultipartFile file = new MockMultipartFile("file", fileName, "application/pdf", "content".getBytes());
        User user = new User();
        user.setUserId(1);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn(email);
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(cvRepository.findByUserId(1)).thenReturn(null);
        when(cvRepository.save(any(Cv.class))).thenReturn(new Cv());
        when(auditLogRepository.save(any(AuditLog.class))).thenReturn(new AuditLog());

        SecurityContextHolder.setContext(securityContext);

        String result = cvService.uploadCv(fileName, fileExtension, file);

        assertTrue(result.contains("File CV đã được upload thành công"));
        verify(cvRepository).save(any(Cv.class));
        verify(auditLogRepository).save(any(AuditLog.class));
    }

    @Test
    void uploadCvUpdatesExistingCv() throws IOException {
        String email = "test@example.com";
        String fileName = "test.pdf";
        String fileExtension = "pdf";
        MockMultipartFile file = new MockMultipartFile("file", fileName, "application/pdf", "content".getBytes());
        User user = new User();
        user.setUserId(1);
        Cv existingCv = new Cv();
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn(email);
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(cvRepository.findByUserId(1)).thenReturn(existingCv);
        when(cvRepository.save(any(Cv.class))).thenReturn(existingCv);
        when(auditLogRepository.save(any(AuditLog.class))).thenReturn(new AuditLog());

        SecurityContextHolder.setContext(securityContext);

        String result = cvService.uploadCv(fileName, fileExtension, file);

        assertTrue(result.contains("File CV đã được upload thành công"));
        verify(cvRepository).save(existingCv);
        verify(auditLogRepository).save(any(AuditLog.class));
    }

    @Test
    void uploadCvThrowsExceptionWhenUserNotFound() {
        String email = "test@example.com";
        String fileName = "test.pdf";
        String fileExtension = "pdf";
        MockMultipartFile file = new MockMultipartFile("file", fileName, "application/pdf", "content".getBytes());
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn(email);
        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

        SecurityContextHolder.setContext(securityContext);

        assertThrows(RuntimeException.class, () -> cvService.uploadCv(fileName, fileExtension, file));
    }

    @Test
    void extractSkillSavesSkillsSuccessfully() throws Exception {
        String email = "test@example.com";
        User user = new User();
        user.setUserId(1);
        Cv cv = new Cv();
        cv.setId(1);
        cv.setFilePath(tempDir.resolve("test.pdf").toString());
        cv.setFileType("pdf");
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn(email);
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(cvRepository.findByUserId(1)).thenReturn(cv);
        doNothing().when(cvSkillService).saveCvSkillsToDb(anyString(), eq(1));

        SecurityContextHolder.setContext(securityContext);

        cvService.extractSkill();

        verify(cvSkillService).saveCvSkillsToDb(anyString(), eq(1));
    }

//    @Test
//    void cleanCvTextRemovesUnwantedCharacters() {
//        String rawText = "• Java\n- Python\n  \n123\nA";
//
//        String result = cvService.cleanCvText(rawText);
//
//        assertEquals("Java Python", result.trim());
//    }

    @Test
    void splitByWordsSplitsCorrectly() {
        String text = "Java Python C++ JavaScript SQL";
        List<String> expected = Arrays.asList("Java Python C++", "JavaScript SQL");

        List<String> result = cvService.splitByWords(text, 10);

        assertEquals(expected, result);
    }

    @Test
    void getCvSkillReturnsSkills() {
        String email = "test@example.com";
        User user = new User();
        user.setUserId(1);
        Cv cv = new Cv();
        cv.setId(1);
        List<UserCvSkills> skills = Arrays.asList(new UserCvSkills(), new UserCvSkills());
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn(email);
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(cvRepository.findByUserId(1)).thenReturn(cv);
        when(userCvSkillsRepository.findByCvId(1)).thenReturn(skills);

        SecurityContextHolder.setContext(securityContext);

        List<UserCvSkills> result = cvService.getCvSkill();

        assertEquals(2, result.size());
        verify(userCvSkillsRepository).findByCvId(1);
    }

    @Test
    void extractTextFromFileThrowsExceptionForUnsupportedFileType() {
        assertThrows(IllegalArgumentException.class, () -> CVService.extractTextFromFile("test.txt", "txt"));
    }
}