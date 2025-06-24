package com.skillgapguide.sgg.Controller;

import com.skillgapguide.sgg.Entity.Course;
import com.skillgapguide.sgg.Response.EHttpStatus;
import com.skillgapguide.sgg.Response.Response;
import com.skillgapguide.sgg.Service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CourseController {
    private final CourseService courseService;

    @GetMapping("/findById/{courseId}")
    public Response<Course> getCourseById(@PathVariable Integer courseId) {
        return new Response<>(EHttpStatus.OK, "Lấy thông tin khóa học thành công", courseService.getCourseById(courseId));
    }
    @GetMapping("/findAllFavoriteCourses/{userId}")
    public Response<?> findAllFavoriteCourses(
            @PathVariable Integer userId,
            @RequestParam(defaultValue = "0") int pageNo,
            @RequestParam(defaultValue = "10") int pageSize) {
        return new Response<>(EHttpStatus.OK, "Lấy danh sách tất cả khóa học yêu thích thành công",
                courseService.getFavoriteCoursesByUserId(userId, pageNo, pageSize));
    }
}
