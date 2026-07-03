package com.dearbook.backend.service;

import com.dearbook.backend.entity.PageView;
import com.dearbook.backend.repository.PageViewRepository;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.LinkedHashMap;

@Service
public class PageViewService {

    private static final ZoneId VN_ZONE = ZoneId.of("Asia/Ho_Chi_Minh");
    private static final DateTimeFormatter DAY_FORMATTER = DateTimeFormatter.ofPattern("dd/MM");

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
        OffsetDateTime startOfDay = OffsetDateTime.now(VN_ZONE)
                .toLocalDate()
                .atStartOfDay(VN_ZONE)
                .toOffsetDateTime();
        OffsetDateTime endOfDay = startOfDay.plusDays(1);
        return pageViewRepository.countByVisitedAtBetween(startOfDay, endOfDay);
    }

    /**
     * Số lượt xem theo ngày trong 7 ngày gần nhất.
     * Trả về list { day: "DD/MM", count: N }
     */
    public List<Map<String, Object>> getLast7Days() {
        OffsetDateTime since = OffsetDateTime.now(VN_ZONE).minusDays(6)
                .toLocalDate()
                .atStartOfDay(VN_ZONE)
                .toOffsetDateTime();

        Map<String, Long> countsByDay = new LinkedHashMap<>();
        for (int i = 0; i < 7; i++) {
            String day = since.plusDays(i).format(DAY_FORMATTER);
            countsByDay.put(day, 0L);
        }

        List<PageView> views = pageViewRepository.findByVisitedAtGreaterThanEqualOrderByVisitedAtAsc(since);
        for (PageView view : views) {
            if (view.getVisitedAt() == null) {
                continue;
            }

            String day = view.getVisitedAt()
                    .atZoneSameInstant(VN_ZONE)
                    .format(DAY_FORMATTER);
            countsByDay.computeIfPresent(day, (key, count) -> count + 1);
        }

        List<Map<String, Object>> result = new ArrayList<>();

        for (Map.Entry<String, Long> row : countsByDay.entrySet()) {
            Map<String, Object> entry = new LinkedHashMap<>();
            entry.put("day", row.getKey());
            entry.put("count", row.getValue());
            result.add(entry);
        }
        return result;
    }
}
