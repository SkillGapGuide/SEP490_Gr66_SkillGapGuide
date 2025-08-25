package com.skillgapguide.sgg.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfReader;
import com.itextpdf.kernel.pdf.canvas.parser.PdfTextExtractor;
import com.skillgapguide.sgg.Dto.ExtractJDSkillDTO;
import com.skillgapguide.sgg.Entity.*;
import com.skillgapguide.sgg.Repository.*;
import com.skillgapguide.sgg.Response.EHttpStatus;
import com.skillgapguide.sgg.Response.Response;
import org.apache.poi.xwpf.extractor.XWPFWordExtractor;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.client.WebClient;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class JobService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private EmbedService embedService;
    @Autowired
    private JobDesFileRepository jobDesFileRepository;
    @Autowired
    private JobDeleteService jobDeleteService;
    @Autowired
    private JobDesSkillsRepository jobDesSkillsRepository;
    @Autowired
    private CVRepository cvRepository;
    @Autowired
    private JobRepository jobRepository;
    @Autowired
    private AuditLogRepository auditLogRepository;
    private final String UPLOAD_DIR = "JdData/";
    public List<String> loadMultiFile(MultipartFile[] files){
        jobDeleteService.deleteJob(); // delete job
        jobDeleteService.deleteFileJobDes(); // delete file job description
        List<String> uploadedIds = new ArrayList<>();
        for (MultipartFile file : files) {
            if (file.isEmpty()) {
                throw new IllegalStateException("Có file trống, vui lòng kiểm tra lại");
            }
            String fileName = file.getOriginalFilename();
            String fileExtension = (fileName != null && fileName.contains("."))
                    ? fileName.substring(fileName.lastIndexOf('.') + 1)
                    : "";
            if (!fileExtension.equalsIgnoreCase("pdf") && !fileExtension.equalsIgnoreCase("docx")) {
                throw new IllegalStateException("Chỉ chấp nhận file PDF");
            }
            // 3. Gọi service để lưu từng tệp và lưu lại ID/trạng thái
            String uniqueFileName = java.util.UUID.randomUUID() + "_" + fileName;
            String id = uploadJd(uniqueFileName, fileExtension, file);
            uploadedIds.add(id);
        }
        return uploadedIds;
    }
    public String uploadJd(String fileName, String fileExtension, MultipartFile file) {
        try {
            String email = SecurityContextHolder.getContext().getAuthentication().getName(); // lấy từ JWT
            Integer userId = userRepository.findByEmail(email).map(User::getUserId).orElseThrow(() -> new RuntimeException("User not found"));
            Cv cv = cvRepository.findByUserId(userId);
            if (cv == null) {
                throw new IllegalStateException("Chưa upload cv");
            }
            Files.createDirectories(Paths.get(UPLOAD_DIR));
            Path path = Paths.get(UPLOAD_DIR + fileName);
            Files.write(path, file.getBytes());

            JobDesFile jobMetadata = new JobDesFile();
            jobMetadata.setUserId(userId);
            jobMetadata.setFileName(fileName);
            jobMetadata.setFilePath(path.toAbsolutePath().toString());
            jobMetadata.setFileType(fileExtension);
            jobMetadata.setUploadDate(LocalDateTime.now());
            jobDesFileRepository.save(jobMetadata);
            AuditLog auditLog = new AuditLog();
            auditLog.setUserId(userId);
            auditLog.setAction("UPLOAD_JOB_DESCRIPTION");
            auditLog.setDescription("User uploaded job description file: " + fileName);
            auditLog.setCreatedAt(Timestamp.valueOf(LocalDateTime.now()));
            auditLogRepository.save(auditLog);
            return "File JD đã được upload thành công: " + fileName;
        } catch (IOException e) {
            e.printStackTrace();
            return "Upload file JD thất bại";
        }
    }

    public static String extractTextFromFile(String filePath, String fileType) throws IOException {
        try {
            if (fileType.equals("pdf")) {
                StringBuilder text = new StringBuilder();
                PdfDocument pdfDoc = new PdfDocument(new PdfReader(filePath));
                int pages = pdfDoc.getNumberOfPages();
                for (int i = 1; i <= pages; i++) {
                    text.append(PdfTextExtractor.getTextFromPage(pdfDoc.getPage(i)));
                }
                pdfDoc.close();
                return text.toString();
            } else if (fileType.equals("docx")) {
                try (XWPFDocument doc = new XWPFDocument(Files.newInputStream(Paths.get(filePath)))) {
                    XWPFWordExtractor extractor = new XWPFWordExtractor(doc);
                    return extractor.getText();
                }
            } else {
                throw new IllegalArgumentException("Unsupported file type: " + filePath);
            }
        } catch (IOException ioException) {
            ioException.printStackTrace();
            return "Upload file JD thất bại";
        }
    }

    public void extractJd(String filePath, int userId, String fileType) throws IOException {
        String text = extractTextFromFile(filePath,fileType);
            try {
                String prompt = """
Hãy phân tích nội dung JD dưới đây và trích xuất các thông tin sau:
- Tên vị trí (title)
- Viết lại mô tả công việc (description) bằng cách loại bỏ các phần phúc lợi, chế độ, địa điểm làm việc…
NHƯNG phải giữ lại toàn bộ yêu cầu công việc và yêu cầu ứng viên (không được bỏ bớt ý).
- Tên công ty (company)
- Danh sách tất cả các kỹ năng yêu cầu (skills)
Yêu cầu:
- Nếu JD bằng tiếng Việt, kết quả phải giữ nguyên bằng tiếng Việt (không dịch sang tiếng Anh).
- Trả về đúng định dạng JSON như sau, không thêm bất kỳ nội dung nào khác ngoài JSON:
{
  "title": "",
  "description": "",
  "company": "",
  "skills": []
}
JD:
""" + text;

                OllamaService service = new OllamaService(WebClient.builder());
                String content = service.callMistralApi(prompt).block();
                try {
                    ObjectMapper mapper = new ObjectMapper();
                    ExtractJDSkillDTO response = mapper.readValue(content, ExtractJDSkillDTO.class);
                    Cv cv = cvRepository.findByUserId(userId);
                    List<String> skills = response.getSkills();

                    Job jobNew = new Job();
                    jobNew.setTitle(response.getTitle());
                    jobNew.setCompany(response.getCompany());
                    jobNew.setDescription(response.getDescription());
                    jobNew.setStatus("ACTIVE");
                    jobNew.setCvId(cv.getId());
                    jobRepository.save(jobNew);

                    saveJobSkillsToDb(skills, jobNew.getJobId());

                } catch (Exception e) {
                    e.printStackTrace();
                    throw new IllegalStateException("Lỗi khi phân tích JD: " + e.getMessage());
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
    }
    public void saveJobSkillsToDb(List<String> skills, int jobId) throws Exception {
        for (String skill : skills) {
            JobDesSkills jobDesSkills = new JobDesSkills();
            jobDesSkills.setSkill(skill);
            jobDesSkills.setJobId(jobId);
            jobDesSkillsRepository.save(jobDesSkills);
            embedService.getJobDesSkillEmbedding(skill);
        }
    }
    public List<JobDesSkills> getJobSkill(int jobId) {
        return jobDesSkillsRepository.findByJobId(jobId);
    }

    public List<Job> getJobList() throws IOException {
        String email = SecurityContextHolder.getContext().getAuthentication().getName(); // lấy từ JWT
        Integer userId = userRepository.findByEmail(email).map(User::getUserId).orElseThrow(() -> new RuntimeException("User not found"));
        Cv cv = cvRepository.findByUserId(userId);
        if (cv == null) {
            throw new IllegalStateException("Chưa upload cv");
        }
        return jobRepository.getJobsByCvId(cv.getId());
    }
    public void analyzeJobDescription(int option) throws IOException {
        String email = SecurityContextHolder.getContext().getAuthentication().getName(); // lấy từ JWT
        Integer userId = userRepository.findByEmail(email).map(User::getUserId).orElseThrow(() -> new RuntimeException("User not found"));
        Cv cv = cvRepository.findByUserId(userId);
        if (option ==1) {
            List<JobDesFile> jobDesFiles = jobDesFileRepository.findByUserId(userId);
            if (jobDesFiles.isEmpty()) {
                throw new IllegalStateException("Chưa upload job description");
            }
            for (JobDesFile jobDesFile : jobDesFiles) {
                Path path = Paths.get(jobDesFile.getFilePath());
                extractJd(path.toAbsolutePath().toString(), userId, jobDesFile.getFileType());
            }
        } else if(option == 2|| option== 3){
            List<Job> jobList = jobRepository.getJobsByCvId(cv.getId());
            if (jobList.isEmpty()) {
                throw new IllegalStateException("Chưa upload job description");
            }
            for( Job job : jobList) {
                String prompt = """
Hãy phân tích nội dung JD dưới đây và trích xuất tất cả các kỹ năng yêu cầu của ứng viên. Đồng thời viết lại mô tả công việc bằng cách loại bỏ các phần phúc lợi, chế độ, địa điểm làm việc…
NHƯNG phải giữ lại toàn bộ yêu cầu công việc và yêu cầu ứng viên (không được bỏ bớt ý).
Yêu cầu:
- Giữ nguyên kỹ năng theo ngôn ngữ gốc của JD (nếu JD là tiếng Việt thì không được dịch sang tiếng Anh).
- Chỉ trả về duy nhất định dạng JSON như sau, không thêm bất kỳ nội dung nào khác:
{
"skills": [
],
"description":"..."
}
JD:
""" + job.getDescription();
                OllamaService service = new OllamaService(WebClient.builder());
                String content = service.callMistralApi(prompt).block();
                try {
                    ObjectMapper mapper = new ObjectMapper();
                    ExtractJDSkillDTO response = mapper.readValue(content, ExtractJDSkillDTO.class);
                    List<String> skills = response.getSkills();
                    saveJobSkillsToDb(skills, job.getJobId());
                    job.setDescription(response.getDescription());
                    jobRepository.save(job);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }

    }
}
