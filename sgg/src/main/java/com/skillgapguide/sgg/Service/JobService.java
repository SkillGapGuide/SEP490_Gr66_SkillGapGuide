package com.skillgapguide.sgg.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfReader;
import com.itextpdf.kernel.pdf.canvas.parser.PdfTextExtractor;
import com.skillgapguide.sgg.Dto.ExtractCvSkillDTO;
import com.skillgapguide.sgg.Dto.ExtractJDSkillDTO;
import com.skillgapguide.sgg.Entity.*;
import com.skillgapguide.sgg.Repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.client.WebClient;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class JobService {
    @Autowired
    private JobDesFileRepository jobDesFileRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private JobDesSkillsRepository jobDesSkillsRepository;
    private final String UPLOAD_DIR = "D:/JdData/";

    public String uploadJd(String fileName, String fileExtension, MultipartFile file) {
        try {
            String email = SecurityContextHolder.getContext().getAuthentication().getName(); // lấy từ JWT
            Integer userId = userRepository.findByEmail(email).map(User::getUserId).orElseThrow(() -> new RuntimeException("User not found"));
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
            // Chạy extract skill trong thread riêng
            new Thread(() -> {
                try {
                    extractSkill(path.toAbsolutePath().toString(), jobMetadata.getId()); // sai id
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }).start();
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

    public void extractSkill(String filePath, int jobId) throws IOException {
        String text = extractTextFromPdf(filePath);
        String prompt = "Hãy phân tích job description dưới đây và trích xuất tất cả các yêu cầu kỹ năng của ứng viên, title, description, company. Chỉ trả về kết quả dưới dạng JSON theo mẫu sau, không thêm bất kỳ nội dung nào khác:\n" +
                "{\n" +
                "\"skills\": [\n" +
                "],\n" +
                "\"title\": \"\",\n" +
                "\"description\": \"\",\n" +
                "\"company\": \"\""+
                "}\n" +
                "JD:\n" + text;

        LMStudioService service = new LMStudioService(WebClient.builder());
        service.callLMApi(prompt).subscribe(content -> {
            try {
                saveCvSkillsToDb(content);
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        });
    }

    public void saveCvSkillsToDb(String aiResponseJson) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        ExtractJDSkillDTO response = mapper.readValue(aiResponseJson, ExtractJDSkillDTO.class);

//        List<String> skills = response.getSkills();
//        for (String skill : skills) {
//            JobDesSkills jobDesSkills = new JobDesSkills();
//            jobDesSkills.setSkill(skill);
//            jobDesSkills.setJobId(jobId);
//            jobDesSkillsRepository.save(jobDesSkills);
//        }
    }
}
