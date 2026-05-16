// Sử dụng biến môi trường nếu có, nếu không thì dùng relative path (rỗng) khi chạy chung host
const API_BASE_URL = import.meta.env.VITE_API_URL !== undefined 
  ? import.meta.env.VITE_API_URL 
  : (import.meta.env.PROD ? "" : "https://dearbook-backend-docker.onrender.com");

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`API error ${response.status}: ${text}`);
  }

  const contentType = response.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    return response.json();
  }

  return response.text() as T;
}

export function apiGet<T>(path: string, options?: RequestInit) {
  return request<T>(path, options);
}

export function apiPost<T>(path: string, body: unknown, options?: RequestInit) {
  return request<T>(path, {
    ...options,
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });
}

export function apiPut<T>(path: string, body: unknown, options?: RequestInit) {
  return request<T>(path, {
    ...options,
    method: "PUT",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });
}

export function apiDelete<T>(path: string, options?: RequestInit) {
  return request<T>(path, {
    ...options,
    method: "DELETE",
  });
}
