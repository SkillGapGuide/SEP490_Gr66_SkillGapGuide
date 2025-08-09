package com.skillgapguide.sgg.Service;

import com.skillgapguide.sgg.Entity.*;
import com.skillgapguide.sgg.Repository.JobCvSkillScoreRepository;
import com.skillgapguide.sgg.Repository.JobDesSkillsRepository;
import com.skillgapguide.sgg.Repository.UserCvSkillsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class CosineSimilarityService {
    @Autowired
    private EmbedService embedService;
    @Autowired
    private JobCvSkillScoreRepository jobCvSkillScoreRepository;
    @Autowired
    private JobDesSkillsRepository jobDesSkillsRepository;
    @Autowired
    private UserCvSkillsRepository userCvSkillsRepository;
    public void compareCvJob(int jobId, int cvId) throws Exception {
        jobCvSkillScoreRepository.deleteByJobIdAndCvId(jobId,cvId);
        List<UserCvSkills> userCvSkillsList = userCvSkillsRepository.findByCvId(cvId);
        List<JobDesSkills> jobDesSkillsList = jobDesSkillsRepository.findByJobId(jobId);
        // Lặp qua từng Job Skill
        for (JobDesSkills jobSkill : jobDesSkillsList) {
            double bestScore = -1.0;
            UserCvSkills bestCvSkill = null;

            // Tìm CV skill có score cao nhất
            for (UserCvSkills cvSkill : userCvSkillsList) {
                double score = getCosine(cvSkill, jobSkill);
                if (score > bestScore) {
                    bestScore = score;
                    bestCvSkill = cvSkill;
                }
            }
            // Lưu vào DB (cho phép null nếu không match)
            JobCvSkillScore row = new JobCvSkillScore();
            row.setJobSkill(jobSkill.getId());
            row.setCvSkill(bestCvSkill != null ? bestCvSkill.getId() : null);
            row.setScore(bestScore >= 0 ? bestScore : 0.0);

            jobCvSkillScoreRepository.save(row);
        }
    }

    public double getCosine(UserCvSkills cv, JobDesSkills job) throws Exception {
        double[] vec1 = normalize(embedService.getCvSkillEmbedding(cv.getSkill()));
        double[] vec2 = normalize(embedService.getJobDesSkillEmbedding(job.getSkill()));
        double result = cosineSimilarity(vec1,vec2);
        return result;
    }
    public double testCosine(String cv, String job) throws Exception {
        double[] vec1 = normalize(embedService.getCvSkillEmbedding(cv));
        double[] vec2 = normalize(embedService.getJobDesSkillEmbedding(job));
        double result = cosineSimilarity(vec1,vec2);
        return result;
    }
    public double[] normalize(double[] vector) {
        double norm = 0.0;
        for (double v : vector) {
            norm += v * v;
        }
        norm = Math.sqrt(norm);
        for (int i = 0; i < vector.length; i++) {
            vector[i] /= norm;
        }
        return vector;
    }

    /**
     * Calculates the cosine similarity between two vectors a and b.
     * @param a Real number table representing the first vector
     * @param b Real number table representing the second vector
     * @return value between -1 and 1
     */
    public double cosineSimilarity(double[] a, double[] b) {
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
