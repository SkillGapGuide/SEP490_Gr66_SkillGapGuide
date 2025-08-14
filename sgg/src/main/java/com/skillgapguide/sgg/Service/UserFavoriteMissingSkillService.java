package com.skillgapguide.sgg.Service;

import com.skillgapguide.sgg.Dto.UserFavoriteMissingSkillResponse;
import com.skillgapguide.sgg.Entity.Cv;
import com.skillgapguide.sgg.Entity.JobDesSkills;
import com.skillgapguide.sgg.Entity.UserCvSkills;
import com.skillgapguide.sgg.Entity.UserFavoriteMissingSkill;
import com.skillgapguide.sgg.Repository.CVRepository;
import com.skillgapguide.sgg.Repository.JobDesSkillsRepository;
import com.skillgapguide.sgg.Repository.UserCvSkillsRepository;
import com.skillgapguide.sgg.Repository.UserFavoriteMissingSkillRepository;
import com.skillgapguide.sgg.Response.EHttpStatus;
import com.skillgapguide.sgg.Response.Response;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserFavoriteMissingSkillService {
    private final UserFavoriteMissingSkillRepository userFavoriteMissingSkillRepository;
    private final JobDesSkillsRepository skillRepository;
    public Page<UserFavoriteMissingSkillResponse> getFavoriteMissingSkillsByUserId(Integer userId, int pageNo, int pageSize) {
        Pageable pageable = Pageable.ofSize(pageSize).withPage(pageNo - 1);
        return userFavoriteMissingSkillRepository.findUserFavoriteMissingSkillsByUserId(userId, pageable);
    }

    public String addMissingSkillToFavorites(Integer userId, Integer skillId) {
        try {
            JobDesSkills jobDesSkills = skillRepository.findById(skillId)
                    .orElseThrow(() -> new IllegalArgumentException("Skill không tồn tại"));
            Optional<UserFavoriteMissingSkill> existingFavorite =
                    userFavoriteMissingSkillRepository.findByUserIdAndSkillId(userId, jobDesSkills.getSkill());
            if (existingFavorite.isPresent()) {
                throw new IllegalStateException("Skill đã có trong danh sách yêu thích");
            }
            UserFavoriteMissingSkill favorite = new UserFavoriteMissingSkill();
            favorite.setUserId(userId);
            favorite.setSkillId(jobDesSkills.getSkill());
            favorite.setStatus("ACTIVE");
            favorite.setCreatedAt(new Timestamp(System.currentTimeMillis()));
            userFavoriteMissingSkillRepository.save(favorite);
            return  "Thêm kỹ năng thành công";
        } catch (IllegalArgumentException | IllegalStateException e) {
            return e.getMessage();
        } catch (Exception e) {
            return "Lỗi hệ thống";
        }
    }

    public void removeFavoriteMissingSkill(Integer userId, Integer skillId) {
        Optional<UserFavoriteMissingSkill> existingFavorite =
                userFavoriteMissingSkillRepository.findByUserIdAndId(userId, skillId);
        if (existingFavorite.isEmpty()) {
            throw new IllegalStateException("Skill yêu thích không tồn tại");
        }
        userFavoriteMissingSkillRepository.delete(existingFavorite.get());
    }

    public void removeAllFavoriteMissingSkills(Integer userId) {
//        Page<UserFavoriteMissingSkill> favorites = userFavoriteMissingSkillRepository.findUserFavoriteMissingSkillsByUserId(userId, Pageable.unpaged());
//        userFavoriteMissingSkillRepository.deleteAll(favorites.getContent());
    }
}
