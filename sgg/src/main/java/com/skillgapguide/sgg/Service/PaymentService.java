package com.skillgapguide.sgg.Service;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.skillgapguide.sgg.Dto.PaymentDTO;
import com.skillgapguide.sgg.Entity.Payment;
import com.skillgapguide.sgg.Entity.Subscription;
import com.skillgapguide.sgg.Entity.User;
import com.skillgapguide.sgg.Entity.UserSubscriptionHistory;
import com.skillgapguide.sgg.Repository.PaymentRepository;
import com.skillgapguide.sgg.Repository.SubscriptionRepository;
import com.skillgapguide.sgg.Repository.UserRepository;
import com.skillgapguide.sgg.Repository.UserSubscriptionHistoryRepository;
import com.skillgapguide.sgg.Response.EHttpStatus;
import com.skillgapguide.sgg.Response.Response;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class PaymentService {
    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final UserSubscriptionHistoryRepository userSubscriptionHistoryRepository;
    @Autowired
    private PaymentRepository paymentRepo;
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
    public String getPaymentQr(Integer type) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        double totalPrice;
        String description;
        if(type == 1){
            totalPrice = 100000;
            description = user.getFullName() + " dang ky goi co ban "+user.getUserId();
        } else if (type == 2) {
            totalPrice = 200000;
            description = user.getFullName() + " dang ky goi toan dien"+user.getUserId();
        } else {
            throw new IllegalStateException("Invalid payment type");
        }
        String accountName = "Tran Tuan Minh";
        String bankId = "MB";
        String accountNo = "1020052412003";
        String qrUrl = "https://img.vietqr.io/image/" + bankId + "-" + accountNo + "-print.png?amount=" + totalPrice + "&addInfo=" + description + "&accountName=" + accountName;
        return qrUrl;
    }
    public void confirmPaymentCassio(String json) throws Exception {
        String status;
        try {
            JsonObject jsonObject = JsonParser.parseString(json).getAsJsonObject();
            JsonArray jsonArray = (JsonArray) jsonObject.get("data");
            // loop array
            for (JsonElement element : jsonArray) {
                JsonObject transaction = element.getAsJsonObject();
                String description = transaction.get("description").getAsString();
                String amountStr = transaction.get("amount").getAsString();
                Double amount = Double.parseDouble(amountStr);
                Integer userId;
                Pattern pattern = Pattern.compile("(\\d+)$");
                Matcher matcher = pattern.matcher(description);
                if (matcher.find()) {
                    String userIdStr = matcher.group(1);
                    userId = Integer.parseInt(userIdStr);
                }
                else {
                    status = "FAILED";
                    throw new RuntimeException("Không tìm thấy userId trong mô tả giao dịch");
                }
                int subscriptionId;
                if (description.contains("dang ky goi co ban")) {
                    subscriptionId = 2;
                } else if (description.contains("dang ky goi toan dien")) {
                    subscriptionId = 3;
                } else {
                    status = "FAILED";
                    throw new RuntimeException("Không tìm thấy subscriptionId trong mô tả giao dịch");
                }
//                Payment payment = new Payment();
//                    payment.setAmount(amount);
//                    payment.setDate(new Date());
//                    payment.setStatus("SUCCESS");
//                    payment.setPaymentMethod("QRCode");
//                    payment.setUserId(userId);
                // Kiểm tra downgrade

                User user = userRepository.findById(userId)
                        .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

                Subscription newSubscription = subscriptionRepository.findById(subscriptionId)
                        .orElseThrow(() -> new RuntimeException("Subscription not found"));
                Subscription currentSubscription = subscriptionRepository.findById(user.getSubscriptionId()).orElse(null);
                int currentType = currentSubscription != null ? currentSubscription.getType() : 0;
                int newType = newSubscription.getType();

                if (currentType >= newType) {
                    status = "Bạn đang sử dụng gói cao hơn hoặc tương đương, không thể mua gói thấp hơn";
                }

                // Nếu là nâng cấp: cập nhật UserSubscriptionHistory hiện tại (nếu có) thành EXPIRED
                List<UserSubscriptionHistory> activeHistories = userSubscriptionHistoryRepository.findByUserAndStatus(user, "ACTIVE");
                LocalDateTime now = LocalDateTime.now();
                for (UserSubscriptionHistory history : activeHistories) {
                    history.setStatus("EXPIRED");
                    history.setUpdatedAt(now);
                    userSubscriptionHistoryRepository.save(history);
                }

                // Cập nhật user: roleId theo type, subscriptionId
                int roleId;
                switch (newType) {
                    case 2 -> roleId = 5; // PRO
                    case 3 -> roleId = 6; // PREMIUM
                    default -> roleId = 4; // BASIC
                }

                user.setRoleId(roleId);
                user.setSubscriptionId(subscriptionId);
                userRepository.save(user);

                // Ghi lại user_subscription_history
                UserSubscriptionHistory history = new UserSubscriptionHistory();
                history.setUser(user);
                history.setSubscription(newSubscription);
                history.setStartDate(now);
                history.setEndDate(now.plusDays(1));
                history.setStatus("ACTIVE");
                history.setCreatedAt(now);
                history.setUpdatedAt(now);
                userSubscriptionHistoryRepository.save(history);

                // Ghi vào bảng Payment
                Payment payment = new Payment();
                payment.setAmount(amount);
                payment.setDate(new Date());
                payment.setStatus("SUCCESS");
                payment.setPaymentMethod("QRCODE");
                payment.setUserId(user.getUserId());
                paymentRepo.save(payment);

            }
        } catch (Exception e){
            status = "FAILED";
            throw new Exception("Xác nhận thanh toán thất bại: " + e.getMessage(), e);
        }
    }
    public int checkPayment() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        int subscriptionId = user.getSubscriptionId();
        Subscription subscription = subscriptionRepository.findById(subscriptionId)
                .orElseThrow(() -> new RuntimeException("Subscription not found with ID: " + subscriptionId));
        return subscription.getType();
    }
}
