package com.skillgapguide.sgg.Service;

import com.skillgapguide.sgg.Dto.FeedbackDTO;
import com.skillgapguide.sgg.Dto.FeedbackDetailResponse;
import com.skillgapguide.sgg.Dto.FeedbackListResponse;
import com.skillgapguide.sgg.Entity.Feedback;
import com.skillgapguide.sgg.Entity.User;
import com.skillgapguide.sgg.Repository.FeedbackRepository;
import com.skillgapguide.sgg.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.List;

@Service
public class FeedbackService {
    @Autowired
    private FeedbackRepository feedbackRepository;
    @Autowired
    private UserRepository userRepository;
    public Page<FeedbackListResponse> getFeedbackList(int star, Integer pageNo, Integer pageSize){
        Pageable paging = PageRequest.of(pageNo, pageSize);
        if(star == 0){
            return feedbackRepository.getAllFeedback(paging);
        }
        return feedbackRepository.getAllFeedbackByStar(star,paging);
    }
    public FeedbackDetailResponse getFeedbackDetail(String email){
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("Người dùng không tồn tại"));
        return feedbackRepository.getFeedbackDetail(email);
    }
    public Feedback createFeedback(FeedbackDTO feedback) {
        User user = userRepository.findById(feedback.getUserId())
                .orElseThrow(() -> new IllegalStateException("User does not exist"));

        Feedback f = new Feedback();
        f.setUserId(user.getUserId());
        f.setContent(feedback.getContent());
        if(feedback.getStar() < 1 || feedback.getStar() > 5) {
            throw new IllegalArgumentException("Star phải nằm trong khoảng từ 1 đến 5");
        }
        f.setStar(feedback.getStar());
        f.setCreateAt(new Timestamp(System.currentTimeMillis()));
        return feedbackRepository.save(f);
    }

}
