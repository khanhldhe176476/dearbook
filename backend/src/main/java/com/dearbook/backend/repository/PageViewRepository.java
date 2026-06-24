package com.dearbook.backend.repository;

import com.dearbook.backend.entity.PageView;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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

    /**
     * Lấy số lượt truy cập theo từng ngày trong 7 ngày gần nhất.
     * Trả về danh sách Object[]{date_string, count}
     */
    @Query(value = """
            SELECT TO_CHAR(DATE_TRUNC('day', visited_at AT TIME ZONE 'Asia/Ho_Chi_Minh'), 'DD/MM') AS day,
                   COUNT(*) AS cnt
            FROM page_views
            WHERE visited_at >= :since
            GROUP BY DATE_TRUNC('day', visited_at AT TIME ZONE 'Asia/Ho_Chi_Minh')
            ORDER BY DATE_TRUNC('day', visited_at AT TIME ZONE 'Asia/Ho_Chi_Minh')
            """, nativeQuery = true)
    List<Object[]> countByDaySince(@Param("since") OffsetDateTime since);
}
