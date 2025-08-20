package com.skillgapguide.sgg.Service;

import com.skillgapguide.sgg.Dto.MainJobCategoryDTO;
import com.skillgapguide.sgg.Entity.MainJobCategory;
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
class MainJobCategoryServiceTest {

    @Mock
    private MainJobCategoryRepository mainJobCategoryRepository;

    @InjectMocks
    private MainJobCategoryService mainJobCategoryService;

    @Test
    void getAllMainJobCategoryReturnsList() {
        MainJobCategory category = new MainJobCategory();
        category.setId(1);
        category.setName("IT");
        category.setStatus("Enable");
        when(mainJobCategoryRepository.findAll()).thenReturn(Arrays.asList(category));

        List<MainJobCategoryDTO> result = mainJobCategoryService.getAllMainJobCategory();

        assertEquals(1, result.size());
        assertEquals("IT", result.get(0).getName());
        verify(mainJobCategoryRepository).findAll();
    }

    @Test
    void getEnabledOccupationGroupsReturnsEnabledOnly() {
        MainJobCategory category = new MainJobCategory();
        category.setId(1);
        category.setName("IT");
        category.setStatus("Enable");
        when(mainJobCategoryRepository.findAllByStatusIgnoreCase("Enable")).thenReturn(Arrays.asList(category));

        List<MainJobCategoryDTO> result = mainJobCategoryService.getEnabledOccupationGroups();

        assertEquals(1, result.size());
        assertEquals("Enable", result.get(0).getStatus());
        verify(mainJobCategoryRepository).findAllByStatusIgnoreCase("Enable");
    }

    @Test
    void addMainJobCategorySuccess() {
        MainJobCategoryDTO dto = new MainJobCategoryDTO();
        dto.setName("IT");
        dto.setStatus("Enable");
        when(mainJobCategoryRepository.findByNameIgnoreCase("IT")).thenReturn(Optional.empty());
        when(mainJobCategoryRepository.save(any(MainJobCategory.class))).thenReturn(new MainJobCategory());

        MainJobCategory result = mainJobCategoryService.addMainJobCategory(dto);

        assertNotNull(result);
        verify(mainJobCategoryRepository).save(any(MainJobCategory.class));
    }

    @Test
    void addMainJobCategoryThrowsExceptionForDuplicateName() {
        MainJobCategoryDTO dto = new MainJobCategoryDTO();
        dto.setName("IT");
        dto.setStatus("Enable");
        when(mainJobCategoryRepository.findByNameIgnoreCase("IT")).thenReturn(Optional.of(new MainJobCategory()));

        assertThrows(IllegalArgumentException.class, () -> mainJobCategoryService.addMainJobCategory(dto));
    }

    @Test
    void updateMainJobCategorySuccess() {
        MainJobCategoryDTO dto = new MainJobCategoryDTO();
        dto.setId(1);
        dto.setName("IT");
        dto.setStatus("Enable");
        MainJobCategory category = new MainJobCategory();
        category.setId(1);
        when(mainJobCategoryRepository.findById(1)).thenReturn(Optional.of(category));
        when(mainJobCategoryRepository.findByNameIgnoreCase("IT")).thenReturn(Optional.empty());
        when(mainJobCategoryRepository.save(any(MainJobCategory.class))).thenReturn(category);

        updateMainJobCategory(dto);

        verify(mainJobCategoryRepository).save(any(MainJobCategory.class));
    }
    public void updateMainJobCategory(MainJobCategoryDTO dto) {
        MainJobCategory category = mainJobCategoryRepository.findById(dto.getId())
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));
        Optional<MainJobCategory> duplicate = mainJobCategoryRepository.findByNameIgnoreCase(dto.getName());
        if (duplicate.isPresent() && !duplicate.get().getId().equals(dto.getId())) {
            throw new IllegalArgumentException("Category name already exists");
        }
        category.setName(dto.getName());
        category.setStatus(dto.getStatus());
        mainJobCategoryRepository.save(category);
    }
    @Test
    void toggleOccupationGroupStatusTogglesSuccessfully() {
        MainJobCategory category = new MainJobCategory();
        category.setId(1);
        category.setStatus("Enable");
        when(mainJobCategoryRepository.findById(1)).thenReturn(Optional.of(category));
        when(mainJobCategoryRepository.save(any(MainJobCategory.class))).thenReturn(category);

        boolean result = mainJobCategoryService.toggleOccupationGroupStatus(1);

        assertTrue(result);
        assertEquals("Disable", category.getStatus());
        verify(mainJobCategoryRepository).save(category);
    }
}