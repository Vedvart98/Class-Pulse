package com.classannounce.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.base-url:http://localhost:5173}")
    private String baseUrl;

    public void sendMagicLink(String email, String token) {
        String magicLink = baseUrl + "/verify?token=" + token;

        if (Boolean.parseBoolean(System.getProperty("mail.dev-mode", "false"))) {
            log.info("=== DEV MODE: Magic Link ===");
            log.info("Email: {}", email);
            log.info("Link: {}", magicLink);
            log.info("========================");
            return;
        }

        // Production: send actual email
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setSubject("Your ClassAnnounce Login Link");
            message.setText(String.format(
                "Hello,\n\nClick the link below to log in to ClassAnnounce:\n%s\n\n" +
                "This link will expire in 15 minutes.\n\n" +
                "If you didn't request this, please ignore this email.",
                magicLink
            ));
            message.setFrom(getFromAddress());

            mailSender.send(message);
            log.info("Magic link sent to {}", email);
        } catch (Exception e) {
            log.error("Failed to send email to {}: {}", email, e.getMessage());
            throw new RuntimeException("Failed to send magic link email", e);
        }
    }

    private String getFromAddress() {
        return "noreply@classannounce.edu";
    }
}