package com.dearbook.backend.repository;

import com.dearbook.backend.entity.UserUpload;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface UserUploadRepository extends JpaRepository<UserUpload, UUID> {
    List<UserUpload> findByUserIdOrderByCreatedAtDesc(UUID userId);
}
