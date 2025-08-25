package com.skillgapguide.sgg.Service;

import com.skillgapguide.sgg.Dto.AuthRequest;
import com.skillgapguide.sgg.Dto.AuthResponse;
import com.skillgapguide.sgg.Dto.GoogleLoginRequest;
import com.skillgapguide.sgg.Dto.RegisterRequest;
import com.skillgapguide.sgg.Entity.User;
import com.skillgapguide.sgg.Entity.UserStatus;
import com.skillgapguide.sgg.Entity.VerificationToken;
import com.skillgapguide.sgg.Filter.JWTUtil;
import com.skillgapguide.sgg.Repository.UserRepository;
import com.skillgapguide.sgg.Repository.UserStatusRepository;
import com.skillgapguide.sgg.Repository.VerificationTokenRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JWTUtil jwtUtil;

    @Mock
    private VerificationTokenRepository tokenRepository;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private UserStatusRepository userStatusRepository;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private AuthService authService;

    @Test
    void registerThrowsExceptionWhenEmailExists() {
        RegisterRequest request = new RegisterRequest("test@example.com", "password", "Test User", "1234567890");
        when(userRepository.findByEmail(request.email())).thenReturn(Optional.of(new User()));

        assertThrows(IllegalStateException.class, () -> authService.register(request));
    }

    @Test
    void registerCreatesUserAndSendsVerificationEmail() {
        RegisterRequest request = new RegisterRequest("test@example.com", "password", "Test User", "1234567890");
        UserStatus notVerifiedStatus = new UserStatus();
        notVerifiedStatus.setName("NOT_VERIFIED");
        User savedUser = new User();
        savedUser.setEmail(request.email());
        savedUser.setFullName(request.fullName());
        savedUser.setPhone(request.phone());
        savedUser.setRoleId(4);
        savedUser.setSubscriptionId(1);
        savedUser.setProvider(User.Provider.LOCAL);
        savedUser.setStatus(notVerifiedStatus);

        when(userRepository.findByEmail(request.email())).thenReturn(Optional.empty());
        when(userStatusRepository.findByName("NOT_VERIFIED")).thenReturn(Optional.of(notVerifiedStatus));
        when(passwordEncoder.encode(request.password())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(savedUser);
        when(tokenRepository.save(any(VerificationToken.class))).thenReturn(new VerificationToken());

        String result = authService.register(request);

        assertEquals("Đăng ký thành công. Vui lòng kiểm tra email để xác thực tài khoản.", result);
        verify(userRepository).save(any(User.class));
        verify(tokenRepository).save(any(VerificationToken.class));
        verify(emailService).sendMail(eq(request.email()), anyString(), anyString());
    }

    @Test
    void verifyAccountThrowsExceptionWhenTokenInvalid() {
        String token = UUID.randomUUID().toString();
        when(tokenRepository.findByToken(token)).thenReturn(Optional.empty());

        assertThrows(IllegalStateException.class, () -> authService.verifyAccount(token));
    }

    @Test
    void verifyAccountThrowsExceptionWhenTokenExpired() {
        String token = UUID.randomUUID().toString();
        VerificationToken verificationToken = new VerificationToken();
        verificationToken.setExpiryDate(LocalDateTime.now().minusMinutes(1));

        when(tokenRepository.findByToken(token)).thenReturn(Optional.of(verificationToken));

        assertThrows(IllegalStateException.class, () -> authService.verifyAccount(token));
        verify(tokenRepository).delete(verificationToken);
    }

    @Test
    void verifyAccountUpdatesUserStatusSuccessfully() {
        String token = UUID.randomUUID().toString();
        User user = new User();
        UserStatus verifiedStatus = new UserStatus();
        verifiedStatus.setName("VERIFIED");
        VerificationToken verificationToken = new VerificationToken();
        verificationToken.setUser(user);
        verificationToken.setExpiryDate(LocalDateTime.now().plusMinutes(10));

        when(tokenRepository.findByToken(token)).thenReturn(Optional.of(verificationToken));
        when(userStatusRepository.findByName("VERIFIED")).thenReturn(Optional.of(verifiedStatus));
        when(userRepository.save(any(User.class))).thenReturn(user);

        authService.verifyAccount(token);

        assertEquals("VERIFIED", user.getStatus().getName());
        verify(userRepository).save(user);
        verify(tokenRepository).delete(verificationToken);
    }

    @Test
    void loginThrowsExceptionWhenUserNotFound() {
        AuthRequest request = new AuthRequest("test@example.com", "password");
        when(userRepository.findByEmail(request.email())).thenReturn(Optional.empty());

        assertThrows(IllegalStateException.class, () -> authService.login(request));
    }

    @Test
    void loginThrowsExceptionWhenUserNotVerified() {
        AuthRequest request = new AuthRequest("test@example.com", "password");
        User user = new User();
        UserStatus notVerifiedStatus = new UserStatus();
        notVerifiedStatus.setName("NOT_VERIFIED");
        user.setStatus(notVerifiedStatus);
        when(userRepository.findByEmail(request.email())).thenReturn(Optional.of(user));

        assertThrows(IllegalStateException.class, () -> authService.login(request));
    }

    @Test
    void loginReturnsTokenWhenSuccessful() {
        AuthRequest request = new AuthRequest("test@example.com", "password");
        User user = new User();
        user.setEmail(request.email());
        user.setFullName("testuser");
        UserStatus verifiedStatus = new UserStatus();
        verifiedStatus.setName("VERIFIED");
        user.setStatus(verifiedStatus);
        String jwtToken = "jwtToken";

        when(userRepository.findByEmail(request.email())).thenReturn(Optional.of(user));
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(new UsernamePasswordAuthenticationToken(request.email(), request.password()));
        when(jwtUtil.generateToken(user.getUsername())).thenReturn(jwtToken);

        AuthResponse result = authService.login(request);

        assertNotNull(result);
        assertEquals(jwtToken, result.getToken());
        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(jwtUtil).generateToken(user.getUsername());
    }

    @Test
    void processGoogleLoginThrowsExceptionWhenEmailEmpty() {
        GoogleLoginRequest request = new GoogleLoginRequest("", "Test User", "avatar.png");

        assertThrows(ResponseStatusException.class, () -> authService.processGoogleLogin(request));
    }

    @Test
    void processGoogleLoginThrowsExceptionWhenEmailExistsWithDifferentProvider() {
        GoogleLoginRequest request = new GoogleLoginRequest("test@example.com", "Test User", "avatar.png");
        User existingUser = new User();
        existingUser.setProvider(User.Provider.LOCAL);
        when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.of(existingUser));

        assertThrows(ResponseStatusException.class, () -> authService.processGoogleLogin(request));
    }

    @Test
    void processGoogleLoginReturnsTokenForExistingGoogleUser() {
        GoogleLoginRequest request = new GoogleLoginRequest("test@example.com", "Test User", "avatar.png");
        User existingUser = new User();
        existingUser.setFullName("testuser");
        existingUser.setProvider(User.Provider.GOOGLE);
        String jwtToken = "jwtToken";

        when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.of(existingUser));
        when(jwtUtil.generateToken(existingUser.getUsername())).thenReturn(jwtToken);

        AuthResponse result = authService.processGoogleLogin(request);

        assertNotNull(result);
        assertEquals(jwtToken, result.getToken());
        verify(jwtUtil).generateToken(existingUser.getUsername());
    }

    @Test
    void processGoogleLoginCreatesNewGoogleUserSuccessfully() {
        GoogleLoginRequest request = new GoogleLoginRequest("test@example.com", "Test User", "avatar.png");
        UserStatus verifiedStatus = new UserStatus();
        verifiedStatus.setName("VERIFIED");
        User savedUser = new User();
        savedUser.setEmail(request.getEmail());
        savedUser.setFullName("testuser");
        savedUser.setProvider(User.Provider.GOOGLE);
        savedUser.setStatus(verifiedStatus);
        String jwtToken = "jwtToken";

        when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.empty());
        when(userStatusRepository.findByName("VERIFIED")).thenReturn(Optional.of(verifiedStatus));
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(savedUser);
        when(jwtUtil.generateToken(savedUser.getUsername())).thenReturn(jwtToken);

        AuthResponse result = authService.processGoogleLogin(request);

        assertNotNull(result);
        assertEquals(jwtToken, result.getToken());
        verify(userRepository).save(any(User.class));
        verify(jwtUtil).generateToken(savedUser.getUsername());
    }
}