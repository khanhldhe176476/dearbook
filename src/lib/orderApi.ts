import { apiGet, apiPost } from './api';

export interface OrderRequest {
  userBookId: string;
  recipientName: string;
  phone: string;
  address: string;
  city: string;
  paymentMethod: string;
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
};
