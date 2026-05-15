package com.dearbook.backend.service;

import com.dearbook.backend.dto.BookCategoryResponse;
import com.dearbook.backend.entity.BookCategory;
import com.dearbook.backend.repository.BookCategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookCategoryService {

    private final BookCategoryRepository bookCategoryRepository;

    public BookCategoryService(BookCategoryRepository bookCategoryRepository) {
        this.bookCategoryRepository = bookCategoryRepository;
    }

    public List<BookCategoryResponse> getActiveCategories() {
        List<BookCategory> categories = bookCategoryRepository.findByActiveTrueOrderBySortOrderAsc();
        return categories.stream()
                .map(category -> new BookCategoryResponse(
                        category.getId(),
                        category.getName(),
                        category.getSlug(),
                        category.getDescription(),
                        category.getSortOrder()
                ))
                .collect(Collectors.toList());
    }
}
