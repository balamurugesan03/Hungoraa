const mongoose = require('mongoose');

// Singleton document (key: 'platform') holding admin-configurable platform
// settings. Persisted so values survive a server restart — the old in-memory
// object did not.
const platformSettingsSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'platform', unique: true },

    // ── General ──────────────────────────────────────────────────────────────
    defaultCommission: { type: Number, default: 10 },
    otpExpiry: { type: Number, default: 5 },
    maxOtpAttempts: { type: Number, default: 5 },
    accessTokenExpiry: { type: String, default: '7d' },
    maxRefreshDevices: { type: Number, default: 5 },
    bookingCancellationHours: { type: Number, default: 2 },

    // ── Feature toggles ─────────────────────────────────────────────────────
    enableWallet: { type: Boolean, default: true },
    enableGoogleLogin: { type: Boolean, default: true },
    enableRazorpay: { type: Boolean, default: true },
    enableSmsOtp: { type: Boolean, default: true },
    enableEmailVerification: { type: Boolean, default: true },
    maintenanceMode: { type: Boolean, default: false },

    // ── Pay Bill: convenience fee + GST (EasyDiner-style) ───────────────────
    // Charged on top of (bill − discount). Platform revenue; does not touch
    // the restaurant's receivable or the commission base.
    convenienceFeeEnabled: { type: Boolean, default: true },
    convenienceFeeType: { type: String, enum: ['flat', 'percent'], default: 'flat' },
    convenienceFeeValue: { type: Number, default: 6 },      // ₹6 flat, or 6% if percent
    convenienceFeeCap: { type: Number, default: 25 },       // max ₹ when percent (0 = no cap)
    convenienceFeeMinBill: { type: Number, default: 0 },    // waive the fee below this bill
    gstOnFeePercent: { type: Number, default: 18 },         // GST on the convenience fee

    // ── Mobile home screen — hero background (Swiggy-style) ─────────────────
    homeHeroEnabled: { type: Boolean, default: false },
    homeHeroImageUrl: { type: String, default: '' },
    homeHeroVideoUrl: { type: String, default: '' },        // optional looping video (mp4)
  },
  { timestamps: true, minimize: false },
);

platformSettingsSchema.statics.getSingleton = async function () {
  let doc = await this.findOne({ key: 'platform' });
  if (!doc) doc = await this.create({ key: 'platform' });
  return doc;
};

// Fields the admin panel is allowed to write.
platformSettingsSchema.statics.WRITABLE = [
  'defaultCommission', 'otpExpiry', 'maxOtpAttempts', 'accessTokenExpiry',
  'maxRefreshDevices', 'bookingCancellationHours',
  'enableWallet', 'enableGoogleLogin', 'enableRazorpay', 'enableSmsOtp',
  'enableEmailVerification', 'maintenanceMode',
  'convenienceFeeEnabled', 'convenienceFeeType', 'convenienceFeeValue',
  'convenienceFeeCap', 'convenienceFeeMinBill', 'gstOnFeePercent',
  'homeHeroEnabled', 'homeHeroImageUrl', 'homeHeroVideoUrl',
];

// Fields safe to expose to unauthenticated mobile clients.
platformSettingsSchema.statics.PUBLIC = [
  'homeHeroEnabled', 'homeHeroImageUrl', 'homeHeroVideoUrl',
  'convenienceFeeEnabled', 'maintenanceMode',
];

module.exports = mongoose.model('PlatformSettings', platformSettingsSchema);
