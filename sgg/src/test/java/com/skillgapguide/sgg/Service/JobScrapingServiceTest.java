package com.skillgapguide.sgg.Service;

import com.skillgapguide.sgg.Entity.Cv;
import com.skillgapguide.sgg.Entity.Job;
import com.skillgapguide.sgg.Entity.Specialization;
import com.skillgapguide.sgg.Entity.User;
import com.skillgapguide.sgg.Repository.CVRepository;
import com.skillgapguide.sgg.Repository.JobCategoryRepository;
import com.skillgapguide.sgg.Repository.JobRepository;
import com.skillgapguide.sgg.Repository.SpecializationRepository;
import com.skillgapguide.sgg.Repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Arrays;
import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class JobScrapingServiceTest {

    @Mock
    private JobRepository jobRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private CVRepository cvRepository;

    @Mock
    private JobDeleteService jobDeleteService;

    @Mock
    private SpecializationRepository specializationRepository;

    @Mock
    private JobCategoryRepository jobCategoryRepository;

    @Mock
    private SecurityContext securityContext;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private JobScrapingService jobScrapingService;

    @Test
    void scrapeAndSaveTop10JobsByCategoryHandlesEmptyLinks() {
        String url = "http://example.com";
        JobScrapingService spyService = spy(jobScrapingService);
        doReturn(Collections.emptyList()).when(spyService).scrapeJobLinksFromListPage(url);

        spyService.scrapeAndSaveTop10JobsByCategory(url);

        verify(jobRepository, never()).save(any(Job.class));
    }

    @Test
    void scrapeAndSaveTop4JobsFromMultipleCategoriesSuccess() {
        String url = "http://example.com";
        when(jobRepository.count()).thenReturn(0L, 1L);
        JobScrapingService spyService = spy(jobScrapingService);
        doReturn(true).when(spyService).scrapeAndSaveJob(url);

        spyService.scrapeAndSaveTop4JobsFromMultipleCategories(Arrays.asList(url));

        verify(jobRepository, times(2)).count();
    }

    @Test
    void scrapeAndSaveTop10JobsBySpecializationSuccess() {
        String specializationName = "Developer";
        Specialization specialization = new Specialization();
        specialization.setName(specializationName);
        specialization.setUrl("http://example.com");
        when(specializationRepository.findByNameIgnoreCase(specializationName)).thenReturn(Optional.of(specialization));
        JobScrapingService spyService = spy(jobScrapingService);
        doReturn(Arrays.asList("job1")).when(spyService).scrapeJobLinksFromListPage("http://example.com");
        doReturn(true).when(spyService).scrapeAndSaveJob("job1");

        spyService.scrapeAndSaveTop10JobsBySpecialization(specializationName);

        verify(spyService).scrapeAndSaveJob("job1");
    }
}