package com.classannounce.config;

import com.classannounce.entity.Announcement;
import com.classannounce.entity.Priority;
import com.classannounce.entity.Role;
import com.classannounce.entity.User;
import com.classannounce.repository.AnnouncementRepository;
import com.classannounce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class DataInitializer {

    private final UserRepository userRepository;
    private final AnnouncementRepository announcementRepository;

    @Bean
    public CommandLineRunner initData() {
        return args -> {
            if (userRepository.count() == 0) {
                log.info("Initializing default data...");

                User admin = User.builder()
                        .email("admin@college.edu")
                        .name("Admin User")
                        .role(Role.ADMIN)
                        .build();
                userRepository.save(admin);

                log.info("Admin user created: admin@college.edu");
            }

            if (announcementRepository.count() == 0) {
                log.info("Creating sample announcements...");

                User admin = userRepository.findByEmail("admin@college.edu").orElse(null);
                if (admin == null) {
                    admin = userRepository.findAll().stream().findFirst().orElse(null);
                }

                if (admin != null) {
                    Announcement a1 = Announcement.builder()
                            .title("Welcome to ClassAnnounce!")
                            .content("Welcome to our class announcement system. You will receive all important updates here.")
                            .priority(Priority.HIGH)
                            .createdBy(admin)
                            .build();
                    announcementRepository.save(a1);

                    Announcement a2 = Announcement.builder()
                            .title("Assignment Deadline Extended")
                            .content("Due to the upcoming holidays, the assignment deadline has been extended by 3 days. New deadline is next Friday.")
                            .priority(Priority.HIGH)
                            .createdBy(admin)
                            .build();
                    announcementRepository.save(a2);

                    Announcement a3 = Announcement.builder()
                            .title("Library Hours During Exams")
                            .content("The library will be open 24/7 during the exam week. Special quiet zones will be available.")
                            .priority(Priority.MEDIUM)
                            .createdBy(admin)
                            .build();
                    announcementRepository.save(a3);

                    log.info("Sample announcements created");
                }
            }
        };
    }
}