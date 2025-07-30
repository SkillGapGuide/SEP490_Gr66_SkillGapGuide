package com.skillgapguide.sgg.Service;

import com.skillgapguide.sgg.Entity.Subscription;
import com.skillgapguide.sgg.Entity.User;
import com.skillgapguide.sgg.Entity.UserSubscriptionHistory;
import com.skillgapguide.sgg.Repository.SubscriptionRepository;
import com.skillgapguide.sgg.Repository.UserRepository;
import com.skillgapguide.sgg.Repository.UserSubscriptionHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SubscriptionService {
    private final UserSubscriptionHistoryRepository historyRepo;
    private final UserRepository userRepository;
    private final SubscriptionRepository subscriptionRepository;

    @Scheduled(cron = "0 0 2 * * *") // chạy mỗi ngày lúc 2 giờ sáng
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
}
