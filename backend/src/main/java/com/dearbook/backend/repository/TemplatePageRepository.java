package com.dearbook.backend.repository;
import com.dearbook.backend.entity.TemplatePage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;
@Repository
public interface TemplatePageRepository extends JpaRepository<TemplatePage, UUID> {
    List<TemplatePage> findByTemplateIdOrderByPageNumberAsc(UUID templateId);
}
