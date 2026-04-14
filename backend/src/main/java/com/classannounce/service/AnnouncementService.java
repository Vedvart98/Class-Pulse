package com.classannounce.service;

import com.classannounce.dto.AnnouncementDto;
import com.classannounce.dto.CreateAnnouncementRequest;
import com.classannounce.entity.Announcement;
import com.classannounce.entity.Priority;
import com.classannounce.entity.User;
import com.classannounce.repository.AnnouncementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnnouncementService {
    private final AnnouncementRepository announcementRepository;

    public List<AnnouncementDto> getAllAnnouncements() {
        return announcementRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public Page<AnnouncementDto> getAnnouncementsPaginated(int page, int size) {
        Page<Announcement> announcements = announcementRepository
                .findAllOrderByPriorityAndDate(PageRequest.of(page, size));
        return announcements.map(this::toDto);
    }

    public AnnouncementDto getAnnouncementById(Long id) {
        Announcement announcement = announcementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Announcement not found"));
        return toDto(announcement);
    }

    @Transactional
    public AnnouncementDto createAnnouncement(CreateAnnouncementRequest request, User admin) {
        Announcement announcement = Announcement.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .priority(Priority.valueOf(request.getPriority()))
                .createdBy(admin)
                .build();

        Announcement saved = announcementRepository.save(announcement);
        return toDto(saved);
    }

    @Transactional
    public AnnouncementDto updateAnnouncement(Long id, CreateAnnouncementRequest request, User admin) {
        Announcement announcement = announcementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Announcement not found"));

        announcement.setTitle(request.getTitle());
        announcement.setContent(request.getContent());
        announcement.setPriority(Priority.valueOf(request.getPriority()));

        Announcement saved = announcementRepository.save(announcement);
        return toDto(saved);
    }

    @Transactional
    public void deleteAnnouncement(Long id) {
        if (!announcementRepository.existsById(id)) {
            throw new RuntimeException("Announcement not found");
        }
        announcementRepository.deleteById(id);
    }

    private AnnouncementDto toDto(Announcement announcement) {
        return AnnouncementDto.builder()
                .id(announcement.getId())
                .title(announcement.getTitle())
                .content(announcement.getContent())
                .priority(announcement.getPriority())
                .createdByName(announcement.getCreatedBy().getName())
                .createdAt(announcement.getCreatedAt())
                .updatedAt(announcement.getUpdatedAt())
                .build();
    }
}