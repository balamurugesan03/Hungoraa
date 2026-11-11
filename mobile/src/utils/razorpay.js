// Razorpay Checkout wrapper.
//
// The SDK is a native module, so it only exists in a dev/release build made
// AFTER `react-native-razorpay` was installed — it is required lazily so an
// older build (or Expo Go) still launches and just reports "unavailable".
import { useAuthStore } from '../store/authStore';

const BRAND_NAVY = '#0C2F4E';

let _sdk;
const getSdk = () => {
  if (_sdk !== undefined) return _sdk;
  try {
    // eslint-disable-next-line global-require
    _sdk = require('react-native-razorpay').default || require('react-native-razorpay');
  } catch {
    _sdk = null;
  }
  return _sdk;
};

export class PaymentCancelledError extends Error {
  constructor(message = 'Payment cancelled') {
    super(message);
    this.cancelled = true;
  }
}

/**
 * Opens Razorpay Checkout for an order created on the backend.
 *
 * @param {object} order  { orderId, amount (paise), currency, key }
 * @param {object} [opts] { description, prefill }
 * @returns {Promise<{ razorpayOrderId, razorpayPaymentId, razorpaySignature }>}
 *          Rejects with PaymentCancelledError if the user backs out.
 */
export async function openRazorpayCheckout(order, opts = {}) {
  const sdk = getSdk();
  if (!sdk?.open) {
    throw new Error('Online payment needs the latest app build. Please update the app.');
  }

  const user = useAuthStore.getState().user || {};
  const key = order.key || process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID;
  if (!key || !order.orderId) throw new Error('Payment could not be started');

  const options = {
    key,
    order_id: order.orderId,
    amount: String(order.amount),
    currency: order.currency || 'INR',
    name: 'Hungora',
    description: opts.description || 'Payment',
    prefill: {
      name: user.name || '',
      email: user.email || '',
      contact: user.phone ? String(user.phone).replace(/\D/g, '').slice(-10) : '',
      ...(opts.prefill || {}),
    },
    theme: { color: BRAND_NAVY },
  };

  try {
    const res = await sdk.open(options);
    return {
      razorpayOrderId: res.razorpay_order_id || order.orderId,
      razorpayPaymentId: res.razorpay_payment_id,
      razorpaySignature: res.razorpay_signature,
    };
  } catch (err) {
    // code 0 / 2 = user closed the sheet or pressed back
    let desc = err?.description;
    try {
      const parsed = typeof desc === 'string' ? JSON.parse(desc) : null;
      desc = parsed?.error?.description || desc;
    } catch { /* plain string */ }
    if (err?.code === 0 || err?.code === 2 || /cancel/i.test(String(desc))) {
      throw new PaymentCancelledError();
    }
    throw new Error(desc || 'Payment failed');
  }
}
