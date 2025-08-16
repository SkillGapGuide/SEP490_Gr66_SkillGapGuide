package com.skillgapguide.sgg.Service;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.skillgapguide.sgg.Dto.PaymentDTO;
import com.skillgapguide.sgg.Dto.PaymentQrDTO;
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
    private final UserService userService;
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
    public PaymentQrDTO getPaymentQr(Integer type) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Subscription subscription = subscriptionRepository.findByType(type)
                .orElseThrow(() -> new RuntimeException("Subscription not found"));
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String description;
        if(type == 2){
            description = user.getFullName() + " goi co ban "+user.getUserId();
        } else if (type == 3) {
            description = user.getFullName() + " goi toan dien "+user.getUserId();
        } else {
            throw new IllegalStateException("Invalid payment type");
        }
        double totalPrice = subscription.getPrice().doubleValue();
        Payment payment = new Payment();
        payment.setAmount(totalPrice);
        payment.setDate(new Date());
        payment.setStatus("UNPAID");
        payment.setPaymentMethod("QRCODE");
        payment.setUserId(user.getUserId());
        paymentRepo.save(payment);
        String accountName = "Tran Tuan Minh";
        String bankId = "BIDV";
        String accountNo = "V3CASS9999";
        String qrUrl = "https://img.vietqr.io/image/" + bankId + "-" + accountNo + "-print.png?amount=" + totalPrice + "&addInfo=" + description+" "+payment.getPaymentId() + "&accountName=" + accountName;
        payment.setQrCodeUrl(qrUrl);
        paymentRepo.save(payment);
        PaymentQrDTO paymentQrDTO = new PaymentQrDTO(qrUrl, payment.getPaymentId());
        return paymentQrDTO;
    }
    public void confirmPaymentCassio(String json) throws Exception {
        try {
            System.out.println("Xác nhận thanh toán từ Cassio: " + json);
            String status = "SUCCESS";
            JsonObject jsonObject = JsonParser.parseString(json).getAsJsonObject();
            JsonArray jsonArray = (JsonArray) jsonObject.get("data");
            // loop array
            for (JsonElement element : jsonArray) {
                JsonObject transaction = element.getAsJsonObject();
                String description = transaction.get("description").getAsString();
                if (description.equals("giao dich thu nghiem")) {
                    return;
                }
                String amountStr = transaction.get("amount").getAsString();
                Double amount = Double.parseDouble(amountStr);
                Integer userId;
                Integer paymentId;

                Pattern pattern = Pattern.compile("(\\d+)\\s+(\\d+)$");
                Matcher matcher = pattern.matcher(description);

                if (matcher.find()) {
                    userId = Integer.parseInt(matcher.group(1));
                    paymentId = Integer.parseInt(matcher.group(2));
                }

                else {
                    status = "FAILED";
                    throw new RuntimeException("Không tìm thấy userId trong mô tả giao dịch");
                }
                int subscriptionId;
                if (description.contains("goi co ban")) {
                    subscriptionId = 2;
                } else if (description.contains("goi toan dien")) {
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
                Payment payment = paymentRepository.findById(paymentId)
                        .orElseThrow(() -> new RuntimeException("Payment not found with ID: " + paymentId));
                if(payment.getAmount().compareTo(amount) != 0) {
                    status = "Số tiền thanh toán không khớp";
                    // Ghi vào bảng Payment
                    payment.setAmount(amount);
                    payment.setDate(new Date());
                    payment.setStatus(status);
                    payment.setPaymentMethod("QRCODE");
                    paymentRepo.save(payment);
                    throw new RuntimeException("Số tiền thanh toán không khớp");
                }
                // Ghi vào bảng Payment
                payment.setAmount(amount);
                payment.setDate(new Date());
                payment.setStatus(status);
                payment.setPaymentMethod("QRCODE");
                paymentRepo.save(payment);
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
            }
        } catch (Exception e){
            throw new Exception("Xác nhận thanh toán thất bại: " + e.getMessage(), e);
        }
    }

    public String checkPayment(int paymentId) {
        Payment payment = paymentRepository.findPaymentByPaymentId(paymentId);
        return payment.getStatus();
    }
}
