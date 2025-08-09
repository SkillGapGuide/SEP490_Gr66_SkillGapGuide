package com.skillgapguide.sgg.Service;

import com.skillgapguide.sgg.Dto.ForgotPasswordRequest;
import com.skillgapguide.sgg.Dto.UserListRequest;
import com.skillgapguide.sgg.Dto.UserListResponse;
import com.skillgapguide.sgg.Entity.User;
import com.skillgapguide.sgg.Entity.VerificationToken;
import com.skillgapguide.sgg.Repository.UserRepository;
import com.skillgapguide.sgg.Repository.VerificationTokenRepository;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private VerificationTokenRepository verificationTokenRepository;

    @Mock
    private EmailService emailService;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;
    @Test
    void getAllUser_ReturnsAllUsers_WhenNoFiltersProvided() {
        UserListRequest request = new UserListRequest(null, null, null, 0, 10);
        Page<UserListResponse> mockPage = mock(Page.class);
        when(mockPage.getContent()).thenReturn(List.of());

        // 👇 Mock đúng method được gọi
        when(userRepository.getAllUser(any(Pageable.class))).thenReturn(mockPage);

        Page<UserListResponse> result = userService.getAllUser(request);

        assertNotNull(result);
        assertEquals(0, result.getContent().size());
    }
    @Test
    void getAllUser_ReturnsFilteredUsers_WhenFiltersProvided() {
        UserListRequest request = new UserListRequest("", "admin", "", 0, 10);
        Page<UserListResponse> mockPage = mock(Page.class);
        when(mockPage.getContent()).thenReturn(List.of());

        when(userRepository.filterUser(
                eq(""), eq("admin"), eq(""), any(Pageable.class)
        )).thenReturn(mockPage);

        Page<UserListResponse> result = userService.getAllUser(request);

        assertNotNull(result);
        assertEquals(0, result.getContent().size());
    }
    @Test
    void getAllUser_ThrowsException_WhenRepositoryFails() {
        UserListRequest request = new UserListRequest("searchText", "role", "status", 0, 10);
        when(userRepository.filterUser(anyString(), anyString(), anyString(), any(Pageable.class)))
                .thenThrow(new RuntimeException("Database error"));

        IllegalStateException exception = assertThrows(IllegalStateException.class, () -> userService.getAllUser(request));
        assertEquals("Error !êêê! Database error", exception.getMessage());
    }
    @Test
    void disableAccount_ThrowsException_WhenEmailIsEmpty() {
        IllegalStateException exception = assertThrows(IllegalStateException.class, () -> userService.disableAccount(""));
        assertEquals("Người dùng không tồn tại", exception.getMessage());
    }

    @Test
    void enableAccount_ThrowsException_WhenEmailIsEmpty() {
        IllegalStateException exception = assertThrows(IllegalStateException.class, () -> userService.enableAccount(""));
        assertEquals("Người dùng không tồn tại", exception.getMessage());
    }

    @Test
    void getUserDetail_ThrowsException_WhenEmailIsEmpty() {
        IllegalStateException exception = assertThrows(IllegalStateException.class, () -> userService.getUserDetail(""));
        assertEquals("Error !êêê! Người dùng không tồn tại", exception.getMessage());
    }
}
