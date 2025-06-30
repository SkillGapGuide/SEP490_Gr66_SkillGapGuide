package com.skillgapguide.sgg.Entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "occupation_groups")
public class OccupationGroup {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String name;

    @Column(name = "status")
    private String status;
}
