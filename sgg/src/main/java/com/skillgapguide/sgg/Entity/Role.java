package com.skillgapguide.sgg.Entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "Role")
public class Role {

    @Id
    @Column(name = "role_id")
    private Integer roleId;

    @Column(nullable = false)
    private String name;
}

