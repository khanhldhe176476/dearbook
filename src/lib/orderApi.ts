import { apiGet, apiPost, apiPostMultipart, API_BASE_URL } from './api';

const BACKEND_TOKEN_KEY = 'dearbook_backend_token';
const BACKEND_TOKEN_USER_ID = 'dearbook_backend_token_user_id';

export interface OrderRequest {
  userBookId: string;
  customerName?: string;
  recipientName?: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  district?: string;
  note?: string;
  collectionName?: string;
  productType?: string;
  productSize?: string;
  quantity?: number;
  customPages?: number;
  paymentMethod: string;
  designPages?: any[];
  pdfFileName?: string | null;
  pdfFileData?: string | null;
}

export interface OrderResponse {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

/**
 * Get or create a backend JWT token for the given userId.
 * The token is cached in localStorage to avoid unnecessary requests.
 * After Supabase login, the frontend must call this to obtain a backend token
 * before making any order API calls.
 */
export async function ensureBackendToken(userId: string): Promise<string> {
  // Return cached token if it matches the current userId
  const cached = localStorage.getItem(BACKEND_TOKEN_KEY);
  const cachedUserId = localStorage.getItem(BACKEND_TOKEN_USER_ID);
  if (cached && cachedUserId === userId) {
    return cached;
  }

  // Request a new backend JWT
  const res = await fetch(`${API_BASE_URL}/api/v1/auth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to get backend token: ${res.status} ${text}`);
  }

  const data = await res.json();
  const token = data.token;
  if (!token) {
    throw new Error('Backend did not return a token');
  }

  localStorage.setItem(BACKEND_TOKEN_KEY, token);
  localStorage.setItem(BACKEND_TOKEN_USER_ID, userId);
  return token;
}

/** Clear cached backend token (e.g., on logout) */
export function clearBackendToken() {
  localStorage.removeItem(BACKEND_TOKEN_KEY);
  localStorage.removeItem(BACKEND_TOKEN_USER_ID);
}

/** Build headers with Authorization Bearer token */
async function authHeaders(userId: string): Promise<Record<string, string>> {
  const token = await ensureBackendToken(userId);
  return { Authorization: `Bearer ${token}` };
}

export const orderApi = {
  getMyOrders: async (userId: string) =>
    apiGet<OrderResponse[]>('/api/orders/my', { headers: await authHeaders(userId) }),

  placeOrder: async (userId: string, data: OrderRequest) =>
    apiPost<OrderResponse>('/api/orders', data, { headers: await authHeaders(userId) }),

  uploadPdf: async (orderId: string, userId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const headers = await authHeaders(userId);
    return apiPostMultipart<string>(`/api/orders/${orderId}/pdf`, formData, { headers });
  },

  uploadPdfWithProgress: async (
    orderId: string, 
    userId: string, 
    file: File, 
    onProgress: (percent: number) => void
  ): Promise<string> => {
    const token = await ensureBackendToken(userId);
    const url = `${API_BASE_URL}/api/orders/${orderId}/pdf`;
    
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', url, true);
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(percent);
        }
      };
      
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr.responseText);
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}: ${xhr.responseText}`));
        }
      };
      
      xhr.onerror = () => reject(new Error('Network error occurred during upload.'));
      
      const formData = new FormData();
      formData.append('file', file);
      xhr.send(formData);
    });
  },

  uploadPdfTempWithProgress: async (
    userId: string, 
    file: File, 
    onProgress: (percent: number) => void
  ): Promise<{ filePath: string; fileName: string }> => {
    const token = await ensureBackendToken(userId);
    const url = `${API_BASE_URL}/api/orders/upload-pdf`;
    
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', url, true);
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(percent);
        }
      };
      
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText);
            resolve(data);
          } catch (e) {
            reject(new Error('Invalid response JSON from server'));
          }
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}: ${xhr.responseText}`));
        }
      };
      
      xhr.onerror = () => reject(new Error('Network error occurred during upload.'));
      
      const formData = new FormData();
      formData.append('file', file);
      xhr.send(formData);
    });
  },

  uploadPdfTempChunked: async (
    userId: string,
    file: File,
    onProgress: (percent: number, statusText?: string) => void
  ): Promise<{ filePath: string; fileName: string }> => {
    const token = await ensureBackendToken(userId);
    const chunkSize = 5 * 1024 * 1024; // 5MB chunk
    const totalChunks = Math.ceil(file.size / chunkSize);
    // Safe characters only for uploadId
    const safeName = file.name.replace(/[^a-zA-Z0-9]/g, '');
    const uploadId = `${safeName}-${file.size}-${Date.now()}`;

    for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
      const start = chunkIndex * chunkSize;
      const end = Math.min(start + chunkSize, file.size);
      const chunk = file.slice(start, end);

      const statusText = `Đang tải lên... Phần ${chunkIndex + 1}/${totalChunks}`;
      onProgress(Math.round((chunkIndex / totalChunks) * 100), statusText);

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${API_BASE_URL}/api/orders/upload-pdf-chunk`, true);
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const chunkPercent = event.loaded / event.total;
            const overallPercent = Math.round(((chunkIndex + chunkPercent) / totalChunks) * 100);
            onProgress(overallPercent, statusText);
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            reject(new Error(`Failed to upload chunk ${chunkIndex + 1}/${totalChunks}: ${xhr.status} ${xhr.responseText}`));
          }
        };

        xhr.onerror = () => reject(new Error(`Network error during chunk ${chunkIndex + 1} upload.`));

        const formData = new FormData();
        formData.append('uploadId', uploadId);
        formData.append('chunkIndex', chunkIndex.toString());
        formData.append('totalChunks', totalChunks.toString());
        formData.append('file', chunk, `${file.name}.part${chunkIndex}`);

        xhr.send(formData);
      });
    }

    onProgress(99, 'Đang xử lý ghép file thiết kế...');

    const mergeRes = await fetch(`${API_BASE_URL}/api/orders/merge-pdf-chunks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ uploadId, fileName: file.name })
    });

    if (!mergeRes.ok) {
      const errorText = await mergeRes.text();
      throw new Error(`Ghép file thất bại: ${mergeRes.status} ${errorText}`);
    }

    onProgress(100, 'Tải lên thành công!');
    return mergeRes.json();
  }
};

