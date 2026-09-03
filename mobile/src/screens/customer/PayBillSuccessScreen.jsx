import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Platform, StatusBar, Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, SPACING, BORDER_RADIUS, SHADOW } from '../../constants';

export default function PayBillSuccessScreen({ route, navigation }) {
  const { billPayment, restaurantName } = route.params || {};

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 1, tension: 80, friction: 6, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  const rows = [
    { label: 'Restaurant', value: restaurantName || '—' },
    { label: 'Bill Amount', value: `₹${(billPayment?.billAmount || 0).toLocaleString()}` },
    { label: 'Discount', value: billPayment?.discountAmount > 0 ? `- ₹${billPayment.discountAmount.toLocaleString()}` : '₹0', highlight: '#2d6a4f' },
    { label: 'You Paid', value: `₹${(billPayment?.finalAmount || 0).toLocaleString()}`, bold: true },
    { label: 'Payment Method', value: (billPayment?.paymentMethod || 'razorpay').toUpperCase() },
    { label: 'Reference', value: billPayment?.billPaymentId || '—', mono: true },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={['#1B5E8F', '#0C2F4E']} style={styles.hero}>
        <Animated.View style={[styles.checkCircle, { transform: [{ scale: scaleAnim }] }]}>
          <LinearGradient colors={['#2d6a4f', '#40916c']} style={styles.checkGrad}>
            <Ionicons name="checkmark" size={48} color="#fff" />
          </LinearGradient>
        </Animated.View>
        <Animated.View style={{ opacity: fadeAnim, alignItems: 'center' }}>
          <Text style={styles.heroTitle}>Payment Successful!</Text>
          <Text style={styles.heroSub}>Your bill has been paid successfully</Text>
        </Animated.View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scroll}>
        {billPayment?.discountAmount > 0 && (
          <View style={styles.savingsBanner}>
            <Ionicons name="pricetag" size={16} color="#2d6a4f" />
            <Text style={styles.savingsText}>
              You saved ₹{billPayment.discountAmount.toLocaleString()} with offer!
            </Text>
          </View>
        )}

        <View style={styles.receiptCard}>
          <View style={styles.receiptHeader}>
            <Ionicons name="receipt-outline" size={18} color={COLORS.primary} />
            <Text style={styles.receiptTitle}>Payment Receipt</Text>
          </View>

          {rows.map((row, i) => (
            <View key={i} style={[styles.row, i < rows.length - 1 && styles.rowBorder]}>
              <Text style={styles.rowLabel}>{row.label}</Text>
              <Text style={[
                styles.rowValue,
                row.bold && { fontFamily: FONTS.bold, fontSize: SIZES.base },
                row.highlight && { color: row.highlight },
                row.mono && { fontFamily: 'monospace', fontSize: SIZES.xs },
              ]}>
                {row.value}
              </Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.homeBtn}
          onPress={() => navigation.reset({ index: 0, routes: [{ name: 'CustomerTabs' }] })}
          activeOpacity={0.88}
        >
          <LinearGradient colors={['#e63946', '#c1121f']} style={styles.homeBtnGrad}>
            <Text style={styles.homeBtnText}>Back to Home</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.historyBtn}
          onPress={() => navigation.navigate('BillPaymentHistory')}
        >
          <Text style={styles.historyBtnText}>View Payment History</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  hero: {
    paddingTop: Platform.OS === 'ios' ? 80 : 60,
    paddingBottom: 40,
    alignItems: 'center',
    gap: 16,
  },
  checkCircle: {
    width: 96, height: 96, borderRadius: 48,
    shadowColor: '#2d6a4f', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 12, elevation: 8,
  },
  checkGrad: { width: 96, height: 96, borderRadius: 48, alignItems: 'center', justifyContent: 'center' },
  heroTitle: { fontSize: SIZES.xxl, fontFamily: FONTS.bold, color: '#fff' },
  heroSub: { fontSize: SIZES.sm, fontFamily: FONTS.regular, color: 'rgba(255,255,255,0.7)' },
  scroll: { padding: SPACING.lg, paddingBottom: 40 },
  savingsBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#d8f3dc', borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md, marginBottom: SPACING.lg,
    borderWidth: 1, borderColor: '#52b788',
  },
  savingsText: { fontSize: SIZES.base, fontFamily: FONTS.bold, color: '#2d6a4f' },
  receiptCard: {
    backgroundColor: COLORS.card, borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg, ...SHADOW.md, marginBottom: SPACING.xl,
  },
  receiptHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginBottom: SPACING.md, paddingBottom: SPACING.md,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  receiptTitle: { fontSize: SIZES.base, fontFamily: FONTS.bold, color: COLORS.dark },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.border },
  rowLabel: { fontSize: SIZES.sm, fontFamily: FONTS.regular, color: COLORS.gray },
  rowValue: { fontSize: SIZES.sm, fontFamily: FONTS.medium, color: COLORS.dark, maxWidth: '60%', textAlign: 'right' },
  homeBtn: { borderRadius: BORDER_RADIUS.md, overflow: 'hidden', marginBottom: SPACING.md },
  homeBtnGrad: { padding: 16, alignItems: 'center' },
  homeBtnText: { fontSize: SIZES.base, fontFamily: FONTS.bold, color: '#fff' },
  historyBtn: { alignItems: 'center', padding: SPACING.md },
  historyBtnText: { fontSize: SIZES.sm, fontFamily: FONTS.medium, color: COLORS.primary },
});
