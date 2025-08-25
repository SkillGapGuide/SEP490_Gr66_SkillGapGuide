package com.skillgapguide.sgg.Service;

import com.skillgapguide.sgg.Dto.AddSpecializationRequestDTO;
import com.skillgapguide.sgg.Dto.SpecializationDTO;
import com.skillgapguide.sgg.Entity.JobGroup;
import com.skillgapguide.sgg.Entity.Specialization;
import com.skillgapguide.sgg.Repository.JobGroupRepository;
import com.skillgapguide.sgg.Repository.SpecializationRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
        import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SpecializationsServiceTest {

    @Mock
    private SpecializationRepository specializationRepository;

    @Mock
    private JobGroupRepository jobGroupRepository;

    @InjectMocks
    private SpecializationsService specializationsService;

    @Test
    void getAllReturnsList() {
        JobGroup occupation = new JobGroup();
        occupation.setId(1);
        occupation.setName("Developer");
        Specialization specialization = new Specialization();
        specialization.setId(1);
        specialization.setName("Java");
        specialization.setStatus("Enable");
        specialization.setOccupation(occupation);
        when(specializationRepository.findAll()).thenReturn(Arrays.asList(specialization));

        List<SpecializationDTO> result = specializationsService.getAll();

        assertEquals(1, result.size());
        assertEquals("Java", result.get(0).getName());
        verify(specializationRepository).findAll();
    }

    @Test
    void addSuccess() {
        AddSpecializationRequestDTO dto = new AddSpecializationRequestDTO();
        dto.setName("Java");
        dto.setStatus("Enable");
        dto.setOccupationId(1);
        dto.setUrl("url");
        JobGroup occupation = new JobGroup();
        occupation.setId(1);
        when(jobGroupRepository.findById(1)).thenReturn(Optional.of(occupation));
        when(specializationRepository.findByNameIgnoreCase("Java")).thenReturn(Optional.empty());
        when(specializationRepository.findByUrlIgnoreCase("url")).thenReturn(Optional.empty());
        when(specializationRepository.save(any(Specialization.class))).thenReturn(new Specialization());

        SpecializationDTO result = specializationsService.add(dto);

        assertNotNull(result);
        verify(specializationRepository).save(any(Specialization.class));
    }

    @Test
    void toggleStatusTogglesSuccessfully() {
        Specialization specialization = new Specialization();
        specialization.setId(1);
        specialization.setStatus("Enable");
        when(specializationRepository.findById(1)).thenReturn(Optional.of(specialization));
        when(specializationRepository.save(any(Specialization.class))).thenReturn(specialization);

        boolean result = specializationsService.toggleStatus(1);

        assertTrue(result);
        assertEquals("Disable", specialization.getStatus());
        verify(specializationRepository).save(specialization);
    }

    @Test
    void searchByNameReturnsList() {
        String name = "Java";
        JobGroup occupation = new JobGroup();
        occupation.setId(1);
        occupation.setName("Developer");
        Specialization specialization = new Specialization();
        specialization.setId(1);
        specialization.setName("Java");
        specialization.setOccupation(occupation);
        when(specializationRepository.findByNameContainingIgnoreCase(name)).thenReturn(Arrays.asList(specialization));

        List<SpecializationDTO> result = specializationsService.searchByName(name);

        assertEquals(1, result.size());
        assertEquals("Java", result.get(0).getName());
        verify(specializationRepository).findByNameContainingIgnoreCase(name);
    }
}