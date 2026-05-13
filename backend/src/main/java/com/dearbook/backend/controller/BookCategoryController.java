package com.dearbook.backend.controller;

import com.dearbook.backend.dto.BookCategoryResponse;
import com.dearbook.backend.service.BookCategoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/public/categories")
public class BookCategoryController {

    private final BookCategoryService bookCategoryService;

    public BookCategoryController(BookCategoryService bookCategoryService) {
        this.bookCategoryService = bookCategoryService;
    }

    @GetMapping
    public ResponseEntity<List<BookCategoryResponse>> getActiveCategories() {
        return ResponseEntity.ok(bookCategoryService.getActiveCategories());
    }
}
