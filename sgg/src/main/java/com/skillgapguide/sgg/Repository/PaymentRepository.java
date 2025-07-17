package com.skillgapguide.sgg.Repository;

import com.skillgapguide.sgg.Entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Integer> {
}
