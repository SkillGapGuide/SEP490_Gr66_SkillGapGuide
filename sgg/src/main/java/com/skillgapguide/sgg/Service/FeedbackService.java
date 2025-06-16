package com.skillgapguide.sgg.Service;

import com.skillgapguide.sgg.Dto.FeedbackDetailResponse;
import com.skillgapguide.sgg.Dto.FeedbackListResponse;
import com.skillgapguide.sgg.Repository.FeedbackRepository;
import com.skillgapguide.sgg.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FeedbackService {
    @Autowired
    private FeedbackRepository feedbackRepository;
    public List<FeedbackListResponse> getFeedbackList(int star){
        if(star == 0){
            return feedbackRepository.getAllFeedback();
        }
        return feedbackRepository.getAllFeedbackByStar(star);
    }
    public FeedbackDetailResponse getFeedbackDetail(int userId){
        return feedbackRepository.getFeedbackDetail(userId);
    }

}
