
        package com.skillgapguide.sgg.Service;

import com.skillgapguide.sgg.Entity.UserSubscriptionHistory;
import com.skillgapguide.sgg.Entity.User;
import com.skillgapguide.sgg.Entity.Subscription;
import com.skillgapguide.sgg.Repository.UserSubscriptionHistoryRepository;
import com.skillgapguide.sgg.Repository.UserRepository;
import com.skillgapguide.sgg.Repository.SubscriptionRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SubscriptionServiceTest {

    @Mock
    private UserSubscriptionHistoryRepository historyRepo;

    @Mock
    private UserRepository userRepository;

    @Mock
    private SubscriptionRepository subscriptionRepository;

    @InjectMocks
    private SubscriptionService subscriptionService;

    @Test
    void expireOldSubscriptionsExpiresSuccessfully() {
        UserSubscriptionHistory history = new UserSubscriptionHistory();
        history.setEndDate(LocalDateTime.now().minusDays(1));
        history.setStatus("ACTIVE");
        User user = new User();
        history.setUser(user);
        Subscription defaultSub = new Subscription();
        defaultSub.setSubscriptionId(1);
        List<UserSubscriptionHistory> active = Arrays.asList(history);
        when(historyRepo.findByStatus("ACTIVE")).thenReturn(active);
        when(subscriptionRepository.findByType(1)).thenReturn(java.util.Optional.of(defaultSub));

        subscriptionService.expireOldSubscriptions();

        assertEquals("EXPIRED", history.getStatus());
        verify(historyRepo).save(history);
        verify(userRepository).save(user);
    }

    @Test
    void countFreeUserSubscriptionHistoryReturnsCount() {
        when(historyRepo.countFreeUserSubscriptionHistory()).thenReturn(5);

        Integer result = subscriptionService.countFreeUserSubscriptionHistory();

        assertEquals(5, result);
        verify(historyRepo).countFreeUserSubscriptionHistory();
    }

    @Test
    void countAllUserSubscriptionHistoryReturnsMap() {
        Object[] result = new Object[]{3, 2, 1};
        when(historyRepo.countAllUserSubscriptionHistory()).thenReturn(result);

        Map<String, Integer> counts = subscriptionService.countAllUserSubscriptionHistory();

        assertEquals(3, counts.get("Free"));
        assertEquals(2, counts.get("Pro"));
        assertEquals(1, counts.get("Premium"));
        verify(historyRepo).countAllUserSubscriptionHistory();
    }
}