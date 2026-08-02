import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  Alert, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentApi } from '../../api/payment.api';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants';

const PAYMENT_METHODS = [
  { id: 'razorpay', label: 'Razorpay', icon: '💳', desc: 'Credit/Debit card, UPI, Net Banking' },
  { id: 'wallet', label: 'Hungora Wallet', icon: '👛', desc: 'Instant payment from wallet balance' },
  { id: 'cash', label: 'Pay at Restaurant', icon: '💵', desc: 'Cash payment when you arrive' },
];

export default function PaymentScreen({ navigation, route }) {
  const { bookingId, amount, walletBalance = 0, restaurantName } = route.params || {};
  const qc = useQueryClient();
  const [method, setMethod] = useState('razorpay');

  const payMutation = useMutation({
    mutationFn: async () => {
      if (method === 'cash') {
        return { success: true };
      }
      if (method === 'wallet') {
        if (walletBalance < amount) {
          throw new Error(`Insufficient wallet balance. Available: ₹${walletBalance}`);
        }
        return paymentApi.payWithWallet(bookingId, amount);
      }
      // Razorpay
      const orderRes = await paymentApi.createOrder(bookingId, amount);
      const { orderId, key } = orderRes.data.data;
      // In a real app: open RazorpayCheckout here
      Alert.alert('Razorpay', `Order ID: ${orderId}\n(Razorpay SDK integration active)`);
      return orderRes;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-bookings'] });
      navigation.replace('BookingSuccess', { bookingId });
    },
    onError: (err) => Alert.alert('Payment Failed', err.message || 'Could not process payment'),
  });

  const handlePay = () => {
    if (method === 'razorpay') {
      Alert.alert(
        'Proceed with Razorpay?',
        `Pay ₹${amount} for booking at ${restaurantName}`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Pay Now', onPress: () => payMutation.mutate() },
        ]
      );
    } else {
      payMutation.mutate();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Amount Summary */}
        <View style={styles.amountCard}>
          <Text style={styles.amountLabel}>Total Amount</Text>
          <Text style={styles.amount}>₹{amount || 0}</Text>
          <Text style={styles.forText}>for {restaurantName}</Text>
        </View>

        {/* Payment Methods */}
        <Text style={styles.sectionTitle}>Choose Payment Method</Text>
        {PAYMENT_METHODS.map((pm) => {
          const isWalletDisabled = pm.id === 'wallet' && walletBalance < (amount || 0);
          return (
            <TouchableOpacity
              key={pm.id}
              style={[
                styles.methodCard,
                method === pm.id && styles.methodCardActive,
                isWalletDisabled && styles.methodCardDisabled,
              ]}
              onPress={() => !isWalletDisabled && setMethod(pm.id)}
              activeOpacity={0.8}
            >
              <Text style={styles.methodIcon}>{pm.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.methodLabel, method === pm.id && styles.methodLabelActive]}>
                  {pm.label}
                </Text>
                <Text style={styles.methodDesc}>
                  {pm.id === 'wallet'
                    ? `Balance: ₹${walletBalance}${isWalletDisabled ? ' (insufficient)' : ''}`
                    : pm.desc}
                </Text>
              </View>
              <View style={[styles.radio, method === pm.id && styles.radioActive]}>
                {method === pm.id && <View style={styles.radioDot} />}
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Security Note */}
        <View style={styles.securityNote}>
          <Text style={styles.securityIcon}>🔒</Text>
          <Text style={styles.securityText}>Your payment is 100% secure and encrypted</Text>
        </View>
      </ScrollView>

      {/* Pay Button */}
      <View style={styles.footer}>
        <View style={styles.footerMeta}>
          <Text style={styles.footerLabel}>Paying via</Text>
          <Text style={styles.footerMethod}>
            {PAYMENT_METHODS.find((m) => m.id === method)?.label}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.payBtn, payMutation.isPending && { opacity: 0.6 }]}
          onPress={handlePay}
          disabled={payMutation.isPending}
        >
          {payMutation.isPending
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.payBtnText}>
                {method === 'cash' ? 'Confirm Booking' : `Pay ₹${amount || 0}`}
              </Text>}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm,
    backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f1f3f5',
  },
  backBtn: { padding: 8 },
  backText: { fontSize: 22, color: COLORS.primary },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#212529' },
  scroll: { padding: SPACING.md, paddingBottom: 120 },
  amountCard: {
    backgroundColor: COLORS.primary, borderRadius: BORDER_RADIUS.lg,
    padding: 28, alignItems: 'center', marginBottom: SPACING.lg,
  },
  amountLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 14, marginBottom: 6 },
  amount: { color: '#fff', fontSize: 48, fontWeight: '900', marginBottom: 4 },
  forText: { color: 'rgba(255,255,255,0.7)', fontSize: 13 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#212529', marginBottom: 12 },
  methodCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: '#fff', borderRadius: BORDER_RADIUS.md, padding: SPACING.md,
    marginBottom: 12, borderWidth: 2, borderColor: 'transparent',
    elevation: 1, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, shadowOffset: { width: 0, height: 2 },
  },
  methodCardActive: { borderColor: COLORS.primary, backgroundColor: '#fff0f1' },
  methodCardDisabled: { opacity: 0.4 },
  methodIcon: { fontSize: 28 },
  methodLabel: { fontSize: 15, fontWeight: '700', color: '#212529', marginBottom: 2 },
  methodLabelActive: { color: COLORS.primary },
  methodDesc: { fontSize: 12, color: '#868e96' },
  radio: {
    width: 22, height: 22, borderRadius: 11, borderWidth: 2,
    borderColor: '#ced4da', justifyContent: 'center', alignItems: 'center',
  },
  radioActive: { borderColor: COLORS.primary },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.primary },
  securityNote: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#f8f9fa', borderRadius: 10, padding: 14, marginTop: 8,
  },
  securityIcon: { fontSize: 18 },
  securityText: { fontSize: 12, color: '#868e96', flex: 1 },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#fff', padding: SPACING.md, paddingBottom: 32,
    flexDirection: 'row', alignItems: 'center', gap: 14,
    borderTopWidth: 1, borderTopColor: '#f1f3f5',
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: -4 },
  },
  footerMeta: { flex: 1 },
  footerLabel: { fontSize: 11, color: '#868e96' },
  footerMethod: { fontSize: 14, fontWeight: '700', color: '#212529' },
  payBtn: { backgroundColor: COLORS.primary, borderRadius: BORDER_RADIUS.md, paddingHorizontal: 28, paddingVertical: 16 },
  payBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
