package com.dearbook.backend.service;
import com.dearbook.backend.dto.*;
import com.dearbook.backend.entity.*;
import com.dearbook.backend.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
@Service
public class BookService {
    private final UserBookRepository bookRepo;
    private final UserBookPageRepository pageRepo;
    private final BookTemplateRepository templateRepo;
    private final TemplatePageRepository templatePageRepo;
    private final ProfileRepository profileRepo;
    public BookService(UserBookRepository bookRepo, UserBookPageRepository pageRepo, BookTemplateRepository templateRepo, TemplatePageRepository templatePageRepo, ProfileRepository profileRepo) {
        this.bookRepo = bookRepo;
        this.pageRepo = pageRepo;
        this.templateRepo = templateRepo;
        this.templatePageRepo = templatePageRepo;
        this.profileRepo = profileRepo;
    }
    @Transactional
    public UserBookResponse createBook(UUID userId, UserBookRequest req) {
        var user = getOrCreateProfile(userId);
        var template = parseUuid(req.templateId()).flatMap(templateRepo::findById).orElse(null);
        UserBook book = new UserBook();
        book.setUser(user);
        book.setTemplate(template);
        book.setClientBookId(req.clientBookId());
        book.setClientTemplateId(req.templateId());
        book.setTitle(req.title());
        var savedBook = bookRepo.save(book);
        if (template != null) {
            var tPages = templatePageRepo.findByTemplateIdOrderByPageNumberAsc(template.getId());
            for (var tp : tPages) {
                UserBookPage up = new UserBookPage();
                up.setUserBook(savedBook);
                up.setTemplatePage(tp);
                up.setPageNumber(tp.getPageNumber());
                up.setUserContent(tp.getDefaultContent());
                pageRepo.save(up);
            }
        }
        return toResponse(savedBook);
    }
    public List<UserBookResponse> getMyBooks(UUID userId) {
        return bookRepo.findByUserIdOrderByUpdatedAtDesc(userId).stream()
            .map(this::toResponse)
            .toList();
    }
    @Transactional
    public UserBookResponse saveSnapshot(UUID userId, String clientBookId, UserBookSnapshotRequest req) {
        var user = getOrCreateProfile(userId);
        var book = bookRepo.findByUserIdAndClientBookId(userId, clientBookId).orElseGet(UserBook::new);
        book.setUser(user);
        book.setClientBookId(clientBookId);
        book.setClientTemplateId(req.templateId());
        book.setTemplate(parseUuid(req.templateId()).flatMap(templateRepo::findById).orElse(null));
        book.setTitle(req.title() == null || req.title().isBlank() ? "Sách mới" : req.title());
        book.setStatus(req.status() == null || req.status().isBlank() ? "DRAFT" : req.status().toUpperCase());
        book.setBookData(req.bookData());
        return toResponse(bookRepo.save(book));
    }
    @Transactional
    public void updatePage(UUID bookId, UUID pageId, UserBookPageRequest req) {
        var page = pageRepo.findById(pageId).orElseThrow();
        page.setUserContent(req.userContent());
        pageRepo.save(page);
    }

    private UserBookResponse toResponse(UserBook book) {
        var templateId = book.getClientTemplateId();
        if ((templateId == null || templateId.isBlank()) && book.getTemplate() != null) {
            templateId = book.getTemplate().getId().toString();
        }
        return new UserBookResponse(
            book.getId(),
            book.getClientBookId(),
            templateId,
            book.getTitle(),
            book.getStatus(),
            book.getCreatedAt(),
            book.getUpdatedAt(),
            book.getBookData()
        );
    }

    private Profile getOrCreateProfile(UUID userId) {
        return profileRepo.findById(userId).orElseGet(() -> {
            Profile profile = new Profile();
            profile.setId(userId);
            profile.setEmail(userId + "@local.dearbook");
            profile.setFullName("DearBook User");
            return profileRepo.save(profile);
        });
    }

    private Optional<UUID> parseUuid(String value) {
        if (value == null || value.isBlank()) return Optional.empty();
        try {
            return Optional.of(UUID.fromString(value));
        } catch (IllegalArgumentException ignored) {
            return Optional.empty();
        }
    }
}
