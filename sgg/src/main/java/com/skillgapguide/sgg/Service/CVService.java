package com.skillgapguide.sgg.Service;

import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfReader;
import com.itextpdf.kernel.pdf.canvas.parser.PdfTextExtractor;
import com.skillgapguide.sgg.Entity.AuditLog;
import com.skillgapguide.sgg.Entity.Cv;
import com.skillgapguide.sgg.Entity.User;
import com.skillgapguide.sgg.Entity.UserCvSkills;
import com.skillgapguide.sgg.Repository.AuditLogRepository;
import com.skillgapguide.sgg.Repository.CVRepository;
import com.skillgapguide.sgg.Repository.UserCvSkillsRepository;
import com.skillgapguide.sgg.Repository.UserRepository;
import org.apache.poi.xwpf.extractor.XWPFWordExtractor;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.configurationprocessor.json.JSONArray;
import org.springframework.boot.configurationprocessor.json.JSONObject;
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
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class CVService {
    @Autowired
    private CVRepository cvRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserCvSkillsRepository userCvSkillsRepository;
    @Autowired
    private AuditLogRepository auditLogRepository;
    @Autowired
    private CvSkillService cvSkillService;
    private final String UPLOAD_DIR = "CvData/";

    public String uploadCv(String fileName,String fileExtension, MultipartFile file){
        try {
            String email = SecurityContextHolder.getContext().getAuthentication().getName(); // lấy từ JWT
            Integer userId = userRepository.findByEmail(email)
                    .map(User::getUserId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            String uniqueFileName = java.util.UUID.randomUUID() + "_" + fileName;
            Files.createDirectories(Paths.get(UPLOAD_DIR));
            Path path = Paths.get(UPLOAD_DIR + uniqueFileName);
            Files.write(path, file.getBytes());
            try{
                extractTextFromFile(path.toAbsolutePath().toString(),fileExtension);
            } catch (IOException e) {
                e.printStackTrace();
                return "Lỗi khi đọc file PDF ";
            }
            Cv cv = cvRepository.findByUserId(userId);
            if(cv != null){
                cv.setFileName(uniqueFileName);
                cv.setFilePath(path.toAbsolutePath().toString());
                cv.setFileType(fileExtension);
                cv.setUploadDate(LocalDateTime.now());
                cvRepository.save(cv);
            }
            else {
                Cv cvMetadata = new Cv();
                cvMetadata.setUserId(userId);
                cvMetadata.setFileName(uniqueFileName);
                cvMetadata.setFilePath(path.toAbsolutePath().toString());
                cvMetadata.setFileType(fileExtension);
                cvMetadata.setUploadDate(LocalDateTime.now());
                cvRepository.save(cvMetadata);
            }
            AuditLog auditLog = new AuditLog();
            auditLog.setUserId(userId);
            auditLog.setAction("Upload CV");
            auditLog.setDescription("User " + email + " uploaded CV: " + fileName);
            auditLog.setCreatedAt(Timestamp.valueOf(LocalDateTime.now()));
            auditLogRepository.save(auditLog);
            return "File CV đã được upload thành công: " + fileName;
        } catch (IOException e) {
            e.printStackTrace();
            return "Upload file CV thất bại";
        }
    }

    public void extractSkill() throws Exception {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Integer userId = userRepository.findByEmail(email)
                .map(User::getUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Cv cv = cvRepository.findByUserId(userId);

        String text = cleanCvText(extractTextFromFile(cv.getFilePath(), cv.getFileType()));
        List<String> chunks = splitByWords(text, 1000);

        for (String chunk : chunks) {
            String prompt = """
                    Bạn là một chuyên gia phân tích nhân sự. Hãy phân tích CV dưới đây và trích xuất tất cả các kỹ năng chính của ứng viên.
                    YÊU CẦU BẮT BUỘC:
                    Không được tạo thêm các trường khác ngoài "skills".
                    Không nhóm kỹ năng vào các mảng con.
                    Chỉ liệt kê kỹ năng trong mảng "skills".
                    Nếu không tìm thấy kỹ năng, trả về {"skills": []}.
                    Không giải thích, không mô tả ngoài JSON.
                    Json:
                    {
                      "skills": [
                        "kỹ năng 1",
                        "kỹ năng 2"
                      ]
                    }
                    CV:
                    """ + chunk;
            OllamaService service = new OllamaService(WebClient.builder());
            String content = service.callMistralApi(prompt).block(); // <- CHỜ kết quả trả về
            try {
                cvSkillService.saveCvSkillsToDb(content, cv.getId());
            } catch (Exception e) {
                System.err.println("Lỗi khi lưu kỹ năng vào DB: " + e.getMessage());
                e.printStackTrace();
            }
        }
    }

    private String cleanCvText(String rawText) {
        if (rawText == null) return "";

        // 1. Chuẩn hóa xuống dòng thành \n
        String text = rawText.replaceAll("\r\n", "\n").replaceAll("\r", "\n");

        // 2. Xóa ký tự bullet, gạch đầu dòng, ký tự trang trí
        text = text.replaceAll("(?m)^[\\s\\u2022\\u2023\\u25E6\\u2043\\u2219\\u25AA\\u25CF\\u25CB\\u25A0\\u25A1\\u25B6\\u25C6\\u25C7\\u25BA\\u25BB\\u25FE\\u25FD\\uF0B7\\u2024\\u2027\\u2219\\u25D8\\u2219\\u25C9\\u25C8\\u2219\\u25CE\\u25CD\\u25D0\\u2219\\u2219\\u25CF\\u25E6\\u2022\\u2219\\u2219\\-*]+", "");        text = text.replaceAll("^[\\s\\-\\*]+", ""); // gạch đầu dòng "-" hoặc "*"

        // 4. Xóa dòng trống hoặc dòng quá ngắn (header/footer, số trang)
        StringBuilder sb = new StringBuilder();
        for (String line : text.split("\n")) {
            line = line.trim();
            if (line.isEmpty()) continue;
            if (line.matches("^\\d+$")) continue; // chỉ là số trang
            if (line.length() < 2) continue; // dòng quá ngắn
            sb.append(line).append("\n");
        }

        // 5. Gộp các khoảng trắng thừa
        text = sb.toString().replaceAll("\\s{2,}", " ").trim();

        return text;
    }
    public List<String> splitByWords(String text, int maxTokens) {
        // Ước lượng: 1 token ~ 0.75 từ
        int maxWords = (int) (maxTokens / 0.75);
        String[] words = text.split("\\s+");
        List<String> chunks = new ArrayList<>();
        StringBuilder current = new StringBuilder();

        for (String word : words) {
            if (current.length() > 0) current.append(" ");
            current.append(word);

            if (current.toString().split("\\s+").length >= maxWords) {
                chunks.add(current.toString().trim());
                current.setLength(0);
            }
        }
        if (current.length() > 0) {
            chunks.add(current.toString().trim());
        }
        return chunks;
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
    public List<UserCvSkills> getCvSkill(){
        String email = SecurityContextHolder.getContext().getAuthentication().getName(); // lấy từ JWT
        Integer userId = userRepository.findByEmail(email)
                .map(User::getUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Cv cv = cvRepository.findByUserId(userId);
        return userCvSkillsRepository.findByCvId(cv.getId());
    }
}
