package com.skillgapguide.sgg.Dto;

import lombok.Data;

@Data
public class PaymentQrDTO {
    private String qrCodeUrl;
    private Integer paymentId;

    public PaymentQrDTO(String qrCodeUrl, Integer paymentId) {
        this.qrCodeUrl = qrCodeUrl;
        this.paymentId = paymentId;
    }
}
