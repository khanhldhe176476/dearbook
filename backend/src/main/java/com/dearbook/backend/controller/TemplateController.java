package com.dearbook.backend.controller;
import com.dearbook.backend.dto.*;
import com.dearbook.backend.service.TemplateService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;
@RestController
@RequestMapping("/api/public")
public class TemplateController {
    private final TemplateService service;
    public TemplateController(TemplateService service) { this.service = service; }
    @GetMapping("/templates")
    public List<TemplateResponse> getTemplates() { return service.getAllTemplates(); }
    @GetMapping("/templates/{id}")
    public TemplateResponse getTemplate(@PathVariable UUID id) { return service.getTemplate(id); }
    @GetMapping("/templates/{id}/pages")
    public List<TemplatePageResponse> getPages(@PathVariable UUID id) { return service.getTemplatePages(id); }
}
