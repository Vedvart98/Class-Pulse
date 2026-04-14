package com.classannounce.controller;

import com.classannounce.dto.*;
import com.classannounce.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/request-magic-link")
    public ResponseEntity<Map<String, String>> requestMagicLink(
            @Valid @RequestBody MagicLinkRequest request) {
        authService.requestMagicLink(request.getEmail());
        return ResponseEntity.ok(Map.of(
            "message", "Magic link sent to your email"
        ));
    }

    @PostMapping("/verify-token")
    public ResponseEntity<AuthResponse> verifyToken(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        AuthResponse response = authService.verifyToken(token);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser() {
        var auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || !(auth.getPrincipal() instanceof com.classannounce.entity.User)) {
            return ResponseEntity.status(401).build();
        }
        com.classannounce.entity.User user = (com.classannounce.entity.User) auth.getPrincipal();
        return ResponseEntity.ok(authService.getCurrentUser(user));
    }
}