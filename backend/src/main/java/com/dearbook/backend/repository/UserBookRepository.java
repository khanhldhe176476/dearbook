package com.dearbook.backend.repository;
import com.dearbook.backend.entity.UserBook;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
@Repository
public interface UserBookRepository extends JpaRepository<UserBook, UUID> {
    List<UserBook> findByUserIdOrderByUpdatedAtDesc(UUID userId);
    Optional<UserBook> findByUserIdAndClientBookId(UUID userId, String clientBookId);
}
