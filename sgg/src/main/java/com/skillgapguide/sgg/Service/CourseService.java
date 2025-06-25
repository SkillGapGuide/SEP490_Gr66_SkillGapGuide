package com.skillgapguide.sgg.Service;


import com.skillgapguide.sgg.Dto.CourseDTO;
import com.skillgapguide.sgg.Entity.Course;
import com.skillgapguide.sgg.Entity.UserFavoriteCourse;
import com.skillgapguide.sgg.Repository.CourseRepository;
import com.skillgapguide.sgg.Repository.FavoriteCourseRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;


import java.sql.Timestamp;
import java.util.Optional;

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
    public UserFavoriteCourse addCourseToFavorites(Integer userId, Integer courseId) {
        // Kiểm tra xem khóa học có tồn tại không
        Course course = courseRepository.findCourseByCourseId(courseId);
        if (course == null) {
            throw new IllegalArgumentException("Khóa học không tồn tại");
        }

        // Kiểm tra xem cặp userId và courseId đã tồn tại trong danh sách yêu thích chưa
        Optional<UserFavoriteCourse> existingFavorite = favoriteCourseRepository.findByUserIdAndCourseId(userId, courseId);
        if (existingFavorite.isPresent()) {
            throw new IllegalStateException("Khóa học đã có trong danh sách yêu thích");
        }

        // Tạo bản ghi UserFavoriteCourse mới
        UserFavoriteCourse favoriteCourse = new UserFavoriteCourse();
        favoriteCourse.setUserId(userId);
        favoriteCourse.setCourse(course);
        favoriteCourse.setStatus("ACTIVE");
        favoriteCourse.setCreatedAt(new Timestamp(System.currentTimeMillis()));

        // Lưu vào cơ sở dữ liệu
        return favoriteCourseRepository.save(favoriteCourse);
    }
    public void hideCourse(Integer courseId) {
        Course course = courseRepository.findCourseByCourseId(courseId);
        if (course == null) {
            throw new IllegalArgumentException("Khóa học không tồn tại");
        }
        course.setStatus("HIDDEN");
        courseRepository.save(course);
    }
    public void showCourse(Integer courseId) {
        Course course = courseRepository.findCourseByCourseId(courseId);
        if (course == null) {
            throw new IllegalArgumentException("Khóa học không tồn tại");
        }
        course.setStatus("AVAILABLE");
        courseRepository.save(course);
    }
    public Course addCourseManually(CourseDTO course) {
        Logger logger = LoggerFactory.getLogger(CourseService.class);

        // Input validation
        if (course == null ||
                course.getTitle() == null || course.getTitle().trim().isEmpty() ||
                course.getUrl() == null || course.getUrl().trim().isEmpty() ||
                course.getProvider() == null || course.getProvider().trim().isEmpty()) {
            throw new IllegalArgumentException("Course title, URL, and provider must not be empty");
        }

        // Check for existing course
        Optional<Course> existingCourse = courseRepository.findCourseByUrl(course.getUrl());
        if (existingCourse.isPresent()) {
            logger.warn("Attempt to add duplicate course with URL: {}", course.getUrl());
            throw new IllegalStateException("Course already exists");
        }

        Course newCourse = new Course();
        newCourse.setTitle(course.getTitle());
        newCourse.setDescription(course.getDescription());
        newCourse.setProvider(course.getProvider());
        newCourse.setUrl(course.getUrl());
        newCourse.setStatus("AVAILABLE");
        newCourse.setCreatedAt(new Timestamp(System.currentTimeMillis()));

        logger.info("Adding new course: {}", newCourse.getTitle());
        return courseRepository.save(newCourse);
    }
    // At the top of the class
    private static final Logger logger = LoggerFactory.getLogger(CourseService.class);

    public void removeFavoriteCourse(Integer userId, Integer courseId) {
        Optional<UserFavoriteCourse> existingFavorite = favoriteCourseRepository.findByUserIdAndCourseId(userId, courseId);
        if (existingFavorite.isEmpty()) {
            logger.warn("Attempted to remove non-existent favorite: userId={}, courseId={}", userId, courseId);
            throw new IllegalStateException("Favorite course not found");
        }
        favoriteCourseRepository.delete(existingFavorite.get());
        logger.info("Removed favorite course: userId={}, courseId={}", userId, courseId);
    }

    public void removeAllFavoriteCourses(Integer userId) {
        Page<UserFavoriteCourse> favoriteCourses = favoriteCourseRepository.findByUserId(userId, Pageable.unpaged());
        favoriteCourseRepository.deleteAll(favoriteCourses.getContent());
        logger.info("Removed all favorite courses for userId={}", userId);
    }
}
