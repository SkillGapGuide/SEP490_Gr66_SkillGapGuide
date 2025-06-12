package com.skillgapguide.sgg.Repository;

import com.skillgapguide.sgg.Entity.UserStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserStatusRepository extends JpaRepository<UserStatus, Integer> {
    // Tìm kiếm trạng thái người dùng theo tên
    Optional<UserStatus> findByName(String name);


}
