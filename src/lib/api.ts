export const API_BASE_URL =
  import.meta.env.VITE_API_URL !== undefined && import.meta.env.VITE_API_URL !== ""
    ? import.meta.env.VITE_API_URL
    : "";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${path}`;

  let response: Response;
  try {
    // Merge headers: default Content-Type + caller's headers (caller overrides defaults)
    const { headers: callerHeaders, ...restOptions } = options || {};
    const mergedHeaders = {
      "Content-Type": "application/json",
      ...(callerHeaders || {}),
    };
    response = await fetch(url, {
      ...restOptions,
      headers: mergedHeaders,
    });
  } catch (networkErr: any) {
    // "Failed to fetch" = backend unreachable
    if (networkErr?.message === 'Failed to fetch' || networkErr?.name === 'TypeError') {
      throw new Error(
        `Không thể kết nối tới backend (${url}).\n` +
        'Hãy đảm bảo backend Spring Boot đang chạy ở port 8080.\n' +
        'Chạy lệnh: cd backend && .\\mvnw.cmd spring-boot:run'
      );
    }
    throw networkErr;
  }

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
  });
}

export function apiPut<T>(path: string, body: unknown, options?: RequestInit) {
  return request<T>(path, {
    ...options,
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export function apiDelete<T>(path: string, options?: RequestInit) {
  return request<T>(path, {
    ...options,
    method: "DELETE",
  });
}

export async function apiPostMultipart<T>(path: string, formData: FormData, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  let response: Response;
  try {
    const { headers: callerHeaders, ...restOptions } = options || {};
    response = await fetch(url, {
      ...restOptions,
      method: "POST",
      headers: {
        ...(callerHeaders || {}),
      },
      body: formData,
    });
  } catch (networkErr: any) {
    if (networkErr?.message === 'Failed to fetch' || networkErr?.name === 'TypeError') {
      throw new Error(
        `Không thể kết nối tới backend (${url}).\n` +
        'Hãy đảm bảo backend Spring Boot đang chạy ở port 8080.\n' +
        'Chạy lệnh: cd backend && .\\mvnw.cmd spring-boot:run'
      );
    }
    throw networkErr;
  }

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

