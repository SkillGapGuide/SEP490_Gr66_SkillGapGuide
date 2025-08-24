package com.skillgapguide.sgg.Service;

import com.skillgapguide.sgg.Dto.PaymentDTO;
import com.skillgapguide.sgg.Entity.Payment;
import com.skillgapguide.sgg.Entity.User;
import com.skillgapguide.sgg.Repository.PaymentRepository;
import com.skillgapguide.sgg.Repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
        import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PaymentServiceTest {

    @Mock
    private PaymentRepository paymentRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private PaymentService paymentService;

    @Test
    void toPaymentDTOReturnsDTO() {
        Payment payment = new Payment();
        payment.setUserId(1);
        User user = new User();
        user.setFullName("user");
        when(userRepository.findById(1)).thenReturn(Optional.of(user));

        PaymentDTO result = paymentService.toPaymentDTO(payment);

        assertEquals("user", result.getUsername());
        verify(userRepository).findById(1);
    }

    @Test
    void checkPaymentReturnsStatus() {
        int paymentId = 1;
        Payment payment = new Payment();
        payment.setStatus("PAID");
        when(paymentRepository.findPaymentByPaymentId(paymentId)).thenReturn(payment);

        String result = paymentService.checkPayment(paymentId);

        assertEquals("PAID", result);
        verify(paymentRepository).findPaymentByPaymentId(paymentId);
    }
}