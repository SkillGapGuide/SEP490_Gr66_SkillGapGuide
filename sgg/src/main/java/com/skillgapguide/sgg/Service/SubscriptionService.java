package com.skillgapguide.sgg.Service;

import com.skillgapguide.sgg.Dto.UserSubscriptionRequest;
import com.skillgapguide.sgg.Entity.Subscription;
import com.skillgapguide.sgg.Entity.User;
import com.skillgapguide.sgg.Entity.UserSubscriptionHistory;
import com.skillgapguide.sgg.Exception.SubscriptionAlreadyExistsException;
import com.skillgapguide.sgg.Repository.SubscriptionRepository;
import com.skillgapguide.sgg.Repository.UserRepository;
import com.skillgapguide.sgg.Repository.UserSubscriptionHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigInteger;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class SubscriptionService {
    private final UserSubscriptionHistoryRepository historyRepo;
    private final UserRepository userRepository;
    private final SubscriptionRepository subscriptionRepository;


//    @Scheduled(cron = "0 0 2 * * *", zone = "Asia/Ho_Chi_Minh") // chạy mỗi ngày lúc 2 giờ sáng
    @Transactional
//    @Scheduled(cron = "0 */1 * * * *", zone = "Asia/Ho_Chi_Minh")
    @Scheduled(cron = "0 0 * * * *", zone = "Asia/Ho_Chi_Minh")
    public void expireOldSubscriptions() {
        List<UserSubscriptionHistory> activeHistories = historyRepo.findByStatus("ACTIVE");
        LocalDateTime now = LocalDateTime.now();

        for (UserSubscriptionHistory history : activeHistories) {
            if (history.getEndDate() != null && now.isAfter(history.getEndDate())) {
                // Cập nhật trạng thái lịch sử
                history.setStatus("EXPIRED");
                history.setUpdatedAt(now);
                historyRepo.save(history);

                // Cập nhật User về gói mặc định
                User user = history.getUser();
                Subscription defaultSub = subscriptionRepository.findByType(1)
                        .orElseThrow(() -> new RuntimeException("Không tìm thấy gói mặc định có type = 1"));

                user.setRoleId(4); // ROLE_USER
                user.setSubscriptionId(defaultSub.getSubscriptionId());
                userRepository.save(user);
            }
        }
    }
    public Optional<UserSubscriptionRequest> findSubscriptionByUserId(Integer userId) {
        return historyRepo.findSubscriptionByUserId(userId);
    }
    public List<Subscription> findAllSubscriptions() {
        return subscriptionRepository.findAll();
    }
    public Subscription findSubscriptionBySubscriptionId(Integer subscriptionId) {
        return subscriptionRepository.findSubscriptionBySubscriptionId(subscriptionId);
    }
    public Subscription editSubscription(Subscription subscription, Integer subscriptionId) {
        Subscription newSubscription = subscriptionRepository.findSubscriptionBySubscriptionId(subscriptionId);
        if (newSubscription == null) {
            throw new RuntimeException("Không tìm thấy gói cước với ID: " + subscription.getSubscriptionId());
        }
        // Cập nhật các trường cần thiết
        newSubscription.setSubscriptionName(subscription.getSubscriptionName());
        newSubscription.setType(subscription.getType());
        newSubscription.setPrice(subscription.getPrice());
        newSubscription.setStatus(subscription.getStatus());
        subscriptionRepository.save(newSubscription);
        return newSubscription;
    }
    public Subscription createNewSubscription(Subscription subscription) {
        if (subscriptionRepository.existsSubscriptionBySubscriptionName(subscription.getSubscriptionName())) {
            throw new SubscriptionAlreadyExistsException("Gói cước với tên " + subscription.getSubscriptionName() + " đã tồn tại");
        }
        Subscription newSubscription = new Subscription();
        newSubscription.setSubscriptionName(subscription.getSubscriptionName());
        newSubscription.setType(subscription.getType());
        newSubscription.setPrice(subscription.getPrice());
        newSubscription.setStatus(subscription.getStatus());
        return subscriptionRepository.save(newSubscription);
    }
    public Integer countTotalUserSubscriptionHistory() {
        return historyRepo.countTotalUserSubscriptionHistory();
    }
    public BigInteger countTotalUserSubscriptionHistoryPrice() {
        return historyRepo.countTotalUserSubscriptionHistoryPrice();
    }
    public Integer countFreeUserSubscriptionHistory() {
        return historyRepo.countFreeUserSubscriptionHistory();
    }
    public Integer countProUserSubscriptionHistory() {
        return historyRepo.countProUserSubscriptionHistory();
    }
    public Integer countPremiumUserSubscriptionHistory() {
        return historyRepo.countPremiumUserSubscriptionHistory();
    }
    public Map<String, Integer> countAllUserSubscriptionHistory() {
        Object[] result = (Object[]) historyRepo.countAllUserSubscriptionHistory();
        Map<String, Integer> counts = new HashMap<>();
        counts.put("Free", ((Number) result[0]).intValue());
        counts.put("Pro", ((Number) result[1]).intValue());
        counts.put("Premium", ((Number) result[2]).intValue());
        return counts;
    }
    public Map<String, Object> countTotalUsersAndAmountLast7Days() {
        Object[] result = (Object[]) historyRepo.countTotalUsersAndAmountLast7Days();
        Map<String, Object> counts = new HashMap<>();
        counts.put("totalUsers", ((Number) result[0]).intValue());
        counts.put("totalAmount", result[1] != null ? ((Number) result[1]).longValue() : 0L);
        return counts;
    }
    public List<Map<String, Object>> countDailyUsersAndAmountLast7DaysWithZero() {
        List<Object[]> rows = historyRepo.countDailyUsersAndAmountLast7DaysWithZero();
        List<Map<String, Object>> result = new ArrayList<>();

        for (Object[] row : rows) {
            Map<String, Object> dayData = new HashMap<>();
            dayData.put("date", row[0].toString());
            dayData.put("totalUsers", ((Number) row[1]).intValue());
            dayData.put("totalAmount", ((Number) row[2]).longValue());
            result.add(dayData);
        }
        return result;
    }

    public List<Map<String, Object>> countDailyUsersAndAmountLast30DaysWithZero() {
        List<Object[]> rows = historyRepo.countDailyUsersAndAmountLast30DaysWithZero();
        List<Map<String, Object>> result = new ArrayList<>();

        for (Object[] row : rows) {
            Map<String, Object> dayData = new HashMap<>();
            dayData.put("date", row[0].toString());
            dayData.put("totalUsers", ((Number) row[1]).intValue());
            dayData.put("totalAmount", ((Number) row[2]).longValue());
            result.add(dayData);
        }
        return result;
    }


}
