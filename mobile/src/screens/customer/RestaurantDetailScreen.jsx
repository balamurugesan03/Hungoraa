import React, { useState } from 'react';
import {
  View, Text, StyleSheet, Dimensions, Share, Pressable,
} from 'react-native';
import Animated, {
  useSharedValue, useAnimatedScrollHandler, useAnimatedStyle,
  interpolate, Extrapolation,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useQuery, useMutation } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import restaurantApi from '../../api/restaurant.api';
import { isOpenNow } from '../../components/home/viewModels';
import { COLOR, SPACING, RADII, ELEVATION, GRADIENT, text, FONT } from '../../theme';
import {
  PhotoImage, IconButton, Button, Tag, Rating, Divider, Avatar, EmptyState,
} from '../../components/ui';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const HERO_H = 320;
const TABS = ['Overview', 'Menu', 'Reviews', 'Offers'];
const FALLBACK_IMG = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&q=80';

export default function RestaurantDetailScreen({ navigation, route }) {
  const { id, restaurantId } = route.params || {};
  const rid = restaurantId || id;
  const insets = useSafeAreaInsets();
  const scrollY = useSharedValue(0);

  const [tab, setTab] = useState('Overview');
  const [saved, setSaved] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['restaurant', rid],
    queryFn: () => restaurantApi.getById(rid).then((r) => r.data.data),
    enabled: !!rid,
  });
  const restaurant = data?.restaurant || {};

  const { data: menuData } = useQuery({
    queryKey: ['restaurant-menu', rid],
    queryFn: () => restaurantApi.getMenu(rid).then((r) => r.data.data),
    enabled: tab === 'Menu' && !!rid,
  });
  const { data: reviewsData } = useQuery({
    queryKey: ['restaurant-reviews', rid],
    queryFn: () => restaurantApi.getReviews(rid).then((r) => r.data.data),
    enabled: tab === 'Reviews' && !!rid,
  });
  const { data: offersData } = useQuery({
    queryKey: ['restaurant-offers', rid],
    queryFn: () => restaurantApi.getOffers(rid).then((r) => r.data.data.offers),
    enabled: tab === 'Offers' && !!rid,
  });

  const saveMutation = useMutation({
    mutationFn: () => restaurantApi.toggleSave(rid),
    onSuccess: () => {
      setSaved((s) => !s);
      Toast.show({ type: 'success', text1: saved ? 'Removed from saved' : 'Saved to favourites' });
    },
  });

  const onScroll = useAnimatedScrollHandler((e) => { scrollY.value = e.contentOffset.y; });

  const heroStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(scrollY.value, [-HERO_H, 0, HERO_H], [-HERO_H / 2, 0, HERO_H * 0.4], Extrapolation.CLAMP) },
      { scale: interpolate(scrollY.value, [-HERO_H, 0], [2, 1], Extrapolation.CLAMP) },
    ],
  }));
  const barStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [HERO_H - 140, HERO_H - 80], [0, 1], Extrapolation.CLAMP),
  }));

  const images = restaurant.images?.length ? restaurant.images.map((i) => i.url) : [FALLBACK_IMG];
  const cuisines = restaurant.cuisine?.join(' · ') || 'Restaurant';
  const open = restaurant._id ? isOpenNow(restaurant) : true;

  const share = () => Share.share({ message: `Check out ${restaurant?.name || 'this place'} on Hungora!` });

  return (
    <View style={styles.container}>
      {/* Parallax hero */}
      <Animated.View style={[styles.hero, heroStyle]}>
        <PhotoImage uri={images[0]} style={styles.heroImg} scrim scrimHeight="55%" />
      </Animated.View>

      {/* Collapsed bar */}
      <Animated.View style={[styles.topBar, { paddingTop: insets.top + 6 }, barStyle]} pointerEvents="none">
        <Text style={[text.h3, styles.topBarTitle]} numberOfLines={1}>{restaurant.name}</Text>
      </Animated.View>

      {/* Floating controls */}
      <View style={[styles.floating, { top: insets.top + 6 }]}>
        <IconButton icon="chevron-back" variant="glass" onPress={() => navigation.goBack()} />
        <View style={styles.floatRight}>
          <IconButton icon="share-social-outline" variant="glass" size={19} onPress={share} />
          <IconButton
            icon={saved ? 'heart' : 'heart-outline'}
            variant="glass"
            size={19}
            color={saved ? COLOR.terracotta : '#FFFFFF'}
            onPress={() => saveMutation.mutate()}
          />
        </View>
      </View>

      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 + insets.bottom }}
      >
        <View style={{ height: HERO_H - 28 }} />

        <View style={styles.sheet}>
          <View style={styles.grabber} />

          <View style={styles.headRow}>
            <Text style={[text.h1, styles.name]}>{restaurant.name || ' '}</Text>
            {restaurant.isVerified ? (
              <Ionicons name="checkmark-circle" size={18} color={COLOR.info} style={styles.verified} />
            ) : null}
          </View>
          <Text style={[text.body, styles.cuisine]}>{cuisines}</Text>

          <View style={styles.metaRow}>
            <Rating value={restaurant.averageRating || 0} count={restaurant.totalReviews || 0} size={14} />
            <View style={styles.dot} />
            <Text style={styles.metaText}>{`₹${restaurant.costForTwo || 800} for two`}</Text>
            <View style={styles.dot} />
            <Tag
              label={open ? 'Open now' : 'Closed'}
              tone={open ? 'success' : 'error'}
            />
          </View>

          <View style={styles.infoCard}>
            <Ionicons name="location-outline" size={18} color={COLOR.terracotta} />
            <Text style={[text.body, styles.infoText]} numberOfLines={2}>
              {[restaurant.address?.street, restaurant.address?.city, restaurant.address?.state].filter(Boolean).join(', ') || 'Address unavailable'}
            </Text>
            <Pressable hitSlop={8} onPress={() => navigation.navigate('MapView', { restaurantId: rid })}>
              <Ionicons name="map-outline" size={18} color={COLOR.terracotta} />
            </Pressable>
          </View>

          {restaurant.amenities?.length ? (
            <View style={styles.amenities}>
              {restaurant.amenities.slice(0, 6).map((a) => <Tag key={a} label={a} tone="neutral" />)}
            </View>
          ) : null}

          {/* Tabs */}
          <View style={styles.tabs}>
            {TABS.map((t) => (
              <Pressable key={t} onPress={() => setTab(t)} style={styles.tab}>
                <Text style={[styles.tabText, tab === t && styles.tabTextOn]}>{t}</Text>
                {tab === t ? <View style={styles.tabUnderline} /> : null}
              </Pressable>
            ))}
          </View>

          <View style={styles.tabBody}>
            {tab === 'Overview' && <Overview restaurant={restaurant} loading={isLoading} />}
            {tab === 'Menu' && (
              <Menu
                menuData={menuData}
                onItem={() => navigation.navigate('MenuDetail', { restaurantId: rid, restaurantName: restaurant.name })}
              />
            )}
            {tab === 'Reviews' && <Reviews reviews={reviewsData?.reviews || []} />}
            {tab === 'Offers' && <Offers offers={offersData || []} />}
          </View>
        </View>
      </Animated.ScrollView>

      {/* Sticky CTA */}
      <View style={[styles.cta, { paddingBottom: insets.bottom + SPACING.sm }]}>
        <View>
          <Text style={text.bodyStrong}>Reserve a table</Text>
          <Text style={text.caption}>Free · instant confirmation</Text>
        </View>
        <Button
          label="Book a table"
          full={false}
          onPress={() => navigation.navigate('Booking', { restaurantId: rid, restaurantName: restaurant.name })}
        />
      </View>
    </View>
  );
}

function Section({ title, children }) {
  return (
    <View style={styles.section}>
      <Text style={[text.h3, styles.sectionTitle]}>{title}</Text>
      {children}
    </View>
  );
}

function Overview({ restaurant, loading }) {
  if (loading) return <Text style={[text.body, styles.pad]}>Loading…</Text>;
  return (
    <View>
      {restaurant.description ? (
        <Section title="About">
          <Text style={[text.body, styles.leading]}>{restaurant.description}</Text>
        </Section>
      ) : null}
      {restaurant.operatingHours?.length ? (
        <Section title="Hours">
          {restaurant.operatingHours.map((h) => (
            <View key={h.day} style={styles.hourRow}>
              <Text style={[text.bodyInk, styles.day]}>{cap(h.day)}</Text>
              <Text style={[text.body, !h.isOpen && { color: COLOR.error }]}>
                {h.isOpen ? (h.slots || []).map((s) => `${s.open}–${s.close}`).join(', ') : 'Closed'}
              </Text>
            </View>
          ))}
        </Section>
      ) : null}
    </View>
  );
}

function Menu({ menuData, onItem }) {
  const categories = menuData?.categories || menuData?.menu?.categories || [];
  if (!categories.length) {
    return <EmptyState icon="fast-food-outline" title="Menu coming soon" message="This restaurant hasn't published its menu yet." />;
  }
  return (
    <View style={styles.pad}>
      {categories.map((cat) => (
        <View key={cat.name} style={styles.menuCat}>
          <Text style={[text.overline, styles.menuCatTitle]}>{cat.name}</Text>
          {cat.items.map((item) => (
            <Pressable key={item._id || item.name} style={styles.menuItem} onPress={() => onItem(item)}>
              <View style={styles.menuInfo}>
                <View style={[styles.vegDot, { borderColor: item.isVeg ? COLOR.success : COLOR.error }]}>
                  <View style={[styles.vegInner, { backgroundColor: item.isVeg ? COLOR.success : COLOR.error }]} />
                </View>
                <View style={styles.flex}>
                  <Text style={text.bodyStrong}>{item.name}</Text>
                  <Text style={[text.caption, styles.menuPrice]}>₹{item.price}</Text>
                  {item.description ? (
                    <Text style={[text.caption, styles.menuDesc]} numberOfLines={2}>{item.description}</Text>
                  ) : null}
                </View>
              </View>
              {item.image ? (
                <PhotoImage uri={item.image} style={styles.menuImg} radius={RADII.sm} />
              ) : null}
            </Pressable>
          ))}
        </View>
      ))}
    </View>
  );
}

function Reviews({ reviews }) {
  if (!reviews.length) {
    return <EmptyState icon="chatbubble-ellipses-outline" title="No reviews yet" message="Be the first to share your experience." />;
  }
  return (
    <View style={styles.pad}>
      {reviews.map((r, i) => (
        <View key={r._id || i}>
          {i > 0 ? <Divider spacing={SPACING.md} /> : null}
          <View style={styles.reviewHead}>
            <Avatar name={r.user?.name} uri={r.user?.avatar?.url} size={38} />
            <View style={styles.flex}>
              <Text style={text.bodyStrong}>{r.user?.name || 'Anonymous'}</Text>
              <Text style={text.caption}>{r.date || formatDate(r.createdAt)}</Text>
            </View>
            <Rating value={r.rating} size={12} />
          </View>
          {r.comment ? <Text style={[text.body, styles.reviewBody]}>{r.comment}</Text> : null}
        </View>
      ))}
    </View>
  );
}

function Offers({ offers }) {
  if (!offers.length) {
    return <EmptyState icon="pricetag-outline" title="No active offers" message="Check back later for deals at this restaurant." />;
  }
  return (
    <View style={styles.pad}>
      {offers.map((offer, i) => {
        const label = offer.type === 'percentage'
          ? `${offer.discountValue}% off`
          : offer.type === 'flat' ? `₹${offer.discountValue} off`
            : offer.type === 'bogo' ? 'Buy 1 Get 1' : (offer.type?.replace(/_/g, ' ') || 'Special offer');
        return (
          <View key={offer._id || i} style={[styles.offerCard, ELEVATION.sm]}>
            <LinearGradient colors={GRADIENT.terracotta} style={styles.offerBadge}>
              <Ionicons name="gift-outline" size={20} color="#FFFFFF" />
            </LinearGradient>
            <View style={styles.flex}>
              <Text style={text.bodyStrong}>{offer.title}</Text>
              <Text style={[text.caption, styles.mt2]}>
                {label}{offer.minOrderAmount > 0 ? ` · Min ₹${offer.minOrderAmount}` : ''}
              </Text>
              {offer.code ? (
                <View style={styles.codeRow}>
                  <Text style={text.caption}>Code </Text>
                  <View style={styles.codeBadge}>
                    <Text style={styles.codeText}>{offer.code}</Text>
                  </View>
                </View>
              ) : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const cap = (s = '') => s.charAt(0).toUpperCase() + s.slice(1);
const formatDate = (d) => {
  try { return new Date(d).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }); }
  catch { return ''; }
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLOR.bg },
  hero: { position: 'absolute', top: 0, left: 0, right: 0, height: HERO_H },
  heroImg: { width, height: HERO_H },
  topBar: {
    position: 'absolute', top: 0, left: 0, right: 0, zIndex: 5,
    backgroundColor: COLOR.bg, paddingBottom: 10, paddingHorizontal: 56,
    borderBottomWidth: 1, borderBottomColor: COLOR.hairline,
  },
  topBarTitle: { textAlign: 'center' },
  floating: {
    position: 'absolute', left: SPACING.md, right: SPACING.md, zIndex: 10,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  floatRight: { flexDirection: 'row', gap: SPACING.xs },
  sheet: {
    backgroundColor: COLOR.bg,
    borderTopLeftRadius: RADII.xl,
    borderTopRightRadius: RADII.xl,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
    minHeight: 500,
  },
  grabber: { alignSelf: 'center', width: 40, height: 4, borderRadius: 2, backgroundColor: COLOR.border, marginBottom: SPACING.md },
  headRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  name: { flexShrink: 1 },
  verified: {},
  cuisine: { marginTop: 4 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs, marginTop: SPACING.sm, flexWrap: 'wrap' },
  metaText: { fontFamily: FONT.medium, fontSize: 13, color: COLOR.inkSoft },
  dot: { width: 3, height: 3, borderRadius: 2, backgroundColor: COLOR.inkFaint },
  infoCard: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.sm,
    backgroundColor: COLOR.surface, borderRadius: RADII.md, padding: SPACING.md,
    marginTop: SPACING.md,
  },
  infoText: { flex: 1 },
  amenities: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs, marginTop: SPACING.md },
  tabs: { flexDirection: 'row', marginTop: SPACING.lg, borderBottomWidth: 1, borderBottomColor: COLOR.hairline },
  tab: { flex: 1, alignItems: 'center', paddingVertical: SPACING.sm },
  tabText: { fontFamily: FONT.semiBold, fontSize: 13, color: COLOR.inkFaint },
  tabTextOn: { color: COLOR.ink },
  tabUnderline: {
    position: 'absolute', bottom: -1, height: 2, width: 28, borderRadius: 1,
    backgroundColor: COLOR.terracotta,
  },
  tabBody: { paddingTop: SPACING.md, minHeight: 200 },
  section: { marginBottom: SPACING.lg },
  sectionTitle: { marginBottom: SPACING.xs },
  leading: { lineHeight: 22 },
  pad: { paddingBottom: SPACING.md },
  hourRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: COLOR.hairline },
  day: { textTransform: 'capitalize' },
  flex: { flex: 1 },
  menuCat: { marginBottom: SPACING.lg },
  menuCatTitle: { marginBottom: SPACING.xs },
  menuItem: {
    flexDirection: 'row', gap: SPACING.sm, paddingVertical: SPACING.sm,
    borderBottomWidth: 1, borderBottomColor: COLOR.hairline, alignItems: 'center',
  },
  menuInfo: { flex: 1, flexDirection: 'row', gap: SPACING.sm },
  vegDot: { width: 16, height: 16, borderRadius: 3, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  vegInner: { width: 7, height: 7, borderRadius: 4 },
  menuPrice: { marginTop: 2, color: COLOR.ink, fontFamily: FONT.semiBold },
  menuDesc: { marginTop: 3 },
  menuImg: { width: 66, height: 66 },
  reviewHead: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  reviewBody: { marginTop: SPACING.xs, lineHeight: 21 },
  offerCard: {
    flexDirection: 'row', gap: SPACING.sm, alignItems: 'center',
    backgroundColor: COLOR.surface, borderRadius: RADII.md, padding: SPACING.sm, marginBottom: SPACING.sm,
  },
  offerBadge: { width: 48, height: 48, borderRadius: RADII.sm, alignItems: 'center', justifyContent: 'center' },
  mt2: { marginTop: 2 },
  codeRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  codeBadge: {
    borderWidth: 1, borderColor: COLOR.terracotta, borderStyle: 'dashed',
    borderRadius: RADII.xs, paddingHorizontal: 8, paddingVertical: 2,
  },
  codeText: { fontFamily: FONT.bold, fontSize: 12, color: COLOR.terracotta, letterSpacing: 0.5 },
  cta: {
    position: 'absolute', left: 0, right: 0, bottom: 0,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: COLOR.surface, paddingHorizontal: SPACING.lg, paddingTop: SPACING.sm,
    borderTopWidth: 1, borderTopColor: COLOR.hairline,
    ...ELEVATION.lg,
  },
});
