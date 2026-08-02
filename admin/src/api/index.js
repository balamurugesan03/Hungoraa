import api from './axios';

export const authApi = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  getMe: () => api.get('/auth/me'),
  logout: (refreshToken) => api.post('/auth/logout', { refreshToken }),
};

export const adminApi = {
  getDashboard: () => api.get('/admin/dashboard'),
  getStats: (period) => api.get('/admin/stats', { params: { period } }),
  getSettings: () => api.get('/admin/settings'),
  updateSettings: (data) => api.put('/admin/settings', data),
  // New analytics dashboards
  getCommissionDashboard: (params) => api.get('/admin/commissions', { params }),
  getSettlementDashboard: (params) => api.get('/admin/settlements', { params }),
  getDiscountAnalytics: (params) => api.get('/admin/analytics/discounts', { params }),
  getRevenueAnalytics: (params) => api.get('/admin/analytics/revenue', { params }),
};

export const userApi = {
  getAll: (params) => api.get('/admin/users', { params }),
  getById: (id) => api.get(`/admin/users/${id}`),
  update: (id, data) => api.put(`/admin/users/${id}`, data),
  toggleBlock: (id) => api.patch(`/admin/users/${id}/block`),
  delete: (id) => api.delete(`/admin/users/${id}`),
  resetPassword: (id, newPassword) => api.patch(`/admin/users/${id}/reset-password`, { newPassword }),
};

export const restaurantApi = {
  create: (data) => api.post('/admin/restaurants/create', data),
  getAll: (params) => api.get('/admin/restaurants', { params }),
  getById: (id) => api.get(`/admin/restaurants/${id}`),
  update: (id, data) => api.put(`/admin/restaurants/${id}`, data),
  approve: (id) => api.patch(`/admin/restaurants/${id}/approve`),
  reject: (id, reason) => api.patch(`/admin/restaurants/${id}/reject`, { reason }),
  updateCommission: (id, commission) => api.patch(`/admin/restaurants/${id}/commission`, { commission }),
  updateSubscription: (id, plan) => api.patch(`/admin/restaurants/${id}/subscription`, { plan }),
  updatePolicy: (id, policy) => api.patch(`/admin/restaurants/${id}/policy`, { policy }),
  toggleBlock: (id) => api.patch(`/admin/restaurants/${id}/block`),
  delete: (id) => api.delete(`/admin/restaurants/${id}`),
};

export const bookingApi = {
  getAll: (params) => api.get('/admin/bookings', { params }),
  getById: (id) => api.get(`/bookings/${id}`),
};

export const reviewApi = {
  getAll: (params) => api.get('/admin/reviews', { params }),
  delete: (id) => api.delete(`/admin/reviews/${id}`),
};

export const offerApi = {
  getAll: (params) => api.get('/admin/offers', { params }),
  getPending: () => api.get('/admin/offers/pending'),
  approve: (id) => api.patch(`/offers/${id}/approve`),
  reject: (id, reason) => api.patch(`/offers/${id}/reject`, { reason }),
  delete: (id) => api.delete(`/offers/${id}`),
};

export const notificationApi = {
  getAll: (params) => api.get('/notifications/admin/all', { params }),
  getStats: (params) => api.get('/notifications/admin/stats', { params }),
  sendToUser: (data) => api.post('/notifications/admin/send', data),
  sendBulk: (data) => api.post('/notifications/admin/broadcast', data),
};

export const paymentApi = {
  getAll: (params) => api.get('/admin/payments', { params }),
  getById: (id) => api.get(`/payments/${id}`),
  refund: (id, data) => api.post(`/payments/${id}/refund`, data),
  refundToWallet: (id, data) => api.post(`/payments/${id}/refund-to-wallet`, data),
};

export const commissionApi = {
  getAll: (params) => api.get('/commissions', { params }),
  getById: (id) => api.get(`/commissions/${id}`),
  getTrend: (params) => api.get('/commissions/trend', { params }),
  getByRestaurant: (restaurantId, params) => api.get(`/commissions/restaurant/${restaurantId}`, { params }),
};

export const settlementApi = {
  getAll: (params) => api.get('/settlements', { params }),
  create: (data) => api.post('/settlements', data),
  getById: (id) => api.get(`/settlements/${id}`),
  // Replaces old /complete — advances pipeline (processing → generated → paid/failed)
  updateStatus: (id, data) => api.patch(`/settlements/${id}/status`, data),
  getReport: (params) => api.get('/settlements/report', { params }),
};

export const invoiceApi = {
  getAll: (params) => api.get('/invoices/all', { params }),
  getById: (id) => api.get(`/invoices/${id}`),
};
