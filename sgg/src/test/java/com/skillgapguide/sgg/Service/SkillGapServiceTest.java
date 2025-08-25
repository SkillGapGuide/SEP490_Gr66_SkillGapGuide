package com.skillgapguide.sgg.Service;

import com.skillgapguide.sgg.Dto.SkillMatchResultDTO;
import com.skillgapguide.sgg.Dto.CommentResponse;
import com.skillgapguide.sgg.Repository.JobCvSkillScoreRepository;
import com.skillgapguide.sgg.Repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import reactor.core.publisher.Mono;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SkillGapServiceTest {

    @Mock
    private JobCvSkillScoreRepository jobCvSkillScoreRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private OllamaService ollamaService;

    @InjectMocks
    private SkillGapSevice skillGapService;

    @Test
    void getMatchingResultsReturnsList() {
        int jobId = 1;
        int cvId = 1;
        List<SkillMatchResultDTO> results = Arrays.asList(new SkillMatchResultDTO());
        when(jobCvSkillScoreRepository.findByCvSkillAndJobSkill(cvId, jobId)).thenReturn(results);

        List<SkillMatchResultDTO> result = skillGapService.getMatchingResults(jobId, cvId);

        assertEquals(1, result.size());
        verify(jobCvSkillScoreRepository).findByCvSkillAndJobSkill(cvId, jobId);
    }

    @Test
    void getCommentReturnsResponse() throws Exception {
        int jobId = 1;
        int cvId = 1;
        List<SkillMatchResultDTO> data = Arrays.asList(new SkillMatchResultDTO());
        String jsonResponse = "{\"generalComment\":\"Good\", \"skillComment\":[]}";
        CommentResponse expected = new CommentResponse();
        expected.setGeneralComment("Good");
        when(jobCvSkillScoreRepository.findByCvSkillAndJobSkill(cvId, jobId)).thenReturn(data);
        when(ollamaService.callMistralApi(anyString())).thenReturn(Mono.just(jsonResponse));

        CommentResponse result = skillGapService.getComment(jobId, cvId);

        assertNotNull(result);
        assertEquals("Good", result.getGeneralComment());
        verify(ollamaService).callMistralApi(anyString());
    }
}