
        package com.skillgapguide.sgg.Service;

import com.skillgapguide.sgg.Dto.FavoriteJobDTO;
import com.skillgapguide.sgg.Dto.ViewFavoriteJobDTO;
import com.skillgapguide.sgg.Entity.Job;
import com.skillgapguide.sgg.Entity.User;
import com.skillgapguide.sgg.Entity.UserFavoriteJob;
import com.skillgapguide.sgg.Repository.JobRepository;
import com.skillgapguide.sgg.Repository.UserFavoriteJobRepository;
import com.skillgapguide.sgg.Repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FavoriteJobServiceTest {

    @Mock
    private UserFavoriteJobRepository userFavoriteJobRepository;

    @Mock
    private JobRepository jobRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private SecurityContext securityContext;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private FavoriteJobService favoriteJobService;

    @Test
    void addFavoriteJobSuccess() {
        String email = "test@example.com";
        Integer jobId = 1;
        User user = new User();
        user.setUserId(1);
        Job job = new Job();
        job.setJobId(jobId);
        job.setTitle("Software Engineer");
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn(email);
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(jobRepository.findById(jobId)).thenReturn(Optional.of(job));
        when(userFavoriteJobRepository.existsByUserAndJob(user, job)).thenReturn(false);
        when(userFavoriteJobRepository.save(any(UserFavoriteJob.class))).thenReturn(new UserFavoriteJob());

        SecurityContextHolder.setContext(securityContext);

        FavoriteJobDTO result = favoriteJobService.addFavoriteJob(jobId);

        assertNotNull(result);
        assertEquals(jobId, result.getJobId());
        assertEquals("Software Engineer", result.getTitle());
        verify(userFavoriteJobRepository).save(any(UserFavoriteJob.class));
    }

    @Test
    void addFavoriteJobThrowsExceptionWhenJobExists() {
        String email = "test@example.com";
        Integer jobId = 1;
        User user = new User();
        user.setUserId(1);
        Job job = new Job();
        job.setJobId(jobId);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn(email);
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(jobRepository.findById(jobId)).thenReturn(Optional.of(job));
        when(userFavoriteJobRepository.existsByUserAndJob(user, job)).thenReturn(true);

        SecurityContextHolder.setContext(securityContext);

        assertThrows(IllegalArgumentException.class, () -> favoriteJobService.addFavoriteJob(jobId));
    }

    @Test
    void getFavoriteJobsReturnsList() {
        String email = "test@example.com";
        User user = new User();
        user.setUserId(1);
        List<ViewFavoriteJobDTO> jobs = Arrays.asList(new ViewFavoriteJobDTO(), new ViewFavoriteJobDTO());
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn(email);
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(userFavoriteJobRepository.findFavoriteJobsByUserId(1)).thenReturn(jobs);

        SecurityContextHolder.setContext(securityContext);

        List<ViewFavoriteJobDTO> result = favoriteJobService.getFavoriteJobs();

        assertEquals(2, result.size());
        verify(userFavoriteJobRepository).findFavoriteJobsByUserId(1);
    }

    @Test
    void removeFavoriteJobSuccess() {
        String email = "test@example.com";
        Integer jobId = 1;
        User user = new User();
        user.setUserId(1);
        Job job = new Job();
        job.setJobId(jobId);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn(email);
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(jobRepository.findById(jobId)).thenReturn(Optional.of(job));
        when(userFavoriteJobRepository.existsByUserAndJob(user, job)).thenReturn(true);

        SecurityContextHolder.setContext(securityContext);

        favoriteJobService.removeFavoriteJob(jobId);

        verify(userFavoriteJobRepository).deleteByUserAndJob(user, job);
    }

    @Test
    void removeFavoriteJobThrowsExceptionWhenNotExists() {
        String email = "test@example.com";
        Integer jobId = 1;
        User user = new User();
        user.setUserId(1);
        Job job = new Job();
        job.setJobId(jobId);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn(email);
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(jobRepository.findById(jobId)).thenReturn(Optional.of(job));
        when(userFavoriteJobRepository.existsByUserAndJob(user, job)).thenReturn(false);

        SecurityContextHolder.setContext(securityContext);

        assertThrows(IllegalArgumentException.class, () -> favoriteJobService.removeFavoriteJob(jobId));
    }
}