package com.skillgapguide.sgg.Controller;

import com.skillgapguide.sgg.Entity.Payment;
import com.skillgapguide.sgg.Entity.User;
import com.skillgapguide.sgg.Repository.PaymentRepository;
import com.skillgapguide.sgg.Repository.UserRepository;
import com.skillgapguide.sgg.Service.VnPayService;
import io.swagger.v3.oas.annotations.Hidden;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@SecurityRequirement(name = "Bearer Authentication")
@RequiredArgsConstructor
public class PaymentController {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private VnPayService vnPayService;
    @Autowired
    private PaymentRepository paymentRepo;

    @GetMapping("/create")
    public ResponseEntity<Map<String, Object>> createPayment(@RequestParam double amount, HttpServletRequest request) throws Exception {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String orderInfo = "Thanh toán đơn hàng #" + System.currentTimeMillis();
        String ipAddr = request.getRemoteAddr();

        // 👉 Gửi userId vào service để nhúng vào TxnRef
        String url = vnPayService.createPaymentUrl(amount, orderInfo, ipAddr, user.getUserId());

        Map<String, Object> response = Map.of(
                "paymentUrl", url,
                "message", "Redirect to payment"
        );
        return ResponseEntity.ok(response);
    }

    @GetMapping("/vnpay-return")
    public ResponseEntity<Map<String, Object>> paymentReturn(@RequestParam Map<String, String> params) {
        try {
            String status = params.get("vnp_ResponseCode");
            String transactionNo = params.get("vnp_TransactionNo");
            double amount = Double.parseDouble(params.get("vnp_Amount")) / 100;
            String txnRef = params.get("vnp_TxnRef");

            // Tách userId từ txnRef: ví dụ 123_172102938123
            Integer userId = Integer.parseInt(txnRef.split("_")[0]);
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

            Payment payment = new Payment();
            payment.setAmount(amount);
            payment.setDate(new Date());
            payment.setStatus("00".equals(status) ? "SUCCESS" : "FAILED");
            payment.setTransactionCode(transactionNo);
            payment.setPaymentMethod("VNPAY");
            payment.setUserId(user.getUserId());

            Payment saved = paymentRepo.save(payment);

            return ResponseEntity.ok(Map.of(
                    "message", "00".equals(status) ? "Thanh toán thành công" : "Thanh toán thất bại",
                    "status", status,
                    "transactionCode", transactionNo,
                    "paymentId", saved.getPaymentId()
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                    "message", "Lỗi khi xử lý callback từ VNPAY",
                    "error", e.getMessage()
            ));
        }
    }

}
