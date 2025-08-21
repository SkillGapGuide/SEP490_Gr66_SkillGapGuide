package com.skillgapguide.sgg.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfReader;
import com.itextpdf.kernel.pdf.canvas.parser.PdfTextExtractor;
import com.skillgapguide.sgg.Dto.CommentResponse;
import com.skillgapguide.sgg.Dto.ExtractCvSkillDTO;
import com.skillgapguide.sgg.Dto.SkillMatchResultDTO;
import com.skillgapguide.sgg.Entity.Cv;
import com.skillgapguide.sgg.Entity.User;
import com.skillgapguide.sgg.Repository.CVRepository;
import com.skillgapguide.sgg.Repository.JobCvSkillScoreRepository;
import com.skillgapguide.sgg.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class SkillGapSevice {
    @Autowired
    private JobCvSkillScoreRepository jobCvSkillScoreRepository;
    @Autowired
    private UserRepository userRepository;
    public List<SkillMatchResultDTO> getMatchingResults(int jobId, int cvId) {
        return jobCvSkillScoreRepository.findByCvSkillAndJobSkill(cvId, jobId);
    }
    public CommentResponse getComment(int jobId, int cvId) throws JsonProcessingException {
        List<SkillMatchResultDTO> data = getMatchingResults(jobId,cvId);
        String prompt = "Hãy đưa ra nhận xét chung tổng quát về ứng viên và yêu cầu tuyển dụng với mức phù hợp là 0.7. Nhận xét với riêng từng kỹ năng về kỹ năng của cv với lời khuyên để cải thiện và chỉ nhận xét với những kỹ năng dưới 0.7 " +
                ". Yêu cầu trả lời bằng tiếng việt" +
                ". Chỉ trả về kết quả dưới dạng JSON theo mẫu sau, không thêm bất kỳ nội dung nào khác, không nhắc đến score cụ thể trong nhận xét:\n" +
                "{\n" +
                "\"generalComment\":\"\",\n" +
                "\"skillComment\":[\n" +
                "\"skill\":\"\",\n" +
                "\"comment\":\"\"\n" +
                "]\n" +
                "}\n" +
                "Dữ liệu để nhận xét :\n" + data.toString() ;
        OllamaService service = new OllamaService(WebClient.builder());
        String resultAI = service.callMistralApi(prompt).block();
        ObjectMapper mapper = new ObjectMapper();
        CommentResponse result = mapper.readValue(resultAI, CommentResponse.class);
        return result;
    }

}
