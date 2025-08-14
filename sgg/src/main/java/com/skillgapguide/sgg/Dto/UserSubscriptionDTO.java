package com.skillgapguide.sgg.Dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserSubscriptionDTO {
    private String fullName;
    private String role;
    private LocalDateTime subscriptionStart;
    private LocalDateTime subscriptionEnd;
    private String subscriptionName;

    public UserSubscriptionDTO(String fullName, String role, String subscriptionName,
                               LocalDateTime subscriptionStart, LocalDateTime subscriptionEnd) {
        this.fullName = fullName;
        this.role = role;
        this.subscriptionName = subscriptionName;
        this.subscriptionStart = subscriptionStart;
        this.subscriptionEnd = subscriptionEnd;
    }
}
