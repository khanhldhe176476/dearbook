package com.dearbook.backend.service;

import com.dearbook.backend.entity.PageView;
import com.dearbook.backend.repository.PageViewRepository;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.LinkedHashMap;

@Service
public class PageViewService {

    private final PageViewRepository pageViewRepository;

    public PageViewService(PageViewRepository pageViewRepository) {
        this.pageViewRepository = pageViewRepository;
    }

    /**
     * Ghi nhận một lượt truy cập trang mới.
     */
    public void recordView(String page, String ipAddress, String userAgent) {
        PageView pv = new PageView();
        pv.setPage(page != null ? page : "/");
        pv.setIpAddress(ipAddress);
        if (userAgent != null && userAgent.length() > 512) {
            pv.setUserAgent(userAgent.substring(0, 512));
        } else {
            pv.setUserAgent(userAgent);
        }
        pageViewRepository.save(pv);
    }

    /**
     * Tổng số lượt truy cập.
     */
    public long getTotalCount() {
        return pageViewRepository.count();
    }

    /**
     * Số lượt truy cập hôm nay (theo giờ Việt Nam).
     */
    public long getTodayCount() {
        ZoneId vn = ZoneId.of("Asia/Ho_Chi_Minh");
        OffsetDateTime startOfDay = OffsetDateTime.now(vn)
                .toLocalDate()
                .atStartOfDay(vn)
                .toOffsetDateTime();
        OffsetDateTime endOfDay = startOfDay.plusDays(1);
        return pageViewRepository.countByVisitedAtBetween(startOfDay, endOfDay);
    }

    /**
     * Số lượt xem theo ngày trong 7 ngày gần nhất.
     * Trả về list { day: "DD/MM", count: N }
     */
    public List<Map<String, Object>> getLast7Days() {
        ZoneId vn = ZoneId.of("Asia/Ho_Chi_Minh");
        OffsetDateTime since = OffsetDateTime.now(vn).minusDays(6)
                .toLocalDate()
                .atStartOfDay(vn)
                .toOffsetDateTime();

        List<Object[]> raw = pageViewRepository.countByDaySince(since);
        List<Map<String, Object>> result = new ArrayList<>();

        for (Object[] row : raw) {
            Map<String, Object> entry = new LinkedHashMap<>();
            entry.put("day", row[0] != null ? row[0].toString() : "");
            entry.put("count", row[1] != null ? ((Number) row[1]).longValue() : 0L);
            result.add(entry);
        }
        return result;
    }
}
