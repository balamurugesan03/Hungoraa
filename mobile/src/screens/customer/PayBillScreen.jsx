import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput,
  ActivityIndicator, FlatList, Platform, StatusBar, KeyboardAvoidingView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useQuery, useMutation } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import billPaymentApi from '../../api/billPayment.api';
import { COLORS, FONTS, SIZES, SPACING, BORDER_RADIUS, SHADOW } from '../../constants';

const STEPS = ['Restaurant', 'Bill Amount', 'Preview', 'Pay'];

// ─── Step 1: Restaurant Picker ────────────────────────────────────────────────
function RestaurantPicker({ onSelect }) {
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['pay-bill-restaurants', search],
    queryFn: () => billPaymentApi.getRestaurants({ search: search || undefined }).then((r) => r.data.data.restaurants),
  });

  const restaurants = data || [];

  return (
    <View style={{ flex: 1 }}>
      <View style={rp.searchRow}>
        <Ionicons name="search-outline" size={18} color={COLORS.gray} />
        <TextInput
          style={rp.searchInput}
          placeholder="Search restaurant..."
          placeholderTextColor={COLORS.lightGray}
          value={search}
          onChangeText={setSearch}
          autoFocus
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color={COLORS.lightGray} />
          </TouchableOpacity>
        )}
      </View>

      {isLoading ? (
        <View style={rp.center}>
          <ActivityIndicator color={COLORS.primary} />
        </View>
      ) : restaurants.length === 0 ? (
        <View style={rp.center}>
          <Text style={rp.emptyIcon}>🍽️</Text>
          <Text style={rp.emptyTitle}>No restaurants found</Text>
          <Text style={rp.emptySub}>Try a different search or check back later</Text>
        </View>
      ) : (
        <FlatList
          data={restaurants}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <TouchableOpacity style={rp.card} onPress={() => onSelect(item)} activeOpacity={0.8}>
              <View style={rp.cardLeft}>
                <View style={rp.avatar}>
                  <Text style={rp.avatarText}>{item.name.charAt(0)}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={rp.name} numberOfLines={1}>{item.name}</Text>
                  <Text style={rp.address} numberOfLines={1}>
                    {item.address?.city} • {item.cuisine?.slice(0, 2).join(', ')}
                  </Text>
                  {item.averageRating > 0 && (
                    <View style={rp.ratingRow}>
                      <Ionicons name="star" size={12} color="#C8952B" />
                      <Text style={rp.rating}>{item.averageRating.toFixed(1)}</Text>
                    </View>
                  )}
                </View>
              </View>
              <View style={rp.payBillTag}>
                <Text style={rp.payBillTagText}>Pay Bill</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

// ─── Step 2: Bill Amount Entry ─────────────────────────────────────────────────
function BillAmountEntry({ restaurant, onNext }) {
  const [amount, setAmount] = useState('');

  const fetchMutation = useMutation({
    mutationFn: (grossAmount) =>
      billPaymentApi.fetchBill({ restaurantId: restaurant._id, grossAmount }).then((r) => r.data.data),
    onSuccess: (data, grossAmount) => {
      onNext({ billPaymentId: data.billPayment._id, grossAmount });
    },
    onError: (err) => Toast.show({
      type: 'error',
      text1: 'Could not fetch bill',
      text2: err.response?.data?.message || 'Please try again',
    }),
  });

  const handleNext = () => {
    const val = parseFloat(amount);
    if (!val || val <= 0) {
      Toast.show({ type: 'error', text1: 'Enter a valid bill amount' });
      return;
    }
    fetchMutation.mutate(val);
  };

  const QUICK_AMOUNTS = [500, 1000, 1500, 2000, 3000, 5000];

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={ba.scroll} keyboardShouldPersistTaps="handled">
        <View style={ba.restaurantCard}>
          <View style={ba.restaurantAvatar}>
            <Text style={ba.restaurantAvatarText}>{restaurant.name.charAt(0)}</Text>
          </View>
          <View>
            <Text style={ba.restaurantName}>{restaurant.name}</Text>
            <Text style={ba.restaurantCity}>{restaurant.address?.city}</Text>
          </View>
        </View>

        <Text style={ba.label}>Enter Bill Amount</Text>
        <View style={ba.amountRow}>
          <Text style={ba.rupee}>₹</Text>
          <TextInput
            style={ba.amountInput}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor={COLORS.lightGray}
            autoFocus
          />
        </View>

        <Text style={ba.quickLabel}>Quick Select</Text>
        <View style={ba.quickGrid}>
          {QUICK_AMOUNTS.map((a) => (
            <TouchableOpacity
              key={a}
              style={[ba.quickChip, amount === String(a) && ba.quickChipActive]}
              onPress={() => setAmount(String(a))}
            >
              <Text style={[ba.quickChipText, amount === String(a) && ba.quickChipTextActive]}>
                ₹{a.toLocaleString()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[ba.nextBtn, (!amount || parseFloat(amount) <= 0 || fetchMutation.isPending) && ba.nextBtnDisabled]}
          onPress={handleNext}
          disabled={!amount || parseFloat(amount) <= 0 || fetchMutation.isPending}
        >
          <LinearGradient
            colors={[COLORS.primary, COLORS.primaryDark || COLORS.primary]}
            style={ba.nextBtnGrad}
          >
            {fetchMutation.isPending
              ? <ActivityIndicator color="#fff" />
              : <Text style={ba.nextBtnText}>Get Offer & Preview →</Text>
            }
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── Step 3: Preview + Offer ───────────────────────────────────────────────────
function BillPreview({ restaurant, billPaymentId, grossAmount, onPay, onBack }) {
  const [couponCode, setCouponCode] = useState('');
  const [discountBreakup, setDiscountBreakup] = useState(null);
  const [netPaid, setNetPaid] = useState(grossAmount);
  const [appliedOffer, setAppliedOffer] = useState(null);

  const applyMutation = useMutation({
    mutationFn: () =>
      billPaymentApi.applyOffer(billPaymentId, { couponCode }).then((r) => r.data.data),
    onSuccess: (data) => {
      setDiscountBreakup(data.billPayment.discountBreakup);
      setNetPaid(data.billPayment.netPaid);
      setAppliedOffer(data.billPayment.offer);
      Toast.show({ type: 'success', text1: 'Offer applied!' });
    },
    onError: (err) => Toast.show({
      type: 'error',
      text1: 'Invalid coupon',
      text2: err.response?.data?.message || 'Coupon not valid for this bill',
    }),
  });

  const totalDiscount = discountBreakup?.total || 0;

  return (
    <ScrollView contentContainerStyle={pv.scroll}>
      {/* Restaurant */}
      <View style={pv.restaurantRow}>
        <View style={pv.restaurantDot}>
          <Text style={pv.restaurantDotText}>{restaurant.name.charAt(0)}</Text>
        </View>
        <Text style={pv.restaurantName}>{restaurant.name}</Text>
      </View>

      {/* Coupon Input */}
      <View style={pv.couponCard}>
        <Text style={pv.couponLabel}>Have a coupon?</Text>
        <View style={pv.couponRow}>
          <TextInput
            style={pv.couponInput}
            value={couponCode}
            onChangeText={setCouponCode}
            placeholder="Enter coupon code"
            placeholderTextColor={COLORS.lightGray}
            autoCapitalize="characters"
          />
          <TouchableOpacity
            style={[pv.couponBtn, (!couponCode || applyMutation.isPending) && pv.couponBtnDisabled]}
            onPress={() => applyMutation.mutate()}
            disabled={!couponCode || applyMutation.isPending}
          >
            {applyMutation.isPending
              ? <ActivityIndicator color="#fff" size="small" />
              : <Text style={pv.couponBtnText}>Apply</Text>
            }
          </TouchableOpacity>
        </View>
      </View>

      {/* Applied offer badge */}
      {appliedOffer && (
        <View style={pv.offerBadge}>
          <Ionicons name="pricetag" size={16} color="#2d6a4f" />
          <Text style={pv.offerBadgeText}>
            {appliedOffer.type === 'percentage'
              ? `${appliedOffer.discountValue}% OFF`
              : `Flat ₹${appliedOffer.discountValue} OFF`}
          </Text>
          <Text style={pv.offerTitle}>{appliedOffer.title}</Text>
        </View>
      )}

      {/* Bill Breakdown */}
      <View style={pv.breakdownCard}>
        <Text style={pv.breakdownTitle}>Bill Breakdown</Text>

        <View style={pv.row}>
          <Text style={pv.rowLabel}>Restaurant Bill</Text>
          <Text style={pv.rowValue}>₹{grossAmount.toLocaleString()}</Text>
        </View>

        {totalDiscount > 0 && (
          <>
            <View style={pv.row}>
              <Text style={[pv.rowLabel, { color: '#2d6a4f' }]}>Total Discount</Text>
              <Text style={[pv.rowValue, { color: '#2d6a4f' }]}>- ₹{totalDiscount.toLocaleString()}</Text>
            </View>
            {discountBreakup.restaurantFunded > 0 && (
              <View style={pv.row}>
                <Text style={pv.subLabel}>  • Restaurant</Text>
                <Text style={pv.subValue}>₹{discountBreakup.restaurantFunded.toLocaleString()}</Text>
              </View>
            )}
            {discountBreakup.platformFunded > 0 && (
              <View style={pv.row}>
                <Text style={pv.subLabel}>  • DineSmart</Text>
                <Text style={pv.subValue}>₹{discountBreakup.platformFunded.toLocaleString()}</Text>
              </View>
            )}
            {discountBreakup.bankFunded > 0 && (
              <View style={pv.row}>
                <Text style={pv.subLabel}>  • Bank Offer</Text>
                <Text style={pv.subValue}>₹{discountBreakup.bankFunded.toLocaleString()}</Text>
              </View>
            )}
          </>
        )}

        <View style={pv.divider} />

        <View style={pv.totalRow}>
          <Text style={pv.totalLabel}>You Pay</Text>
          <Text style={pv.totalValue}>₹{netPaid.toLocaleString()}</Text>
        </View>

        {totalDiscount > 0 && (
          <View style={pv.savingsBadge}>
            <Ionicons name="checkmark-circle" size={14} color="#2d6a4f" />
            <Text style={pv.savingsText}>You save ₹{totalDiscount.toLocaleString()}!</Text>
          </View>
        )}
      </View>

      <TouchableOpacity
        style={pv.payBtn}
        onPress={() => onPay({ billPaymentId, grossAmount, netPaid, discountBreakup, offer: appliedOffer })}
        activeOpacity={0.88}
      >
        <LinearGradient colors={['#e63946', '#c1121f']} style={pv.payBtnGrad}>
          <Text style={pv.payBtnText}>Pay ₹{netPaid.toLocaleString()} →</Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity style={pv.backBtn} onPress={onBack}>
        <Text style={pv.backBtnText}>← Change Amount</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ─── Step 4: Payment Method ───────────────────────────────────────────────────
function PaymentStep({ previewData, onSuccess, onBack }) {
  const [method, setMethod] = useState('razorpay');

  const completeMutation = useMutation({
    mutationFn: () =>
      billPaymentApi.completeBillPayment(previewData.billPaymentId, {
        paymentMethod: method,
      }).then((r) => r.data.data),
    onSuccess: (data) => {
      if (method === 'wallet') {
        onSuccess(data.billPayment);
      } else {
        Alert.alert(
          'Razorpay Payment',
          `Amount: ₹${previewData.netPaid}\n\n(Integrate Razorpay SDK here)`,
          [{ text: 'Simulate Success', onPress: () => onSuccess(data.billPayment) }]
        );
      }
    },
    onError: (err) => Toast.show({
      type: 'error',
      text1: 'Payment Failed',
      text2: err.response?.data?.message || 'Please try again',
    }),
  });

  const METHODS = [
    { id: 'razorpay', label: 'UPI / Card / Net Banking', icon: 'card-outline', sub: 'Powered by Razorpay' },
    { id: 'wallet', label: 'Hungora Wallet', icon: 'wallet-outline', sub: 'Instant payment' },
  ];

  return (
    <ScrollView contentContainerStyle={ps.scroll}>
      <View style={ps.amountCard}>
        <Text style={ps.amountLabel}>Amount to Pay</Text>
        <Text style={ps.amountValue}>₹{previewData.netPaid.toLocaleString()}</Text>
        {(previewData.discountBreakup?.total || 0) > 0 && (
          <Text style={ps.savingNote}>
            Saving ₹{previewData.discountBreakup.total.toLocaleString()}
          </Text>
        )}
      </View>

      <Text style={ps.sectionLabel}>SELECT PAYMENT METHOD</Text>

      {METHODS.map((m) => (
        <TouchableOpacity
          key={m.id}
          style={[ps.method, method === m.id && ps.methodActive]}
          onPress={() => setMethod(m.id)}
        >
          <View style={[ps.methodIcon, method === m.id && ps.methodIconActive]}>
            <Ionicons name={m.icon} size={20} color={method === m.id ? COLORS.white : COLORS.gray} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[ps.methodLabel, method === m.id && ps.methodLabelActive]}>{m.label}</Text>
            <Text style={ps.methodSub}>{m.sub}</Text>
          </View>
          <View style={[ps.radio, method === m.id && ps.radioActive]}>
            {method === m.id && <View style={ps.radioDot} />}
          </View>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={ps.payBtn}
        onPress={() => completeMutation.mutate()}
        disabled={completeMutation.isPending}
        activeOpacity={0.88}
      >
        <LinearGradient colors={['#e63946', '#c1121f']} style={ps.payBtnGrad}>
          {completeMutation.isPending
            ? <ActivityIndicator color="#fff" />
            : <Text style={ps.payBtnText}>Pay ₹{previewData.netPaid.toLocaleString()}</Text>
          }
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity style={ps.backBtn} onPress={onBack}>
        <Text style={ps.backBtnText}>← Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function PayBillScreen({ navigation }) {
  const [step, setStep] = useState(0);
  const [restaurant, setRestaurant] = useState(null);
  // billDraft: { billPaymentId, grossAmount }
  const [billDraft, setBillDraft] = useState(null);
  // previewData: { billPaymentId, grossAmount, netPaid, discountBreakup, offer }
  const [previewData, setPreviewData] = useState(null);

  const handleSelectRestaurant = (r) => { setRestaurant(r); setStep(1); };
  const handleBillFetched = (draft) => { setBillDraft(draft); setStep(2); };
  const handlePreviewNext = (data) => { setPreviewData(data); setStep(3); };
  const handleSuccess = (billPayment) => {
    navigation.replace('PayBillSuccess', { billPayment, restaurantName: restaurant?.name });
  };

  const goBack = () => {
    if (step === 0) navigation.goBack();
    else setStep((s) => s - 1);
  };

  const STEP_TITLES = ['Select Restaurant', 'Enter Bill Amount', 'Offer Preview', 'Payment'];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <LinearGradient colors={['#1B5E8F', '#0C2F4E']} style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Pay Bill</Text>
          <Text style={styles.headerSub}>{STEP_TITLES[step]}</Text>
        </View>
        <View style={styles.stepDots}>
          {STEPS.map((_, i) => (
            <View key={i} style={[styles.dot, i <= step && styles.dotActive]} />
          ))}
        </View>
      </LinearGradient>

      <View style={{ flex: 1 }}>
        {step === 0 && <RestaurantPicker onSelect={handleSelectRestaurant} />}
        {step === 1 && restaurant && (
          <BillAmountEntry restaurant={restaurant} onNext={handleBillFetched} />
        )}
        {step === 2 && restaurant && billDraft && (
          <BillPreview
            restaurant={restaurant}
            billPaymentId={billDraft.billPaymentId}
            grossAmount={billDraft.grossAmount}
            onPay={handlePreviewNext}
            onBack={() => setStep(1)}
          />
        )}
        {step === 3 && previewData && (
          <PaymentStep
            previewData={previewData}
            onSuccess={handleSuccess}
            onBack={() => setStep(2)}
          />
        )}
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.md,
    paddingTop: Platform.OS === 'ios' ? 56 : 36,
    paddingBottom: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: SIZES.lg, fontFamily: FONTS.bold, color: '#fff' },
  headerSub: { fontSize: SIZES.xs, color: 'rgba(255,255,255,0.6)', fontFamily: FONTS.regular },
  stepDots: { flexDirection: 'row', gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.3)' },
  dotActive: { backgroundColor: '#FFFFFF', width: 18 },
});

const rp = StyleSheet.create({
  searchRow: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.sm,
    backgroundColor: COLORS.card, margin: SPACING.md,
    paddingHorizontal: SPACING.md, paddingVertical: 10,
    borderRadius: BORDER_RADIUS.md, borderWidth: 1.5, borderColor: COLORS.border,
  },
  searchInput: { flex: 1, fontSize: SIZES.base, fontFamily: FONTS.regular, color: COLORS.dark },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 8 },
  emptyIcon: { fontSize: 40 },
  emptyTitle: { fontSize: SIZES.base, fontFamily: FONTS.bold, color: COLORS.dark },
  emptySub: { fontSize: SIZES.sm, fontFamily: FONTS.regular, color: COLORS.gray, textAlign: 'center', paddingHorizontal: 40 },
  card: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: COLORS.card, marginHorizontal: SPACING.md,
    marginBottom: SPACING.sm, borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md, ...SHADOW.sm,
  },
  cardLeft: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, flex: 1 },
  avatar: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: '#e63946', alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: SIZES.xl, fontFamily: FONTS.bold, color: '#fff' },
  name: { fontSize: SIZES.base, fontFamily: FONTS.bold, color: COLORS.dark },
  address: { fontSize: SIZES.xs, fontFamily: FONTS.regular, color: COLORS.gray, marginTop: 2 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 3 },
  rating: { fontSize: SIZES.xs, fontFamily: FONTS.medium, color: COLORS.dark },
  payBillTag: {
    backgroundColor: '#e8f5e9', paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 12,
  },
  payBillTagText: { fontSize: 11, fontFamily: FONTS.bold, color: '#2d6a4f' },
});

const ba = StyleSheet.create({
  scroll: { padding: SPACING.lg },
  restaurantCard: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.md,
    backgroundColor: COLORS.card, borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md, marginBottom: SPACING.xl, ...SHADOW.sm,
  },
  restaurantAvatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#e63946', alignItems: 'center', justifyContent: 'center',
  },
  restaurantAvatarText: { fontSize: SIZES.lg, fontFamily: FONTS.bold, color: '#fff' },
  restaurantName: { fontSize: SIZES.base, fontFamily: FONTS.bold, color: COLORS.dark },
  restaurantCity: { fontSize: SIZES.xs, fontFamily: FONTS.regular, color: COLORS.gray },
  label: { fontSize: SIZES.sm, fontFamily: FONTS.bold, color: COLORS.gray, marginBottom: SPACING.sm, textTransform: 'uppercase', letterSpacing: 1 },
  amountRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.card, borderRadius: BORDER_RADIUS.lg,
    borderWidth: 2, borderColor: COLORS.primary,
    paddingHorizontal: SPACING.lg, marginBottom: SPACING.xl, ...SHADOW.md,
  },
  rupee: { fontSize: 32, fontFamily: FONTS.bold, color: COLORS.primary, marginRight: 4 },
  amountInput: { flex: 1, fontSize: 40, fontFamily: FONTS.bold, color: COLORS.dark, paddingVertical: SPACING.lg },
  quickLabel: { fontSize: SIZES.xs, fontFamily: FONTS.medium, color: COLORS.gray, marginBottom: SPACING.sm },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.xl },
  quickChip: {
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: BORDER_RADIUS.md,
    borderWidth: 1.5, borderColor: COLORS.border, backgroundColor: COLORS.card,
  },
  quickChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  quickChipText: { fontSize: SIZES.sm, fontFamily: FONTS.medium, color: COLORS.dark },
  quickChipTextActive: { color: '#fff' },
  nextBtn: { borderRadius: BORDER_RADIUS.md, overflow: 'hidden', marginTop: SPACING.md },
  nextBtnDisabled: { opacity: 0.5 },
  nextBtnGrad: { padding: 16, alignItems: 'center' },
  nextBtnText: { fontSize: SIZES.base, fontFamily: FONTS.bold, color: '#fff' },
});

const pv = StyleSheet.create({
  scroll: { padding: SPACING.lg, paddingBottom: 40 },
  restaurantRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, marginBottom: SPACING.lg },
  restaurantDot: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#e63946', alignItems: 'center', justifyContent: 'center' },
  restaurantDotText: { fontSize: SIZES.xl, fontFamily: FONTS.bold, color: '#fff' },
  restaurantName: { fontSize: SIZES.lg, fontFamily: FONTS.bold, color: COLORS.dark },
  couponCard: {
    backgroundColor: COLORS.card, borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md, marginBottom: SPACING.md, ...SHADOW.sm,
  },
  couponLabel: { fontSize: SIZES.xs, fontFamily: FONTS.medium, color: COLORS.gray, marginBottom: 8 },
  couponRow: { flexDirection: 'row', gap: SPACING.sm },
  couponInput: {
    flex: 1, borderWidth: 1.5, borderColor: COLORS.border, borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: SPACING.md, paddingVertical: 10,
    fontSize: SIZES.sm, fontFamily: FONTS.medium, color: COLORS.dark,
  },
  couponBtn: {
    backgroundColor: COLORS.primary, paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.sm, alignItems: 'center', justifyContent: 'center',
  },
  couponBtnDisabled: { opacity: 0.5 },
  couponBtnText: { fontSize: SIZES.sm, fontFamily: FONTS.bold, color: '#fff' },
  offerBadge: {
    flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6,
    backgroundColor: '#d8f3dc', borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md, marginBottom: SPACING.lg, borderWidth: 1, borderColor: '#52b788',
  },
  offerBadgeText: { fontSize: SIZES.base, fontFamily: FONTS.bold, color: '#2d6a4f' },
  offerTitle: { fontSize: SIZES.xs, fontFamily: FONTS.regular, color: '#40916c' },
  breakdownCard: {
    backgroundColor: COLORS.card, borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg, ...SHADOW.md, marginBottom: SPACING.xl,
  },
  breakdownTitle: { fontSize: SIZES.base, fontFamily: FONTS.bold, color: COLORS.dark, marginBottom: SPACING.md },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 5 },
  rowLabel: { fontSize: SIZES.sm, fontFamily: FONTS.regular, color: COLORS.gray },
  rowValue: { fontSize: SIZES.sm, fontFamily: FONTS.medium, color: COLORS.dark },
  subLabel: { fontSize: SIZES.xs, fontFamily: FONTS.regular, color: COLORS.gray },
  subValue: { fontSize: SIZES.xs, fontFamily: FONTS.regular, color: '#2d6a4f' },
  divider: { height: 1.5, backgroundColor: COLORS.dark, marginVertical: SPACING.sm },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 },
  totalLabel: { fontSize: SIZES.base, fontFamily: FONTS.bold, color: COLORS.dark },
  totalValue: { fontSize: SIZES.xl, fontFamily: FONTS.bold, color: '#e63946' },
  savingsBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: SPACING.sm },
  savingsText: { fontSize: SIZES.sm, fontFamily: FONTS.medium, color: '#2d6a4f' },
  payBtn: { borderRadius: BORDER_RADIUS.md, overflow: 'hidden', marginBottom: SPACING.md },
  payBtnGrad: { padding: 16, alignItems: 'center' },
  payBtnText: { fontSize: SIZES.base, fontFamily: FONTS.bold, color: '#fff' },
  backBtn: { alignItems: 'center', padding: SPACING.md },
  backBtnText: { fontSize: SIZES.sm, fontFamily: FONTS.medium, color: COLORS.gray },
});

const ps = StyleSheet.create({
  scroll: { padding: SPACING.lg, paddingBottom: 40 },
  amountCard: {
    backgroundColor: '#F7E3E0', borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl, alignItems: 'center', marginBottom: SPACING.xl,
    borderWidth: 1.5, borderColor: '#F2C9C4',
  },
  amountLabel: { fontSize: SIZES.sm, fontFamily: FONTS.regular, color: COLORS.gray, marginBottom: 4 },
  amountValue: { fontSize: 40, fontFamily: FONTS.bold, color: '#e63946' },
  savingNote: { fontSize: SIZES.xs, fontFamily: FONTS.medium, color: '#2d6a4f', marginTop: 6 },
  sectionLabel: { fontSize: 10, fontFamily: FONTS.bold, color: COLORS.gray, letterSpacing: 1.2, marginBottom: SPACING.md },
  method: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.md,
    backgroundColor: COLORS.card, borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md, marginBottom: SPACING.sm,
    borderWidth: 1.5, borderColor: COLORS.border,
  },
  methodActive: { borderColor: '#e63946', backgroundColor: '#F7E3E0' },
  methodIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.background, alignItems: 'center', justifyContent: 'center' },
  methodIconActive: { backgroundColor: '#e63946' },
  methodLabel: { fontSize: SIZES.sm, fontFamily: FONTS.bold, color: COLORS.dark },
  methodLabelActive: { color: '#e63946' },
  methodSub: { fontSize: SIZES.xs, fontFamily: FONTS.regular, color: COLORS.gray, marginTop: 2 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center' },
  radioActive: { borderColor: '#e63946' },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#e63946' },
  payBtn: { borderRadius: BORDER_RADIUS.md, overflow: 'hidden', marginTop: SPACING.xl, marginBottom: SPACING.sm },
  payBtnGrad: { padding: 16, alignItems: 'center' },
  payBtnText: { fontSize: SIZES.base, fontFamily: FONTS.bold, color: '#fff' },
  backBtn: { alignItems: 'center', padding: SPACING.md },
  backBtnText: { fontSize: SIZES.sm, fontFamily: FONTS.medium, color: COLORS.gray },
});
