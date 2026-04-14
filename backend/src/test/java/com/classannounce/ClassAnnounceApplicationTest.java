package com.classannounce;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
class ClassAnnounceApplicationTest {

    @Test
    void contextLoads() {
    }

    @Test
    void applicationStarts() {
        assertNotNull(ClassAnnounceApplication.class);
        assertTrue(ClassAnnounceApplication.class.isAnnotationPresent(
            org.springframework.boot.autoconfigure.SpringBootApplication.class
        ));
    }
}
