package com.skillgapguide.sgg.Repository;

import com.skillgapguide.sgg.Entity.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SubscriptionRepository extends JpaRepository<Subscription, Integer> {

    Subscription findSubscriptionBySubscriptionId(Integer subscriptionId);

    boolean existsSubscriptionByType(String type);

    boolean existsSubscriptionBySubscriptionName(String subscriptionName);

    Subscription findSubscriptionByTypeAndStatus(String type, String status);

    Subscription findSubscriptionByTypeAndSubscriptionName(String type, String subscriptionName);
}
