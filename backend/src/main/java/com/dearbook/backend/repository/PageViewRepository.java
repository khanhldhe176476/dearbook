package com.dearbook.backend.repository;

import com.dearbook.backend.entity.PageView;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface PageViewRepository extends JpaRepository<PageView, UUID> {

    /** Đếm tổng số lượt truy cập */
    long count();

    /** Đếm số lượt truy cập trong khoảng thời gian */
    long countByVisitedAtBetween(OffsetDateTime from, OffsetDateTime to);

    List<PageView> findByVisitedAtGreaterThanEqualOrderByVisitedAtAsc(OffsetDateTime since);
}
