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
import org.springframework.beans.factory.annotation.Autowired;
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
    private final String UPLOAD_DIR = "D:/JdData/";
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
            return "File JD đã được upload thành công: " + fileName;
        } catch (IOException e) {
            e.printStackTrace();
            return "Upload file JD thất bại";
        }
    }

    public static String extractTextFromPdf(String filePath) throws IOException {
        try {
            StringBuilder text = new StringBuilder();
            PdfDocument pdfDoc = new PdfDocument(new PdfReader(filePath));
            int pages = pdfDoc.getNumberOfPages();
            for (int i = 1; i <= pages; i++) {
                text.append(PdfTextExtractor.getTextFromPage(pdfDoc.getPage(i)));
            }
            pdfDoc.close();
            return text.toString();
        } catch (IOException ioException) {
            throw new IOException(ioException.getMessage());
        }
    }

    public void extractJd(String filePath, int userId, String fileName) throws IOException {
        String text = extractTextFromPdf(filePath);
            try {
                String prompt = "Hãy phân tích job description dưới đây và trích xuất tất cả các yêu cầu kỹ năng của ứng viên, title, description, company. Chỉ trả về kết quả dưới dạng JSON theo mẫu sau, không thêm bất kỳ nội dung nào khác:\n" +
                        "{\n" +
                        "\"skills\": [\n" +
                        "],\n" +
                        "\"title\": \"\",\n" +
                        "\"description\": \"\",\n" +
                        "\"company\": \"\"" +
                        "}\n" +
                        "JD:\n" + text;

                LMStudioService service = new LMStudioService(WebClient.builder());
                String content = service.callMistralApi(prompt).block();
                try {
                    saveJobSkillsToDb(content, userId);
                    AuditLog auditLog = new AuditLog();
                    auditLog.setUserId(userId);
                    auditLog.setAction("UPLOAD_JOB_DESCRIPTION");
                    auditLog.setDescription("User uploaded job description file: " + fileName);
                    auditLog.setCreatedAt(Timestamp.valueOf(LocalDateTime.now()));
                    auditLogRepository.save(auditLog);
                } catch (Exception e) {
                    throw new RuntimeException(e);
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
    }
    public void saveJobSkillsToDb(String aiResponseJson, int userId) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        ExtractJDSkillDTO response = mapper.readValue(aiResponseJson, ExtractJDSkillDTO.class);
        Cv cv = cvRepository.findByUserId(userId);
        Job job = new Job();
        job.setTitle(response.getTitle());
        job.setCompany(response.getCompany());
        job.setDescription(response.getDescription());
        job.setStatus("ACTIVE");
        job.setCvId(cv.getId());
        jobRepository.save(job);
        List<String> skills = response.getSkills();
        for (String skill : skills) {
            JobDesSkills jobDesSkills = new JobDesSkills();
            jobDesSkills.setSkill(skill);
            jobDesSkills.setJobId(job.getJobId());
            jobDesSkillsRepository.save(jobDesSkills);
            embedService.getJobDesSkillEmbedding(skill);
        }
    }
    public List<JobDesSkills> getJobSkill(int jobId) {
        return jobDesSkillsRepository.findByJobId(jobId);
    }

    public List<Job> getJobList(int option) throws IOException {
        String email = SecurityContextHolder.getContext().getAuthentication().getName(); // lấy từ JWT
        Integer userId = userRepository.findByEmail(email).map(User::getUserId).orElseThrow(() -> new RuntimeException("User not found"));
        Cv cv = cvRepository.findByUserId(userId);
        if (cv == null) {
            throw new IllegalStateException("Chưa upload cv");
        }
        if (option == 1) {
            List<JobDesFile> jobDesFiles = jobDesFileRepository.findByUserId(userId);
            for (JobDesFile jobDesFile : jobDesFiles) {
                Path path = Paths.get(jobDesFile.getFilePath());
                String fileName = jobDesFile.getFileName();
                extractJd(path.toAbsolutePath().toString(), userId, fileName);
            }
        }
        return jobRepository.getJobsByCvId(cv.getId());
    }
}
