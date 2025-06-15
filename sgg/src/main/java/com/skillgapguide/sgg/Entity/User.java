package com.skillgapguide.sgg.Entity;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Data
@Entity
@Table(name = "User")
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Integer userId;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = true) // Google user có thể không có password
    private String password;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(name = "role_id", nullable = false)
    private Integer roleId;

    @Column(name = "subscription_id", nullable = false)
    private Integer subscriptionId;

    @Column(nullable = false)
    private String phone;

    @Column(nullable = true)
    private String avatar;
    @Enumerated(EnumType.STRING) // Lưu status dưới dạng chuỗi trong DB (VD: "VERIFIED")
    @Column(nullable = false)
    private static final String STATUS_VERIFIED = "VERIFIED";
    private static final String STATUS_BANNED = "BANNED";
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "status_id", nullable = false)
    private UserStatus status;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Provider provider;

    public enum Provider {
        LOCAL,    // Tài khoản thường
        GOOGLE    // Tài khoản Google
    }

    // ------ Spring Security ------
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        String role;
        if (this.roleId == 1) {
            role = "ROLE_SYSTEM_ADMIN";
        } else if (this.roleId == 2) {
            role = "ROLE_BUSINESS_ADMIN";
        } else if (this.roleId == 3) {
            role = "ROLE_USER";
        } else if (this.roleId == 4) {
            role = "ROLE_PREMIUM_USER";
        } else {
            role = "UNKNOWN";
        }
        return List.of(new SimpleGrantedAuthority(role));
    }
    @Override
    public String getPassword() {
        return this.password;
    }
    @Override
    public String getUsername() {
        return this.email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // Không kiểm soát
    }

    @Override
    public boolean isAccountNonLocked() {
        // BANNED = không cho login
        return this.status != null && !"BANNED".equalsIgnoreCase(this.status.getName());
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // Không kiểm soát
    }

    @Override
    public boolean isEnabled() {
        // Chỉ cho phép login nếu VERIFIED
        return this.status != null && this.status.getName().equals(STATUS_VERIFIED);
    }
}
