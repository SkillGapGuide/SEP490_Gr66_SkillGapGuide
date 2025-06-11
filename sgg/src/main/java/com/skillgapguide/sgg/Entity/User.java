package com.skillgapguide.sgg.Entity;
import jakarta.persistence.*;
import lombok.Data;
import java.util.Set;

@Data
@Entity
@Table(name = "User")
public class User {

    @Id
    @Column(name = "user_id")
    private Integer userId;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(name = "role_id", nullable = false)
    private Integer roleId;

    @Column(name = "subscription_id", nullable = false)
    private Integer subscriptionId;

    @Column(nullable = false)
    private String phone;

    @Column(nullable = false)
    private String address;
}

