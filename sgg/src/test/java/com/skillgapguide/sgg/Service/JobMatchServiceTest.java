
        package com.skillgapguide.sgg.Service;

import com.skillgapguide.sgg.Entity.Cv;
import com.skillgapguide.sgg.Entity.Job;
import com.skillgapguide.sgg.Entity.JobCvScore;
import com.skillgapguide.sgg.Repository.CVRepository;
import com.skillgapguide.sgg.Repository.JobCvScoreRepository;
import com.skillgapguide.sgg.Repository.JobRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class JobMatchServiceTest {

    @Mock
    private EmbedService embedService;

    @Mock
    private CVService cvService;

    @Mock
    private UserService userService;

    @Mock
    private CVRepository cvRepository;

    @Mock
    private JobCvScoreRepository jobCvScoreRepository;

    @Mock
    private JobRepository jobRepository;

    @Mock
    private CosineSimilarityService cosineSimilarityService;

    @Mock
    private SecurityContext securityContext;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private JobMatchService jobMatchService;

    @Test
    void getJobMatchScoreSuccess() throws Exception {
        String email = "test@example.com";
        Integer userId = 1;
        Cv cv = new Cv();
        cv.setId(1);
        cv.setFilePath("cv.pdf");
        cv.setFileType("pdf");
        Job job = new Job();
        job.setJobId(1);
        job.setTitle("Developer");
        job.setDescription("Java developer");
        job.setCompany("Tech Corp");
        List<Job> jobs = Arrays.asList(job);
        List<JobCvScore> scores = Arrays.asList(new JobCvScore());
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn(email);
        when(userService.getUserIdFromContext()).thenReturn(userId);
        when(cvRepository.findByUserId(userId)).thenReturn(cv);
        when(cvService.extractTextFromFile(anyString(), anyString())).thenReturn("Java skills");
        when(embedService.fetchEmbeddingNomicv15(anyString())).thenReturn(new double[]{1.0, 0.0});
        when(cosineSimilarityService.normalize(any())).thenReturn(new double[]{1.0, 0.0});
        when(cosineSimilarityService.cosineSimilarity(any(), any())).thenReturn(0.9);
        when(jobRepository.getJobsByCvId(1)).thenReturn(jobs);
        when(jobCvScoreRepository.save(any(JobCvScore.class))).thenReturn(new JobCvScore());
        when(jobCvScoreRepository.findJobCvScoreByCvId(1)).thenReturn(scores);

        SecurityContextHolder.setContext(securityContext);

        List<JobCvScore> result = jobMatchService.getJobMatchScore();

        assertEquals(1, result.size());
        verify(jobCvScoreRepository).save(any(JobCvScore.class));
        verify(jobCvScoreRepository).findJobCvScoreByCvId(1);
    }

    @Test
    void getJobMatchScoreThrowsExceptionWhenNoJobs() throws Exception {
        String email = "test@example.com";
        Integer userId = 1;
        Cv cv = new Cv();
        cv.setId(1);
        cv.setFilePath("cv.pdf");
        cv.setFileType("pdf");
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn(email);
        when(userService.getUserIdFromContext()).thenReturn(userId);
        when(cvRepository.findByUserId(userId)).thenReturn(cv);
        when(cvService.extractTextFromFile(anyString(), anyString())).thenReturn("Java skills");
        when(jobRepository.getJobsByCvId(1)).thenReturn(Collections.emptyList());

        SecurityContextHolder.setContext(securityContext);

        assertThrows(Exception.class, () -> jobMatchService.getJobMatchScore());
    }
}