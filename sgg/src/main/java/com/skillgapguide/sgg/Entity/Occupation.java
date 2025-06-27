package com.skillgapguide.sgg.Entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "occupation")
public class Occupation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "name", nullable = false)
    private String name;
}
