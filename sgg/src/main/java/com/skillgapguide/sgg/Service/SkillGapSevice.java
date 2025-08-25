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
        System.out.println(data);
        String prompt = """
Hãy đưa ra nhận xét chung tổng quát về ứng viên và yêu cầu tuyển dụng.
Viết nhận xét tổng quát ở phần "generalComment".
Trong nhận xét, đưa ra lời khuyên cải thiện, nhưng KHÔNG nhắc đến điểm số cụ thể.
Trả lời hoàn toàn bằng tiếng Việt.
Chỉ trả về kết quả dưới dạng JSON theo đúng mẫu sau, không thêm bất kỳ nội dung nào khác:
{
  "generalComment": "..."
  ]
}
Dữ liệu để nhận xét:
""" + data.toString();
        OllamaService service = new OllamaService(WebClient.builder());
        String resultAI = service.callMistralApiWithTemperature(prompt,0.7).block();
        ObjectMapper mapper = new ObjectMapper();
        CommentResponse result = mapper.readValue(resultAI, CommentResponse.class);
        return result;
    }

}
