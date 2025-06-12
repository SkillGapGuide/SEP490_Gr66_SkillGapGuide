package com.skillgapguide.sgg.Security;

import com.skillgapguide.sgg.Filter.JWTAuthFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;


@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    // Bộ lọc JWT để xác thực người dùng
    private final JWTAuthFilter jwtAuthFilter;

    private final AuthenticationProvider authenticationProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Vô hiệu hóa CSRF vì dùng JWT
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // Không tạo session
                .authorizeHttpRequests(auth -> auth
                        // Các endpoint không cần xác thực
                        .requestMatchers("/api/auth/**","api/user/**").permitAll()
                        // Ví dụ phân quyền: Endpoint này chỉ dành cho ADMIN (roleId=2)
                        .requestMatchers("/api/admin/**").hasAuthority("ROLE_ADMIN")
                        // Tất cả các request khác đều cần xác thực
                        .anyRequest().authenticated()
                )
                .authenticationProvider(authenticationProvider)
                // Thêm bộ lọc JWT vào trước bộ lọc mặc định của Spring Security
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
