package com.skillgapguide.sgg.Controller;

import com.skillgapguide.sgg.Dto.FavoriteJobDTO;
import com.skillgapguide.sgg.Response.EHttpStatus;
import com.skillgapguide.sgg.Response.Response;
import com.skillgapguide.sgg.Service.FavoriteJobService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/favorite-job")
@SecurityRequirement(name = "Bearer Authentication")
@RequiredArgsConstructor
public class UserFavoriteJob {
    private final FavoriteJobService favoriteJobService;

    @PostMapping("/add/{jobId}")
    public ResponseEntity<Response<FavoriteJobDTO>> addFavoriteJob(@PathVariable Integer jobId) {
        try {
            FavoriteJobDTO dto = favoriteJobService.addFavoriteJob(jobId);
            return ResponseEntity.ok(new Response<>(EHttpStatus.OK, "Đã thêm vào danh sách yêu thích", dto));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(new Response<>(EHttpStatus.BAD_REQUEST, e.getMessage(), null));
        }
    }
}
