package com.skillgapguide.sgg.Entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "Content")
public class Content {

    @Id
    private Integer id;

    @Column(name = "`Column`", nullable = false)
    private Integer column;
}

