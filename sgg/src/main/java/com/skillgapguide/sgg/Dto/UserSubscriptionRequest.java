package com.skillgapguide.sgg.Dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.Date;

@Data
public class UserSubscriptionRequest {
    private Integer userId;
    private Integer subscriptionId;
    private String subscriptionName;
    private String fullName;
    private LocalDateTime endDate;
    private String status;

    public UserSubscriptionRequest(Integer userId, Integer subscriptionId, String subscriptionName, String fullName, LocalDateTime endDate, String status) {
        this.userId = userId;
        this.subscriptionId = subscriptionId;
        this.subscriptionName = subscriptionName;
        this.fullName = fullName;
        this.endDate = endDate;
        this.status = status;
    }
}
