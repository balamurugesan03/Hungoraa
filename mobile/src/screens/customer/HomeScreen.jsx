import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  FlatList, RefreshControl, StatusBar, Platform, Dimensions, Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../store/authStore';
import { useAppStore } from '../../store/appStore';
import restaurantApi from '../../api/restaurant.api';
import RestaurantCard from '../../components/common/RestaurantCard';
import RestaurantCardHorizontal from '../../components/common/RestaurantCardHorizontal';
import SkeletonCard from '../../components/common/SkeletonCard';
import { COLORS, FONTS, SIZES, SPACING, BORDER_RADIUS, SHADOW, CUISINE_ICONS } from '../../constants';

const { width } = Dimensions.get('window');


const CATEGORIES = [
  { id: 'all', label: 'All', icon: '🍽️' },
  { id: 'indian', label: 'Indian', icon: '🍛' },
  { id: 'chinese', label: 'Chinese', icon: '🥢' },
  { id: 'italian', label: 'Italian', icon: '🍕' },
  { id: 'biryani', label: 'Biryani', icon: '🍚' },
  { id: 'burger', label: 'Burgers', icon: '🍔' },
  { id: 'seafood', label: 'Seafood', icon: '🦞' },
  { id: 'desserts', label: 'Desserts', icon: '🍰' },
  { id: 'cafe', label: 'Cafe', icon: '☕' },
];

const BANNERS = [
  { id: '1', title: '50% Off on Weekends!', subtitle: 'Use code WEEKEND50', color: ['#e63946', '#c1121f'], emoji: '🎉' },
  { id: '2', title: 'Free Dessert', subtitle: 'On bookings above ₹1000', color: ['#2d6a4f', '#40916c'], emoji: '🍰' },
  { id: '3', title: 'Happy Hours', subtitle: '3 PM - 6 PM everyday', color: ['#457b9d', '#1d3557'], emoji: '🥂' },
];

export default function HomeScreen({ navigation }) {
  const user = useAuthStore((s) => s.user);
  const { selectedCity, setCity, setSearchQuery } = useAppStore();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [cityModalVisible, setCityModalVisible] = useState(false);

  const { data: citiesData } = useQuery({
    queryKey: ['restaurant-cities'],
    queryFn: () => restaurantApi.getCities().then((r) => r.data.data.cities),
  });

  const cityList = [null, ...(citiesData || [])];

  const { data: featured, isLoading: featuredLoading, refetch: refetchFeatured } = useQuery({
    queryKey: ['featured-restaurants'],
    queryFn: () => restaurantApi.getFeatured().then((r) => r.data.data),
  });

  const { data: trending, isLoading: trendingLoading, refetch: refetchTrending } = useQuery({
    queryKey: ['trending-restaurants', selectedCity],
    queryFn: () => restaurantApi.getTrending(selectedCity || undefined).then((r) => r.data.data),
  });

  const { data: nearby, isLoading: nearbyLoading, refetch: refetchNearby } = useQuery({
    queryKey: ['nearby-restaurants', selectedCategory, selectedCity],
    queryFn: () => restaurantApi.getAll({
      cuisine: selectedCategory !== 'all' ? selectedCategory : undefined,
      city: selectedCity || undefined,
      limit: 10,
    }).then((r) => r.data.data),
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refetchFeatured(), refetchTrending(), refetchNearby()]);
    setRefreshing(false);
  }, []);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <LinearGradient colors={['#1a1a2e', '#16213e']} style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>{greeting()},</Text>
            <Text style={styles.userName}>{user?.name?.split(' ')[0] || 'Foodie'} 👋</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.locationBtn}
              onPress={() => setCityModalVisible(true)}
            >
              <Ionicons name="location" size={14} color={COLORS.primary} />
              <Text style={styles.locationText} numberOfLines={1}>{selectedCity || 'All Cities'}</Text>
              <Ionicons name="chevron-down" size={12} color={COLORS.lightGray} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.notifBtn}
              onPress={() => navigation.navigate('Notifications')}
            >
              <Ionicons name="notifications-outline" size={22} color={COLORS.white} />
              <View style={styles.notifBadge} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <TouchableOpacity
          style={styles.searchBar}
          onPress={() => navigation.navigate('Search')}
          activeOpacity={0.9}
        >
          <Ionicons name="search" size={18} color={COLORS.gray} />
          <Text style={styles.searchPlaceholder}>Search restaurants, cuisines...</Text>
          <View style={styles.filterIconWrap}>
            <Ionicons name="options-outline" size={18} color={COLORS.primary} />
          </View>
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView
        style={styles.body}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />}
      >
        {/* Promo Banners */}
        <View style={styles.section}>
          <FlatList
            data={BANNERS}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <LinearGradient colors={item.color} style={styles.banner}>
                <View style={styles.bannerContent}>
                  <Text style={styles.bannerEmoji}>{item.emoji}</Text>
                  <Text style={styles.bannerTitle}>{item.title}</Text>
                  <Text style={styles.bannerSub}>{item.subtitle}</Text>
                  <TouchableOpacity style={styles.bannerBtn}>
                    <Text style={styles.bannerBtnText}>Grab Deal →</Text>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            )}
          />
        </View>

        {/* Pay Bill Feature Card */}
        <TouchableOpacity
          style={payBillStyles.card}
          onPress={() => navigation.navigate('PayBill')}
          activeOpacity={0.88}
        >
          <LinearGradient colors={['#1b4332', '#2d6a4f']} style={payBillStyles.gradient}>
            <View style={payBillStyles.left}>
              <View style={payBillStyles.iconCircle}>
                <Text style={{ fontSize: 26 }}>💳</Text>
              </View>
              <View>
                <Text style={payBillStyles.title}>Pay Bill via App</Text>
                <Text style={payBillStyles.sub}>Auto-apply offers on your restaurant bill</Text>
              </View>
            </View>
            <View style={payBillStyles.arrowCircle}>
              <Ionicons name="arrow-forward" size={18} color="#fff" />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Categories */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categories</Text>
        </View>
        <FlatList
          data={CATEGORIES}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.categoryItem, selectedCategory === item.id && styles.categoryItemActive]}
              onPress={() => setSelectedCategory(item.id)}
            >
              <Text style={styles.categoryEmoji}>{item.icon}</Text>
              <Text style={[styles.categoryLabel, selectedCategory === item.id && styles.categoryLabelActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
        />

        {/* Featured / Deals */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>🔥 Trending Deals</Text>
          <TouchableOpacity onPress={() => navigation.navigate('RestaurantList', { filter: 'trending' })}>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        {trendingLoading ? (
          <FlatList
            data={[1, 2, 3]}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: SPACING.lg, gap: SPACING.md }}
            keyExtractor={(i) => i.toString()}
            renderItem={() => <SkeletonCard width={220} height={200} />}
          />
        ) : (
          <FlatList
            data={trending?.restaurants || []}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: SPACING.lg, gap: SPACING.md }}
            keyExtractor={(item) => item._id || item.id}
            renderItem={({ item }) => (
              <RestaurantCard
                restaurant={item}
                onPress={() => navigation.navigate('RestaurantDetail', { id: item._id || item.id })}
              />
            )}
          />
        )}

        {/* Nearby / All */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>🗺️ Restaurants Near You</Text>
          <TouchableOpacity onPress={() => navigation.navigate('RestaurantList', {})}>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.verticalList}>
          {nearbyLoading
            ? [1, 2, 3].map((i) => <SkeletonCard key={i} width="100%" height={120} />)
            : (nearby?.restaurants || []).map((item) => (
                <RestaurantCardHorizontal
                  key={item._id || item.id}
                  restaurant={item}
                  onPress={() => navigation.navigate('RestaurantDetail', { id: item._id || item.id })}
                />
              ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* City Picker Modal */}
      <Modal
        visible={cityModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setCityModalVisible(false)}
      >
        <TouchableOpacity
          style={cityStyles.overlay}
          activeOpacity={1}
          onPress={() => setCityModalVisible(false)}
        >
          <View style={cityStyles.sheet}>
            <View style={cityStyles.handle} />
            <Text style={cityStyles.title}>Select City</Text>
            <FlatList
              data={cityList}
              keyExtractor={(item) => item ?? '__all__'}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[cityStyles.cityItem, selectedCity === item && cityStyles.cityItemActive]}
                  onPress={() => {
                    setCity(item);
                    setCityModalVisible(false);
                  }}
                >
                  <Text style={[cityStyles.cityText, selectedCity === item && cityStyles.cityTextActive]}>
                    {item ?? 'All Cities'}
                  </Text>
                  {selectedCity === item && (
                    <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    paddingTop: Platform.OS === 'ios' ? 56 : 36,
    paddingBottom: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  greeting: { fontSize: SIZES.sm, color: 'rgba(255,255,255,0.6)', fontFamily: FONTS.regular },
  userName: { fontSize: SIZES.xl, color: COLORS.white, fontFamily: FONTS.bold, marginTop: 2 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  locationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  locationText: { fontSize: SIZES.xs, color: COLORS.white, fontFamily: FONTS.medium, maxWidth: 80 },
  notifBtn: { position: 'relative', padding: 4 },
  notifBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    borderWidth: 1.5,
    borderColor: '#16213e',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: 12,
    gap: SPACING.sm,
    ...SHADOW.sm,
  },
  searchPlaceholder: { flex: 1, fontSize: SIZES.base, color: COLORS.lightGray, fontFamily: FONTS.regular },
  filterIconWrap: {
    backgroundColor: COLORS.primaryBg,
    padding: 6,
    borderRadius: BORDER_RADIUS.sm,
  },
  body: { flex: 1 },
  section: { marginTop: SPACING.md },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  sectionTitle: { fontSize: SIZES.md, fontFamily: FONTS.bold, color: COLORS.black },
  seeAll: { fontSize: SIZES.sm, color: COLORS.primary, fontFamily: FONTS.medium },
  banner: {
    width: width - SPACING.lg * 2,
    marginHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    minHeight: 140,
    justifyContent: 'center',
  },
  bannerContent: {},
  bannerEmoji: { fontSize: 32, marginBottom: 8 },
  bannerTitle: { fontSize: SIZES.xl, fontFamily: FONTS.bold, color: COLORS.white, marginBottom: 4 },
  bannerSub: { fontSize: SIZES.sm, color: 'rgba(255,255,255,0.8)', fontFamily: FONTS.regular, marginBottom: 12 },
  bannerBtn: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignSelf: 'flex-start',
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  bannerBtnText: { fontSize: SIZES.sm, color: COLORS.white, fontFamily: FONTS.bold },
  categoryList: { paddingHorizontal: SPACING.lg, gap: SPACING.sm, paddingVertical: 4 },
  categoryItem: {
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.white,
    minWidth: 72,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    ...SHADOW.sm,
  },
  categoryItemActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryEmoji: { fontSize: 22, marginBottom: 4 },
  categoryLabel: { fontSize: 11, fontFamily: FONTS.medium, color: COLORS.gray },
  categoryLabelActive: { color: COLORS.white },
  verticalList: { paddingHorizontal: SPACING.lg, gap: SPACING.md },
});

const payBillStyles = StyleSheet.create({
  card: {
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    ...SHADOW.md,
  },
  gradient: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md,
  },
  left: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  iconCircle: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  title: { fontSize: SIZES.base, fontFamily: FONTS.bold, color: '#fff' },
  sub: { fontSize: SIZES.xs, color: 'rgba(255,255,255,0.75)', fontFamily: FONTS.regular, marginTop: 2 },
  arrowCircle: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
});

const cityStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    paddingTop: SPACING.sm,
    paddingBottom: 40,
    maxHeight: '60%',
  },
  handle: {
    width: 40, height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: SIZES.lg,
    fontFamily: FONTS.bold,
    color: COLORS.black,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  cityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  cityItemActive: {
    backgroundColor: COLORS.primaryBg,
  },
  cityText: {
    fontSize: SIZES.base,
    fontFamily: FONTS.medium,
    color: COLORS.black,
  },
  cityTextActive: {
    color: COLORS.primary,
    fontFamily: FONTS.bold,
  },
});
