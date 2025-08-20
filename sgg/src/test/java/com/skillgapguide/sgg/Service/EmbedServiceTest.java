
package com.skillgapguide.sgg.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.skillgapguide.sgg.Entity.JobDesSkillsEmbedding;
import com.skillgapguide.sgg.Entity.UserCvSkillsEmbedding;
import com.skillgapguide.sgg.Repository.JobDesSkillsEmbeddingRepository;
import com.skillgapguide.sgg.Repository.JobMatchEmbeddingRepository;
import com.skillgapguide.sgg.Repository.UserCvSkillsEmbeddingRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.io.IOException;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EmbedServiceTest {

    @Mock
    private UserCvSkillsEmbeddingRepository userCvSkillsEmbeddingRepository;

    @Mock
    private JobDesSkillsEmbeddingRepository jobDesSkillsEmbeddingRepository;

    @Mock
    private JobMatchEmbeddingRepository jobMatchEmbeddingRepository;

    @InjectMocks
    private EmbedService embedService;

    @Test
    void getCvSkillEmbeddingReturnsCachedEmbedding() throws Exception {
        String skill = "Java";
        double[] expectedVector = new double[]{1.0, 0.0};
        UserCvSkillsEmbedding embedding = new UserCvSkillsEmbedding();
        embedding.setSkill(skill);
        embedding.setEmbeddingJson(new ObjectMapper().writeValueAsString(expectedVector));

        when(userCvSkillsEmbeddingRepository.findBySkill(skill)).thenReturn(Optional.of(embedding));

        double[] result = embedService.getCvSkillEmbedding(skill);

        assertArrayEquals(expectedVector, result, 0.0001);
        verify(userCvSkillsEmbeddingRepository).findBySkill(skill);
        verifyNoMoreInteractions(userCvSkillsEmbeddingRepository, jobDesSkillsEmbeddingRepository, jobMatchEmbeddingRepository);
    }

    @Test
    void getCvSkillEmbeddingFetchesAndSavesNewEmbedding() throws Exception {
        String skill = "Java";
        double[] expectedVector = new double[]{1.0, 0.0};
        when(userCvSkillsEmbeddingRepository.findBySkill(skill)).thenReturn(Optional.empty());
        when(userCvSkillsEmbeddingRepository.save(any(UserCvSkillsEmbedding.class))).thenReturn(new UserCvSkillsEmbedding());
        when(embedService.fetchEmbeddingNomicv15(skill.toLowerCase())).thenReturn(expectedVector);

        double[] result = embedService.getCvSkillEmbedding(skill);

        assertArrayEquals(expectedVector, result, 0.0001);
        verify(userCvSkillsEmbeddingRepository).findBySkill(skill);
        verify(userCvSkillsEmbeddingRepository).save(any(UserCvSkillsEmbedding.class));
    }

    @Test
    void getJobDesSkillEmbeddingReturnsCachedEmbedding() throws Exception {
        String skill = "Java";
        double[] expectedVector = new double[]{1.0, 0.0};
        JobDesSkillsEmbedding embedding = new JobDesSkillsEmbedding();
        embedding.setSkill(skill);
        embedding.setEmbeddingJson(new ObjectMapper().writeValueAsString(expectedVector));

        when(jobDesSkillsEmbeddingRepository.findBySkill(skill)).thenReturn(Optional.of(embedding));

        double[] result = embedService.getJobDesSkillEmbedding(skill);

        assertArrayEquals(expectedVector, result, 0.0001);
        verify(jobDesSkillsEmbeddingRepository).findBySkill(skill);
        verifyNoMoreInteractions(userCvSkillsEmbeddingRepository, jobDesSkillsEmbeddingRepository, jobMatchEmbeddingRepository);
    }

    @Test
    void getJobDesSkillEmbeddingFetchesAndSavesNewEmbedding() throws Exception {
        String skill = "Java";
        double[] expectedVector = new double[]{1.0, 0.0};
        when(jobDesSkillsEmbeddingRepository.findBySkill(skill)).thenReturn(Optional.empty());
        when(jobDesSkillsEmbeddingRepository.save(any(JobDesSkillsEmbedding.class))).thenReturn(new JobDesSkillsEmbedding());
        when(embedService.fetchEmbeddingNomicv15(skill.toLowerCase())).thenReturn(expectedVector);

        double[] result = embedService.getJobDesSkillEmbedding(skill);

        assertArrayEquals(expectedVector, result, 0.0001);
        verify(jobDesSkillsEmbeddingRepository).findBySkill(skill);
        verify(jobDesSkillsEmbeddingRepository).save(any(JobDesSkillsEmbedding.class));
    }

    @Test
    void fetchEmbeddingNomicv15ThrowsExceptionOnInvalidResponse() throws IOException, InterruptedException {
        when(embedService.fetchEmbeddingNomicv15(anyString())).thenThrow(new RuntimeException("Invalid response"));

        assertThrows(Exception.class, () -> embedService.getJobDesSkillEmbedding("Java"));
    }
}