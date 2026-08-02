const mongoose = require('mongoose');

const discountBreakupSchema = new mongoose.Schema(
  {
    restaurantFunded: { type: Number, default: 0 },
    platformFunded:   { type: Number, default: 0 },
    bankFunded:       { type: Number, default: 0 },
    total:            { type: Number, default: 0 },
  },
  { _id: false }
);

const billPaymentSchema = new mongoose.Schema(
  {
    billPaymentId: { type: String, unique: true },

    customer:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },

    // ── Bill lifecycle ───────────────────────────────────────────────────────
    // open     : bill fetched, customer viewing
    // preview  : offer applied, showing final amount before payment
    // paid     : payment successful
    // cancelled: customer abandoned
    billStatus: {
      type: String,
      enum: ['open', 'preview', 'paid', 'cancelled'],
      default: 'open',
    },

    billAmount:      { type: Number, required: true, min: 1 }, // gross amount from restaurant

    // Offer / discount applied during Pay Bill
    offer:           { type: mongoose.Schema.Types.ObjectId, ref: 'Offer' },
    offerCode:       String,
    discountBreakup: { type: discountBreakupSchema, default: () => ({}) },
    finalAmount:     { type: Number, required: true }, // billAmount − discountBreakup.total

    // Commission (same EasyDiner formula as Invoice)
    commissionPercentage:  { type: Number, default: 10 },
    commissionBase:        { type: Number, default: 0 }, // billAmount − restaurantFunded discount
    commissionAmount:      { type: Number, default: 0 },
    restaurantReceivable:  { type: Number, default: 0 },

    paymentMethod: {
      type: String,
      enum: ['razorpay', 'wallet', 'card', 'upi'],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },

    // Razorpay
    razorpayOrderId:   String,
    razorpayPaymentId: String,
    razorpaySignature: String,

    // Human-readable payment reference (UPI ref, card last4, etc.)
    paymentReference: String,

    paidAt: Date,

    // Links to the generated invoice (created after successful payment)
    invoice: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice' },
  },
  { timestamps: true }
);

billPaymentSchema.pre('save', function (next) {
  if (!this.billPaymentId) {
    this.billPaymentId = `BP${Date.now().toString().slice(-8)}`;
  }

  const ownerDiscount = this.discountBreakup?.restaurantFunded ?? 0;
  this.commissionBase = Math.max(0, this.billAmount - ownerDiscount);
  this.commissionAmount = parseFloat(
    ((this.commissionBase * this.commissionPercentage) / 100).toFixed(2)
  );
  this.restaurantReceivable = parseFloat(
    (this.commissionBase - this.commissionAmount).toFixed(2)
  );

  next();
});

billPaymentSchema.index({ customer: 1, createdAt: -1 });
billPaymentSchema.index({ restaurant: 1, paymentStatus: 1 });
billPaymentSchema.index({ billStatus: 1 });

const BillPayment = mongoose.model('BillPayment', billPaymentSchema);
module.exports = BillPayment;
