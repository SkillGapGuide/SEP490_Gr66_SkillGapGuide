package com.skillgapguide.sgg.Repository;

import com.skillgapguide.sgg.Dto.UserSubscriptionRequest;
import com.skillgapguide.sgg.Entity.User;
import com.skillgapguide.sgg.Entity.UserSubscriptionHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigInteger;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserSubscriptionHistoryRepository extends JpaRepository<UserSubscriptionHistory, Integer> {
    Optional<UserSubscriptionHistory> findTopByUser_UserIdAndStatusOrderByStartDateDesc(Integer userId, String status);

    List<UserSubscriptionHistory> findByStatus(String status);

    List<UserSubscriptionHistory> findByUserAndStatus(User user, String status);
    @Query("SELECT new com.skillgapguide.sgg.Dto.UserSubscriptionRequest(u.userId, su.subscriptionId, su.subscriptionName, u.fullName, s.endDate, s.status) " +
            "FROM UserSubscriptionHistory s " +
            "JOIN s.user u " +
            "JOIN s.subscription su " +
            "WHERE u.userId = :userId")
    Optional<UserSubscriptionRequest> findSubscriptionByUserId(@Param("userId") Integer userId);
    @Query("Select Count(*) from UserSubscriptionHistory")
    Integer countTotalUserSubscriptionHistory();
    @Query(value = "SELECT SUM(su.price) " +
            "FROM user_subscription_history u " +
            "JOIN subscription su ON u.subscription_id = su.subscription_id",
            nativeQuery = true)
    BigInteger countTotalUserSubscriptionHistoryPrice();
    @Query(value = "SELECT Count(u.subscription_id) AS Free_User\n" +
            "FROM user_subscription_history u\n" +
            "JOIN subscription su \n" +
            "    ON u.subscription_id = su.subscription_id\n" +
            "    where u.subscription_id = 1",
                nativeQuery = true)
    Integer countFreeUserSubscriptionHistory();
    @Query(value = "SELECT Count(u.subscription_id) AS Pro_User\n" +
            "FROM user_subscription_history u\n" +
            "JOIN subscription su \n" +
            "    ON u.subscription_id = su.subscription_id\n" +
            "    where u.subscription_id = 2",
            nativeQuery = true)
    Integer countProUserSubscriptionHistory();
    @Query(value = "SELECT Count(u.subscription_id) AS Premium_User\n" +
            "FROM user_subscription_history u\n" +
            "JOIN subscription su \n" +
            "    ON u.subscription_id = su.subscription_id\n" +
            "    where u.subscription_id = 3",
            nativeQuery = true)
    Integer countPremiumUserSubscriptionHistory();
    @Query(value = """
    SELECT 
        SUM(CASE WHEN u.subscription_id = 1 THEN 1 ELSE 0 END) AS Free,
        SUM(CASE WHEN u.subscription_id = 2 THEN 1 ELSE 0 END) AS Pro,
        SUM(CASE WHEN u.subscription_id = 3 THEN 1 ELSE 0 END) AS Premium
    FROM user_subscription_history u
""", nativeQuery = true)
    Object countAllUserSubscriptionHistory();
    @Query(value = """
    SELECT 
        COUNT(DISTINCT u.user_id) AS total_users,
        SUM(su.price) AS total_amount
    FROM user_subscription_history u
    JOIN subscription su 
        ON u.subscription_id = su.subscription_id
    WHERE u.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
""", nativeQuery = true)
    Object countTotalUsersAndAmountLast7Days();
    @Query(value = """
    WITH RECURSIVE dates AS (
        SELECT CURDATE() - INTERVAL 6 DAY AS date_val
        UNION ALL
        SELECT date_val + INTERVAL 1 DAY
        FROM dates
        WHERE date_val + INTERVAL 1 DAY <= CURDATE()
    )
    SELECT 
        d.date_val AS purchase_date,
        COALESCE(COUNT(DISTINCT u.user_id), 0) AS total_users,
        COALESCE(SUM(su.price), 0) AS total_amount
    FROM dates d
    LEFT JOIN user_subscription_history u 
        ON DATE(u.created_at) = d.date_val
    LEFT JOIN subscription su 
        ON u.subscription_id = su.subscription_id
    GROUP BY d.date_val
    ORDER BY d.date_val ASC
""", nativeQuery = true)
    List<Object[]> countDailyUsersAndAmountLast7DaysWithZero();

    @Query(value = """
    WITH RECURSIVE dates AS (
        SELECT CURDATE() - INTERVAL 29 DAY AS date_val
        UNION ALL
        SELECT date_val + INTERVAL 1 DAY
        FROM dates
        WHERE date_val + INTERVAL 1 DAY <= CURDATE()
    )
    SELECT 
        d.date_val AS purchase_date,
        COALESCE(COUNT(DISTINCT u.user_id), 0) AS total_users,
        COALESCE(SUM(su.price), 0) AS total_amount
    FROM dates d
    LEFT JOIN user_subscription_history u 
        ON DATE(u.created_at) = d.date_val
    LEFT JOIN subscription su 
        ON u.subscription_id = su.subscription_id
    GROUP BY d.date_val
    ORDER BY d.date_val ASC
""", nativeQuery = true)
    List<Object[]> countDailyUsersAndAmountLast30DaysWithZero();

}
