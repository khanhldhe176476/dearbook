package com.dearbook.backend.repository;
import com.dearbook.backend.entity.UserBookPage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;
@Repository
public interface UserBookPageRepository extends JpaRepository<UserBookPage, UUID> {
    List<UserBookPage> findByUserBookIdOrderByPageNumberAsc(UUID userBookId);
}
