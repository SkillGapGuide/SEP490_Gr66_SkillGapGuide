package com.skillgapguide.sgg.Service;

import com.skillgapguide.sgg.Entity.*;
import com.skillgapguide.sgg.Repository.JobCvSkillScoreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CosineSimilarityService {
    @Autowired
    private EmbedService embedService;
    @Autowired
    private JobCvSkillScoreRepository jobCvSkillScoreRepository;

    public void compareCvJob(Job job, Cv cv){

    }
    public double getCosine(UserCvSkills cv, JobDesSkills job) throws Exception {
        double[] vec1 = embedService.getCvSkillEmbedding(cv.getSkill());
        double[] vec2 = embedService.getJobDesSkillEmbedding(job.getSkill());
        double result = cosineSimilarity(vec1,vec2);
        JobCvSkillScore score = new JobCvSkillScore(job.getId(),cv.getId(),result);
        jobCvSkillScoreRepository.save(score);
        return result;
    }
    public double testCosine(String cv, String job) throws Exception {
        double[] vec1 = embedService.getCvSkillEmbedding(cv);
        double[] vec2 = embedService.getJobDesSkillEmbedding(job);
        double result = cosineSimilarity(vec1,vec2);
        return result;
    }

    /**
     * Calculates the cosine similarity between two vectors a and b.
     * @param a Real number table representing the first vector
     * @param b Real number table representing the second vector
     * @return value between -1 and 1
     */
    public static double cosineSimilarity(double[] a, double[] b) {
        double dot = 0.0, normA = 0.0, normB = 0.0;
        for (int i = 0; i < a.length; i++) {
            dot += a[i] * b[i];      // Dot product
            normA += a[i] * a[i];    // Sum of squares for a
            normB += b[i] * b[i];    // Sum of squares for b
        }
        // Cosine similarity = dot product / (magnitude of a * magnitude of b)
        return dot / (Math.sqrt(normA) * Math.sqrt(normB));
    }
}
