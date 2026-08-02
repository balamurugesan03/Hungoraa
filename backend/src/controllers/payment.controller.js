const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const Wallet = require('../models/Wallet');
const Restaurant = require('../models/Restaurant');
const Notification = require('../models/Notification');
const logger = require('../utils/logger');
const { successResponse, errorResponse } = require('../utils/response');

const getRazorpay = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error('Razorpay keys not configured');
  }
  return new Razorpay({
    key_id:     process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

const verifySignature = (orderId, paymentId, signature) => {
  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');
  return expected === signature;
};

// ─── Customer: Create Razorpay order for booking deposit ──────────────────────
exports.createOrder = async (req, res) => {
  try {
    const { bookingId, amount, type = 'deposit' } = req.body;

    const booking = await Booking.findById(bookingId).populate('restaurant', 'name commission');
    if (!booking) return errorResponse(res, 404, 'Booking not found');
    if (booking.customer.toString() !== req.user._id.toString()) {
      return errorResponse(res, 403, 'Not authorized');
    }
    if (booking.isPaid) return errorResponse(res, 400, 'Booking already paid');
    if (!['held', 'pending', 'confirmed'].includes(booking.status)) {
      return errorResponse(res, 400, `Cannot pay for a booking with status "${booking.status}"`);
    }

    const payAmount = parseFloat(amount);
    if (!payAmount || payAmount <= 0) return errorResponse(res, 400, 'Invalid amount');

    const order = await getRazorpay().orders.create({
      amount:   Math.round(payAmount * 100),
      currency: 'INR',
      receipt:  `bk_${booking.bookingId}_${Date.now()}`,
      notes:    { bookingId: bookingId.toString(), customerId: req.user._id.toString() },
    });

    const payment = await Payment.create({
      booking:         bookingId,
      customer:        req.user._id,
      restaurant:      booking.restaurant._id,
      amount:          payAmount,
      method:          'razorpay',
      type,
      status:          'pending',
      razorpayOrderId: order.id,
      receipt:         order.receipt,
      description:     `Booking deposit – ${booking.restaurant.name}`,
    });

    return successResponse(res, 200, 'Order created', {
      orderId:   order.id,
      amount:    order.amount,
      currency:  order.currency,
      key:       process.env.RAZORPAY_KEY_ID,
      paymentId: payment._id,
    });
  } catch (err) {
    logger.error('createOrder error:', err);
    return errorResponse(res, 500, err.message);
  }
};

// ─── Customer: Verify Razorpay payment + confirm booking ──────────────────────
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, bookingId } = req.body;

    if (!verifySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature)) {
      // Mark payment as failed in DB
      await Payment.findOneAndUpdate(
        { razorpayOrderId },
        { status: 'failed', failureReason: 'Signature mismatch' }
      );
      return errorResponse(res, 400, 'Invalid payment signature');
    }

    const payment = await Payment.findOneAndUpdate(
      { razorpayOrderId },
      {
        razorpayPaymentId,
        razorpaySignature,
        status: 'completed',
        paidAt: new Date(),
      },
      { new: true }
    );
    if (!payment) return errorResponse(res, 404, 'Payment record not found');

    // Confirm booking — if it was in 'held' state, advance to 'pending'
    const booking = await Booking.findById(bookingId).populate('restaurant', 'owner name');
    if (booking) {
      const nextStatus = booking.status === 'held' ? 'pending' : booking.status;
      booking.isPaid      = true;
      booking.payment     = payment._id;
      booking.status      = nextStatus;
      booking.holdStatus  = 'confirmed';
      booking.statusHistory.push({ status: nextStatus, changedBy: req.user._id, reason: 'Deposit paid' });
      await booking.save();

      // Notify restaurant owner about deposit
      await Notification.create({
        recipient: booking.restaurant.owner,
        title:     'Deposit Received',
        body:      `Deposit of ₹${payment.amount} received for booking #${booking.bookingId}`,
        type:      'deposit_received',
        data:      { bookingId: booking._id, paymentId: payment._id, amount: payment.amount },
        channel:   'in-app',
      });
    }

    return successResponse(res, 200, 'Payment verified', { payment });
  } catch (err) {
    logger.error('verifyPayment error:', err);
    return errorResponse(res, 500, err.message);
  }
};

// ─── Customer: Pay booking deposit via wallet ─────────────────────────────────
exports.payWithWallet = async (req, res) => {
  try {
    const { bookingId, amount } = req.body;
    if (!bookingId || !amount) return errorResponse(res, 400, 'bookingId and amount are required');

    const booking = await Booking.findById(bookingId).populate('restaurant', 'owner name commission');
    if (!booking) return errorResponse(res, 404, 'Booking not found');
    if (booking.customer.toString() !== req.user._id.toString()) {
      return errorResponse(res, 403, 'Not authorized');
    }
    if (booking.isPaid) return errorResponse(res, 400, 'Booking already paid');
    if (!['held', 'pending', 'confirmed'].includes(booking.status)) {
      return errorResponse(res, 400, `Cannot pay for a booking with status "${booking.status}"`);
    }

    const payAmount = parseFloat(amount);
    const wallet = await Wallet.findOne({ user: req.user._id });
    if (!wallet) return errorResponse(res, 404, 'Wallet not found');
    if (wallet.balance < payAmount) {
      return errorResponse(res, 400, `Insufficient balance. Available: ₹${wallet.balance}`);
    }

    await wallet.debit(payAmount, `Booking deposit – ${booking.restaurant.name}`, bookingId, 'booking');

    const payment = await Payment.create({
      booking:     bookingId,
      customer:    req.user._id,
      restaurant:  booking.restaurant._id,
      amount:      payAmount,
      method:      'wallet',
      type:        'deposit',
      status:      'completed',
      paidAt:      new Date(),
      description: `Booking deposit – ${booking.restaurant.name}`,
    });

    const nextStatus = booking.status === 'held' ? 'pending' : booking.status;
    booking.isPaid     = true;
    booking.payment    = payment._id;
    booking.status     = nextStatus;
    booking.holdStatus = 'confirmed';
    booking.statusHistory.push({ status: nextStatus, changedBy: req.user._id, reason: 'Deposit paid via wallet' });
    await booking.save();

    // Notify owner
    await Notification.create({
      recipient: booking.restaurant.owner,
      title:     'Deposit Received',
      body:      `Deposit of ₹${payAmount} received (wallet) for booking #${booking.bookingId}`,
      type:      'deposit_received',
      data:      { bookingId: booking._id, paymentId: payment._id, amount: payAmount },
      channel:   'in-app',
    });

    return successResponse(res, 200, 'Payment successful', { payment, walletBalance: wallet.balance });
  } catch (err) {
    logger.error('payWithWallet error:', err);
    return errorResponse(res, 500, err.message);
  }
};

// ─── Customer: Create Razorpay order for wallet top-up ───────────────────────
exports.createWalletTopupOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    const topupAmount = parseFloat(amount);
    if (!topupAmount || topupAmount < 1) return errorResponse(res, 400, 'Minimum top-up is ₹1');

    const order = await getRazorpay().orders.create({
      amount:   Math.round(topupAmount * 100),
      currency: 'INR',
      receipt:  `wallet_${req.user._id}_${Date.now()}`,
      notes:    { purpose: 'wallet_topup', customerId: req.user._id.toString() },
    });

    const payment = await Payment.create({
      customer:        req.user._id,
      amount:          topupAmount,
      method:          'razorpay',
      type:            'wallet_topup',
      status:          'pending',
      razorpayOrderId: order.id,
      receipt:         order.receipt,
      description:     'Wallet top-up',
    });

    return successResponse(res, 200, 'Top-up order created', {
      orderId:   order.id,
      amount:    order.amount,
      currency:  order.currency,
      key:       process.env.RAZORPAY_KEY_ID,
      paymentId: payment._id,
    });
  } catch (err) {
    logger.error('createWalletTopupOrder error:', err);
    return errorResponse(res, 500, err.message);
  }
};

// ─── Customer: Verify wallet top-up payment + credit wallet ───────────────────
exports.topUpWallet = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    if (!verifySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature)) {
      await Payment.findOneAndUpdate(
        { razorpayOrderId },
        { status: 'failed', failureReason: 'Signature mismatch' }
      );
      return errorResponse(res, 400, 'Invalid payment signature');
    }

    const payment = await Payment.findOneAndUpdate(
      { razorpayOrderId, type: 'wallet_topup' },
      { razorpayPaymentId, razorpaySignature, status: 'completed', paidAt: new Date() },
      { new: true }
    );
    if (!payment) return errorResponse(res, 404, 'Payment record not found');

    const wallet = await Wallet.findOne({ user: req.user._id });
    if (!wallet) return errorResponse(res, 404, 'Wallet not found');

    await wallet.credit(payment.amount, 'Wallet top-up via Razorpay', payment._id.toString(), 'topup');

    return successResponse(res, 200, 'Wallet topped up', {
      payment,
      newBalance: wallet.balance,
    });
  } catch (err) {
    logger.error('topUpWallet error:', err);
    return errorResponse(res, 500, err.message);
  }
};

// ─── Customer / Owner / Admin: Get single payment ─────────────────────────────
exports.getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('booking',    'bookingId date time status')
      .populate('restaurant', 'name address')
      .populate('customer',   'name email phone');

    if (!payment) return errorResponse(res, 404, 'Payment not found');

    const isOwner    = req.user.role === 'admin' || req.user.role === 'owner';
    const isCustomer = payment.customer._id.toString() === req.user._id.toString();
    if (!isOwner && !isCustomer) return errorResponse(res, 403, 'Access denied');

    return successResponse(res, 200, 'Payment fetched', { payment });
  } catch (err) {
    return errorResponse(res, 500, err.message);
  }
};

// ─── Customer: Payment history with pagination + filters ──────────────────────
exports.getPaymentHistory = async (req, res) => {
  try {
    const { status, type, from, to, page = 1, limit = 20 } = req.query;

    const filter = { customer: req.user._id };
    if (status) filter.status = status;
    if (type)   filter.type   = type;
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to)   filter.createdAt.$lte = new Date(to);
    }

    const [payments, total] = await Promise.all([
      Payment.find(filter)
        .populate('booking',    'bookingId date time')
        .populate('restaurant', 'name images logo')
        .sort('-createdAt')
        .skip((parseInt(page) - 1) * parseInt(limit))
        .limit(parseInt(limit)),
      Payment.countDocuments(filter),
    ]);

    return successResponse(res, 200, 'Payment history', {
      payments,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (err) {
    return errorResponse(res, 500, err.message);
  }
};

// ─── Customer: Wallet balance + recent transactions ───────────────────────────
exports.getWallet = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ user: req.user._id });
    if (!wallet) return errorResponse(res, 404, 'Wallet not found');

    // Return wallet without full transaction history (use /wallet/transactions for that)
    const { transactions, ...walletData } = wallet.toObject();
    return successResponse(res, 200, 'Wallet fetched', {
      wallet: {
        ...walletData,
        recentTransactions: transactions.slice(-5).reverse(),
      },
    });
  } catch (err) {
    return errorResponse(res, 500, err.message);
  }
};

// ─── Customer: Paginated wallet transaction history ───────────────────────────
exports.getWalletTransactions = async (req, res) => {
  try {
    const { type, page = 1, limit = 20 } = req.query;

    const wallet = await Wallet.findOne({ user: req.user._id });
    if (!wallet) return errorResponse(res, 404, 'Wallet not found');

    let transactions = [...wallet.transactions].reverse(); // newest first
    if (type) transactions = transactions.filter((t) => t.type === type);

    const total = transactions.length;
    const paginated = transactions.slice(
      (parseInt(page) - 1) * parseInt(limit),
      parseInt(page) * parseInt(limit)
    );

    return successResponse(res, 200, 'Wallet transactions', {
      balance: wallet.balance,
      transactions: paginated,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (err) {
    return errorResponse(res, 500, err.message);
  }
};

// ─── Owner / Admin: Initiate Razorpay refund ──────────────────────────────────
exports.refundPayment = async (req, res) => {
  try {
    const { amount, reason } = req.body;

    const payment = await Payment.findById(req.params.id);
    if (!payment) return errorResponse(res, 404, 'Payment not found');
    if (payment.status !== 'completed') return errorResponse(res, 400, 'Only completed payments can be refunded');
    if (!payment.razorpayPaymentId) return errorResponse(res, 400, 'No Razorpay payment ID on record');

    const refundAmount = amount ? parseFloat(amount) : payment.amount;
    if (refundAmount > payment.amount) return errorResponse(res, 400, 'Refund amount exceeds payment amount');

    const refund = await getRazorpay().payments.refund(payment.razorpayPaymentId, {
      amount: Math.round(refundAmount * 100),
      notes:  { reason: reason || 'Booking cancellation' },
    });

    const isPartial = refundAmount < payment.amount;
    payment.status        = isPartial ? 'partially_refunded' : 'refunded';
    payment.refundAmount  = refundAmount;
    payment.refundId      = refund.id;
    payment.refundedAt    = new Date();
    payment.refundReason  = reason;
    await payment.save();

    // Notify customer
    await Notification.create({
      recipient: payment.customer,
      title:     'Refund Initiated',
      body:      `₹${refundAmount} refund has been processed. It will reflect in 5–7 business days.`,
      type:      'refund_completed',
      data:      { paymentId: payment._id, refundAmount, refundId: refund.id },
      channel:   'in-app',
    });

    return successResponse(res, 200, 'Refund initiated', { payment, refund });
  } catch (err) {
    logger.error('refundPayment error:', err);
    return errorResponse(res, 500, err.message);
  }
};

// ─── Admin: Refund to wallet (when Razorpay refund not applicable) ────────────
exports.refundToWallet = async (req, res) => {
  try {
    const { amount, reason } = req.body;

    const payment = await Payment.findById(req.params.id);
    if (!payment) return errorResponse(res, 404, 'Payment not found');
    if (payment.status !== 'completed') return errorResponse(res, 400, 'Only completed payments can be refunded');

    const refundAmount = amount ? parseFloat(amount) : payment.amount;
    if (refundAmount > payment.amount) return errorResponse(res, 400, 'Refund amount exceeds payment amount');

    const wallet = await Wallet.findOne({ user: payment.customer });
    if (!wallet) return errorResponse(res, 404, 'Customer wallet not found');

    await wallet.credit(refundAmount, reason || 'Refund', payment._id.toString(), 'refund');

    const isPartial = refundAmount < payment.amount;
    payment.status       = isPartial ? 'partially_refunded' : 'refunded';
    payment.refundAmount = refundAmount;
    payment.refundedAt   = new Date();
    payment.refundReason = reason;
    await payment.save();

    await Notification.create({
      recipient: payment.customer,
      title:     'Refund Credited to Wallet',
      body:      `₹${refundAmount} has been refunded to your DineSmart wallet`,
      type:      'refund_completed',
      data:      { paymentId: payment._id, refundAmount, walletBalance: wallet.balance },
      channel:   'in-app',
    });

    return successResponse(res, 200, 'Refund credited to wallet', { payment, newWalletBalance: wallet.balance });
  } catch (err) {
    logger.error('refundToWallet error:', err);
    return errorResponse(res, 500, err.message);
  }
};

// ─── Razorpay Webhook ─────────────────────────────────────────────────────────
exports.razorpayWebhook = async (req, res) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const expected  = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(req.body)         // raw Buffer
      .digest('hex');

    if (signature !== expected) {
      logger.warn('Webhook: invalid signature');
      return res.status(400).json({ error: 'Invalid signature' });
    }

    const event   = JSON.parse(req.body.toString());
    const entity  = event.payload?.payment?.entity || event.payload?.refund?.entity;
    const orderId = entity?.order_id;

    switch (event.event) {
      case 'payment.captured': {
        const payment = await Payment.findOneAndUpdate(
          { razorpayOrderId: orderId },
          { status: 'completed', razorpayPaymentId: entity.id, paidAt: new Date() },
          { new: true }
        );
        // Credit wallet if this was a top-up
        if (payment?.type === 'wallet_topup') {
          const wallet = await Wallet.findOne({ user: payment.customer });
          if (wallet) {
            await wallet.credit(payment.amount, 'Wallet top-up via Razorpay', payment._id.toString(), 'topup');
          }
        }
        break;
      }

      case 'payment.failed': {
        const payment = await Payment.findOneAndUpdate(
          { razorpayOrderId: orderId },
          {
            status:        'failed',
            failureReason: entity?.error_description || 'Payment failed',
          },
          { new: true }
        );
        // Notify customer
        if (payment) {
          await Notification.create({
            recipient: payment.customer,
            title:     'Payment Failed',
            body:      `Your payment of ₹${payment.amount} failed. Please try again.`,
            type:      'payment_failed',
            data:      { paymentId: payment._id, amount: payment.amount },
            channel:   'in-app',
          });
          // Release booking hold if deposit failed
          if (payment.booking) {
            await Booking.findOneAndUpdate(
              { _id: payment.booking, status: 'held' },
              {
                status:             'cancelled',
                holdStatus:         'released',
                cancelledAt:        new Date(),
                cancellationReason: 'Deposit payment failed',
              }
            );
          }
        }
        break;
      }

      case 'refund.processed': {
        const refundEntity = event.payload?.refund?.entity;
        if (refundEntity) {
          await Payment.findOneAndUpdate(
            { razorpayPaymentId: refundEntity.payment_id },
            { status: 'refunded', refundId: refundEntity.id, refundedAt: new Date() }
          );
        }
        break;
      }

      default:
        logger.info(`Unhandled webhook event: ${event.event}`);
    }

    return res.json({ status: 'ok' });
  } catch (err) {
    logger.error('Webhook error:', err);
    return res.status(500).json({ error: err.message });
  }
};
