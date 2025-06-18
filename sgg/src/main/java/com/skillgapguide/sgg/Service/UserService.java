package com.skillgapguide.sgg.Service;


import com.skillgapguide.sgg.Dto.*;
import com.skillgapguide.sgg.Entity.User;
import com.skillgapguide.sgg.Entity.UserStatus;
import com.skillgapguide.sgg.Entity.VerificationToken;
import com.skillgapguide.sgg.Repository.UserRepository;
import com.skillgapguide.sgg.Repository.UserStatusRepository;
import com.skillgapguide.sgg.Repository.VerificationTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class  UserService {
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    private final VerificationTokenRepository verificationTokenRepository;
    private  final UserStatusRepository userStatusRepository;
    @Value("${application.base-url}")
    private String baseUrl;
    @Value("${application.frontend-url}")
    private String frontendUrl;

    public String forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new IllegalStateException("Email không chính xác, vui lòng kiểm tra lại."));

        String token = UUID.randomUUID().toString();
        VerificationToken verificationToken = new VerificationToken(
                token,
                user,
                LocalDateTime.now().plusMinutes(3)
        );
        verificationTokenRepository.save(verificationToken);

        String verifyLink = frontendUrl + "/reset-password?token=" + token;
        emailService.sendMail(
                request.email(),
                "Đặt lại mật khẩu",
                "Click vào đây để thay đổi mật khẩu: " + verifyLink
        );

        return request.email();
    }

    public void resetPassword(String token, String newPassword) {
        VerificationToken verificationToken = verificationTokenRepository.findByToken(token)
                .orElseThrow(() -> new IllegalStateException("Token không hợp lệ"));

        if (verificationToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            verificationTokenRepository.delete(verificationToken);
            throw new IllegalStateException("Token đã hết hạn");
        }

        User user = verificationToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        verificationTokenRepository.delete(verificationToken);
    }
    public void changePassword(ChangePasswordRequest request) {
        // Get currently logged in user from Security Context
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("Người dùng không tồn tại"));

        if (!passwordEncoder.matches(request.oldPassword(), user.getPassword())) {
            throw new IllegalStateException("Mật khẩu cũ không chính xác");
        }

        user.setPassword(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
    }
    public Page<UserListResponse> getAllUser(UserListRequest userFilterRequest){
        try{
            Pageable paging = PageRequest.of(userFilterRequest.getPageNo(), userFilterRequest.getPageSize());
            if ((userFilterRequest.getSearchText() == null || userFilterRequest.getSearchText().isBlank())
                    && (userFilterRequest.getRole() == null || userFilterRequest.getRole().isBlank())
                    && (userFilterRequest.getStatus() == null || userFilterRequest.getStatus().isBlank())) {
                return userRepository.getAllUser(paging);
            }
            Page<UserListResponse> test = userRepository.filterUser(userFilterRequest.getSearchText() == null ? "" : userFilterRequest.getSearchText().toLowerCase(),
                    userFilterRequest.getRole(),
                    userFilterRequest.getStatus(),
                    paging);
            return userRepository.filterUser(userFilterRequest.getSearchText() == null ? "" : userFilterRequest.getSearchText().toLowerCase(),
                    userFilterRequest.getRole(),
                    userFilterRequest.getStatus(),
                    paging);
        } catch (Exception e){
            throw new IllegalStateException("Error !êêê! "+e.getMessage());
        }
    }
    public String disableAccount(String email){
        try {
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new IllegalStateException("Người dùng không tồn tại"));
            UserStatus newStatus = userStatusRepository.findById(3)
                    .orElseThrow(() -> new IllegalStateException("Trạng thái không tồn tại"));
            user.setStatus(newStatus);
            userRepository.save(user);
            return "Cập nhật thành công";
        } catch (Exception e){
            return "Lỗi cập nhật" + e.getMessage();
        }
    }
    public String enableAccount(String email){
        try {
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new IllegalStateException("Người dùng không tồn tại"));
            UserStatus newStatus = userStatusRepository.findById(2)
                    .orElseThrow(() -> new IllegalStateException("Trạng thái không tồn tại"));
            user.setStatus(newStatus);
            userRepository.save(user);
            return "Cập nhật thành công";
        } catch (Exception e){
            return "Lỗi cập nhật" + e.getMessage();
        }
    }
    public UserDetailDTO getUserDetail(String email){
        try{
            return userRepository.getUserDetail(email);
        } catch (Exception e){
            throw new IllegalStateException("Error !êêê! "+e.getMessage());
        }
    }
}
