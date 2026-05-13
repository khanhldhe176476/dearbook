package com.dearbook.backend.repository;
import com.dearbook.backend.entity.BookTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;
@Repository
public interface BookTemplateRepository extends JpaRepository<BookTemplate, UUID> {
    List<BookTemplate> findByActiveTrue();
}
