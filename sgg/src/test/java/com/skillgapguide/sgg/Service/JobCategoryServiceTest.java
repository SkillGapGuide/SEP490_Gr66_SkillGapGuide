package com.skillgapguide.sgg.Service;

import com.skillgapguide.sgg.Dto.JobCategoryDTO;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class JobCategoryServiceTest {

    @InjectMocks
    private JobCategoryService jobCategoryService;

    @Test
    void getAllJobCategoriesReturnsNull() {
        assertNull(jobCategoryService.getAllJobCategories());
    }

    @Test
    void addJobCategoryReturnsTrue() {
        JobCategoryDTO dto = new JobCategoryDTO();
        assertTrue(jobCategoryService.addJobCategory(dto));
    }

    @Test
    void editJobCategoryDoesNotThrowException() {
        JobCategoryDTO dto = new JobCategoryDTO();
        assertDoesNotThrow(() -> jobCategoryService.editJobCategory(dto));
    }
}