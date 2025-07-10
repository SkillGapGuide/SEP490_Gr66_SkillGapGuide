package com.skillgapguide.sgg.Service;

import com.skillgapguide.sgg.Repository.JobRepository;
import lombok.RequiredArgsConstructor;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.springframework.stereotype.Service;
import com.skillgapguide.sgg.Entity.Job;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.transaction.annotation.Transactional;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobScrapingService {
    private final JobRepository jobRepository;
//    private final JobCategoryRepository jobCategoryRepository;
    @Transactional // Đảm bảo các thao tác DB được thực hiện trong một giao dịch
    public void scrapeAndSaveJob(String jobDetailUrl) {
        if (jobRepository.existsBySourceUrl(jobDetailUrl)) {
            System.out.println(">>> CÔNG VIỆC ĐÃ TỒN TẠI, BỎ QUA: " + jobDetailUrl);
            return; // Dừng thực thi phương thức ngay lập tức.
        }
        System.setProperty("webdriver.chrome.driver", "sgg/drivers/chromedriver.exe"); // Cập nhật đường dẫn đến chromedriver
        // Cấu hình để chạy Chrome ở chế độ headless (không hiện cửa sổ trình duyệt)
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--headless=new");
        options.addArguments("--disable-gpu");
        options.addArguments("--window-size=1920,1080");
        options.addArguments("--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36");

        WebDriver driver = null;
        try {
            // Khởi tạo trình duyệt Chrome với các cấu hình
            driver = new ChromeDriver(options);

            // 1. Mở URL bằng Selenium
            driver.get(jobDetailUrl);

            // Chờ một chút để JavaScript có thời gian tải hết nội dung động
            // Đây là cách đơn giản, các cách nâng cao hơn dùng WebDriverWait
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            By categorySelector = By.cssSelector("div.job-detail__company--information-item.company-field div.company-value");
            wait.until(ExpectedConditions.visibilityOfElementLocated(categorySelector));
            // 2. Lấy HTML của trang sau khi đã được render đầy đủ
            String pageSource = driver.getPageSource();

            // 3. Đưa HTML đã render cho Jsoup phân tích
            Document doc = Jsoup.parse(pageSource);

            // === Phần code phân tích và lưu DB giữ nguyên ===
            // === Lưu ý: Bạn cần kiểm tra lại các CSS Selector cho chính xác ===
            // Selector của bạn có thể sai, ví dụ title có thể là "h1.job-title"
            String title = doc.selectFirst("h1.job-detail__info--title").text();
            String company = doc.selectFirst("a.name").text();
            String categoryName = doc.selectFirst("div.job-detail__company--information-item.company-field div.company-value").text();
            StringBuilder descriptionBuilder = new StringBuilder();
            Elements descriptionItems = doc.select("div.job-description__item--content p, div.job-description__item--content div");
            for (Element item : descriptionItems) {
                descriptionBuilder.append(item.html());
            }
            String fullDescription = descriptionBuilder.toString();

            // === 4. Tạo và lưu đối tượng Job ===
            Job job = new Job();
            job.setTitle(title);
            job.setCompany(company);
            job.setDescription(fullDescription);
            job.setStatus("ACTIVE"); // Đặt trạng thái mặc định
            job.setSourceUrl(jobDetailUrl);
            jobRepository.save(job); // Lưu job vào database [5][6][8]

            System.out.println("Đã lưu công việc: " + title);

        } catch (Exception e) {
            System.err.println("Lỗi khi cào và lưu dữ liệu từ URL: " + jobDetailUrl);
            e.printStackTrace();
        } finally {
            // Rất quan trọng: Luôn đóng trình duyệt sau khi dùng xong để giải phóng bộ nhớ
            if (driver != null) {
                driver.quit();
            }
        }
    }
    public List<String> scrapeJobLinksFromListPage(String listPageUrl) {
        System.setProperty("webdriver.chrome.driver", "sgg/drivers/chromedriver.exe"); // Đường dẫn chromedriver của bạn
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--headless=new");
        options.addArguments("--disable-gpu");
        options.addArguments("--window-size=1920,1080");
        options.addArguments("--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36");

        WebDriver driver = null;
        List<String> jobLinks = new ArrayList<>();

        try {
            driver = new ChromeDriver(options);
            driver.get(listPageUrl);

            // Đợi cho đến khi danh sách job hiển thị (chỉ cần 1 job là đủ)
            WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
            wait.until(ExpectedConditions.visibilityOfElementLocated(
                    By.cssSelector("div.job-item-search-result.bg-highlight.job-ta div.body div.body-box div.body-content div.title-block div h3.title a")
            ));

            // Lấy tất cả các link job
            List<WebElement> linkElements = driver.findElements(
                    By.cssSelector("div.job-item-search-result.bg-highlight.job-ta div.body div.body-box div.body-content div.title-block div h3.title a")

            );

            jobLinks = linkElements.stream()
                    .map(e -> e.getAttribute("href"))
                    .filter(href -> href != null && !href.isEmpty())
                    .distinct()
                    .collect(Collectors.toList());

        } catch (Exception e) {
            System.err.println("Lỗi khi lấy danh sách link job từ: " + listPageUrl);
            e.printStackTrace();
        } finally {
            if (driver != null) driver.quit();
        }
        return jobLinks;
    }
    @Transactional
    public void scrapeAndSaveTop10JobsByCategory(String categoryListUrl) {
        int n = 10;
        // 1. Lấy danh sách link job từ trang category (danh sách việc làm theo lĩnh vực)
        List<String> jobLinks = scrapeJobLinksFromListPage(categoryListUrl);

        if (jobLinks == null || jobLinks.isEmpty()) {
            System.out.println("Không tìm thấy job nào ở URL: " + categoryListUrl);
            return;
        }

        // 2. Chỉ lấy tối đa n link đầu tiên
        List<String> topNJobLinks = jobLinks.stream().limit(n).collect(Collectors.toList());

        // 3. Lặp và crawl từng job
        int count = 0;
        for (String jobUrl : topNJobLinks) {
            try {
                scrapeAndSaveJob(jobUrl);
                count++;
            } catch (Exception e) {
                System.err.println("Lỗi khi crawl job: " + jobUrl + " - " + e.getMessage());
            }
        }
        System.out.println("Đã crawl xong " + count + " job đầu tiên cho lĩnh vực: " + categoryListUrl);

    }
}
