package com.skillgapguide.sgg.Service;


import com.skillgapguide.sgg.Dto.CourseDTO;
import com.skillgapguide.sgg.Dto.ScrapeResultDTO;
import com.skillgapguide.sgg.Entity.Course;
import com.skillgapguide.sgg.Entity.UserFavoriteCourse;
import com.skillgapguide.sgg.Repository.CourseRepository;
import com.skillgapguide.sgg.Repository.FavoriteCourseRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.devtools.DevTools;
import org.openqa.selenium.devtools.v136.network.Network;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.github.javafaker.Faker;
import com.github.mabinogi233.undetected_chromedriver.ChromeDriverBuilder;

import java.io.FileWriter;
import java.io.IOException;
import java.sql.Timestamp;
import java.time.Duration;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.ThreadLocalRandom;

@Service
@RequiredArgsConstructor
public class CourseService {
    private final CourseRepository courseRepository;
    private final FavoriteCourseRepository favoriteCourseRepository;
    @PersistenceContext
    private EntityManager entityManager;

    public Course getCourseById(Integer courseId) {
        Course course = courseRepository.findCourseByCourseId(courseId);
        if (course == null) {
            throw new IllegalArgumentException("Khóa học không tồn tại");
        }
        return course;
    }

    public Page<Course> getAllCourses(int pageNo, int pageSize) {
        Pageable pageable = Pageable.ofSize(pageSize).withPage(pageNo - 1);
        Page<Course> course = courseRepository.findAll(pageable);
        if (course.isEmpty()) {
            throw new IllegalArgumentException("Không có khóa học nào được tìm thấy");
        }
        return course;
    }

    public Page<UserFavoriteCourse> getFavoriteCoursesByUserId(Integer userId, int pageNo, int pageSize) {
        Pageable pageable = Pageable.ofSize(pageSize).withPage(pageNo - 1);
        if (userId == null) {
            throw new IllegalArgumentException("User ID không được để trống");
        }
        Page<UserFavoriteCourse> courses = favoriteCourseRepository.findByUserId(userId, pageable);
        return courses;
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
        favoriteCourse.setStatus("Not Started");
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
            throw new IllegalArgumentException("Không được để trống các trường tiêu đề, URL và nhà cung cấp");
        }

        // Check for existing course
        Optional<Course> existingCourse = courseRepository.findCourseByUrl(course.getUrl());
        if (existingCourse.isPresent()) {
            logger.warn("Attempt to add duplicate course with URL: {}", course.getUrl());
            throw new IllegalStateException("Khóa học đã tồn tại");
        }

        Course newCourse = new Course();
        newCourse.setTitle(course.getTitle());
        newCourse.setRating(course.getRating());
        newCourse.setDifficulty(course.getDifficulty());
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

    public void changeFavoriteCourseStatus(Integer courseId, Integer userId, String status) {
        UserFavoriteCourse favoriteCourse = favoriteCourseRepository.findByUserIdAndCourseId(userId, courseId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy khóa học yêu thích"));
        favoriteCourse.setStatus(status);
        favoriteCourseRepository.save(favoriteCourse);
        logger.info("Changed status of favorite course: userId={}, courseId={}, status={}", userId, courseId, status);
    }

    public void removeFavoriteCourse(Integer userId, Integer courseId) {
        Optional<UserFavoriteCourse> existingFavorite = favoriteCourseRepository.findByUserIdAndCourseId(userId, courseId);
        if (existingFavorite.isEmpty()) {
            logger.warn("Attempted to remove non-existent favorite: userId={}, courseId={}", userId, courseId);
            throw new IllegalStateException("Không tim thấy khóa học yêu thích");
        }
        favoriteCourseRepository.delete(existingFavorite.get());
        logger.info("Removed favorite course: userId={}, courseId={}", userId, courseId);
    }

    public void removeAllFavoriteCourses(Integer userId) {
        Page<UserFavoriteCourse> favoriteCourses = favoriteCourseRepository.findByUserId(userId, Pageable.unpaged());
        favoriteCourseRepository.deleteAll(favoriteCourses.getContent());
        logger.info("Removed all favorite courses for userId={}", userId);
    }

//    public ScrapeResultDTO scrapeAndSaveCoursesByCvId(int numPages, int numItems, Integer cvId) {
//        List<Course> scrapedCourses = new ArrayList<>();
//        List<String> logs = new ArrayList<>();
//        List<String> jobSkills = courseRepository.findJobSkillsByCvId(cvId);
//        if (jobSkills == null || jobSkills.isEmpty()) {
//            logs.add("Không tìm thấy jobSkill nào cho cvId=" + cvId);
//            return new ScrapeResultDTO(scrapedCourses, logs);
//        }
//
//        WebDriver driver = createChromeDriver();
//        try {
//            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(TIMEOUT_SECONDS));
//            for (String keyword : jobSkills) {
//                for (int page = 1; page <= numPages; page++) {
//                    try {
//                        List<Course> pageCourses = scrapePageAndReturnCourses(driver, wait, page, numItems, keyword, logs);
//                        scrapedCourses.addAll(pageCourses);
//                        if (!pageCourses.isEmpty()) {
//                            randomSleep(PAGE_DELAY_MIN, PAGE_DELAY_MAX);
//                        }
//                    } catch (Exception e) {
//                        logs.add("Lỗi khi xử lý trang " + page + ": " + e.getMessage());
//                        entityManager.clear();
//                    }
//                }
//            }
//        } finally {
//            if (driver != null) driver.quit();
//        }
//        return new ScrapeResultDTO(scrapedCourses, logs);
//    }
    public Map<String, List<Course>> scrapeCoursesGroupedByJobSkill(int numPages, int numItems, Integer cvId) {
        Map<String, List<Course>> result = new LinkedHashMap<>();
        List<String> jobSkills = courseRepository.findJobSkillsByCvId(cvId);
        if (jobSkills == null || jobSkills.isEmpty()) {
            logger.warn("Không có job skill nào cho CV id {}", cvId);
            return result;
        }

        WebDriver driver = createChromeDriver();
        try {
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(TIMEOUT_SECONDS));
            int skillIdx = 0;
            for (String keyword : jobSkills) {
                logger.info("\n\n===== BẮT ĐẦU scrape skill: {} =====", keyword);
                List<Course> coursesForSkill = new ArrayList<>();
                for (int page = 1; page <= numPages; page++) {
                    boolean pageScrapedSuccessfully = false;
                    for (int attempt = 1; attempt <= RETRY_COUNT; attempt++) {
                        try {
                            List<Course> pageCourses = scrapePageAndReturnCourses(driver, wait, page, numItems, keyword);
                            coursesForSkill.addAll(pageCourses);
                            pageScrapedSuccessfully = true;
                            if (!pageCourses.isEmpty()) randomSleep(PAGE_DELAY_MIN, PAGE_DELAY_MAX);
                            logger.info("Đã lấy xong page {} keyword {}", page, keyword);
                            break; // Thành công
                        } catch (Exception e) {
                            logger.warn("Lỗi ở page {} keyword {} lần thử {}: {}", page, keyword, attempt, e.getMessage());
                            if (entityManager != null) entityManager.clear();
                            randomSleep(1000, 2000);
                        }
                    }
                    if (!pageScrapedSuccessfully) {
                        logger.error("BỎ QUA page {} của skill {} (sau {} lần thử)", page, keyword, RETRY_COUNT);
                    }
                }
                result.put(keyword, coursesForSkill);

                // Định kỳ reset driver tránh memory leak khi crawl dài
                skillIdx++;
                if (skillIdx % 5 == 0 && skillIdx < jobSkills.size()) {
                    logger.info("*** Reset Chrome Driver sau {} kỹ năng!", skillIdx);
                    driver.quit();
                    driver = createChromeDriver();
                    wait = new WebDriverWait(driver, Duration.ofSeconds(TIMEOUT_SECONDS));
                }
            }
        } finally {
            if (driver != null) driver.quit();
        }
        logger.info("== HOÀN THÀNH scrape cho {} job skills ==", jobSkills.size());
        return result;
    }
    private List<Course> scrapePageAndReturnCourses(WebDriver driver, WebDriverWait wait, int page, int numItems, String keyword) {
        List<Course> courses = new ArrayList<>();
        String pageUrl = buildSearchUrl(page, keyword);
        loadPageAndWait(driver, wait, pageUrl);
        List<String> courseUrls = extractCourseUrls(driver, numItems);
        logger.info("[{}] Tìm thấy {} khoá học mới trên trang {}", keyword, courseUrls.size(), pageUrl);

        for (String courseUrl : courseUrls) {
            try {
                Optional<Course> existingCourse = courseRepository.findCourseByUrl(courseUrl);
                Course course;
                if (existingCourse.isPresent()) {
                    course = existingCourse.get();
                    logger.info("Đã lấy từ DB: {}", course.getTitle());
                } else {
                    course = scrapeCourseDetails(driver, wait, courseUrl);
                    if (course != null) {
                        courseRepository.save(course);
                        logger.info("Saved course: {}", course.getTitle());
                    }
                }
                if (course != null) {
                    courses.add(course);
                }
                randomSleep(COURSE_DELAY_MIN, COURSE_DELAY_MAX);
            } catch (Exception e) {
                logger.error("Lỗi khi xử lý khóa học {}: {}", courseUrl, e.getMessage());
            }
        }
        return courses;
    }

    // Sửa lại hàm scrapePage để nhận keyword động
//    private boolean scrapePage(WebDriver driver, WebDriverWait wait, int page, int numItems, String keyword, Logger logger) {
//        try {
//            String pageUrl = buildSearchUrl(page, keyword);
//            loadPageAndWait(driver, wait, pageUrl, logger);
//            List<String> courseUrls = extractCourseUrls(driver, numItems, logger);
//            if (courseUrls.isEmpty()) {
//                logger.warn("Không tìm thấy khóa học trên trang {}", page);
//                return false;
//            }
//            processCourses(driver, wait, courseUrls, logger);
//            return true;
//        } catch (Exception e) {
//            logger.error("Lỗi khi xử lý trang {}: {}", page, e.getMessage());
//            return false;
//        }
//    }

    private void loadPageAndWait(WebDriver driver, WebDriverWait wait, String url) {
        long start = System.currentTimeMillis();
        driver.get(url);
        wait.until(d -> ((JavascriptExecutor) d).executeScript("return document.readyState").equals("complete"));
        wait.until(ExpectedConditions.presenceOfAllElementsLocatedBy(
                By.cssSelector("h3.ud-heading-lg.card-title-module--title--bv1rZ, .popper--popper--2r2To")));
        scrollToLoadContent(driver);
        logger.info("Tải trang {} mất {} ms", url, System.currentTimeMillis() - start);
    }

    private void scrollToLoadContent(WebDriver driver) {
        JavascriptExecutor js = (JavascriptExecutor) driver;
        Long lastHeight = ((Number) js.executeScript("return document.body.scrollHeight")).longValue();
        for (int i = 0; i < SCROLL_ITERATIONS; i++) {
            js.executeScript("window.scrollTo(0, document.body.scrollHeight);");
            sleep(SCROLL_DELAY);
            Long newHeight = ((Number) js.executeScript("return document.body.scrollHeight")).longValue();
            if (Objects.equals(newHeight, lastHeight)) break;
            lastHeight = newHeight;
        }
    }

    private List<String> extractCourseUrls(WebDriver driver, int numItems) {
        Document doc = Jsoup.parse(driver.getPageSource());
        Elements links = doc.select("a[href^='/course/']");
        if (links.isEmpty()) {
            links = doc.select("a.ud-link-neutral.ud-custom-focus-visible");
        }
        List<String> courseUrls = new ArrayList<>();
        int count = Math.min(numItems, links.size());
        for (int i = 0; i < count; i++) {
            String href = links.get(i).attr("href");
            if (href.startsWith("/course/")) {
                String courseUrl = BASE_URL + href.split("\\?")[0];
                if (!courseRepository.existsCourseByUrl(courseUrl)) {
                    courseUrls.add(courseUrl);
                } else {
                    logger.debug("Khóa học đã tồn tại: {}", courseUrl);
                }
            }
        }
        return courseUrls;
    }

//    private void processCourses(WebDriver driver, WebDriverWait wait, List<String> courseUrls, Logger logger) {
//        for (int i = 0; i < courseUrls.size(); i++) {
//            String courseUrl = courseUrls.get(i);
//            try {
//                Course course = scrapeCourseDetails(driver, wait, courseUrl, logger);
//                if (course != null) {
//                    courseRepository.save(course);
//                    logger.info("Đã lưu khóa học: {}", course.getTitle());
//                }
//                // Chỉ sleep nếu chưa phải là course cuối cùng
//                if (i < courseUrls.size() - 1) {
//                    randomSleep(COURSE_DELAY_MIN, COURSE_DELAY_MAX);
//                }
//            } catch (Exception e) {
//                logger.error("Lỗi khi xử lý khóa học {}: {}", courseUrl, e.getMessage());
//            }
//        }
//    }
    private static final int DESCRIPTION_MAX_LENGTH = 6000;
    private static final int DIFFICULTY_MAX_LENGTH = 2000;
    private Course scrapeCourseDetails(WebDriver driver, WebDriverWait wait, String courseUrl) {
        driver.get(courseUrl);
        wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.cssSelector("h1[data-purpose='lead-title'], .clp-lead__title, .course-title, h1.ud-heading")));
        Document doc = Jsoup.parse(driver.getPageSource());
        String title = extractText(doc, TITLE_SELECTORS);
        if (title.isEmpty()) {
            logger.warn("Bỏ qua khoá học thiếu tiêu đề: {}", courseUrl);
            return null;
        }
        Course course = new Course();
        course.setTitle(title);

        // Mô tả, độ dài cắt bớt nếu quá lớn
        String description = extractText(doc, DESCRIPTION_SELECTORS);
        if (description.length() > DESCRIPTION_MAX_LENGTH) {
            description = description.substring(0, DESCRIPTION_MAX_LENGTH);
        }
        course.setDescription(description);

        String difficulty = extractText(doc, DIFFICULTY_SELECTORS);
        if (difficulty.length() > DIFFICULTY_MAX_LENGTH) {
            difficulty = difficulty.substring(0, DIFFICULTY_MAX_LENGTH);
        }
        course.setDifficulty(difficulty);

        course.setRating(extractText(doc, RATING_SELECTORS));
        course.setProvider(extractText(doc, INSTRUCTOR_SELECTORS));
        course.setUrl(courseUrl);
        course.setStatus("AVAILABLE");
        course.setCreatedAt(Timestamp.from(Instant.now()));
        return course;
    }

    private WebDriver createChromeDriver() {
        String chromeDriverPath = System.getProperty("webdriver.chrome.driver.path", DEFAULT_CHROME_DRIVER_PATH);
        System.setProperty("webdriver.chrome.driver", chromeDriverPath);
        ChromeOptions options = buildChromeOptions();
        // Nếu bạn dùng undetected_chromedriver đặc biệt, replace bên dưới theo lib bạn gọi nhé
        return new ChromeDriver(options);
    }

    private ChromeOptions buildChromeOptions() {
        ChromeOptions options = new ChromeOptions();
        options.addArguments(
                "--window-size=1920,1080",
                "--headless=new", // Thay "--headless=new" bằng "" nếu muốn debug headed
                "--incognito",
                "--disable-blink-features=AutomationControlled",
                "--no-sandbox",
                "--disable-dev-shm-usage",
                "--disable-extensions",
                "--disable-notifications",
                "--user-agent=" + getRandomUserAgent()
        );
        return options;
    }
    private static String getRandomUserAgent() {
        return USER_AGENTS[ThreadLocalRandom.current().nextInt(USER_AGENTS.length)];
    }


    private String buildSearchUrl(int page, String keyword) {
        return String.format("%s/courses/search/?src=ukw&p=%d&q=%s", BASE_URL, page, keyword);
    }

    private static String extractText(Document doc, String... selectors) {
        return Arrays.stream(selectors)
                .map(doc::selectFirst)
                .filter(Objects::nonNull)
                .map(Element::text)
                .map(String::trim)
                .filter(text -> !text.isEmpty())
                .findFirst().orElse("");
    }

    private void randomSleep(int min, int max) {
        sleep(ThreadLocalRandom.current().nextInt(min, max + 1));
    }
    private void sleep(int milliseconds) {
        try { Thread.sleep(milliseconds); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
    }

    // Constants
    private static final String BASE_URL = "https://www.udemy.com";
    //    private static final String SEARCH_KEYWORD = "Java";
    private static final String DEFAULT_CHROME_DRIVER_PATH = "drivers/chromedriver";
//    private static final String USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36";

    private static final int TIMEOUT_SECONDS = 4;
    private static final int RETRY_COUNT = 2;
    private static final int SCROLL_ITERATIONS = 4;
    private static final int SCROLL_DELAY = 700;
    private static final int PAGE_DELAY_MIN = 2000, PAGE_DELAY_MAX = 3400;
    private static final int COURSE_DELAY_MIN = 2000, COURSE_DELAY_MAX = 3400;

    private static final String[] TITLE_SELECTORS = {
            "h1[data-purpose='lead-title']",
            "h1.ud-heading-xxl",
            ".clp-lead__title",
            "h1.ud-heading"
    };
    private static final String[] DIFFICULTY_SELECTORS = {
            "ul.styles--audience__list----YbP"
    };
    private static final String[] DESCRIPTION_SELECTORS = {
            "div.what-you-will-learn--content-spacing--6eP1j"
    };

    private static final String[] RATING_SELECTORS = {
            "[data-purpose='rating-number']"
    };

    private static final String[] INSTRUCTOR_SELECTORS = {
            "a.ud-btn.ud-btn-medium.ud-btn-link.ud-heading-sm.ud-text-sm.ud-instructor-links"
//            "span.ud-btn-label"

    };
    private static final String[] USER_AGENTS = {
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36"
    };
}
