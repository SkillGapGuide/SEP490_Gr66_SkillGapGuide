package com.skillgapguide.sgg.Service;

import com.skillgapguide.sgg.Entity.Cv;
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

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class JobDeleteServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private JobDesFileRepository jobDesFileRepository;

    @Mock
    private JobCvSkillScoreRepository jobCvSkillScoreRepository;

    @Mock
    private CVRepository cvRepository;

    @Mock
    private JobRepository jobRepository;

    @Mock
    private EmbedService embedService;

    @Mock
    private SecurityContext securityContext;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private JobDeleteService jobDeleteService;

    @Test
    void deleteJobSuccess() {
        String email = "test@example.com";
        User user = new User();
        user.setUserId(1);
        Cv cv = new Cv();
        cv.setId(1);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn(email);
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(cvRepository.findByUserId(1)).thenReturn(cv);
        SecurityContextHolder.setContext(securityContext);

        jobDeleteService.deleteJob();

        verify(jobRepository).deleteAllByCvId(1);
    }

    @Test
    void deleteJobThrowsExceptionWhenCvNotFound() {
        String email = "test@example.com";
        User user = new User();
        user.setUserId(1);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn(email);
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(cvRepository.findByUserId(1)).thenReturn(null);
        SecurityContextHolder.setContext(securityContext);

        assertThrows(IllegalStateException.class, () -> jobDeleteService.deleteJob());
    }

    @Test
    void deleteFileJobDesSuccess() {
        String email = "test@example.com";
        User user = new User();
        user.setUserId(1);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn(email);
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        SecurityContextHolder.setContext(securityContext);

        jobDeleteService.deleteFileJobDes();

        verify(jobDesFileRepository).deleteAllByUserId(1);
    }

    @Test
    void deleteJobsByCvIdSuccess() {
        Integer cvId = 1;

        jobDeleteService.deleteJobsByCvId(cvId);

        verify(jobRepository).deleteByCvId(cvId);
    }
}