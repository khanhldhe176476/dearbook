package com.dearbook.backend.controller;
import com.dearbook.backend.dto.*;
import com.dearbook.backend.service.BookService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;
@RestController
@RequestMapping("/api/books")
public class BookController {
    private final BookService service;
    public BookController(BookService service) { this.service = service; }
    @PostMapping
    public UserBookResponse create(@RequestHeader("X-User-Id") UUID userId, @RequestBody UserBookRequest req) {
        return service.createBook(userId, req);
    }
    @GetMapping("/my")
    public List<UserBookResponse> getMy(@RequestHeader("X-User-Id") UUID userId) {
        return service.getMyBooks(userId);
    }
    @PutMapping("/{bookId}/pages/{pageId}")
    public void updatePage(@PathVariable UUID bookId, @PathVariable UUID pageId, @RequestBody UserBookPageRequest req) {
        service.updatePage(bookId, pageId, req);
    }
}
