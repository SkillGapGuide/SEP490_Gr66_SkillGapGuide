package com.skillgapguide.sgg.Controller;

import com.skillgapguide.sgg.Response.EHttpStatus;
import com.skillgapguide.sgg.Response.Response;
import com.skillgapguide.sgg.Service.JobMatchService;
import com.skillgapguide.sgg.Service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequestMapping("/api/job/match")
public class JobMatchController {
    @Autowired
    private JobService jobService;
    @Autowired
    private JobMatchService jobMatchService;

    @GetMapping("/getJobList")
    public Response<?> getJobList() throws IOException {
        return new Response<>(EHttpStatus.OK, jobService.getJobList());
    }
    @GetMapping("/getJobMatchScore")
    public Response<?> getJobMatchScore() throws Exception {
        return new Response<>(EHttpStatus.OK, jobMatchService.getJobMatchScore());
    }
}
