package com.skillgapguide.sgg.Service;

import com.skillgapguide.sgg.Dto.StaticPageDTO;
import com.skillgapguide.sgg.Entity.User;
import com.skillgapguide.sgg.Repository.StaticPageRepository;
import com.skillgapguide.sgg.Repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class StaticPageServiceTest {

    @Mock
    private StaticPageRepository staticPageRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private SecurityContext securityContext;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private StaticPageService staticPageService;

    @Test
    void getContentReturnsList() {
        String name = "page";
        List<StaticPageDTO> dtos = Arrays.asList(new StaticPageDTO());
        when(staticPageRepository.findByName(name)).thenReturn(dtos);

        List<StaticPageDTO> result = staticPageService.getContent(name);

        assertEquals(1, result.size());
        verify(staticPageRepository).findByName(name);
    }

    @Test
    void updateContentSuccess() {
        StaticPageDTO dto = new StaticPageDTO();
        dto.setTitle("title");
        dto.setContent("content");
        String name = "page";
        String email = "test@example.com";
        User user = new User();
        user.setUserId(1);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn(email);
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(staticPageRepository.existsByNameAndTitle(name, dto.getTitle())).thenReturn(true);

        String result = staticPageService.updateContent(dto, name);

        assertEquals("Cập nhật thành công", result);
        verify(staticPageRepository).updateByNameAndTitle(name, dto.getTitle(), dto.getContent(), 1);
    }

    @Test
    void updateContentThrowsExceptionWhenInvalid() {
        StaticPageDTO dto = new StaticPageDTO();
        dto.setTitle("title");
        String name = "page";
        String email = "test@example.com";
        User user = new User();
        user.setUserId(1);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn(email);
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(staticPageRepository.existsByNameAndTitle(name, dto.getTitle())).thenReturn(false);

        assertThrows(IllegalStateException.class, () -> staticPageService.updateContent(dto, name));
    }
}