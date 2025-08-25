package com.skillgapguide.sgg.Repository;


import com.skillgapguide.sgg.Dto.*;
import com.skillgapguide.sgg.Entity.User;
import org.springframework.data.domain.Limit;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email);
    @Query(value = "select u.userId as id ,u.email as email, u.fullName as name, u.phone as phone,r.name as role, us.name as status from User as u join Role as r on u.roleId = r.roleId join UserStatus as us on u.status = us")
    Page<UserListResponse> getAllUser(Pageable pageable);
    @Query(value = "select u.userId as id , u.email as email, u.fullName as name, u.phone as phone,r.name as role, us.name as status " +
            "from User as u join Role as r on u.roleId = r.roleId join UserStatus as us on u.status = us " +
            "WHERE (:keyword IS NULL OR LOWER(u.fullName) LIKE  CONCAT('%', :keyword, '%') OR LOWER(u.email) LIKE  CONCAT('%', :keyword, '%')) " +
            "AND ((:role IS NULL or :role = '') OR r.name = :role) " +
            "AND ((:status IS NULL or :status = '') OR us.name = :status)")
    Page<UserListResponse> filterUser(@Param("keyword") String keyword,
                                      @Param("role") String role,
                                      @Param("status") String status, Pageable pageable);
    @Query(value = "select new com.skillgapguide.sgg.Dto.UserDetailDTO(u.fullName, u.email, u.phone, r.name, sub.type, us.name) from User as u join Role as r on u.roleId = r.roleId join UserStatus as us on " +
            "u.status = us join Subscription  as sub on u.subscriptionId = sub.subscriptionId " +
            "where u.email = :email")
    UserDetailDTO getUserDetail(String email);
    Optional<User> findByPhone(String phone);
    @Query("select new com.skillgapguide.sgg.Dto.SubscriptionDTO(s.subscriptionId, s.subscriptionName, u.userId, u.fullName) " +
            "from User u join Subscription s on u.subscriptionId = s.subscriptionId " +
            "where u.userId = :userid")
    Optional<SubscriptionDTO> findByUserid(@Param("userid") Integer userid);

    @Query("""
    SELECT new com.skillgapguide.sgg.Dto.UserSubscriptionDTO(
        u.fullName,
        r.name,
        s.subscriptionName,
        h.startDate,
        h.endDate
    )
    FROM User u
    JOIN Role r ON u.roleId = r.roleId
    JOIN Subscription s ON u.subscriptionId = s.subscriptionId
    LEFT JOIN UserSubscriptionHistory h
        ON u.userId = h.user.userId AND h.status = 'ACTIVE'
    WHERE u.email = :email
    ORDER BY h.startDate DESC
""")
    List<UserSubscriptionDTO> findUserSubscriptionByEmail(@Param("email") String email);



}
