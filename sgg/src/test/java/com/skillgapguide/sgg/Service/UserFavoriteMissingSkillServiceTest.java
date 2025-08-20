package com.skillgapguide.sgg.Service;

import com.skillgapguide.sgg.Dto.UserFavoriteMissingSkillResponse;
import com.skillgapguide.sgg.Entity.JobDesSkills;
import com.skillgapguide.sgg.Entity.UserFavoriteMissingSkill;
import com.skillgapguide.sgg.Repository.JobDesSkillsRepository;
import com.skillgapguide.sgg.Repository.UserFavoriteMissingSkillRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.Arrays;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
        import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserFavoriteMissingSkillServiceTest {

    @Mock
    private UserFavoriteMissingSkillRepository userFavoriteMissingSkillRepository;

    @Mock
    private JobDesSkillsRepository jobDesSkillsRepository;

    @InjectMocks
    private UserFavoriteMissingSkillService userFavoriteMissingSkillService;

    @Test
    void getFavoriteMissingSkillsByUserIdReturnsPage() {
        int userId = 1;
        int pageNo = 1;
        int pageSize = 10;
        Pageable pageable = Pageable.ofSize(pageSize).withPage(pageNo - 1);
        Page<UserFavoriteMissingSkillResponse> page = new PageImpl<>(Arrays.asList(new UserFavoriteMissingSkillResponse() {
            @Override
            public Integer getSkillId() {
                return 1;
            }

            @Override
            public String getSkillName() {
                return "";
            }

            @Override
            public String getStatus() {
                return "";
            }

            @Override
            public String getCreatedAt() {
                return "";
            }
        }));
        when(userFavoriteMissingSkillRepository.findUserFavoriteMissingSkillsByUserId(userId, pageable)).thenReturn(page);

        Page<UserFavoriteMissingSkillResponse> result = userFavoriteMissingSkillService.getFavoriteMissingSkillsByUserId(userId, pageNo, pageSize);

        assertEquals(1, result.getContent().size());
        verify(userFavoriteMissingSkillRepository).findUserFavoriteMissingSkillsByUserId(userId, pageable);
    }

    @Test
    void addMissingSkillToFavoritesSuccess() {
        int userId = 1;
        int skillId = 1;
        JobDesSkills skill = new JobDesSkills();
        skill.setSkill("Java");
        when(jobDesSkillsRepository.findById(skillId)).thenReturn(Optional.of(skill));
        when(userFavoriteMissingSkillRepository.findByUserIdAndSkillId(userId, "Java")).thenReturn(Optional.empty());
        when(userFavoriteMissingSkillRepository.save(any(UserFavoriteMissingSkill.class))).thenReturn(new UserFavoriteMissingSkill());

        String result = userFavoriteMissingSkillService.addMissingSkillToFavorites(userId, skillId);

        assertEquals("Thêm kỹ năng thành công", result);
        verify(userFavoriteMissingSkillRepository).save(any(UserFavoriteMissingSkill.class));
    }

    @Test
    void addMissingSkillToFavoritesThrowsExceptionWhenExists() {
        int userId = 1;
        int skillId = 1;
        JobDesSkills skill = new JobDesSkills();
        skill.setSkill("Java");
        when(jobDesSkillsRepository.findById(skillId)).thenReturn(Optional.of(skill));
        when(userFavoriteMissingSkillRepository.findByUserIdAndSkillId(userId, "Java")).thenReturn(Optional.of(new UserFavoriteMissingSkill()));

        assertThrows(IllegalStateException.class, () -> userFavoriteMissingSkillService.addMissingSkillToFavorites(userId, skillId));
    }

    @Test
    void removeFavoriteMissingSkillSuccess() {
        int userId = 1;
        int skillId = 1;
        UserFavoriteMissingSkill favorite = new UserFavoriteMissingSkill();
        when(userFavoriteMissingSkillRepository.findByUserIdAndId(userId, skillId)).thenReturn(Optional.of(favorite));

        assertDoesNotThrow(() -> userFavoriteMissingSkillService.removeFavoriteMissingSkill(userId, skillId));
        verify(userFavoriteMissingSkillRepository).delete(favorite);
    }

    @Test
    void removeFavoriteMissingSkillThrowsExceptionWhenNotExists() {
        int userId = 1;
        int skillId = 1;
        when(userFavoriteMissingSkillRepository.findByUserIdAndId(userId, skillId)).thenReturn(Optional.empty());

        assertThrows(IllegalStateException.class, () -> userFavoriteMissingSkillService.removeFavoriteMissingSkill(userId, skillId));
    }
}