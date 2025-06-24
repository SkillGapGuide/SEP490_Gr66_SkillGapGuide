package com.skillgapguide.sgg.Service;


import com.skillgapguide.sgg.Entity.Course;
import com.skillgapguide.sgg.Entity.UserFavoriteCourse;
import com.skillgapguide.sgg.Repository.CourseRepository;
import com.skillgapguide.sgg.Repository.FavoriteCourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CourseService {
    private final CourseRepository courseRepository;
    private final FavoriteCourseRepository favoriteCourseRepository;

    public Course getCourseById(Integer courseId) {
        return courseRepository.findCourseByCourseId(courseId);
    }

    public Page<UserFavoriteCourse> getFavoriteCoursesByUserId(Integer userId, int pageNo, int pageSize) {
        Pageable pageable = Pageable.ofSize(pageSize).withPage(pageNo);
        return favoriteCourseRepository.findByUserId(userId, pageable); // Hoặc findByIdUserId nếu dùng composite key
    }
}
