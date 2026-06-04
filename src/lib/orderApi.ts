import { apiGet, apiPost, apiPostMultipart } from './api';

export interface OrderRequest {
  userBookId: string;
  customerName?: string;
  recipientName?: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
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

export const orderApi = {
  getMyOrders: (userId: string) => apiGet<OrderResponse[]>('/api/orders/my', { headers: { 'X-User-Id': userId } }),
  placeOrder: (userId: string, data: OrderRequest) => 
    apiPost<OrderResponse>('/api/orders', data, { headers: { 'X-User-Id': userId } }),
  uploadPdf: (orderId: string, userId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiPostMultipart<string>(`/api/orders/${orderId}/pdf`, formData, {
      headers: { 'X-User-Id': userId }
    });
  }
};

