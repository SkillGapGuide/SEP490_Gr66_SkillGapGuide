package com.skillgapguide.sgg.Service;

import com.skillgapguide.sgg.Dto.AddJobGroupRequestDTO;
import com.skillgapguide.sgg.Dto.JobGroupDTO;
import com.skillgapguide.sgg.Entity.JobGroup;
import com.skillgapguide.sgg.Entity.MainJobCategory;
import com.skillgapguide.sgg.Repository.JobGroupRepository;
import com.skillgapguide.sgg.Repository.MainJobCategoryRepository;
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
class JobGroupServiceTest {

    @Mock
    private JobGroupRepository jobGroupRepository;

    @Mock
    private MainJobCategoryRepository mainJobCategoryRepository;

    @InjectMocks
    private JobGroupService jobGroupService;

    @Test
    void getAllJobGroupReturnsList() {
        MainJobCategory group = new MainJobCategory();
        group.setId(1);
        group.setName("IT");
        JobGroup jobGroup = new JobGroup();
        jobGroup.setId(1);
        jobGroup.setName("Developer");
        jobGroup.setStatus("Enable");
        jobGroup.setOccupationGroup(group);
        when(jobGroupRepository.findAll()).thenReturn(Arrays.asList(jobGroup));

        List<JobGroupDTO> result = jobGroupService.getAllJobGroup();

        assertEquals(1, result.size());
        assertEquals("Developer", result.get(0).getName());
        assertEquals("IT", result.get(0).getGroupName());
        verify(jobGroupRepository).findAll();
    }

    @Test
    void getEnabledOccupationsReturnsEnabledOnly() {
        MainJobCategory group = new MainJobCategory();
        group.setId(1);
        group.setName("IT");
        JobGroup jobGroup = new JobGroup();
        jobGroup.setId(1);
        jobGroup.setName("Developer");
        jobGroup.setStatus("Enable");
        jobGroup.setOccupationGroup(group);
        when(jobGroupRepository.findByStatusIgnoreCase("Enable")).thenReturn(Arrays.asList(jobGroup));

        List<JobGroupDTO> result = jobGroupService.getEnabledOccupations();

        assertEquals(1, result.size());
        assertEquals("Enable", result.get(0).getStatus());
        verify(jobGroupRepository).findByStatusIgnoreCase("Enable");
    }

    @Test
    void addJobGroupSuccess() {
        AddJobGroupRequestDTO dto = new AddJobGroupRequestDTO();
        dto.setName("Developer");
        dto.setStatus("Enable");
        dto.setOccupationGroupId(1);
        MainJobCategory group = new MainJobCategory();
        group.setId(1);
        when(mainJobCategoryRepository.findById(1)).thenReturn(Optional.of(group));
        when(jobGroupRepository.findByNameIgnoreCase("Developer")).thenReturn(Optional.empty());
        when(jobGroupRepository.save(any(JobGroup.class))).thenReturn(new JobGroup());

        JobGroup result = jobGroupService.addJobGroup(dto);

        assertNotNull(result);
        verify(jobGroupRepository).save(any(JobGroup.class));
    }

    @Test
    void addJobGroupThrowsExceptionForDuplicateName() {
        AddJobGroupRequestDTO dto = new AddJobGroupRequestDTO();
        dto.setName("Developer");
        dto.setStatus("Enable");
        dto.setOccupationGroupId(1);
        when(jobGroupRepository.findByNameIgnoreCase("Developer")).thenReturn(Optional.of(new JobGroup()));

        assertThrows(IllegalArgumentException.class, () -> jobGroupService.addJobGroup(dto));
    }

    @Test
    void updateJobGroupSuccess() {
        AddJobGroupRequestDTO dto = new AddJobGroupRequestDTO();
        dto.setName("Developer");
        dto.setStatus("Enable");
        dto.setOccupationGroupId(1);
        JobGroup existing = new JobGroup();
        existing.setId(1);
        MainJobCategory group = new MainJobCategory();
        group.setId(1);
        when(jobGroupRepository.findById(1)).thenReturn(Optional.of(existing));
        when(mainJobCategoryRepository.findById(1)).thenReturn(Optional.of(group));
        when(jobGroupRepository.findByNameIgnoreCase("Developer")).thenReturn(Optional.empty());
        when(jobGroupRepository.save(any(JobGroup.class))).thenReturn(existing);

        jobGroupService.updateJobGroup(1, dto);

        verify(jobGroupRepository).save(any(JobGroup.class));
    }

    @Test
    void updateJobGroupThrowsExceptionForInvalidStatus() {
        AddJobGroupRequestDTO dto = new AddJobGroupRequestDTO();
        dto.setName("Developer");
        dto.setStatus("Invalid");
        dto.setOccupationGroupId(1);
        lenient().when(jobGroupRepository.findById(1)).thenReturn(Optional.of(new JobGroup()));

        assertThrows(IllegalArgumentException.class, () -> jobGroupService.updateJobGroup(1, dto));
    }

    @Test
    void toggleOccupationStatusTogglesSuccessfully() {
        JobGroup jobGroup = new JobGroup();
        jobGroup.setId(1);
        jobGroup.setStatus("Enable");
        when(jobGroupRepository.findById(1)).thenReturn(Optional.of(jobGroup));
        when(jobGroupRepository.save(any(JobGroup.class))).thenReturn(jobGroup);

        boolean result = jobGroupService.toggleOccupationStatus(1);

        assertTrue(result);
        assertEquals("Disable", jobGroup.getStatus());
        verify(jobGroupRepository).save(jobGroup);
    }

    @Test
    void toggleOccupationStatusReturnsFalseForNonExistentId() {
        when(jobGroupRepository.findById(1)).thenReturn(Optional.empty());

        boolean result = jobGroupService.toggleOccupationStatus(1);

        assertFalse(result);
    }

    @Test
    void getByGroupIdReturnsList() {
        MainJobCategory group = new MainJobCategory();
        group.setId(1);
        group.setName("IT");
        JobGroup jobGroup = new JobGroup();
        jobGroup.setId(1);
        jobGroup.setName("Developer");
        jobGroup.setOccupationGroup(group);
        when(jobGroupRepository.findByOccupationGroupId(1)).thenReturn(Arrays.asList(jobGroup));

        List<JobGroupDTO> result = jobGroupService.getByGroupId(1);

        assertEquals(1, result.size());
        assertEquals("Developer", result.get(0).getName());
        verify(jobGroupRepository).findByOccupationGroupId(1);
    }
}