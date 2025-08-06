package com.skillgapguide.sgg.Entity;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigInteger;

@Data
@Entity
@Table(name = "Subscription")
public class Subscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "subscription_id")
    private Integer subscriptionId;

    @Column(nullable = false)
    private Integer type;
    @Column(name = "subscription_name")
    private String subscriptionName;
    private BigInteger price;
    @Column(nullable = false)
    private String status;
}

