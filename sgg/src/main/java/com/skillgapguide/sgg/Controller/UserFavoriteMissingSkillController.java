package com.skillgapguide.sgg.Controller;

import com.skillgapguide.sgg.Response.EHttpStatus;
import com.skillgapguide.sgg.Response.Response;
import com.skillgapguide.sgg.Service.UserFavoriteMissingSkillService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user-favorite-missing-skills")
@RequiredArgsConstructor
public class UserFavoriteMissingSkillController {
    private final UserFavoriteMissingSkillService userFavoriteMissingSkillService;
    @GetMapping("/get-favorite-missing-skills/{userId}")
    public Response<?> getUserFavoriteMissingSkills(
            @PathVariable Integer userId,
            @RequestParam(defaultValue = "1") int pageNo,
            @RequestParam(defaultValue = "10") int pageSize
    ) {
        return new Response<>(EHttpStatus.OK, "Lấy danh sách kỹ năng thiếu yêu thích thành công",
                userFavoriteMissingSkillService.getFavoriteMissingSkillsByUserId(userId, pageNo, pageSize));
    }
    @PostMapping("/add-favorite-missing-skill/{userId}/{skillId}")
    public Response<?> addMissingSkillToFavorites(@PathVariable Integer userId, @PathVariable Integer skillId) {
        return new Response<>(EHttpStatus.OK, "Thêm kỹ năng thiếu vào danh sách yêu thích thành công",
                userFavoriteMissingSkillService.addMissingSkillToFavorites(userId, skillId));
    }
    @DeleteMapping("/remove-favorite-missing-skill/{userId}/{skillId}")
    public Response<?> removeFavoriteMissingSkill(@PathVariable Integer userId, @PathVariable Integer skillId) {
        userFavoriteMissingSkillService.removeFavoriteMissingSkill(userId, skillId);
        return new Response<>(EHttpStatus.OK, "Xóa kỹ năng thiếu khỏi danh sách yêu thích thành công", null);
    }
//    @DeleteMapping("/remove-all-favorite-missing-skills/{userId}")
//    public Response<?> removeAllFavoriteMissingSkills(@PathVariable Integer userId) {
//        userFavoriteMissingSkillService.removeAllFavoriteMissingSkills(userId);
//        return new Response<>(EHttpStatus.OK, "Xóa tất cả kỹ năng thiếu khỏi danh sách yêu thích thành công", null);
//    }
}
