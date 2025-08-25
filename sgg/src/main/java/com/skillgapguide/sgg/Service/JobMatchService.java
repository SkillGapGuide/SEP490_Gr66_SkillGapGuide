package com.skillgapguide.sgg.Service;

import com.skillgapguide.sgg.Entity.*;
import com.skillgapguide.sgg.Repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobMatchService {
    @Autowired
    private EmbedService embedService;
    @Autowired
    private CVService cvService;
    @Autowired
    private UserService userService;
    @Autowired
    private CVRepository cvRepository;
    @Autowired
    private JobCvScoreRepository jobCvScoreRepository;
    @Autowired
    private JobRepository jobRepository;
    @Autowired
    private CosineSimilarityService cosineSimilarityService;
    @Autowired
    private JobDesSkillsRepository jobDesSkillsRepository;
    public List<JobCvScore> getJobMatchScore() throws Exception {
        // Get job information and CV information from the database
        Integer userId = userService.getUserIdFromContext();
        Cv cv = cvRepository.findByUserId(userId);
        String cvText = cvService.extractTextFromFile(cv.getFilePath(),cv.getFileType());
        double[] cvEmbedding = embedService.fetchEmbeddingNomicv15(cvText);
        List<Job> jobList = jobRepository.getJobsByCvId(cv.getId());
        if (jobList.isEmpty()) {
            throw new Exception("No job found for the given CV ID");
        }
        String jobText ="";
        for (Job job:jobList){
            List<JobDesSkills> jobDesSkillsList = jobDesSkillsRepository.findByJobId(job.getJobId());
            for(JobDesSkills jobDesSkills: jobDesSkillsList){
                jobText += jobDesSkills.getSkill() + " ";
            }
//             jobText = "Description: "+job.getDescription()+
//                    "Title: " + job.getTitle()+
//                    "Company: " + job.getCompany();
            double[] jobEmbedding = embedService.fetchEmbeddingNomicv15(jobText);
            double similarityScore = cosineSimilarityService.cosineSimilarity(cosineSimilarityService.normalize(jobEmbedding), cosineSimilarityService.normalize(cvEmbedding));
            JobCvScore jobCvScore = new JobCvScore();
            jobCvScore.setJobId(job.getJobId());
            jobCvScore.setCvId(cv.getId());
            jobCvScore.setScore(similarityScore);
            jobCvScoreRepository.save(jobCvScore);
        }
        // Calculate the cosine similarity between the two embeddings
        return jobCvScoreRepository.findJobCvScoreByCvId(cv.getId());
    }
}
