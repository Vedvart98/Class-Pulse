package com.classannounce.service;

import com.classannounce.dto.*;
import com.classannounce.entity.*;
import com.classannounce.repository.AnnouncementRepository;
import com.classannounce.repository.MagicTokenRepository;
import com.classannounce.repository.UserRepository;
import com.classannounce.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final MagicTokenRepository magicTokenRepository;
    private final JwtService jwtService;
    private final EmailService emailService;

    @Transactional
    public void requestMagicLink(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email not registered"));

        String token = UUID.randomUUID().toString();
        
        MagicToken magicToken = MagicToken.builder()
                .token(token)
                .user(user)
                .expiresAt(LocalDateTime.now().plusMinutes(15))
                .build();
        
        magicTokenRepository.save(magicToken);
        
        emailService.sendMagicLink(email, token);
    }

    @Transactional
    public AuthResponse verifyToken(String token) {
        MagicToken magicToken = magicTokenRepository.findByTokenAndUsedAtIsNull(token)
                .orElseThrow(() -> new RuntimeException("Invalid or expired token"));

        if (!magicToken.isValid()) {
            throw new RuntimeException("Token has expired");
        }

        // Mark token as used
        magicToken.setUsedAt(LocalDateTime.now());
        magicTokenRepository.save(magicToken);

        // Update user's last login
        User user = magicToken.getUser();
        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        // Generate JWT
        String jwtToken = jwtService.generateToken(user);

        return AuthResponse.builder()
                .token(jwtToken)
                .email(user.getEmail())
                .name(user.getName())
                .role(user.getRole().name())
                .userId(user.getId())
                .build();
    }

    public UserDto getCurrentUser(User user) {
        return UserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .role(user.getRole().name())
                .build();
    }

    public User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}