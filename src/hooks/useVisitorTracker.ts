import { useEffect } from 'react';

const SESSION_KEY = 'dearbook_visit_tracked';
const RECORD_URL = '/api/admin/pageview/record';

/**
 * Hook tự động ghi nhận lượt truy cập website.
 * Chỉ gọi API 1 lần mỗi browser session (dùng sessionStorage để chống đếm trùng khi reload).
 */
export function useVisitorTracker() {
  useEffect(() => {
    // Chỉ track 1 lần trong cùng browser session
    if (sessionStorage.getItem(SESSION_KEY)) return;

    const page = window.location.pathname || '/';

    fetch(RECORD_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page }),
      // Không ném lỗi nếu backend chưa sẵn sàng
      keepalive: true,
    })
      .then((res) => {
        if (res.ok) {
          sessionStorage.setItem(SESSION_KEY, '1');
        }
      })
      .catch(() => {
        // Silently ignore — không ảnh hưởng trải nghiệm người dùng
      });
  }, []);
}
