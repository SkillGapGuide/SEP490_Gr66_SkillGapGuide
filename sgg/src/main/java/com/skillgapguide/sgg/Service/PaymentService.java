package com.skillgapguide.sgg.Service;

import com.skillgapguide.sgg.Entity.Payment;
import com.skillgapguide.sgg.Repository.PaymentRepository;
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
    public Page<Payment> getPaymentsByStatus(String status, Pageable pageable) {
        return paymentRepository.findByStatus(status, pageable);
    }
    public Page<Payment> getPaymentsBetweenDates(Date startDate, Date endDate, Pageable pageable) {
        return paymentRepository.findPaymentBetweenDates(startDate, endDate, pageable);
    }
    public Page<Payment> findPaymentByUserId(Integer userId, Pageable pageable) {
        return paymentRepository.findPaymentByUserId(userId, pageable);
    }
    public Page<Payment> findAll(Pageable pageable) {
        return paymentRepository.findAll(pageable);
    }
    public List<Payment> findAllList() {
        return paymentRepository.findAll();
    }
    public Payment findPaymentByPaymentId(Integer paymentId) {
        return paymentRepository.findPaymentByPaymentId(paymentId);
    }
}
