const Razorpay = require('razorpay');
const crypto = require('crypto');
const BillPayment = require('../models/BillPayment');
const Invoice = require('../models/Invoice');
const Commission = require('../models/Commission');
const Restaurant = require('../models/Restaurant');
const Offer = require('../models/Offer');
const Wallet = require('../models/Wallet');
const Notification = require('../models/Notification');
const discountService = require('../services/discount.service');
const commissionService = require('../services/commission.service');
const loyaltyService = require('../services/loyalty.service');
const emailService = require('../services/email.service');
const { successResponse, errorResponse } = require('../utils/response');

const getRazorpay = () => new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ─── Public: Restaurants with Pay Bill enabled ─────────────────────────────────
exports.getPayBillRestaurants = async (req, res, next) => {
  try {
    const { city, search } = req.query;
    const filter = { payBillEnabled: true, status: { $in: ['approved', 'active'] }, isActive: true };
    if (city)   filter['address.city'] = new RegExp(city, 'i');
    if (search) filter.name = new RegExp(search, 'i');

    const restaurants = await Restaurant.find(filter)
      .select('name address cuisine images logo averageRating costForTwo')
      .sort({ averageRating: -1 })
      .limit(50);

    return successResponse(res, 200, 'Pay Bill restaurants', { restaurants });
  } catch (err) {
    next(err);
  }
};

// ─── Customer: Fetch bill → billStatus = 'open' ────────────────────────────────
// Creates a BillPayment draft so the customer can then apply an offer and pay.
exports.fetchBill = async (req, res, next) => {
  try {
    const { restaurantId, billAmount } = req.body;
    const amount = parseFloat(billAmount);
    if (!restaurantId || !amount || amount <= 0) {
      return errorResponse(res, 400, 'restaurantId and billAmount are required');
    }

    const restaurant = await Restaurant.findOne({
      _id: restaurantId,
      payBillEnabled: true,
      isActive: true,
    });
    if (!restaurant) return errorResponse(res, 404, 'Restaurant not found or Pay Bill not enabled');

    const billPayment = await BillPayment.create({
      customer:      req.user._id,
      restaurant:    restaurantId,
      billAmount:    amount,
      finalAmount:   amount,         // no discount yet
      paymentMethod: 'razorpay',     // will be updated before payment
      billStatus:    'open',
      paymentStatus: 'pending',
    });

    return successResponse(res, 201, 'Bill fetched', {
      billPayment,
      restaurant: { _id: restaurant._id, name: restaurant.name },
    });
  } catch (err) {
    next(err);
  }
};

// ─── Customer: Apply offer to bill → billStatus = 'preview' ───────────────────
exports.applyOffer = async (req, res, next) => {
  try {
    const { offerId, offerCode } = req.body;

    const billPayment = await BillPayment.findOne({ _id: req.params.id, customer: req.user._id });
    if (!billPayment) return errorResponse(res, 404, 'Bill payment not found');
    if (billPayment.billStatus === 'paid') return errorResponse(res, 400, 'Bill is already paid');

    const { offer, discountResult, error } = await discountService.applyOffer({
      offerId,
      code:         offerCode,
      restaurantId: billPayment.restaurant,
      userId:       req.user._id,
      amount:       billPayment.billAmount,
      guests:       1,
    });

    if (error) return errorResponse(res, 400, error);

    billPayment.offer = offer._id;
    billPayment.offerCode = offer.code;
    billPayment.discountBreakup = {
      restaurantFunded: discountResult.restaurantFunded,
      platformFunded:   discountResult.platformFunded,
      bankFunded:       discountResult.bankFunded,
      total:            discountResult.totalDiscount,
    };
    billPayment.finalAmount = parseFloat((billPayment.billAmount - discountResult.totalDiscount).toFixed(2));
    billPayment.billStatus  = 'preview';
    await billPayment.save();

    return successResponse(res, 200, 'Offer applied — preview ready', { billPayment });
  } catch (err) {
    next(err);
  }
};

// ─── Customer: Pay bill (Razorpay order OR Wallet) ────────────────────────────
exports.createBillPayment = async (req, res, next) => {
  try {
    const { restaurantId, billAmount, offerId, offerCode, paymentMethod } = req.body;
    const amount = parseFloat(billAmount);
    if (!restaurantId || !amount || amount <= 0) {
      return errorResponse(res, 400, 'restaurantId and billAmount are required');
    }

    const restaurant = await Restaurant.findOne({ _id: restaurantId, payBillEnabled: true, isActive: true })
      .populate('owner', 'name email phone');
    if (!restaurant) return errorResponse(res, 404, 'Restaurant not found');

    // Apply offer
    let discountBreakup = { restaurantFunded: 0, platformFunded: 0, bankFunded: 0, total: 0 };
    let appliedOffer = null;

    if (offerId || offerCode) {
      const { offer, discountResult, error } = await discountService.applyOffer({
        offerId, code: offerCode,
        restaurantId, userId: req.user._id,
        amount, guests: 1,
      });
      if (!error && discountResult) {
        appliedOffer = offer;
        discountBreakup = {
          restaurantFunded: discountResult.restaurantFunded,
          platformFunded:   discountResult.platformFunded,
          bankFunded:       discountResult.bankFunded,
          total:            discountResult.totalDiscount,
        };
      }
    }

    const finalAmount    = parseFloat((amount - discountBreakup.total).toFixed(2));
    const commissionRate = restaurant.commission || 10;

    // Wallet — complete immediately
    if (paymentMethod === 'wallet') {
      const wallet = await Wallet.findOne({ user: req.user._id });
      if (!wallet) return errorResponse(res, 404, 'Wallet not found');
      if (wallet.balance < finalAmount) {
        return errorResponse(res, 400, `Insufficient balance. Available: ₹${wallet.balance}`);
      }

      await wallet.debit(finalAmount, `Pay Bill at ${restaurant.name}`);

      const billPayment = await BillPayment.create({
        customer:      req.user._id,
        restaurant:    restaurantId,
        billAmount:    amount,
        offer:         appliedOffer?._id,
        offerCode:     appliedOffer?.code,
        discountBreakup,
        finalAmount,
        commissionPercentage: commissionRate,
        paymentMethod: 'wallet',
        paymentStatus: 'paid',
        billStatus:    'paid',
        paidAt:        new Date(),
      });

      if (appliedOffer) {
        discountService.recordOfferUsage({
          offer: appliedOffer, userId: req.user._id, restaurantId,
          grossAmount: amount,
          discountResult: { totalDiscount: discountBreakup.total, ...discountBreakup },
          sourceType: 'bill_payment', sourceId: billPayment._id,
        }).catch(() => {});
      }

      const inv = await _generateBillInvoice(billPayment, restaurant);
      billPayment.invoice = inv._id;
      await billPayment.save();

      const cashback = await loyaltyService.awardBillPaymentCashback({
        userId: req.user._id,
        amount: finalAmount,
        restaurantName: restaurant.name,
        billPaymentId: billPayment._id,
      });

      emailService.sendBillPaymentEmails({
        billPayment, restaurant, customer: req.user, owner: restaurant.owner,
      }).catch(() => {});

      return successResponse(res, 201, 'Payment successful', {
        billPayment,
        coinsEarned: cashback?.coins || 0,
        walletBalance: cashback?.walletBalance,
      });
    }

    // Razorpay — create order
    if (!process.env.RAZORPAY_KEY_ID) return errorResponse(res, 500, 'Razorpay not configured');

    const order = await getRazorpay().orders.create({
      amount:   Math.round(finalAmount * 100),
      currency: 'INR',
      receipt:  `bp_${Date.now()}`,
    });

    const billPayment = await BillPayment.create({
      customer:      req.user._id,
      restaurant:    restaurantId,
      billAmount:    amount,
      offer:         appliedOffer?._id,
      offerCode:     appliedOffer?.code,
      discountBreakup,
      finalAmount,
      commissionPercentage: commissionRate,
      paymentMethod: paymentMethod || 'razorpay',
      paymentStatus: 'pending',
      billStatus:    'preview',
      razorpayOrderId: order.id,
    });

    return successResponse(res, 201, 'Order created', {
      billPayment,
      razorpay: { orderId: order.id, amount: order.amount, currency: order.currency, key: process.env.RAZORPAY_KEY_ID },
    });
  } catch (err) {
    next(err);
  }
};

// ─── Customer: Verify Razorpay + complete bill payment ───────────────────────
exports.completeBillPayment = async (req, res, next) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, paymentReference } = req.body;

    const expected = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    if (expected !== razorpaySignature) return errorResponse(res, 400, 'Invalid payment signature');

    const billPayment = await BillPayment.findOne({ razorpayOrderId });
    if (!billPayment) return errorResponse(res, 404, 'Bill payment not found');
    if (billPayment.paymentStatus === 'paid') return errorResponse(res, 400, 'Already completed');

    billPayment.razorpayPaymentId = razorpayPaymentId;
    billPayment.razorpaySignature = razorpaySignature;
    billPayment.paymentStatus     = 'paid';
    billPayment.billStatus        = 'paid';
    billPayment.paymentReference  = paymentReference || razorpayPaymentId;
    billPayment.paidAt            = new Date();
    await billPayment.save();

    // Record offer usage
    if (billPayment.offer) {
      const offer = await Offer.findById(billPayment.offer);
      if (offer) {
        discountService.recordOfferUsage({
          offer, userId: billPayment.customer, restaurantId: billPayment.restaurant,
          grossAmount: billPayment.billAmount,
          discountResult: {
            totalDiscount:    billPayment.discountBreakup?.total ?? 0,
            restaurantFunded: billPayment.discountBreakup?.restaurantFunded ?? 0,
            platformFunded:   billPayment.discountBreakup?.platformFunded ?? 0,
            bankFunded:       billPayment.discountBreakup?.bankFunded ?? 0,
          },
          sourceType: 'bill_payment', sourceId: billPayment._id,
        }).catch(() => {});
      }
    }

    const restaurant = await Restaurant.findById(billPayment.restaurant).populate('owner', 'name email phone');
    const inv = await _generateBillInvoice(billPayment, restaurant);
    billPayment.invoice = inv._id;
    await billPayment.save();

    const cashback = await loyaltyService.awardBillPaymentCashback({
      userId: billPayment.customer,
      amount: billPayment.finalAmount,
      restaurantName: restaurant?.name,
      billPaymentId: billPayment._id,
    });

    emailService.sendBillPaymentEmails({
      billPayment, restaurant, customer: req.user, owner: restaurant?.owner,
    }).catch(() => {});

    await billPayment.populate('restaurant', 'name address');
    return successResponse(res, 200, 'Payment completed', {
      billPayment,
      coinsEarned: cashback?.coins || 0,
      walletBalance: cashback?.walletBalance,
    });
  } catch (err) {
    next(err);
  }
};

// ─── Customer: My bill payment history ────────────────────────────────────────
exports.getMyBillPayments = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const total = await BillPayment.countDocuments({ customer: req.user._id });
    const payments = await BillPayment.find({ customer: req.user._id })
      .populate('restaurant', 'name address images logo')
      .populate('offer',      'title discountValue type fundedBy')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(Number(limit));

    return successResponse(res, 200, 'Bill payments', {
      payments,
      pagination: { total, page: Number(page), pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
};

// ─── Owner: Restaurant's bill payments ────────────────────────────────────────
exports.getRestaurantBillPayments = async (req, res, next) => {
  try {
    const { restaurantId, page = 1, limit = 20 } = req.query;
    if (!(await Restaurant.findOne({ _id: restaurantId, owner: req.user._id }))) {
      return errorResponse(res, 403, 'Access denied');
    }

    const filter = { restaurant: restaurantId, paymentStatus: 'paid' };
    const total = await BillPayment.countDocuments(filter);
    const payments = await BillPayment.find(filter)
      .populate('customer', 'name phone')
      .populate('offer',    'title code fundedBy')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const stats = await BillPayment.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalRevenue:         { $sum: '$finalAmount' },
          totalRestaurantDiscount: { $sum: '$discountBreakup.restaurantFunded' },
          totalPlatformDiscount:   { $sum: '$discountBreakup.platformFunded' },
          count: { $sum: 1 },
        },
      },
    ]);

    return successResponse(res, 200, 'Restaurant bill payments', {
      payments,
      stats: stats[0] || { totalRevenue: 0, totalRestaurantDiscount: 0, totalPlatformDiscount: 0, count: 0 },
      pagination: { total, page: Number(page), pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
};

// ─── Owner: Toggle Pay Bill on/off ────────────────────────────────────────────
exports.togglePayBill = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findOne({ _id: req.params.id, owner: req.user._id });
    if (!restaurant) return errorResponse(res, 403, 'Access denied');
    restaurant.payBillEnabled = !restaurant.payBillEnabled;
    await restaurant.save();
    return successResponse(res, 200, `Pay Bill ${restaurant.payBillEnabled ? 'enabled' : 'disabled'}`, {
      payBillEnabled: restaurant.payBillEnabled,
    });
  } catch (err) {
    next(err);
  }
};

// ─── Internal: Auto-generate Invoice after bill payment ───────────────────────
async function _generateBillInvoice(billPayment, restaurant) {
  const commissionRate = restaurant?.commission || billPayment.commissionPercentage || 10;
  const ownerDiscount  = billPayment.discountBreakup?.restaurantFunded ?? 0;
  const commissionBase = Math.max(0, billPayment.billAmount - ownerDiscount);
  const commissionAmount = parseFloat(((commissionBase * commissionRate) / 100).toFixed(2));

  const invoice = await Invoice.create({
    booking:             billPayment._id,   // using bill payment ID as booking reference
    customer:            billPayment.customer,
    restaurant:          billPayment.restaurant,
    generatedBy:         billPayment.customer,
    grossAmount:         billPayment.billAmount,
    discountBreakup:     billPayment.discountBreakup ?? {},
    taxPercentage:       0,
    taxAmount:           0,
    netPaid:             billPayment.finalAmount,
    offer:               billPayment.offer,
    offerCode:           billPayment.offerCode,
    commissionPercentage: commissionRate,
    commissionBase,
    commissionAmount,
    restaurantReceivable: parseFloat((commissionBase - commissionAmount).toFixed(2)),
    paymentMethod:        billPayment.paymentMethod,
    paymentStatus:        'paid',
    status:               'paid',
    isLocked:             true,
    settlementStatus:     'pending',
    paidAt:               billPayment.paidAt,
  });

  // Create commission record
  await commissionService.createFromInvoice(invoice);

  return invoice;
}
