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

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

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
}
