package com.skillgapguide.sgg.Repository;


import com.skillgapguide.sgg.Dto.UserListResponse;
import com.skillgapguide.sgg.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email);
    @Query(value = "select u.email as email, u.fullName as name, u.phone as phone,r.name as role, us.name as status from User as u join Role as r on u.roleId = r.roleId join UserStatus as us on u.status = us")
    List<UserListResponse> getAllUser();
}
