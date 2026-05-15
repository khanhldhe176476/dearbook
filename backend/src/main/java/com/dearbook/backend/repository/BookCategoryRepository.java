package com.dearbook.backend.repository;

import com.dearbook.backend.entity.BookCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface BookCategoryRepository extends JpaRepository<BookCategory, UUID> {
    List<BookCategory> findByActiveTrueOrderBySortOrderAsc();
}
