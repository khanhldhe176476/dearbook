package com.dearbook.backend.service;
import com.dearbook.backend.dto.*;
import com.dearbook.backend.repository.*;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;
@Service
public class TemplateService {
    private final BookTemplateRepository templateRepo;
    private final TemplatePageRepository pageRepo;
    public TemplateService(BookTemplateRepository templateRepo, TemplatePageRepository pageRepo) {
        this.templateRepo = templateRepo;
        this.pageRepo = pageRepo;
    }
    public List<TemplateResponse> getAllTemplates() {
        return templateRepo.findByActiveTrue().stream()
            .map(t -> new TemplateResponse(t.getId(), t.getName(), t.getDescription(), t.getCoverImageUrl(), t.getPrice()))
            .toList();
    }
    public TemplateResponse getTemplate(UUID id) {
        var t = templateRepo.findById(id).orElseThrow();
        return new TemplateResponse(t.getId(), t.getName(), t.getDescription(), t.getCoverImageUrl(), t.getPrice());
    }
    public List<TemplatePageResponse> getTemplatePages(UUID templateId) {
        return pageRepo.findByTemplateIdOrderByPageNumberAsc(templateId).stream()
            .map(p -> new TemplatePageResponse(p.getId(), p.getPageNumber(), p.getLayoutType(), p.getDefaultContent()))
            .toList();
    }
}
