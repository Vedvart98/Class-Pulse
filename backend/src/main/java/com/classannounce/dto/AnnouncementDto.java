package com.classannounce.dto;

import com.classannounce.entity.Priority;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnnouncementDto {
    private Long id;
    private String title;
    private String content;
    private Priority priority;
    private String createdByName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}