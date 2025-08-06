package com.skillgapguide.sgg.Repository;

import com.skillgapguide.sgg.Entity.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SubscriptionRepository extends JpaRepository<Subscription, Integer> {

    Subscription findSubscriptionBySubscriptionId(Integer subscriptionId);

    boolean existsSubscriptionByType(Integer type);

    boolean existsSubscriptionBySubscriptionName(String subscriptionName);

    Subscription findSubscriptionByTypeAndStatus(Integer type, String status);

    Subscription findSubscriptionByTypeAndSubscriptionName(Integer type, String subscriptionName);

    Optional<Subscription> findByType(Integer type);
}
