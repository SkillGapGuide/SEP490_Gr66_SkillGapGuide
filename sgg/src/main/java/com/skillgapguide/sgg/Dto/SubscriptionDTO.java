package com.skillgapguide.sgg.Dto;

import lombok.Data;

@Data
public class SubscriptionDTO {
    private Integer subscriptionId;
    private String subscriptionName;
    private Integer userId;
    private String fullName;
    public SubscriptionDTO(Integer subscriptionId, String subscriptionName, Integer userId, String fullName) {
        this.subscriptionId = subscriptionId;
        this.subscriptionName = subscriptionName;
        this.userId = userId;
        this.fullName = fullName;
    }
}
