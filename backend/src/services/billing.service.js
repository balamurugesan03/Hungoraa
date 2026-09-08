const PlatformSettings = require('../models/PlatformSettings');

// Short-lived cache so a burst of quote/pay calls doesn't hammer Mongo.
let cache = null;
let cachedAt = 0;
const TTL = 30 * 1000;

async function getSettings({ fresh = false } = {}) {
  if (!fresh && cache && Date.now() - cachedAt < TTL) return cache;
  cache = (await PlatformSettings.getSingleton()).toObject();
  cachedAt = Date.now();
  return cache;
}

function invalidate() {
  cache = null;
  cachedAt = 0;
}

const r2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;

/**
 * Convenience fee + GST for a Pay Bill transaction.
 * @param base  billAmount − totalDiscount (the amount owed to the restaurant)
 * @param tip   voluntary tip (rides on top, untaxed)
 * Returns { convenienceFee, gstAmount, gstOnFeePercent, toPay }.
 */
async function computeCharges(base, tip = 0) {
  const s = await getSettings();
  const b = Math.max(0, Number(base) || 0);
  const t = Math.max(0, Number(tip) || 0);

  let convenienceFee = 0;
  if (s.convenienceFeeEnabled && b > 0 && b >= (s.convenienceFeeMinBill || 0)) {
    if (s.convenienceFeeType === 'percent') {
      convenienceFee = (b * (s.convenienceFeeValue || 0)) / 100;
      if (s.convenienceFeeCap > 0) convenienceFee = Math.min(convenienceFee, s.convenienceFeeCap);
    } else {
      convenienceFee = s.convenienceFeeValue || 0;
    }
  }
  convenienceFee = r2(convenienceFee);

  const gstOnFeePercent = s.gstOnFeePercent || 0;
  const gstAmount = r2((convenienceFee * gstOnFeePercent) / 100);
  const toPay = r2(b + convenienceFee + gstAmount + t);

  return { convenienceFee, gstAmount, gstOnFeePercent, toPay };
}

module.exports = { getSettings, invalidate, computeCharges, r2 };
