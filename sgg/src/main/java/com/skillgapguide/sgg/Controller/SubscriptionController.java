package com.skillgapguide.sgg.Controller;

import com.skillgapguide.sgg.Dto.SubscriptionDTO;
import com.skillgapguide.sgg.Entity.UserSubscriptionHistory;
import com.skillgapguide.sgg.Response.EHttpStatus;
import com.skillgapguide.sgg.Response.Response;
import com.skillgapguide.sgg.Service.SubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/subscription")
@RequiredArgsConstructor
public class SubscriptionController {
    private final SubscriptionService subscriptionService;
    @GetMapping("/getSubscriptionByUserId/{userId}")
    public Response<Optional<SubscriptionDTO>> getSubscriptionByUserId(@PathVariable Integer userId) {
        if (userId == null || userId <= 0) {
            return new Response<>(EHttpStatus.BAD_REQUEST, "Không tìm thấy User", null);
        }
        return new Response<>(EHttpStatus.OK,"Lấy thông tin đăng ký thành công", subscriptionService.findSubscriptionByUserId(userId));
    }
    @GetMapping("/getAllSubscriptionHistory")
    public Response<Page<UserSubscriptionHistory>> getAllSubscriptionHistory(@RequestParam(defaultValue = "1") int page,
                                                                             @RequestParam(defaultValue = "10") int size) {
        return new Response<>(EHttpStatus.OK, "Lấy tất cả thông tin đăng ký thành công", subscriptionService.findAllHistory(page, size));
    }
}
