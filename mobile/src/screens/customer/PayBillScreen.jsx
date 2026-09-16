import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput,
  ActivityIndicator, FlatList, Platform, StatusBar, KeyboardAvoidingView,
  Animated, Easing, Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useQuery, useMutation } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import billPaymentApi from '../../api/billPayment.api';
import restaurantApi from '../../api/restaurant.api';
import offerApi from '../../api/offer.api';
import {
  isPayBillOffer, offerValueLabel, offerFunderLabel, computeDiscount, bestOffer,
} from '../../utils/offers';
import { COLORS, FONTS, SIZES, SPACING, BORDER_RADIUS, SHADOW } from '../../constants';

const GOLD = '#C8952B';
const GOLD_DEEP = '#A9791D';
const NAVY = '#0C2F4E';
const CREAM = '#F7EDD8';
const QUICK_AMOUNTS = [500, 1000, 1500, 2000, 3000, 5000];
const TIP_OPTIONS = [20, 30, 50, 100];

// ── Count-up rupee value ─────────────────────────────────────────────────────
function AnimatedRupee({ value, style, duration = 420 }) {
  const av = useRef(new Animated.Value(value || 0)).current;
  const [shown, setShown] = useState(Math.round(value || 0));

  useEffect(() => {
    const id = av.addListener(({ value: v }) => setShown(Math.round(v)));
    Animated.timing(av, { toValue: value || 0, duration, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();
    return () => av.removeListener(id);
  }, [value]);

  return <Text style={style}>₹{shown.toLocaleString('en-IN')}</Text>;
}

const topOfferBadge = (o) => {
  if (!o) return null;
  if (o.type === 'percentage') return `Up to ${o.discountValue}% OFF`;
  if (o.type === 'flat') return `Flat ₹${o.discountValue} OFF`;
  return 'Offer available';
};

// ── Restaurant picker (only when opened from the Pay Bill tab) ────────────────
function RestaurantPicker({ onSelect }) {
  const [search, setSearch] = useState('');

  // Try the Pay-Bill list first (it carries offer badges); if the server / that
  // route isn't reachable, fall back to the same general restaurant list the rest
  // of the app uses, so this screen is never mysteriously empty.
  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['pay-bill-restaurants'],
    queryFn: async () => {
      try {
        const r = await billPaymentApi.getRestaurants({});
        const list = r.data?.data?.restaurants || [];
        if (list.length) return list;
      } catch { /* fall through */ }
      const r2 = await restaurantApi.getAll({ limit: 50, sortBy: 'rating' });
      return r2.data?.data?.restaurants || [];
    },
    retry: 1,
  });

  const q = search.trim().toLowerCase();
  const restaurants = (data || []).filter(
    (x) => !q || x.name?.toLowerCase().includes(q) || x.address?.city?.toLowerCase().includes(q),
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={rp.searchRow}>
        <Ionicons name="search-outline" size={18} color={COLORS.gray} />
        <TextInput
          style={rp.searchInput}
          placeholder="Search for a restaurant…"
          placeholderTextColor={COLORS.lightGray}
          value={search}
          onChangeText={setSearch}
          returnKeyType="search"
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color={COLORS.lightGray} />
          </TouchableOpacity>
        )}
      </View>

      {isLoading ? (
        <View style={rp.center}><ActivityIndicator color={NAVY} /></View>
      ) : isError ? (
        <View style={rp.center}>
          <Ionicons name="cloud-offline-outline" size={40} color={COLORS.lightGray} />
          <Text style={rp.emptyTitle}>Couldn’t load restaurants</Text>
          <Text style={rp.emptySub}>Check your internet connection and try again.</Text>
          <TouchableOpacity style={rp.retryBtn} onPress={() => refetch()}>
            <Text style={rp.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : restaurants.length === 0 ? (
        <View style={rp.center}>
          <Text style={rp.emptyIcon}>🍽️</Text>
          <Text style={rp.emptyTitle}>{search ? 'No matches' : 'No restaurants yet'}</Text>
          <Text style={rp.emptySub}>
            {search ? 'Try a different name.' : 'Restaurants will appear here once they’re live.'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={restaurants}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ padding: SPACING.md, paddingBottom: 24 }}
          ListHeaderComponent={<Text style={rp.listHead}>{search ? 'Results' : 'Pay your bill at'}</Text>}
          refreshing={isFetching && !isLoading}
          onRefresh={refetch}
          renderItem={({ item }) => {
            const img = item.images?.[0]?.url || item.logo?.url;
            const badge = topOfferBadge(item.topOffer);
            return (
              <TouchableOpacity style={rp.card} onPress={() => onSelect(item)} activeOpacity={0.9}>
                {img ? (
                  <Image source={{ uri: img }} style={rp.thumb} />
                ) : (
                  <View style={[rp.thumb, rp.thumbFallback]}><Text style={rp.avatarText}>{item.name?.charAt(0)}</Text></View>
                )}
                <View style={{ flex: 1 }}>
                  <View style={rp.cardTopRow}>
                    <Text style={rp.name} numberOfLines={1}>{item.name}</Text>
                    {item.averageRating > 0 ? (
                      <View style={rp.ratingChip}>
                        <Ionicons name="star" size={10} color="#fff" />
                        <Text style={rp.ratingText}>{item.averageRating.toFixed(1)}</Text>
                      </View>
                    ) : null}
                  </View>
                  <Text style={rp.address} numberOfLines={1}>
                    {[item.cuisine?.slice(0, 2).join(', '), item.address?.city].filter(Boolean).join(' · ')}
                  </Text>
                  {badge ? (
                    <View style={rp.offerBadge}>
                      <Ionicons name="pricetag" size={10} color={GOLD_DEEP} />
                      <Text style={rp.offerBadgeText}>{badge}</Text>
                    </View>
                  ) : (
                    <Text style={rp.payHint}>Pay bill · earn reward coins</Text>
                  )}
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
}

// ── The bill form: amount → live discount → pay ──────────────────────────────
function PayBillForm({ navigation, restaurant, initialAmount, initialOfferId }) {
  const [amount, setAmount] = useState(initialAmount ? String(Math.round(initialAmount)) : '');
  const [manualOfferId, setManualOfferId] = useState(initialOfferId || null);
  const [couponCode, setCouponCode] = useState('');
  const [couponOffer, setCouponOffer] = useState(null); // { _id?, code, title, discountAmount, fundedBy }
  const [showCoupon, setShowCoupon] = useState(false);
  const [tip, setTip] = useState(0);
  const [showTip, setShowTip] = useState(false);
  const [method, setMethod] = useState('razorpay');

  const revealAnim = useRef(new Animated.Value(0)).current;
  const payScale = useRef(new Animated.Value(1)).current;
  const pressIn = () => Animated.spring(payScale, { toValue: 0.96, useNativeDriver: true, speed: 40 }).start();
  const pressOut = () => Animated.spring(payScale, { toValue: 1, useNativeDriver: true, speed: 30 }).start();

  const { data: offersData } = useQuery({
    queryKey: ['pay-bill-offers', restaurant._id],
    queryFn: () => restaurantApi.getOffers(restaurant._id).then((r) => r.data.data.offers),
    enabled: !!restaurant._id,
  });
  const offers = useMemo(() => (offersData || []).filter(isPayBillOffer), [offersData]);

  const amt = parseFloat(amount) || 0;

  // Which offer is applied: a validated coupon wins, else the user's manual pick,
  // else the best auto offer for this amount.
  const autoBest = useMemo(() => bestOffer(offers, amt)?.offer || null, [offers, amt]);
  const manualOffer = manualOfferId ? offers.find((o) => o._id === manualOfferId) : null;
  const activeOffer = couponOffer || manualOffer || autoBest;

  const clientDiscount = couponOffer
    ? Math.min(couponOffer.discountAmount || 0, amt)
    : computeDiscount(activeOffer, amt);

  // Server-computed quote is the source of truth for fee + GST + total.
  const quoteOfferId = couponOffer ? undefined : activeOffer?._id;
  const quoteCode = couponOffer?.code;
  const { data: quote } = useQuery({
    queryKey: ['bill-quote', restaurant._id, amt, quoteOfferId || quoteCode || 'none', tip],
    queryFn: () => billPaymentApi.quote({
      restaurantId: restaurant._id, billAmount: amt,
      offerId: quoteOfferId, offerCode: quoteCode, tipAmount: tip,
    }).then((r) => r.data.data),
    enabled: amt > 0,
    keepPreviousData: true,
    staleTime: 15000,
  });

  const discount = quote?.discount ?? clientDiscount;
  const convenienceFee = quote?.convenienceFee ?? 0;
  const gstAmount = quote?.gstAmount ?? 0;
  const gstPct = quote?.gstOnFeePercent ?? 0;
  const net = Math.max(0, amt - discount);
  const payable = Math.round(quote?.toPay ?? (net + convenienceFee + gstAmount + tip));

  useEffect(() => {
    Animated.timing(revealAnim, {
      toValue: amt > 0 ? 1 : 0,
      duration: 260,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [amt > 0]);

  const validateCoupon = useMutation({
    mutationFn: () => offerApi.validateCoupon({
      code: couponCode.trim().toUpperCase(), restaurantId: restaurant._id, amount: amt, guests: 1,
    }).then((r) => r.data.data),
    onSuccess: (data) => {
      setManualOfferId(null);
      setCouponOffer({
        _id: data.offer?._id,
        code: couponCode.trim().toUpperCase(),
        title: data.offer?.title || couponCode.trim().toUpperCase(),
        fundedBy: data.offer?.fundedBy,
        discountAmount: data.discountBreakup?.total ?? 0,
      });
      Toast.show({ type: 'success', text1: 'Coupon applied' });
    },
    onError: (err) => Toast.show({
      type: 'error', text1: 'Invalid coupon', text2: err.response?.data?.message || 'Not valid for this bill',
    }),
  });

  const payMutation = useMutation({
    mutationFn: () => billPaymentApi.pay({
      restaurantId: restaurant._id,
      billAmount: amt,
      offerId: couponOffer ? undefined : activeOffer?._id,
      offerCode: couponOffer?.code,
      tipAmount: tip,
      paymentMethod: method,
    }).then((r) => r.data.data),
    onSuccess: (data) => {
      if (data.billPayment?.paymentStatus === 'paid') {
        navigation.replace('PayBillSuccess', {
          billPayment: data.billPayment,
          coinsEarned: data.coinsEarned,
          restaurantName: restaurant.name,
        });
      } else if (data.razorpay) {
        // A live Razorpay order came back but this build has no checkout SDK.
        Toast.show({
          type: 'info',
          text1: 'Use Hungora Wallet',
          text2: 'Card / UPI checkout isn’t available in this build yet.',
        });
      } else {
        Toast.show({ type: 'error', text1: 'Payment could not be completed' });
      }
    },
    onError: (err) => Toast.show({
      type: 'error', text1: 'Payment failed', text2: err.response?.data?.message || 'Please try again',
    }),
  });

  const clearCoupon = () => { setCouponOffer(null); setCouponCode(''); };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={f.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {/* Amount */}
        <View style={f.amountCard}>
          <Text style={f.label}>Enter bill amount</Text>
          <View style={f.amountRow}>
            <Text style={f.rupee}>₹</Text>
            <TextInput
              style={f.amountInput}
              value={amount}
              onChangeText={(t) => { setAmount(t.replace(/[^0-9]/g, '')); clearCoupon(); }}
              keyboardType="number-pad"
              placeholder="0"
              placeholderTextColor={COLORS.lightGray}
              autoFocus={!initialAmount}
              maxLength={7}
            />
          </View>
          <View style={f.underline} />

          <View style={f.quickRow}>
            {QUICK_AMOUNTS.map((a) => {
              const active = amount === String(a);
              return (
                <TouchableOpacity
                  key={a}
                  style={[f.quickChip, active && f.quickChipActive]}
                  activeOpacity={0.8}
                  onPress={() => { setAmount(String(a)); clearCoupon(); }}
                >
                  <Text style={[f.quickChipText, active && f.quickChipTextActive]}>₹{a.toLocaleString('en-IN')}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Live discount reveal */}
        {amt > 0 ? (
          <Animated.View
            style={[
              f.reveal,
              {
                opacity: revealAnim,
                transform: [{ translateY: revealAnim.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }],
              },
            ]}
          >
            <LinearGradient
              colors={[CREAM, '#FFFCF4']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            {discount > 0 ? (
              <>
                <View style={f.revealTop}>
                  <View style={f.revealIconBadge}><Ionicons name="pricetag" size={12} color="#fff" /></View>
                  <Text style={f.revealOffer}>
                    {activeOffer ? `${offerFunderLabel(activeOffer)} · ${offerValueLabel(activeOffer)}` : 'Offer applied'}
                  </Text>
                </View>
                <Text style={f.revealPayLabel}>You pay</Text>
                <View style={f.revealAmountRow}>
                  <AnimatedRupee value={payable} style={f.revealPay} />
                  <Text style={f.revealStrike}>₹{amt.toLocaleString('en-IN')}</Text>
                </View>
                <View style={f.savePill}>
                  <Ionicons name="sparkles" size={13} color={GOLD_DEEP} />
                  <Text style={f.savePillText}>You save </Text>
                  <AnimatedRupee value={discount} style={f.savePillAmt} />
                </View>
              </>
            ) : (
              <>
                <Text style={f.revealPayLabel}>You pay</Text>
                <View style={f.revealAmountRow}>
                  <AnimatedRupee value={payable} style={f.revealPay} />
                </View>
                <Text style={f.noOffer}>
                  {offers.some((o) => amt < (o.minOrderAmount || 0))
                    ? `Add ₹${Math.min(...offers.filter((o) => o.minOrderAmount > amt).map((o) => o.minOrderAmount - amt))} more to unlock an offer`
                    : 'No offer for this amount — you still earn reward coins'}
                </Text>
              </>
            )}
            {(convenienceFee > 0 || gstAmount > 0) ? (
              <Text style={f.revealFeeNote}>
                incl. ₹{(convenienceFee + gstAmount).toLocaleString('en-IN')} convenience fee &amp; GST
              </Text>
            ) : null}
          </Animated.View>
        ) : null}

        {/* Offer choices */}
        {offers.length ? (
          <View style={f.card}>
            <Text style={f.cardTitle}>Offers for you</Text>
            {offers.map((o) => {
              const d = computeDiscount(o, amt);
              const active = !couponOffer && activeOffer?._id === o._id;
              const locked = amt > 0 && amt < (o.minOrderAmount || 0);
              return (
                <TouchableOpacity
                  key={o._id}
                  style={[f.offerLine, active && f.offerLineActive]}
                  activeOpacity={0.85}
                  disabled={locked}
                  onPress={() => { clearCoupon(); setManualOfferId(o._id); }}
                >
                  <View style={f.offerIcon}><Ionicons name="pricetag" size={14} color={GOLD} /></View>
                  <View style={{ flex: 1 }}>
                    <Text style={f.offerTitle}>{o.title}</Text>
                    <Text style={f.offerSub}>
                      {offerFunderLabel(o)} · {offerValueLabel(o)}
                      {locked ? ` · min ₹${o.minOrderAmount}` : d > 0 ? ` · saves ₹${d}` : ''}
                    </Text>
                  </View>
                  <Ionicons
                    name={active ? 'radio-button-on' : 'radio-button-off'}
                    size={18}
                    color={active ? GOLD : COLORS.lightGray}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        ) : null}

        {/* Coupon */}
        <View style={f.card}>
          <TouchableOpacity style={f.couponHead} onPress={() => setShowCoupon((s) => !s)}>
            <View style={f.offerIcon}><Ionicons name="ticket-outline" size={14} color={GOLD} /></View>
            <Text style={f.couponHeadText}>{couponOffer ? `Coupon ${couponOffer.code} applied` : 'Have a coupon code?'}</Text>
            {couponOffer ? (
              <TouchableOpacity onPress={clearCoupon}><Ionicons name="close-circle" size={18} color={COLORS.error} /></TouchableOpacity>
            ) : (
              <Ionicons name={showCoupon ? 'chevron-up' : 'chevron-forward'} size={16} color={COLORS.lightGray} />
            )}
          </TouchableOpacity>
          {showCoupon && !couponOffer ? (
            <View style={f.couponRow}>
              <TextInput
                style={f.couponInput}
                value={couponCode}
                onChangeText={setCouponCode}
                placeholder="Enter code"
                placeholderTextColor={COLORS.lightGray}
                autoCapitalize="characters"
              />
              <TouchableOpacity
                style={[f.couponBtn, (!couponCode || amt <= 0 || validateCoupon.isPending) && f.dim]}
                disabled={!couponCode || amt <= 0 || validateCoupon.isPending}
                onPress={() => validateCoupon.mutate()}
              >
                {validateCoupon.isPending ? <ActivityIndicator size="small" color={NAVY} /> : <Text style={f.couponBtnText}>Apply</Text>}
              </TouchableOpacity>
            </View>
          ) : null}
        </View>

        {/* Summary */}
        <View style={f.card}>
          <Text style={f.cardTitle}>Payment summary</Text>
          <Row label="Bill amount" value={`₹${amt.toLocaleString('en-IN')}`} />
          {discount > 0 ? (
            <Row
              label={activeOffer?.fundedBy === 'bank' ? 'Bank discount' : 'Discount'}
              value={`− ₹${discount.toLocaleString('en-IN')}`}
              accent
            />
          ) : null}
          {convenienceFee > 0 ? (
            <Row label="Convenience fee" value={`₹${convenienceFee.toLocaleString('en-IN')}`} />
          ) : null}
          {gstAmount > 0 ? (
            <Row label={`GST${gstPct ? ` (${gstPct}%)` : ''}`} value={`₹${gstAmount.toLocaleString('en-IN')}`} />
          ) : null}

          <View style={f.tipRow}>
            <TouchableOpacity
              style={f.tipToggle}
              onPress={() => { if (tip) { setTip(0); setShowTip(false); } else setShowTip((s) => !s); }}
            >
              <Ionicons name={tip ? 'close-circle' : 'add-circle-outline'} size={16} color={tip ? COLORS.gray : GOLD_DEEP} />
              <Text style={f.tipToggleText}>{tip ? 'Remove tip' : 'Add a tip for the staff'}</Text>
            </TouchableOpacity>
            {tip ? <Text style={f.rowValue}>+ ₹{tip}</Text> : null}
          </View>
          {showTip && !tip ? (
            <View style={f.tipChips}>
              {TIP_OPTIONS.map((t) => (
                <TouchableOpacity key={t} style={f.tipChip} onPress={() => { setTip(t); setShowTip(false); }}>
                  <Text style={f.tipChipText}>₹{t}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : null}

          <View style={f.divider} />
          <View style={f.totalRow}>
            <Text style={f.totalLabel}>To pay</Text>
            <Text style={f.totalValue}>₹{payable.toLocaleString('en-IN')}</Text>
          </View>
        </View>

        {/* Payment method */}
        <View style={f.card}>
          <Text style={f.cardTitle}>Pay using</Text>
          {[
            { id: 'razorpay', label: 'UPI / Card / Net Banking', icon: 'card-outline', sub: 'Powered by Razorpay' },
            { id: 'wallet', label: 'Hungora Wallet', icon: 'wallet-outline', sub: 'Instant · earn coins back' },
          ].map((m) => (
            <TouchableOpacity
              key={m.id}
              style={[f.method, method === m.id && f.methodActive]}
              activeOpacity={0.85}
              onPress={() => setMethod(m.id)}
            >
              <View style={[f.methodIcon, method === m.id && f.methodIconActive]}>
                <Ionicons name={m.icon} size={18} color={method === m.id ? '#fff' : COLORS.gray} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[f.methodLabel, method === m.id && f.methodLabelActive]}>{m.label}</Text>
                <Text style={f.methodSub}>{m.sub}</Text>
              </View>
              <View style={[f.radio, method === m.id && f.radioOn]}>{method === m.id ? <View style={f.radioDot} /> : null}</View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 110 }} />
      </ScrollView>

      <View style={f.footer}>
        <Animated.View style={{ transform: [{ scale: payScale }] }}>
          <TouchableOpacity
            style={[f.payBtnWrap, (amt <= 0 || payMutation.isPending) && f.dim]}
            disabled={amt <= 0 || payMutation.isPending}
            onPress={() => payMutation.mutate()}
            onPressIn={pressIn}
            onPressOut={pressOut}
            activeOpacity={0.92}
          >
            <LinearGradient colors={[GOLD, GOLD_DEEP]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={f.payBtn}>
              {payMutation.isPending ? (
                <ActivityIndicator color={NAVY} />
              ) : (
                <>
                  <Text style={f.payBtnText}>
                    {amt > 0 ? `Pay ₹${payable.toLocaleString('en-IN')}` : 'Enter an amount'}
                  </Text>
                  {discount > 0 ? <Text style={f.payBtnSub}>You save ₹{discount.toLocaleString('en-IN')}</Text> : null}
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
  );
}

function Row({ label, value, accent }) {
  return (
    <View style={f.row}>
      <Text style={[f.rowLabel, accent && { color: GOLD_DEEP }]}>{label}</Text>
      <Text style={[f.rowValue, accent && { color: GOLD_DEEP }]}>{value}</Text>
    </View>
  );
}

// ── Screen shell ────────────────────────────────────────────────────────────
export default function PayBillScreen({ navigation, route }) {
  const preRestaurant = route.params?.restaurant || null;
  const preAmount = route.params?.billAmount || null;
  const preOfferId = route.params?.offerId || null;

  const [restaurant, setRestaurant] = useState(preRestaurant);
  const avatarUri = restaurant?.images?.[0]?.url || restaurant?.logo?.url || null;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={['#1B5E8F', NAVY]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
        <TouchableOpacity
          onPress={() => (restaurant && !preRestaurant ? setRestaurant(null) : navigation.goBack())}
          style={styles.backBtn}
          activeOpacity={0.7}
          hitSlop={6}
        >
          <Ionicons name="arrow-back" size={20} color="#fff" />
        </TouchableOpacity>

        {restaurant ? (
          avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.headerAvatar} />
          ) : (
            <View style={styles.headerIconWrap}>
              <Text style={styles.headerIconLetter}>{restaurant.name?.charAt(0)}</Text>
            </View>
          )
        ) : (
          <View style={styles.headerIconWrap}>
            <Ionicons name="receipt-outline" size={18} color="#fff" />
          </View>
        )}

        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle} numberOfLines={1}>{restaurant ? restaurant.name : 'Pay Bill'}</Text>
          <Text style={styles.headerSub} numberOfLines={1}>
            {restaurant ? [restaurant.address?.city, 'Dine-in payment'].filter(Boolean).join(' · ') : 'Choose a restaurant'}
          </Text>
        </View>

        {restaurant?.averageRating > 0 ? (
          <View style={styles.headerRating}>
            <Ionicons name="star" size={11} color={GOLD} />
            <Text style={styles.headerRatingText}>{restaurant.averageRating.toFixed(1)}</Text>
          </View>
        ) : null}
      </LinearGradient>

      {restaurant ? (
        <PayBillForm
          navigation={navigation}
          restaurant={restaurant}
          initialAmount={preAmount}
          initialOfferId={preOfferId}
        />
      ) : (
        <RestaurantPicker onSelect={setRestaurant} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.sm,
    paddingTop: Platform.OS === 'ios' ? 56 : 40, paddingBottom: SPACING.lg, paddingHorizontal: SPACING.lg,
    borderBottomLeftRadius: 26, borderBottomRightRadius: 26,
    shadowColor: NAVY, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.22, shadowRadius: 20, elevation: 10,
  },
  backBtn: {
    width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center', justifyContent: 'center',
  },
  headerAvatar: {
    width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.35)',
  },
  headerIconWrap: {
    width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.22)',
  },
  headerIconLetter: { fontSize: SIZES.base, fontFamily: FONTS.bold, color: '#fff' },
  headerTitle: { fontSize: SIZES.lg, fontFamily: FONTS.bold, color: '#fff' },
  headerSub: { fontSize: SIZES.xs, color: 'rgba(255,255,255,0.7)', fontFamily: FONTS.regular, marginTop: 1 },
  headerRating: {
    flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: BORDER_RADIUS.full, paddingHorizontal: 8, paddingVertical: 4,
  },
  headerRatingText: { fontSize: 11, fontFamily: FONTS.bold, color: '#fff' },
});

const rp = StyleSheet.create({
  searchRow: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, backgroundColor: COLORS.card,
    margin: SPACING.md, paddingHorizontal: SPACING.md, paddingVertical: 10,
    borderRadius: BORDER_RADIUS.md, borderWidth: 1.5, borderColor: COLORS.border,
  },
  searchInput: { flex: 1, fontSize: SIZES.base, fontFamily: FONTS.regular, color: COLORS.dark },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 8, padding: SPACING.xl },
  emptyIcon: { fontSize: 40 },
  emptyTitle: { fontSize: SIZES.base, fontFamily: FONTS.bold, color: COLORS.dark, marginTop: 4 },
  emptySub: { fontSize: SIZES.sm, fontFamily: FONTS.regular, color: COLORS.gray, textAlign: 'center', lineHeight: 19 },
  retryBtn: {
    marginTop: SPACING.md, backgroundColor: NAVY, borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: SPACING.xl, paddingVertical: 10,
  },
  retryText: { fontSize: SIZES.sm, fontFamily: FONTS.bold, color: '#fff' },
  listHead: {
    fontSize: SIZES.xs, fontFamily: FONTS.bold, color: COLORS.gray,
    textTransform: 'uppercase', letterSpacing: 1, marginBottom: SPACING.sm, marginLeft: 4,
  },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.md, backgroundColor: COLORS.card,
    marginBottom: SPACING.sm, borderRadius: BORDER_RADIUS.md, padding: SPACING.sm, ...SHADOW.sm,
  },
  thumb: { width: 60, height: 60, borderRadius: BORDER_RADIUS.sm, backgroundColor: COLORS.background },
  thumbFallback: { alignItems: 'center', justifyContent: 'center', backgroundColor: NAVY },
  avatarText: { fontSize: SIZES.lg, fontFamily: FONTS.bold, color: '#fff' },
  cardTopRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  name: { flex: 1, fontSize: SIZES.base, fontFamily: FONTS.bold, color: COLORS.dark },
  address: { fontSize: SIZES.xs, fontFamily: FONTS.regular, color: COLORS.gray, marginTop: 2 },
  ratingChip: {
    flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: COLORS.success,
    paddingHorizontal: 6, paddingVertical: 3, borderRadius: 6,
  },
  ratingText: { fontSize: 11, fontFamily: FONTS.bold, color: '#fff' },
  offerBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start', marginTop: 5,
    backgroundColor: CREAM, borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2,
  },
  offerBadgeText: { fontSize: 10, fontFamily: FONTS.bold, color: GOLD_DEEP, letterSpacing: 0.3 },
  payHint: { fontSize: 11, fontFamily: FONTS.regular, color: COLORS.lightGray, marginTop: 5 },
});

const f = StyleSheet.create({
  scroll: { padding: SPACING.lg, paddingBottom: 40 },
  amountCard: {
    backgroundColor: COLORS.card, borderRadius: 24, paddingVertical: SPACING.xl, paddingHorizontal: SPACING.lg,
    shadowColor: NAVY, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.08, shadowRadius: 20, elevation: 3,
  },
  label: {
    fontSize: SIZES.sm, fontFamily: FONTS.bold, color: COLORS.gray,
    textTransform: 'uppercase', letterSpacing: 1.2, textAlign: 'center',
  },
  amountRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', marginTop: SPACING.md },
  rupee: { fontSize: 30, fontFamily: FONTS.bold, color: NAVY, marginRight: 4, marginBottom: 8 },
  amountInput: { fontSize: 52, fontFamily: FONTS.bold, color: NAVY, textAlign: 'center', minWidth: 90, padding: 0 },
  underline: { height: 3, width: 150, borderRadius: 2, backgroundColor: GOLD, alignSelf: 'center', marginTop: 6 },
  quickRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, justifyContent: 'center', marginTop: SPACING.lg },
  quickChip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: BORDER_RADIUS.full,
    borderWidth: 1.5, borderColor: COLORS.border, backgroundColor: COLORS.background,
  },
  quickChipActive: { borderColor: GOLD, backgroundColor: NAVY },
  quickChipText: { fontSize: SIZES.xs, fontFamily: FONTS.semiBold, color: COLORS.dark },
  quickChipTextActive: { color: GOLD },

  reveal: {
    marginTop: SPACING.xl, borderRadius: 22, overflow: 'hidden',
    borderWidth: 1, borderColor: '#EAD4A3', padding: SPACING.lg, alignItems: 'center',
    shadowColor: GOLD_DEEP, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.18, shadowRadius: 16, elevation: 4,
  },
  revealTop: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  revealIconBadge: {
    width: 20, height: 20, borderRadius: 10, backgroundColor: GOLD_DEEP,
    alignItems: 'center', justifyContent: 'center',
  },
  revealOffer: { fontSize: SIZES.xs, fontFamily: FONTS.bold, color: NAVY },
  revealPayLabel: { fontSize: 10, fontFamily: FONTS.semiBold, color: GOLD_DEEP, letterSpacing: 1, textTransform: 'uppercase' },
  revealAmountRow: { flexDirection: 'row', alignItems: 'baseline', gap: 10, marginTop: 2 },
  revealPay: { fontSize: 36, fontFamily: FONTS.bold, color: NAVY },
  revealStrike: { fontSize: SIZES.base, fontFamily: FONTS.medium, color: GOLD_DEEP, textDecorationLine: 'line-through' },
  revealFeeNote: { fontSize: 10, fontFamily: FONTS.regular, color: COLORS.gray, marginTop: 8, textAlign: 'center' },
  savePill: {
    flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: SPACING.sm,
    backgroundColor: '#fff', borderRadius: BORDER_RADIUS.full, paddingHorizontal: 12, paddingVertical: 6,
  },
  savePillText: { fontSize: SIZES.xs, fontFamily: FONTS.medium, color: NAVY },
  savePillAmt: { fontSize: SIZES.sm, fontFamily: FONTS.bold, color: GOLD_DEEP },
  noOffer: { fontSize: SIZES.xs, fontFamily: FONTS.regular, color: COLORS.gray, marginTop: 6, textAlign: 'center' },

  card: { backgroundColor: COLORS.card, borderRadius: 20, padding: SPACING.md, marginTop: SPACING.md, ...SHADOW.sm },
  cardTitle: { fontSize: SIZES.base, fontFamily: FONTS.bold, color: NAVY, marginBottom: SPACING.sm },

  offerLine: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.sm, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.border, marginTop: 6,
  },
  offerLineActive: { borderColor: GOLD, backgroundColor: CREAM },
  offerIcon: { width: 30, height: 30, borderRadius: 15, backgroundColor: CREAM, alignItems: 'center', justifyContent: 'center' },
  offerTitle: { fontSize: SIZES.sm, fontFamily: FONTS.bold, color: COLORS.dark },
  offerSub: { fontSize: SIZES.xs, fontFamily: FONTS.regular, color: COLORS.gray, marginTop: 2 },

  couponHead: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  couponHeadText: { flex: 1, fontSize: SIZES.sm, fontFamily: FONTS.bold, color: COLORS.dark },
  couponRow: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.sm },
  couponInput: {
    flex: 1, borderWidth: 1.5, borderColor: COLORS.border, borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: SPACING.md, paddingVertical: 10, fontSize: SIZES.sm, fontFamily: FONTS.bold, color: COLORS.dark,
  },
  couponBtn: { backgroundColor: GOLD, paddingHorizontal: SPACING.lg, borderRadius: BORDER_RADIUS.sm, alignItems: 'center', justifyContent: 'center' },
  couponBtnText: { fontSize: SIZES.sm, fontFamily: FONTS.bold, color: NAVY },

  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 },
  rowLabel: { fontSize: SIZES.sm, fontFamily: FONTS.regular, color: COLORS.gray },
  rowValue: { fontSize: SIZES.sm, fontFamily: FONTS.medium, color: COLORS.dark },
  tipRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 5 },
  tipToggle: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  tipToggleText: { fontSize: SIZES.sm, fontFamily: FONTS.medium, color: COLORS.dark },
  tipChips: { flexDirection: 'row', gap: SPACING.sm, marginTop: 6, flexWrap: 'wrap' },
  tipChip: { paddingHorizontal: 16, paddingVertical: 7, borderRadius: BORDER_RADIUS.full, borderWidth: 1.5, borderColor: GOLD, backgroundColor: CREAM },
  tipChipText: { fontSize: SIZES.sm, fontFamily: FONTS.bold, color: NAVY },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: SPACING.sm },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontSize: SIZES.base, fontFamily: FONTS.bold, color: NAVY },
  totalValue: { fontSize: SIZES.xl, fontFamily: FONTS.bold, color: NAVY },

  method: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.md, padding: SPACING.sm, marginTop: SPACING.sm,
    borderRadius: BORDER_RADIUS.md, borderWidth: 1.5, borderColor: COLORS.border, backgroundColor: COLORS.background,
  },
  methodActive: { borderColor: GOLD, backgroundColor: CREAM },
  methodIcon: { width: 38, height: 38, borderRadius: 19, backgroundColor: COLORS.card, alignItems: 'center', justifyContent: 'center' },
  methodIconActive: { backgroundColor: NAVY },
  methodLabel: { fontSize: SIZES.sm, fontFamily: FONTS.bold, color: COLORS.dark },
  methodLabelActive: { color: NAVY },
  methodSub: { fontSize: SIZES.xs, fontFamily: FONTS.regular, color: COLORS.gray, marginTop: 2 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center' },
  radioOn: { borderColor: GOLD },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: GOLD },

  footer: {
    position: 'absolute', left: 0, right: 0, bottom: 0, padding: SPACING.lg,
    paddingBottom: Platform.OS === 'ios' ? 30 : SPACING.lg, backgroundColor: COLORS.card,
    borderTopLeftRadius: 24, borderTopRightRadius: 24, ...SHADOW.lg,
  },
  payBtnWrap: { borderRadius: BORDER_RADIUS.full, overflow: 'hidden' },
  payBtn: {
    paddingVertical: 16, alignItems: 'center', justifyContent: 'center',
    shadowColor: GOLD_DEEP, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6,
  },
  payBtnText: { fontSize: SIZES.base, fontFamily: FONTS.bold, color: NAVY },
  payBtnSub: { fontSize: 11, fontFamily: FONTS.semiBold, color: 'rgba(12,47,78,0.7)', marginTop: 1 },
  dim: { opacity: 0.45 },
});
