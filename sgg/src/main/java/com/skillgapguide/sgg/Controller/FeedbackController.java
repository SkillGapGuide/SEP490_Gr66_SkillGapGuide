package com.skillgapguide.sgg.Controller;

import com.skillgapguide.sgg.Dto.FeedbackDTO;
import com.skillgapguide.sgg.Entity.Feedback;
import com.skillgapguide.sgg.Response.EHttpStatus;
import com.skillgapguide.sgg.Response.Response;
import com.skillgapguide.sgg.Service.FeedbackService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {
    @Autowired
    private FeedbackService feedbackService;
    @GetMapping("/getAll")
    public Response<?> getAllFeedback(@RequestParam(defaultValue = "0") int star,
                                      @RequestParam(defaultValue = "0") Integer pageNo,
                                      @RequestParam(defaultValue = "10") Integer pageSize){
        return new Response<>(EHttpStatus.OK,feedbackService.getFeedbackList(star,pageNo,pageSize));
    }
    @GetMapping("/getDetail/{email}")
    public Response<?> getDetailFeedback(@PathVariable String email){
        return new Response<>(EHttpStatus.OK,feedbackService.getFeedbackDetail(email));
    }
    @PostMapping("/createFeedback")
    public Response<?> createFeedback(@Valid @RequestBody FeedbackDTO feedback) {
        return new Response<>(EHttpStatus.OK, feedbackService.createFeedback(feedback) );
    }
}
