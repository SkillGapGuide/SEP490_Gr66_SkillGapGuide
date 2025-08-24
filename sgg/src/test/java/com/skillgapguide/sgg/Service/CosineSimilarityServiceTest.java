
        package com.skillgapguide.sgg.Service;

import com.skillgapguide.sgg.Entity.JobCvSkillScore;
import com.skillgapguide.sgg.Entity.JobDesSkills;
import com.skillgapguide.sgg.Entity.UserCvSkills;
import com.skillgapguide.sgg.Repository.JobCvSkillScoreRepository;
import com.skillgapguide.sgg.Repository.JobDesSkillsRepository;
import com.skillgapguide.sgg.Repository.UserCvSkillsRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CosineSimilarityServiceTest {

    @Mock
    private EmbedService embedService;

    @Mock
    private JobCvSkillScoreRepository jobCvSkillScoreRepository;

    @Mock
    private JobDesSkillsRepository jobDesSkillsRepository;

    @Mock
    private UserCvSkillsRepository userCvSkillsRepository;

    @InjectMocks
    private CosineSimilarityService cosineSimilarityService;

    @Test
    void compareCvJobSavesScoresWhenSkillsMatch() throws Exception {
        int jobId = 1;
        int cvId = 1;
        JobDesSkills jobSkill = new JobDesSkills();
        jobSkill.setId(1);
        jobSkill.setSkill("Java");
        UserCvSkills cvSkill = new UserCvSkills();
        cvSkill.setId(1);
        cvSkill.setSkill("Java");
        List<JobDesSkills> jobSkills = Arrays.asList(jobSkill);
        List<UserCvSkills> cvSkills = Arrays.asList(cvSkill);

        when(jobDesSkillsRepository.findByJobId(jobId)).thenReturn(jobSkills);
        when(userCvSkillsRepository.findByCvId(cvId)).thenReturn(cvSkills);
        when(embedService.getCvSkillEmbedding("Java")).thenReturn(new double[]{1.0, 0.0});
        when(embedService.getJobDesSkillEmbedding("Java")).thenReturn(new double[]{1.0, 0.0});
        when(jobCvSkillScoreRepository.save(any(JobCvSkillScore.class))).thenReturn(new JobCvSkillScore());

        cosineSimilarityService.compareCvJob(jobId, cvId);

        verify(jobCvSkillScoreRepository).deleteByJobIdAndCvId(jobId, cvId);
        verify(jobCvSkillScoreRepository).save(any(JobCvSkillScore.class));
        verify(embedService).getCvSkillEmbedding("Java");
        verify(embedService).getJobDesSkillEmbedding("Java");
    }

    @Test
    void compareCvJobSavesZeroScoreWhenNoMatch() throws Exception {
        int jobId = 1;
        int cvId = 1;
        JobDesSkills jobSkill = new JobDesSkills();
        jobSkill.setId(1);
        jobSkill.setSkill("Java");
        List<JobDesSkills> jobSkills = Arrays.asList(jobSkill);
        List<UserCvSkills> cvSkills = Collections.emptyList();

        when(jobDesSkillsRepository.findByJobId(jobId)).thenReturn(jobSkills);
        when(userCvSkillsRepository.findByCvId(cvId)).thenReturn(cvSkills);
        when(jobCvSkillScoreRepository.save(any(JobCvSkillScore.class))).thenReturn(new JobCvSkillScore());

        cosineSimilarityService.compareCvJob(jobId, cvId);

        verify(jobCvSkillScoreRepository).deleteByJobIdAndCvId(jobId, cvId);
        verify(jobCvSkillScoreRepository).save(argThat(score -> score.getScore() == 0.0 && score.getCvSkill() == null));
    }

    @Test
    void getCosineReturnsCorrectSimilarity() throws Exception {
        UserCvSkills cvSkill = new UserCvSkills();
        cvSkill.setSkill("Java");
        JobDesSkills jobSkill = new JobDesSkills();
        jobSkill.setSkill("Java");

        when(embedService.getCvSkillEmbedding("Java")).thenReturn(new double[]{1.0, 0.0});
        when(embedService.getJobDesSkillEmbedding("Java")).thenReturn(new double[]{1.0, 0.0});

        double result = cosineSimilarityService.getCosine(cvSkill, jobSkill);

        assertEquals(1.0, result, 0.0001);
    }

    @Test
    void testCosineReturnsCorrectSimilarity() throws Exception {
        when(embedService.getCvSkillEmbedding("Java")).thenReturn(new double[]{1.0, 0.0});
        when(embedService.getJobDesSkillEmbedding("Java")).thenReturn(new double[]{1.0, 0.0});

        double result = cosineSimilarityService.testCosine("Java", "Java");

        assertEquals(1.0, result, 0.0001);
    }

    @Test
    void normalizeReturnsNormalizedVector() {
        double[] vector = new double[]{3.0, 4.0};
        double[] expected = new double[]{0.6, 0.8}; // Norm = sqrt(3^2 + 4^2) = 5

        double[] result = cosineSimilarityService.normalize(vector);

        assertArrayEquals(expected, result, 0.0001);
    }

    @Test
    void cosineSimilarityReturnsCorrectValue() {
        double[] a = new double[]{1.0, 0.0};
        double[] b = new double[]{1.0, 0.0};

        double result = cosineSimilarityService.cosineSimilarity(a, b);

        assertEquals(1.0, result, 0.0001);
    }

    public double cosineSimilarity(double[] a, double[] b) {
        double normA = 0.0, normB = 0.0, dotProduct = 0.0;
        for (int i = 0; i < a.length; i++) {
            dotProduct += a[i] * b[i];
            normA += a[i] * a[i];
            normB += b[i] * b[i];
        }
        normA = Math.sqrt(normA);
        normB = Math.sqrt(normB);
        if (normA == 0.0 || normB == 0.0) {
            return 0.0;
        }
        return dotProduct / (normA * normB);
    }
}