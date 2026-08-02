import api from './axios';

const billPaymentApi = {
  getRestaurants: (params) => api.get('/bill-payments/restaurants', { params }),

  // Step 1: create a BillPayment draft (billStatus = 'open')
  fetchBill: (data) => api.post('/bill-payments/fetch', data),

  // Step 2: apply coupon → returns discountBreakup + netPaid (billStatus = 'preview')
  applyOffer: (id, data) => api.patch(`/bill-payments/${id}/apply-offer`, data),

  // Step 3: complete payment (billStatus = 'paid')
  completeBillPayment: (id, data) => api.post(`/bill-payments/${id}/complete`, data),

  // History
  getMyHistory: (params) => api.get('/bill-payments/my', { params }),
  getById: (id) => api.get(`/bill-payments/${id}`),
};

export { billPaymentApi };
export default billPaymentApi;
