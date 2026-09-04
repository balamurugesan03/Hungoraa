import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable, FlatList, RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import Brandmark from '../../components/Brandmark';
import QuickActions from '../../components/home/QuickActions';
import DiscoveryGrid from '../../components/home/DiscoveryGrid';
import BottomNavigation from '../../components/home/BottomNavigation';
import RateOrderCard from '../../components/home/RateOrderCard';
import DiningModeModal from '../../components/home/DiningModeModal';
import OffersBanner from '../../components/home/OffersBanner';
import { useAppStore } from '../../store/appStore';
import {
  toRestaurantCard, toPromo, offersByRestaurant, greetingForNow,
} from '../../components/home/viewModels';
import {
  useActiveOffers, useFeaturedRestaurants, useTrendingRestaurants, useUnreadCount,
  useFavorites, useCities,
} from '../../hooks/useHome';
import { useAuthStore } from '../../store/authStore';
import { COLOR, SPACING, RADII, text, FONT } from '../../theme';
import {
  Avatar, Chip, RestaurantCard, SkeletonCard, EmptyState, Sheet, Divider,
} from '../../components/ui';

const CITY_FALLBACK = ['Bengaluru', 'Mumbai', 'Delhi', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata'];

export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user);
  const city = useAuthStore((s) => s.city);
  const setCity = useAuthStore((s) => s.setCity);

  const [category, setCategory] = useState({ id: 'all', label: 'All' });
  const [section, setSection] = useState('top');
  const [showRate, setShowRate] = useState(true);
  const [locOpen, setLocOpen] = useState(false);

  // Post-login dining-intent popup — shows once per app launch.
  const modeChooserShown = useAppStore((s) => s.modeChooserShown);
  const setDiningMode = useAppStore((s) => s.setDiningMode);
  const markModeChooserShown = useAppStore((s) => s.markModeChooserShown);
  const [modeOpen, setModeOpen] = useState(false);

  const offersQ = useActiveOffers(city);
  const featuredQ = useFeaturedRestaurants();
  const trendingQ = useTrendingRestaurants(city, {
    cuisine: category.id === 'all' ? undefined : category.label,
    sortBy: section === 'quick' ? 'relevance' : 'rating',
  });
  const unreadQ = useUnreadCount();
  const citiesQ = useCities();
  const { isFavorite, toggleFavorite } = useFavorites();

  const offerMap = useMemo(() => offersByRestaurant(offersQ.data || []), [offersQ.data]);
  const promos = useMemo(() => (offersQ.data || []).slice(0, 6).map(toPromo), [offersQ.data]);
  const trending = useMemo(
    () => (trendingQ.data || []).map((r) => toRestaurantCard(r, offerMap)),
    [trendingQ.data, offerMap],
  );
  const cuisines = useMemo(() => cuisineList(featuredQ.data, trendingQ.data), [featuredQ.data, trendingQ.data]);

  const go = (screen, params) => navigation?.navigate?.(screen, params);
  const openRestaurant = (r) => go('RestaurantDetail', { restaurantId: r.id, slug: r.slug });

  useEffect(() => {
    if (!modeChooserShown) {
      const t = setTimeout(() => setModeOpen(true), 350);
      return () => clearTimeout(t);
    }
  }, [modeChooserShown]);

  const handlePickMode = (mode) => {
    setDiningMode(mode);
    setModeOpen(false);
    if (mode === 'book') go('RestaurantList', { title: 'Book a table', city });
    else if (mode === 'dinein') go('PayBill');
  };

  const handleQuickAction = (id) => {
    setDiningMode(id);
    if (id === 'book') go('RestaurantList', { title: 'Book a table', city, mode: 'book' });
    else go('PayBill');
  };

  const refreshing = Boolean(offersQ.isRefetching || featuredQ.isRefetching || trendingQ.isRefetching);
  const onRefresh = useCallback(() => {
    offersQ.refetch(); featuredQ.refetch(); trendingQ.refetch(); unreadQ.refetch();
  }, [offersQ, featuredQ, trendingQ, unreadQ]);

  const firstName = (user?.name || '').trim().split(' ')[0] || 'there';
  const avatarUrl = user?.avatar?.url || user?.profilePhoto || user?.photo || null;
  const cityList = citiesQ.data?.length ? citiesQ.data : CITY_FALLBACK;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: insets.top + SPACING.xs, paddingBottom: 110 + insets.bottom }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FFFFFF" colors={['#FFFFFF']} />
        }
      >
        {/* Brand */}
        <Brandmark />

        {/* Top bar */}
        <View style={styles.topBar}>
          <Pressable style={styles.location} onPress={() => setLocOpen(true)}>
            <Ionicons name="location" size={15} color="#F9A91B" />
            <Text style={styles.locText} numberOfLines={1}>{city || 'Select location'}</Text>
            <Ionicons name="chevron-down" size={15} color={COLOR.onNavySoft} />
          </Pressable>
          <View style={styles.topRight}>
            <Pressable hitSlop={8} style={styles.bell} onPress={() => go('Notifications')}>
              <Ionicons name="notifications-outline" size={20} color={COLOR.onNavy} />
              {unreadQ.data > 0 ? <View style={styles.badge} /> : null}
            </Pressable>
            <Pressable onPress={() => go('Profile')} hitSlop={6}>
              <Avatar name={user?.name || 'U'} uri={avatarUrl} size={38} />
            </Pressable>
          </View>
        </View>

        {/* Greeting */}
        <View style={styles.greet}>
          <Text style={[text.display, styles.onNavy]}>{greetingForNow()}, {firstName}.</Text>
          <Text style={[text.body, styles.greetSub]}>What are you dining on today?</Text>
        </View>

        {/* Search (opens Search screen) */}
        <Pressable style={styles.search} onPress={() => go('Search')}>
          <Ionicons name="search" size={18} color={COLOR.inkFaint} />
          <Text style={styles.searchText}>Restaurants, cuisines, a dish…</Text>
          <View style={styles.searchMic}>
            <Ionicons name="mic-outline" size={16} color={COLOR.terracotta} />
          </View>
        </Pressable>

        {/* Cuisine chips */}
        <FlatList
          data={[{ id: 'all', label: 'All' }, ...cuisines]}
          keyExtractor={(c) => c.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
          renderItem={({ item }) => (
            <Chip
              label={item.label}
              selected={category.id === item.id}
              onPress={() => setCategory(item)}
            />
          )}
        />

        {/* Offers banner — live, auto-sliding (EasyDiner style) */}
        {offersQ.isLoading ? (
          <View style={styles.railPad}><SkeletonCard style={styles.skelBanner} /></View>
        ) : promos.length ? (
          <View style={styles.bannerWrap}>
            <OffersBanner promos={promos} onOpen={(p) => go('Offers', { offerId: p.id })} />
          </View>
        ) : null}

        {/* Primary actions */}
        <QuickActions onPress={handleQuickAction} />

        {/* What's on your mind */}
        <Text style={[text.h2, styles.onNavy, styles.sectionHead]}>What&apos;s on your mind?</Text>
        <DiscoveryGrid onOpen={(params) => go('RestaurantList', { ...params, city })} />

        {/* Top rated / quick */}
        <View style={styles.togRow}>
          <Text style={[text.h2, styles.onNavy]}>{section === 'quick' ? 'Table in 15 min' : 'Top rated near you'}</Text>
          <View style={styles.toggle}>
            {[['top', 'Top rated'], ['quick', 'Quick']].map(([id, label]) => (
              <Pressable
                key={id}
                onPress={() => setSection(id)}
                style={[styles.toggleBtn, section === id && styles.toggleBtnOn]}
              >
                <Text style={[styles.toggleText, section === id && styles.toggleTextOn]}>{label}</Text>
              </Pressable>
            ))}
          </View>
        </View>
        {trendingQ.isLoading ? (
          <View style={styles.railPad}><SkeletonCard style={styles.skelFeature} /></View>
        ) : trending.length ? (
          <FlatList
            data={trending}
            keyExtractor={(r) => r.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.rail}
            renderItem={({ item }) => (
              <RestaurantCard
                item={item}
                layout="feature"
                isFavorite={isFavorite(item.id)}
                onToggleFavorite={toggleFavorite}
                onPress={() => openRestaurant(item)}
              />
            )}
          />
        ) : (
          <EmptyState
            dark
            icon="restaurant-outline"
            title={city ? `No restaurants in ${city} yet` : 'No restaurants found'}
            message="Try changing your city or filters."
          />
        )}

        {showRate ? (
          <View style={styles.rateWrap}>
            <RateOrderCard
              title="Rate your last visit"
              subtitle="Help others discover great places"
              onClose={() => setShowRate(false)}
              onRate={(n) => go('Bookings', { screen: 'Review', params: { rating: n } })}
            />
          </View>
        ) : null}
      </ScrollView>

      <BottomNavigation
        active="dineout"
        onChange={(id) => {
          if (id === 'quick') go('RestaurantList', { title: 'Table in 15 min', city });
          else if (id === 'offers' || id === 'win') go('Offers');
          else if (id === 'bookings') go('Bookings');
          else if (id === 'paybill') go('PayBill');
        }}
        bottomInset={insets.bottom}
      />

      <DiningModeModal
        visible={modeOpen}
        onSelect={handlePickMode}
        onClose={() => { setModeOpen(false); markModeChooserShown(); }}
      />

      <Sheet visible={locOpen} onClose={() => setLocOpen(false)} title="Choose your city">
        <ScrollView style={{ maxHeight: 380 }} showsVerticalScrollIndicator={false}>
          {['All cities', ...cityList].map((c, i) => {
            const value = c === 'All cities' ? null : c;
            const active = (city || null) === value;
            return (
              <View key={c}>
                {i > 0 ? <Divider spacing={0} /> : null}
                <Pressable
                  style={styles.cityRow}
                  onPress={() => { setCity(value); setLocOpen(false); }}
                >
                  <Ionicons
                    name={active ? 'radio-button-on' : 'radio-button-off'}
                    size={20}
                    color={active ? COLOR.terracotta : COLOR.inkFaint}
                  />
                  <Text style={[text.bodyInk, active && styles.cityActive]}>{c}</Text>
                </Pressable>
              </View>
            );
          })}
        </ScrollView>
      </Sheet>
    </View>
  );
}

function cuisineList(featured = [], trending = []) {
  const set = new Set();
  [...(featured || []), ...(trending || [])].forEach((r) => {
    (r.cuisine || []).forEach((c) => c && set.add(c));
    (r.categories || []).forEach((c) => c && set.add(c));
  });
  return Array.from(set).slice(0, 12).map((c) => ({ id: c.toLowerCase().replace(/\s+/g, ''), label: c }));
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLOR.navy },
  onNavy: { color: COLOR.onNavy },
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.xs,
  },
  location: {
    flexDirection: 'row', alignItems: 'center', gap: 5, flex: 1, paddingRight: SPACING.md,
  },
  locText: { fontFamily: FONT.semiBold, fontSize: 15, color: COLOR.onNavy, flexShrink: 1 },
  topRight: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  bell: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: COLOR.onNavyFill,
    alignItems: 'center', justifyContent: 'center',
  },
  badge: {
    position: 'absolute', top: 9, right: 10,
    width: 8, height: 8, borderRadius: 4, backgroundColor: '#F9A91B',
    borderWidth: 1.5, borderColor: COLOR.navy,
  },
  greet: { paddingHorizontal: SPACING.lg, marginTop: SPACING.sm, marginBottom: SPACING.md },
  greetSub: { marginTop: 4, color: COLOR.onNavySoft },
  search: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.sm,
    marginHorizontal: SPACING.lg,
    backgroundColor: COLOR.surface, borderRadius: RADII.md,
    borderWidth: 1, borderColor: COLOR.hairline,
    paddingHorizontal: SPACING.md, height: 52,
  },
  searchText: { flex: 1, fontFamily: FONT.regular, fontSize: 14, color: COLOR.inkFaint },
  searchMic: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: COLOR.terracottaTint,
    alignItems: 'center', justifyContent: 'center',
  },
  chips: { paddingHorizontal: SPACING.lg, gap: SPACING.xs, paddingVertical: SPACING.md },
  sectionHead: { paddingHorizontal: SPACING.lg, marginTop: SPACING.sm, marginBottom: SPACING.sm },
  rail: { paddingHorizontal: SPACING.lg, gap: SPACING.md, paddingVertical: SPACING.xs },
  railPad: { paddingHorizontal: SPACING.lg },
  skelFeature: { width: 230, backgroundColor: COLOR.surface, borderRadius: RADII.lg, padding: SPACING.sm },
  bannerWrap: { marginTop: SPACING.xs, marginBottom: SPACING.xs },
  skelBanner: { height: 150, backgroundColor: COLOR.surface, borderRadius: RADII.lg },
  togRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg, marginTop: SPACING.lg, marginBottom: SPACING.sm,
  },
  toggle: { flexDirection: 'row', backgroundColor: COLOR.surfaceAlt, borderRadius: RADII.pill, padding: 3 },
  toggleBtn: { paddingHorizontal: SPACING.sm, paddingVertical: 6, borderRadius: RADII.pill },
  toggleBtnOn: { backgroundColor: COLOR.surface },
  toggleText: { fontFamily: FONT.semiBold, fontSize: 12, color: COLOR.inkSoft },
  toggleTextOn: { color: COLOR.terracotta },
  rateWrap: { marginTop: SPACING.xl },
  cityRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, paddingVertical: SPACING.md },
  cityActive: { fontFamily: FONT.semiBold, color: COLOR.terracotta },
});
