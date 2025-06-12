package com.skillgapguide.sgg.Controller;
import com.skillgapguide.sgg.Dto.AuthRequest;
import com.skillgapguide.sgg.Dto.AuthResponse;
import com.skillgapguide.sgg.Dto.RegisterRequest;
import com.skillgapguide.sgg.Entity.User;
import com.skillgapguide.sgg.Filter.JWTUtil;
import com.skillgapguide.sgg.Repository.UserRepository;
import com.skillgapguide.sgg.Response.EHttpStatus;
import com.skillgapguide.sgg.Response.Response;
import com.skillgapguide.sgg.Service.AuthService;
import com.skillgapguide.sgg.Service.UserService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private AuthService authService;
    @Value("${application.frontend-url}") // Thêm vào application.properties: application.frontend-url=http://localhost:3000
    private String frontendUrl;
    // Endpoint để đăng ký tài khoản mới
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
        String message = authService.register(request);
        return ResponseEntity.ok(message);
    }
    @GetMapping("/verify")
    public void verifyAccount(@RequestParam("token") String token, HttpServletResponse response) throws IOException {
        try {
            authService.verifyAccount(token);
            // Mã hóa message để an toàn khi đặt trên URL
            String message = URLEncoder.encode("Xác thực email thành công!", StandardCharsets.UTF_8);
            // Chuyển hướng về trang chủ của frontend với thông điệp thành công
            response.sendRedirect(frontendUrl + "/home?message=" + message);
        } catch (IllegalStateException e) {
            String errorMessage = URLEncoder.encode(e.getMessage(), StandardCharsets.UTF_8);
            // Chuyển hướng về trang lỗi hoặc trang đăng nhập với thông điệp lỗi
            response.sendRedirect(frontendUrl + "/login?error=" + errorMessage);
        }
    }

    // Endpoint để đăng nhập
    @PostMapping("/login")
    public Response<AuthResponse> login(@RequestBody AuthRequest request) {
        // Gọi service để xử lý logic đăng nhập và trả về token
        return new Response<>(EHttpStatus.OK, "Đăng nhập thành công", authService.login(request));
    }

}
