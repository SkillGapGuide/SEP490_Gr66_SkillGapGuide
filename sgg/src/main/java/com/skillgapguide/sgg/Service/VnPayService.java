package com.skillgapguide.sgg.Service;

import com.skillgapguide.sgg.Config.VnPayConfig;
import com.skillgapguide.sgg.Entity.Subscription;
import com.skillgapguide.sgg.Repository.SubscriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.UnsupportedEncodingException;
import java.math.BigInteger;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.NoSuchAlgorithmException;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
@RequiredArgsConstructor
public class VnPayService {
    private final SubscriptionRepository subscriptionRepository;
    @Autowired
    private VnPayConfig vnPayConfig;
    public String createPaymentUrl(Integer userId, Integer subscriptionId, String ipAddress)
            throws UnsupportedEncodingException, NoSuchAlgorithmException {

        Subscription subscription = subscriptionRepository.findById(subscriptionId)
                .orElseThrow(() -> new RuntimeException("Subscription not found with ID: " + subscriptionId));

        BigInteger amount = subscription.getPrice().multiply(BigInteger.valueOf(100)); // Lấy giá từ DB

        String vnp_Version = "2.1.0";
        String vnp_Command = "pay";
        String vnp_OrderType = "other";
        String vnp_TxnRef = userId + "_" + subscriptionId + "_" + System.currentTimeMillis();
        String vnp_IpAddr = ipAddress;
        String vnp_OrderInfo = "Thanh toán gói " + subscription.getSubscriptionName();

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", vnp_Version);
        vnp_Params.put("vnp_Command", vnp_Command);
        vnp_Params.put("vnp_TmnCode", vnPayConfig.getTmnCode());
        vnp_Params.put("vnp_Amount", amount.toString());// nhân 100 theo yêu cầu của VNPAY
        vnp_Params.put("vnp_CurrCode", "VND");
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", vnp_OrderInfo);
        vnp_Params.put("vnp_OrderType", vnp_OrderType);
        vnp_Params.put("vnp_Locale", "vn");
        vnp_Params.put("vnp_ReturnUrl", vnPayConfig.getReturnUrl());
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);
        vnp_Params.put("vnp_CreateDate", new SimpleDateFormat("yyyyMMddHHmmss").format(new Date()));
        vnp_Params.put("vnp_BankCode", "NCB"); // Test only

        // Tạo chuỗi hash và query
        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();

        for (int i = 0; i < fieldNames.size(); i++) {
            String name = fieldNames.get(i);
            String value = vnp_Params.get(name);
            hashData.append(name).append('=').append(URLEncoder.encode(value, StandardCharsets.US_ASCII));
            query.append(name).append('=').append(URLEncoder.encode(value, StandardCharsets.US_ASCII));
            if (i < fieldNames.size() - 1) {
                hashData.append('&');
                query.append('&');
            }
        }

        String secureHash = hmacSHA512(vnPayConfig.getHashSecret(), hashData.toString());
        query.append("&vnp_SecureHash=").append(secureHash);

        return vnPayConfig.getPayUrl() + "?" + query;
    }



    private String hmacSHA512(String key, String data) throws NoSuchAlgorithmException {
        try {
            if (key == null || data == null) return null;

            Mac hmac512 = Mac.getInstance("HmacSHA512");
            SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
            hmac512.init(secretKey);

            byte[] bytes = hmac512.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder hash = new StringBuilder();
            for (byte b : bytes) {
                hash.append(String.format("%02x", b));
            }

            return hash.toString();
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi tạo HMAC SHA512", e);
        }
    }

}
