import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Platform, StatusBar, ActivityIndicator, TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useMutation } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import bookingApi from '../../api/booking.api';
import paymentApi from '../../api/payment.api';
import { COLORS, FONTS, SIZES, SPACING, BORDER_RADIUS, SHADOW } from '../../constants';

export default function BookingConfirmScreen({ navigation, route }) {
  const { restaurantId, restaurantName, date, time, guests, tableId, specialRequest } = route.params;

  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [couponLoading, setCouponLoading] = useState(false);

  const depositAmount = 200; // Example deposit
  const discount = couponApplied?.discountAmount || 0;
  const finalAmount = Math.max(0, depositAmount - discount);

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    try {
      const { data } = await paymentApi.applyCoupon(couponCode, { restaurantId, guests, amount: depositAmount });
      setCouponApplied(data.data);
      Toast.show({ type: 'success', text1: `Coupon applied! ₹${data.data.discountAmount} off` });
    } catch (err) {
      Toast.show({ type: 'error', text1: err.response?.data?.message || 'Invalid coupon' });
    } finally {
      setCouponLoading(false);
    }
  };

  const bookingMutation = useMutation({
    mutationFn: async () => {
      // Create booking
      const { data: bookingData } = await bookingApi.create({
        restaurantId,
        tableId,
        date,
        time,
        guests,
        specialRequest,
        couponCode: couponApplied ? couponCode : undefined,
        paymentMethod,
      });
      return bookingData.data;
    },
    onSuccess: (data) => {
      navigation.navigate('BookingSuccess', {
        bookingId: data.booking._id,
        bookingCode: data.booking.bookingId,
        restaurantName,
        date,
        time,
        guests,
      });
    },
    onError: (err) => {
      Toast.show({
        type: 'error',
        text1: 'Booking Failed',
        text2: err.response?.data?.message || 'Please try again',
      });
    },
  });

  const PAYMENT_METHODS = [
    { id: 'razorpay', label: 'UPI / Card / Net Banking', icon: 'card-outline', desc: 'Powered by Razorpay' },
    { id: 'wallet', label: 'Hungora Wallet', icon: 'wallet-outline', desc: 'Balance: ₹1,250' },
    { id: 'cash', label: 'Pay at Restaurant', icon: 'cash-outline', desc: 'No advance payment' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <LinearGradient colors={['#1B5E8F', '#0C2F4E']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Confirm Booking</Text>
      </LinearGradient>

      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
        {/* Booking Details Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="restaurant" size={20} color={COLORS.primary} />
            <Text style={styles.cardTitle}>Booking Details</Text>
          </View>
          <Text style={styles.restaurantName}>{restaurantName}</Text>

          <View style={styles.detailsGrid}>
            <DetailItem icon="calendar-outline" label="Date" value={date} />
            <DetailItem icon="time-outline" label="Time" value={time} />
            <DetailItem icon="people-outline" label="Guests" value={`${guests} people`} />
            {specialRequest ? <DetailItem icon="chatbox-outline" label="Request" value={specialRequest} /> : null}
          </View>
        </View>

        {/* Coupon */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Apply Coupon</Text>
          <View style={styles.couponRow}>
            <View style={styles.couponInput}>
              <Ionicons name="pricetag-outline" size={16} color={COLORS.gray} />
              <TextInput
                style={styles.couponText}
                value={couponCode}
                onChangeText={setCouponCode}
                placeholder="Enter coupon code"
                placeholderTextColor={COLORS.lightGray}
                autoCapitalize="characters"
                editable={!couponApplied}
              />
              {couponApplied && (
                <TouchableOpacity onPress={() => { setCouponApplied(null); setCouponCode(''); }}>
                  <Ionicons name="close-circle" size={18} color={COLORS.error} />
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity
              style={[styles.applyBtn, couponApplied && styles.applyBtnApplied]}
              onPress={applyCoupon}
              disabled={couponLoading || !!couponApplied}
            >
              {couponLoading ? (
                <ActivityIndicator size="small" color={COLORS.white} />
              ) : (
                <Text style={styles.applyBtnText}>{couponApplied ? 'Applied ✓' : 'Apply'}</Text>
              )}
            </TouchableOpacity>
          </View>
          {couponApplied && (
            <Text style={styles.couponSuccess}>🎉 ₹{couponApplied.discountAmount} discount applied!</Text>
          )}
        </View>

        {/* Payment Method */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Payment Method</Text>
          {PAYMENT_METHODS.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[styles.paymentMethod, paymentMethod === method.id && styles.paymentMethodActive]}
              onPress={() => setPaymentMethod(method.id)}
            >
              <View style={[styles.paymentIcon, paymentMethod === method.id && styles.paymentIconActive]}>
                <Ionicons name={method.icon} size={18} color={paymentMethod === method.id ? COLORS.white : COLORS.gray} />
              </View>
              <View style={styles.paymentInfo}>
                <Text style={[styles.paymentLabel, paymentMethod === method.id && styles.paymentLabelActive]}>
                  {method.label}
                </Text>
                <Text style={styles.paymentDesc}>{method.desc}</Text>
              </View>
              <View style={[styles.radio, paymentMethod === method.id && styles.radioActive]}>
                {paymentMethod === method.id && <View style={styles.radioDot} />}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Bill Summary */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Bill Summary</Text>
          <BillRow label="Advance Deposit" value={`₹${depositAmount}`} />
          {couponApplied && <BillRow label={`Coupon (${couponCode})`} value={`-₹${discount}`} isDiscount />}
          <View style={styles.billDivider} />
          <BillRow label="Total Payable" value={`₹${finalAmount}`} isBold />
          <Text style={styles.billNote}>* Remaining amount payable at restaurant</Text>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Confirm CTA */}
      <View style={styles.cta}>
        <View style={styles.ctaLeft}>
          <Text style={styles.ctaAmount}>₹{finalAmount}</Text>
          <Text style={styles.ctaLabel}>Total amount</Text>
        </View>
        <TouchableOpacity
          style={styles.confirmBtn}
          onPress={() => bookingMutation.mutate()}
          activeOpacity={0.88}
          disabled={bookingMutation.isPending}
        >
          <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.confirmBtnGrad}>
            {bookingMutation.isPending ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.confirmBtnText}>
                {finalAmount > 0 ? 'Pay & Book' : 'Confirm Booking'}
              </Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function DetailItem({ icon, label, value }) {
  return (
    <View style={detailStyles.item}>
      <Ionicons name={icon} size={14} color={COLORS.primary} />
      <Text style={detailStyles.label}>{label}</Text>
      <Text style={detailStyles.value}>{value}</Text>
    </View>
  );
}

const detailStyles = StyleSheet.create({
  item: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  label: { flex: 1, fontSize: SIZES.sm, color: COLORS.gray, fontFamily: FONTS.regular },
  value: { fontSize: SIZES.sm, fontFamily: FONTS.semiBold, color: COLORS.dark },
});

function BillRow({ label, value, isDiscount, isBold }) {
  return (
    <View style={billStyles.row}>
      <Text style={[billStyles.label, isBold && billStyles.bold]}>{label}</Text>
      <Text style={[billStyles.value, isDiscount && billStyles.discount, isBold && billStyles.bold]}>{value}</Text>
    </View>
  );
}

const billStyles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  label: { fontSize: SIZES.sm, color: COLORS.gray, fontFamily: FONTS.regular },
  value: { fontSize: SIZES.sm, color: COLORS.dark, fontFamily: FONTS.medium },
  discount: { color: COLORS.secondary },
  bold: { fontFamily: FONTS.bold, color: COLORS.dark, fontSize: SIZES.base },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 56 : 36,
    paddingBottom: SPACING.md,
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: SIZES.lg, fontFamily: FONTS.bold, color: COLORS.white },
  body: { flex: 1 },
  card: {
    backgroundColor: COLORS.card,
    margin: SPACING.lg,
    marginBottom: 0,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    ...SHADOW.sm,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.sm },
  cardTitle: { fontSize: SIZES.base, fontFamily: FONTS.bold, color: COLORS.dark, marginBottom: SPACING.sm },
  restaurantName: { fontSize: SIZES.lg, fontFamily: FONTS.bold, color: COLORS.primary, marginBottom: SPACING.md },
  detailsGrid: { gap: 0 },
  couponRow: { flexDirection: 'row', gap: SPACING.sm, alignItems: 'center' },
  couponInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    height: 48,
    gap: SPACING.sm,
    backgroundColor: COLORS.background,
  },
  couponText: { flex: 1, fontSize: SIZES.base, color: COLORS.dark, fontFamily: FONTS.medium },
  applyBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.lg,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyBtnApplied: { backgroundColor: COLORS.secondary },
  applyBtnText: { fontSize: SIZES.sm, fontFamily: FONTS.bold, color: COLORS.white },
  couponSuccess: { fontSize: SIZES.sm, color: COLORS.secondary, fontFamily: FONTS.medium, marginTop: 8 },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  paymentMethodActive: { borderBottomColor: 'transparent' },
  paymentIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.background, alignItems: 'center', justifyContent: 'center' },
  paymentIconActive: { backgroundColor: COLORS.primary },
  paymentInfo: { flex: 1 },
  paymentLabel: { fontSize: SIZES.sm, fontFamily: FONTS.semiBold, color: COLORS.dark },
  paymentLabelActive: { color: COLORS.primary },
  paymentDesc: { fontSize: SIZES.xs, color: COLORS.gray, fontFamily: FONTS.regular, marginTop: 2 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center' },
  radioActive: { borderColor: COLORS.primary },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.primary },
  billDivider: { height: 1, backgroundColor: COLORS.border, marginVertical: 8 },
  billNote: { fontSize: SIZES.xs, color: COLORS.lightGray, fontFamily: FONTS.regular, marginTop: SPACING.sm },
  cta: {
    backgroundColor: COLORS.card,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.lg,
    paddingBottom: Platform.OS === 'ios' ? 30 : SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    ...SHADOW.lg,
  },
  ctaLeft: {},
  ctaAmount: { fontSize: SIZES.xl, fontFamily: FONTS.bold, color: COLORS.dark },
  ctaLabel: { fontSize: SIZES.xs, color: COLORS.gray, fontFamily: FONTS.regular },
  confirmBtn: { borderRadius: BORDER_RADIUS.md, overflow: 'hidden', minWidth: 140 },
  confirmBtnGrad: { paddingHorizontal: SPACING.xl, paddingVertical: 15, alignItems: 'center' },
  confirmBtnText: { fontSize: SIZES.base, fontFamily: FONTS.bold, color: COLORS.white },
});
