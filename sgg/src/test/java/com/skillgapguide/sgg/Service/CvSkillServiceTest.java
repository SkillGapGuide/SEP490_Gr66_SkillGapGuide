package com.skillgapguide.sgg.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.skillgapguide.sgg.Dto.ExtractCvSkillDTO;
import com.skillgapguide.sgg.Entity.UserCvSkills;
import com.skillgapguide.sgg.Repository.UserCvSkillsRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CvSkillServiceTest {

    @Mock
    private UserCvSkillsRepository userCvSkillsRepository;

    @Mock
    private EmbedService embedService;

    @InjectMocks
    private CvSkillService cvSkillService;

    @Test
    void saveCvSkillsToDbSavesSkillsSuccessfully() throws Exception {
        int cvId = 1;
        String json = "{\"skills\": [\"Java\", \"Python\"]}";
        ExtractCvSkillDTO dto = new ExtractCvSkillDTO();
        dto.setSkills(Arrays.asList("Java", "Python"));
        ObjectMapper mapper = new ObjectMapper();
        when(userCvSkillsRepository.save(any(UserCvSkills.class))).thenReturn(new UserCvSkills());
        when(embedService.getCvSkillEmbedding(anyString())).thenReturn(new double[]{1.0, 0.0});

        cvSkillService.saveCvSkillsToDb(json, cvId);

        verify(userCvSkillsRepository).deleteAllByCvId(cvId);
        verify(userCvSkillsRepository, times(2)).save(any(UserCvSkills.class));
        verify(embedService, times(2)).getCvSkillEmbedding(anyString());
    }

    @Test
    void saveCvSkillsToDbHandlesEmptySkills() throws Exception {
        int cvId = 1;
        String json = "{\"skills\": []}";
        ExtractCvSkillDTO dto = new ExtractCvSkillDTO();
        dto.setSkills(Arrays.asList());

        cvSkillService.saveCvSkillsToDb(json, cvId);

        verify(userCvSkillsRepository).deleteAllByCvId(cvId);
        verify(userCvSkillsRepository, never()).save(any(UserCvSkills.class));
        verify(embedService, never()).getCvSkillEmbedding(anyString());
    }

    @Test
    void saveCvSkillsToDbThrowsExceptionOnInvalidJson() {
        int cvId = 1;
        String invalidJson = "invalid json";

        assertThrows(Exception.class, () -> cvSkillService.saveCvSkillsToDb(invalidJson, cvId));
    }
}