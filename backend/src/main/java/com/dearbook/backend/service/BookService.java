package com.dearbook.backend.service;
import com.dearbook.backend.dto.*;
import com.dearbook.backend.entity.*;
import com.dearbook.backend.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
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
        var user = profileRepo.findById(userId).orElseThrow();
        var template = templateRepo.findById(req.templateId()).orElseThrow();
        UserBook book = new UserBook();
        book.setUser(user);
        book.setTemplate(template);
        book.setTitle(req.title());
        var savedBook = bookRepo.save(book);
        var tPages = templatePageRepo.findByTemplateIdOrderByPageNumberAsc(template.getId());
        for (var tp : tPages) {
            UserBookPage up = new UserBookPage();
            up.setUserBook(savedBook);
            up.setTemplatePage(tp);
            up.setPageNumber(tp.getPageNumber());
            up.setUserContent(tp.getDefaultContent());
            pageRepo.save(up);
        }
        return new UserBookResponse(savedBook.getId(), savedBook.getTitle(), savedBook.getStatus(), savedBook.getUpdatedAt());
    }
    public List<UserBookResponse> getMyBooks(UUID userId) {
        return bookRepo.findByUserIdOrderByUpdatedAtDesc(userId).stream()
            .map(b -> new UserBookResponse(b.getId(), b.getTitle(), b.getStatus(), b.getUpdatedAt()))
            .toList();
    }
    @Transactional
    public void updatePage(UUID bookId, UUID pageId, UserBookPageRequest req) {
        var page = pageRepo.findById(pageId).orElseThrow();
        page.setUserContent(req.userContent());
        pageRepo.save(page);
    }
}
