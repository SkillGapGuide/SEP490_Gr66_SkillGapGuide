package com.skillgapguide.sgg.Controller;

import com.skillgapguide.sgg.Dto.SubscriptionDTO;
import com.skillgapguide.sgg.Dto.UserSubscriptionRequest;
import com.skillgapguide.sgg.Entity.Subscription;
import com.skillgapguide.sgg.Entity.UserSubscriptionHistory;
import com.skillgapguide.sgg.Exception.SubscriptionAlreadyExistsException;
import com.skillgapguide.sgg.Response.EHttpStatus;
import com.skillgapguide.sgg.Response.Response;
import com.skillgapguide.sgg.Service.SubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/subscription")
@RequiredArgsConstructor
public class SubscriptionController {
    private final SubscriptionService subscriptionService;
    @GetMapping("/get-subscription-by-user-id")
    public Response<UserSubscriptionRequest> getSubscriptionByUserId(@Param("userId") Integer userId) {
        Optional<UserSubscriptionRequest> subscription = subscriptionService.findSubscriptionByUserId(userId);
        return subscription.map(userSubscriptionRequest -> new Response<>(EHttpStatus.OK, "Lấy thông tin gói cước thành công", userSubscriptionRequest)).orElseGet(() -> new Response<>(EHttpStatus.BAD_REQUEST, "Không tìm thấy gói cước cho người dùng này", null));
    }
    @GetMapping("/get-all-subscriptions")
    public Response<List<Subscription>> getAllSubscriptions() {
        List<Subscription> subscriptions = subscriptionService.findAllSubscriptions();
        return new Response<>(EHttpStatus.OK, "Lấy danh sách gói cước thành công", subscriptions);
    }
    @GetMapping("/get-subscription-by-id")
    public Response<Subscription> getSubscriptionById(@Param("subscriptionId") Integer subscriptionId) {
        Subscription subscription = subscriptionService.findSubscriptionBySubscriptionId(subscriptionId);
        if (subscription != null) {
            return new Response<>(EHttpStatus.OK, "Lấy thông tin gói cước thành công", subscription);
        } else {
            return new Response<>(EHttpStatus.BAD_REQUEST, "Không tìm thấy gói cước với ID: " + subscriptionId, null);
        }
    }
    @PostMapping("/edit-subscription")
    public Response<Subscription> editSubscription(@RequestBody Subscription subscription) {
        Subscription updatedSubscription = subscriptionService.editSubscription(subscription, subscription.getSubscriptionId());
        if (updatedSubscription != null) {
            return new Response<>(EHttpStatus.OK, "Cập nhật gói cước thành công", updatedSubscription);
        } else {
            return new Response<>(EHttpStatus.BAD_REQUEST, "Không tìm thấy gói cước với ID: " + subscription.getSubscriptionId(), null);
        }
    }
    @PostMapping("/create-subscription")
    public Response<Subscription> createSubscription(@RequestBody Subscription subscription) {
        try {
            Subscription createdSubscription = subscriptionService.createNewSubscription(subscription);
            return new Response<>(EHttpStatus.OK, "Tạo gói cước thành công", createdSubscription);
        } catch (SubscriptionAlreadyExistsException e) {
            return new Response<>(EHttpStatus.BAD_REQUEST, e.getMessage(), null);
        }
    }
}
