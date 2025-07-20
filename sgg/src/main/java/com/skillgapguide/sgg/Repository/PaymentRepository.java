package com.skillgapguide.sgg.Repository;

import com.skillgapguide.sgg.Entity.Payment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Date;

public interface PaymentRepository extends JpaRepository<Payment, Integer> {
    Page<Payment> findByStatus(String status, Pageable pageable);
    @Query("SELECT p FROM Payment p WHERE p.date BETWEEN :startDate AND :endDate")
    Page<Payment> findPaymentBetweenDates(Date startDate, Date endDate, Pageable pageable);
    Page<Payment> findPaymentByUserId(Integer userId, Pageable pageable);
    Payment findPaymentByPaymentId(Integer paymentId);
}
