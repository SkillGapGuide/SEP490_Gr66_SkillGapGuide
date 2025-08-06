package com.skillgapguide.sgg.Service;

import com.skillgapguide.sgg.Dto.UserFavoriteMissingSkillResponse;
import com.skillgapguide.sgg.Entity.Cv;
import com.skillgapguide.sgg.Entity.Skill;
import com.skillgapguide.sgg.Entity.UserCvSkills;
import com.skillgapguide.sgg.Entity.UserFavoriteMissingSkill;
import com.skillgapguide.sgg.Repository.CVRepository;
import com.skillgapguide.sgg.Repository.SkillRepository;
import com.skillgapguide.sgg.Repository.UserCvSkillsRepository;
import com.skillgapguide.sgg.Repository.UserFavoriteMissingSkillRepository;
import jakarta.persistence.criteria.CriteriaBuilder;
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
    private final UserCvSkillsRepository skillRepository;
    private final CVRepository cvRepository;
    private static final Logger logger = LoggerFactory.getLogger(UserFavoriteMissingSkillService.class);

    public Page<UserFavoriteMissingSkillResponse> getFavoriteMissingSkillsByUserId(Integer userId, int pageNo, int pageSize) {
        Pageable pageable = Pageable.ofSize(pageSize).withPage(pageNo - 1);
        return userFavoriteMissingSkillRepository.findUserFavoriteMissingSkillsByUserId(userId, pageable);
    }

    public UserFavoriteMissingSkill addMissingSkillToFavorites(Integer userId, Integer skillId) {
        Cv cv = cvRepository.findByUserId(userId);
        UserCvSkills skill = skillRepository.findById(skillId)
                .orElseThrow(() -> new IllegalArgumentException("Skill không tồn tại"));

        Optional<UserFavoriteMissingSkill> existingFavorite =
                userFavoriteMissingSkillRepository.findByUserIdAndSkillId(userId, skillId);
        if (existingFavorite.isPresent()) {
            throw new IllegalStateException("Skill đã có trong danh sách yêu thích");
        }

        UserFavoriteMissingSkill favorite = new UserFavoriteMissingSkill();
        favorite.setUserId(userId);
        favorite.setSkillId(skillId);
        favorite.setStatus("ACTIVE");
        favorite.setCreatedAt(new Timestamp(System.currentTimeMillis()));

        return userFavoriteMissingSkillRepository.save(favorite);
    }

    public void removeFavoriteMissingSkill(Integer userId, Integer skillId) {
        Optional<UserFavoriteMissingSkill> existingFavorite =
                userFavoriteMissingSkillRepository.findByUserIdAndSkillId(userId, skillId);
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
