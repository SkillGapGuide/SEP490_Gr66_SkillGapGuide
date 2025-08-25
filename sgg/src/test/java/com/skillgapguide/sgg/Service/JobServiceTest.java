
        package com.skillgapguide.sgg.Service;

import com.skillgapguide.sgg.Dto.ExtractJDSkillDTO;
import com.skillgapguide.sgg.Entity.Cv;
import com.skillgapguide.sgg.Entity.Job;
import com.skillgapguide.sgg.Entity.JobDesFile;
import com.skillgapguide.sgg.Entity.User;
import com.skillgapguide.sgg.Repository.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.multipart.MultipartFile;
import reactor.core.publisher.Mono;

import java.io.IOException;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class JobServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private EmbedService embedService;

    @Mock
    private JobDesFileRepository jobDesFileRepository;

    @Mock
    private JobDeleteService jobDeleteService;

    @Mock
    private JobDesSkillsRepository jobDesSkillsRepository;

    @Mock
    private CVRepository cvRepository;

    @Mock
    private JobRepository jobRepository;

    @Mock
    private AuditLogRepository auditLogRepository;

    @Mock
    private OllamaService ollamaService;

    @Mock
    private SecurityContext securityContext;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private JobService jobService;

    @Test
    void loadMultiFileSuccess() throws Exception {
        MultipartFile file = mock(MultipartFile.class);
        when(file.getOriginalFilename()).thenReturn("test.pdf");
        when(file.isEmpty()).thenReturn(false);
        String email = "test@example.com";
        User user = new User();
        user.setUserId(1);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn(email);
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        SecurityContextHolder.setContext(securityContext);

        List<String> result = jobService.loadMultiFile(new MultipartFile[]{file});

        assertNotNull(result);
        verify(jobDeleteService).deleteJob();
        verify(jobDeleteService).deleteFileJobDes();
    }

    @Test
    void loadMultiFileThrowsExceptionForEmptyFile() {
        MultipartFile file = mock(MultipartFile.class);
        when(file.isEmpty()).thenReturn(true);

        assertThrows(IllegalStateException.class, () -> jobService.loadMultiFile(new MultipartFile[]{file}));
    }

    @Test
    void getJobsSuccess() throws IOException {
        String email = "test@example.com";
        User user = new User();
        user.setUserId(1);
        Cv cv = new Cv();
        cv.setId(1);
        Job job = new Job();
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn(email);
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(cvRepository.findByUserId(1)).thenReturn(cv);
        when(jobRepository.getJobsByCvId(1)).thenReturn(Arrays.asList(job));
        SecurityContextHolder.setContext(securityContext);

        List<Job> result = jobService.getJobList();

        assertEquals(1, result.size());
        verify(jobRepository).getJobsByCvId(1);
    }

    @Test
    void getJobsThrowsExceptionWhenNoCv() {
        String email = "test@example.com";
        User user = new User();
        user.setUserId(1);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn(email);
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(cvRepository.findByUserId(1)).thenReturn(null);
        SecurityContextHolder.setContext(securityContext);

        assertThrows(IllegalStateException.class, () -> jobService.getJobList());
    }

    @Test
    void analyzeJobDescriptionOption1Success() throws Exception {
        String email = "test@example.com";
        User user = new User();
        user.setUserId(1);
        Cv cv = new Cv();
        cv.setId(1);
        JobDesFile jobDesFile = new JobDesFile();
        jobDesFile.setFilePath("test.pdf");
        jobDesFile.setFileType("pdf");
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn(email);
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(cvRepository.findByUserId(1)).thenReturn(cv);
        when(jobDesFileRepository.findByUserId(1)).thenReturn(Arrays.asList(jobDesFile));
        SecurityContextHolder.setContext(securityContext);

        jobService.analyzeJobDescription(1);

        verify(jobDesFileRepository).findByUserId(1);
    }

    @Test
    void analyzeJobDescriptionOption2Success() throws Exception {
        String email = "test@example.com";
        User user = new User();
        user.setUserId(1);
        Cv cv = new Cv();
        cv.setId(1);
        Job job = new Job();
        job.setJobId(1);
        job.setDescription("Java skills");
        ExtractJDSkillDTO skills = new ExtractJDSkillDTO();
        skills.setSkills(Arrays.asList("Java"));
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn(email);
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(cvRepository.findByUserId(1)).thenReturn(cv);
        when(jobRepository.getJobsByCvId(1)).thenReturn(Arrays.asList(job));
        when(ollamaService.callMistralApi(anyString())).thenReturn(Mono.just("{\"skills\": [\"Java\"]}"));
        SecurityContextHolder.setContext(securityContext);

        jobService.analyzeJobDescription(2);

        verify(ollamaService).callMistralApi(anyString());
        verify(jobDesSkillsRepository).saveAll(any());
    }
}