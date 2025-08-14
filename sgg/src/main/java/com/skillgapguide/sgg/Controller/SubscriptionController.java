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

import java.math.BigInteger;
import java.util.List;
import java.util.Map;
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
    @GetMapping("/count-total-user-subscription-history")
    public Response<Integer> countTotalUserSubscriptionHistory() {
        Integer totalCount = subscriptionService.countTotalUserSubscriptionHistory();
        return new Response<>(EHttpStatus.OK, "Tổng số lịch sử đăng ký người dùng", totalCount);
    }
    @GetMapping("/count-total-user-subscription-history-price")
    public Response<BigInteger> countTotalUserSubscriptionHistoryPrice() {
        BigInteger totalPrice = subscriptionService.countTotalUserSubscriptionHistoryPrice();
        return new Response<>(EHttpStatus.OK, "Tổng giá trị lịch sử đăng ký người dùng", totalPrice);
    }
    @GetMapping("/count-free-user-subscription-history")
    public Response<Integer> countFreeUserSubscriptionHistory() {
        Integer freeUserCount = subscriptionService.countFreeUserSubscriptionHistory();
        return new Response<>(EHttpStatus.OK, "Tổng số người dùng sử dụng gói miễn phí", freeUserCount);
    }
    @GetMapping("/count-pro-user-subscription-history")
    public Response<Integer> countProUserSubscriptionHistory() {
        Integer proUserCount = subscriptionService.countProUserSubscriptionHistory();
        return new Response<>(EHttpStatus.OK, "Tổng số người dùng sử dụng gói Pro", proUserCount);
    }
    @GetMapping("/count-premium-user-subscription-history")
    public Response<Integer> countPremiumUserSubscriptionHistory() {
        Integer premiumUserCount = subscriptionService.countPremiumUserSubscriptionHistory();
        return new Response<>(EHttpStatus.OK, "Tổng số người dùng sử dụng gói Premium", premiumUserCount);
    }
    @GetMapping("/count-user-subscription-history")
    public Response<Map<String, Integer>> countAllUserSubscriptionHistory() {
        Map<String, Integer> result = subscriptionService.countAllUserSubscriptionHistory();
        return new Response<>(
                EHttpStatus.OK,
                "Tổng số người dùng sử dụng gói Free, Pro, Premium",
                result
        );
    }
    @GetMapping("/stats-user-subscription-last7days")
    public Response<Map<String, Object>> getStatsUserSubscriptionLast7Days() {
        Map<String, Object> result = subscriptionService.countTotalUsersAndAmountLast7Days();
        return new Response<>(
                EHttpStatus.OK,
                "Tổng số người mua và tổng số tiền trong 7 ngày gần nhất",
                result
        );
    }
    @GetMapping("/stats-user-subscription-daily-last7days")
    public Response<List<Map<String, Object>>> getDailyStatsUserSubscriptionLast7Days() {
        List<Map<String, Object>> result = subscriptionService.countDailyUsersAndAmountLast7DaysWithZero();
        return new Response<>(
                EHttpStatus.OK,
                "Số người mua và tổng tiền theo từng ngày trong 7 ngày gần nhất",
                result
        );
    }
    @GetMapping("/stats-user-subscription-daily-last30days")
    public Response<List<Map<String, Object>>> getDailyStatsUserSubscriptionLast30Days() {
        List<Map<String, Object>> result = subscriptionService.countDailyUsersAndAmountLast30DaysWithZero();
        return new Response<>(
                EHttpStatus.OK,
                "Số người mua và tổng tiền theo từng ngày trong 30 ngày gần nhất",
                result
        );
    }

}
