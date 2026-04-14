package com.classannounce.repository;

import com.classannounce.entity.Announcement;
import com.classannounce.entity.Priority;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {
    @Query("SELECT a FROM Announcement a ORDER BY " +
           "CASE a.priority WHEN 'HIGH' THEN 1 WHEN 'MEDIUM' THEN 2 WHEN 'LOW' THEN 3 END, " +
           "a.createdAt DESC")
    Page<Announcement> findAllOrderByPriorityAndDate(Pageable pageable);

    List<Announcement> findAllByOrderByCreatedAtDesc();
}