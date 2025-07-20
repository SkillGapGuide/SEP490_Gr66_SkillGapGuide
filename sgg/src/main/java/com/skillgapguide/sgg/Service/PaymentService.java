package com.skillgapguide.sgg.Service;

import com.skillgapguide.sgg.Dto.PaymentDTO;
import com.skillgapguide.sgg.Entity.Payment;
import com.skillgapguide.sgg.Entity.User;
import com.skillgapguide.sgg.Repository.PaymentRepository;
import com.skillgapguide.sgg.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentService {
    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;
    public PaymentDTO toPaymentDTO(Payment payment) {
        String username = getUsernameByUserId(payment.getUserId());
        PaymentDTO dto = new PaymentDTO();
        dto.setPaymentId(payment.getPaymentId());
        dto.setUsername(username);
        dto.setAmount(payment.getAmount());
        dto.setDate(payment.getDate());
        dto.setPaymentMethod(payment.getPaymentMethod());
        dto.setTransactionCode(payment.getTransactionCode());
        dto.setQrCodeUrl(payment.getQrCodeUrl());
        dto.setStatus(payment.getStatus());
        return dto;
    }

    private String getUsernameByUserId(Integer userId) {
        User user = userRepository.findById(userId).orElse(null);
        return user != null ? user.getFullName() : "Unknown User";
    }

    public Page<PaymentDTO> getPaymentsByStatus(String status, Pageable pageable) {
        return paymentRepository.findByStatus(status, pageable)
                .map(this::toPaymentDTO);
    }

    public Page<PaymentDTO> getPaymentsBetweenDates(Date startDate, Date endDate, Pageable pageable) {
        return paymentRepository.findPaymentBetweenDates(startDate, endDate, pageable)
                .map(this::toPaymentDTO);
    }

    public Page<PaymentDTO> findPaymentByUserId(Integer userId, Pageable pageable) {
        return paymentRepository.findPaymentByUserId(userId, pageable)
                .map(this::toPaymentDTO);
    }

    public Page<PaymentDTO> findAll(Pageable pageable) {
        return paymentRepository.findAll(pageable)
                .map(this::toPaymentDTO);
    }

    public List<PaymentDTO> findAllList() {
        return paymentRepository.findAll()
                .stream()
                .map(this::toPaymentDTO)
                .toList();
    }

    public PaymentDTO findPaymentByPaymentId(Integer paymentId) {
        Payment payment = paymentRepository.findPaymentByPaymentId(paymentId);
        return payment != null ? toPaymentDTO(payment) : null;
    }
}
