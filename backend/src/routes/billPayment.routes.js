const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const {
  getPayBillRestaurants,
  fetchBill,
  applyOffer,
  createBillPayment,
  completeBillPayment,
  getMyBillPayments,
  getRestaurantBillPayments,
  togglePayBill,
} = require('../controllers/billPayment.controller');

// Public
router.get('/restaurants', getPayBillRestaurants);

router.use(protect);

// Customer — bill flow: fetch → apply offer (optional) → pay → complete
router.post('/fetch', authorize('customer'), fetchBill);
router.patch('/:id/apply-offer', authorize('customer'), applyOffer);
router.post('/', authorize('customer'), createBillPayment);
router.post('/complete', authorize('customer'), completeBillPayment);
router.get('/my', authorize('customer'), getMyBillPayments);

// Owner
router.get('/restaurant', authorize('owner', 'admin'), getRestaurantBillPayments);
router.patch('/:id/toggle', authorize('owner', 'admin'), togglePayBill);

module.exports = router;
