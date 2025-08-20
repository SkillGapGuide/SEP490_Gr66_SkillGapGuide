package com.skillgapguide.sgg.Service;

import com.skillgapguide.sgg.Dto.FeedbackDTO;
import com.skillgapguide.sgg.Dto.FeedbackDetailResponse;
import com.skillgapguide.sgg.Dto.FeedbackListResponse;
import com.skillgapguide.sgg.Entity.Feedback;
import com.skillgapguide.sgg.Entity.User;
import com.skillgapguide.sgg.Repository.FeedbackRepository;
import com.skillgapguide.sgg.Repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.Arrays;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FeedbackServiceTest {

    class TestFeedbackListResponse implements FeedbackListResponse {
        @Override
        public String getEmail() {
            return "test@example.com";
        }
        @Override
        public String getContent() {
            return "Test content";
        }
        @Override
        public String getTime() {
            return "2024-01-01T00:00:00";
        }
        @Override
        public Integer getStar() {
            return 5;
        }
    }
    class TestFeedbackDetailResponse implements FeedbackDetailResponse {
        @Override
        public String getEmail() {
            return "test@example.com";
        }
        @Override
        public String getName() {
            return "Test Name";
        }
        @Override
        public String getContent() {
            return "Test content";
        }
        @Override
        public String getTime() {
            return "2024-01-01T00:00:00";
        }
        @Override
        public Integer getStar() {
            return 5;
        }
    }
    @Mock
    private FeedbackRepository feedbackRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private FeedbackService feedbackService;

    @Test
    void getFeedbackListReturnsAllFeedbacksWhenStarIsZero() {
        int star = 0;
        int pageNo = 0;
        int pageSize = 10;
        Pageable pageable = PageRequest.of(pageNo, pageSize);
        Page<FeedbackListResponse> page = new PageImpl<>(Arrays.asList(new TestFeedbackListResponse()));
        when(feedbackRepository.getAllFeedback(pageable)).thenReturn(page);

        Page<FeedbackListResponse> result = feedbackService.getFeedbackList(star, pageNo, pageSize);

        assertEquals(1, result.getContent().size());
        verify(feedbackRepository).getAllFeedback(pageable);
    }

    @Test
    void getFeedbackListReturnsFeedbacksByStar() {
        int star = 5;
        int pageNo = 0;
        int pageSize = 10;
        Pageable pageable = PageRequest.of(pageNo, pageSize);
        Page<FeedbackListResponse> page = new PageImpl<>(Arrays.asList(new TestFeedbackListResponse()));
        when(feedbackRepository.getAllFeedbackByStar(star, pageable)).thenReturn(page);

        Page<FeedbackListResponse> result = feedbackService.getFeedbackList(star, pageNo, pageSize);

        assertEquals(1, result.getContent().size());
        verify(feedbackRepository).getAllFeedbackByStar(star, pageable);
    }

    @Test
    void getFeedbackDetailReturnsFeedback() {
        String email = "test@example.com";
        User user = new User();
        user.setUserId(1);
        FeedbackDetailResponse response = new TestFeedbackDetailResponse();
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(feedbackRepository.getFeedbackDetail(email)).thenReturn(response);

        FeedbackDetailResponse result = feedbackService.getFeedbackDetail(email);

        assertNotNull(result);
        verify(feedbackRepository).getFeedbackDetail(email);
    }

    @Test
    void getFeedbackDetailThrowsExceptionWhenUserNotFound() {
        String email = "test@example.com";
        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

        assertThrows(IllegalStateException.class, () -> feedbackService.getFeedbackDetail(email));
    }

    @Test
    void createFeedbackSuccess() {
        FeedbackDTO feedbackDTO = new FeedbackDTO();
        feedbackDTO.setUserId(1);
        feedbackDTO.setContent("Great service");
        feedbackDTO.setStar(5);
        User user = new User();
        user.setUserId(1);
        when(userRepository.findById(1)).thenReturn(Optional.of(user));
        when(feedbackRepository.save(any(Feedback.class))).thenReturn(new Feedback());

        Feedback result = feedbackService.createFeedback(feedbackDTO);

        assertNotNull(result);
        verify(feedbackRepository).save(any(Feedback.class));
    }

    @Test
    void createFeedbackThrowsExceptionForInvalidStar() {
        FeedbackDTO feedbackDTO = new FeedbackDTO();
        feedbackDTO.setUserId(1);
        feedbackDTO.setContent("Great service");
        feedbackDTO.setStar(6);
        User user = new User();
        user.setUserId(1);
        when(userRepository.findById(1)).thenReturn(Optional.of(user));

        assertThrows(IllegalArgumentException.class, () -> feedbackService.createFeedback(feedbackDTO));
    }
}