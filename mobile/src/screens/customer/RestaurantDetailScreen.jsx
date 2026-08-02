import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList,
  Dimensions, Platform, Share, StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import restaurantApi from '../../api/restaurant.api';
import { COLORS, FONTS, SIZES, SPACING, BORDER_RADIUS, SHADOW } from '../../constants';

const { width, height } = Dimensions.get('window');
const HEADER_HEIGHT = 280;

const TABS = ['Overview', 'Menu', 'Reviews', 'Offers'];

export default function RestaurantDetailScreen({ navigation, route }) {
  const { id } = route.params;
  const [activeTab, setActiveTab] = useState('Overview');
  const [isSaved, setIsSaved] = useState(false);
  const scrollY = useRef(null);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['restaurant', id],
    queryFn: () => restaurantApi.getById(id).then((r) => r.data.data),
    enabled: !!id,
  });

  const { data: menuData } = useQuery({
    queryKey: ['restaurant-menu', id],
    queryFn: () => restaurantApi.getMenu(id).then((r) => r.data.data),
    enabled: activeTab === 'Menu' && !!id,
  });

  const { data: reviewsData } = useQuery({
    queryKey: ['restaurant-reviews', id],
    queryFn: () => restaurantApi.getReviews(id).then((r) => r.data.data),
    enabled: activeTab === 'Reviews' && !!id,
  });

  const { data: offersData } = useQuery({
    queryKey: ['restaurant-offers', id],
    queryFn: () => restaurantApi.getOffers(id).then((r) => r.data.data.offers),
    enabled: activeTab === 'Offers' && !!id,
  });

  const saveMutation = useMutation({
    mutationFn: () => restaurantApi.toggleSave(id),
    onSuccess: () => {
      setIsSaved(!isSaved);
      Toast.show({ type: 'success', text1: isSaved ? 'Removed from saved' : 'Saved!' });
    },
  });

  const handleShare = () => {
    Share.share({ message: `Check out ${restaurant?.name} on Hungora!` });
  };

  const restaurant = data?.restaurant || {};

  const renderRatingStars = (rating) =>
    [1, 2, 3, 4, 5].map((star) => (
      <Ionicons
        key={star}
        name={star <= Math.floor(rating) ? 'star' : star - 0.5 <= rating ? 'star-half' : 'star-outline'}
        size={14}
        color={COLORS.rating}
      />
    ));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Floating Header Buttons */}
      <View style={styles.floatingHeader}>
        <TouchableOpacity style={styles.floatingBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color={COLORS.dark} />
        </TouchableOpacity>
        <View style={styles.floatingRight}>
          <TouchableOpacity style={styles.floatingBtn} onPress={handleShare}>
            <Ionicons name="share-social-outline" size={20} color={COLORS.dark} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.floatingBtn} onPress={() => saveMutation.mutate()}>
            <Ionicons
              name={isSaved ? 'heart' : 'heart-outline'}
              size={20}
              color={isSaved ? COLORS.primary : COLORS.dark}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Gallery */}
        <FlatList
          data={restaurant.images?.length ? restaurant.images : [{ url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800' }]}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item }) => (
            <Image source={{ uri: item.url }} style={styles.heroImage} contentFit="cover" />
          )}
          style={styles.gallery}
        />

        {/* Quick Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoTop}>
            <View style={styles.nameSection}>
              <Text style={styles.restaurantName}>{restaurant.name}</Text>
              {restaurant.isVerified && (
                <View style={styles.verifiedBadge}>
                  <Ionicons name="checkmark-circle" size={14} color={COLORS.info} />
                  <Text style={styles.verifiedText}>Verified</Text>
                </View>
              )}
            </View>
            <Text style={styles.cuisine}>{restaurant.cuisine?.join(' • ')}</Text>
          </View>

          {/* Rating & Meta Row */}
          <View style={styles.metaRow}>
            <View style={styles.ratingWrap}>
              <View style={styles.starsRow}>{renderRatingStars(restaurant.averageRating || 4.5)}</View>
              <Text style={styles.ratingValue}>{restaurant.averageRating?.toFixed(1) || '4.5'}</Text>
              <Text style={styles.reviewCount}>({restaurant.totalReviews || 234} reviews)</Text>
            </View>
          </View>

          <View style={styles.chipRow}>
            <InfoChip icon="location-outline" text={restaurant.address?.city || 'Bangalore'} />
            <InfoChip icon="cash-outline" text={`₹${restaurant.costForTwo || 800} for 2`} />
            <InfoChip icon="time-outline" text="Open Now" color={COLORS.secondary} />
          </View>

          {/* Amenities */}
          {restaurant.amenities?.length > 0 && (
            <View style={styles.amenitiesRow}>
              {restaurant.amenities.map((a) => (
                <View key={a} style={styles.amenityTag}>
                  <Text style={styles.amenityText}>{a}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        <View style={styles.tabContent}>
          {activeTab === 'Overview' && <OverviewTab restaurant={restaurant} />}
          {activeTab === 'Menu' && <MenuTab menuData={menuData} navigation={navigation} restaurantId={id} />}
          {activeTab === 'Reviews' && <ReviewsTab reviews={reviewsData?.reviews || []} />}
          {activeTab === 'Offers' && <OffersTab offers={offersData || []} />}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Book Table CTA */}
      <View style={styles.bookingCTA}>
        <View style={styles.ctaInfo}>
          <Text style={styles.ctaText}>Reserve a table</Text>
          <Text style={styles.ctaSub}>Instant confirmation</Text>
        </View>
        <TouchableOpacity
          style={styles.bookBtn}
          onPress={() => navigation.navigate('Booking', { restaurantId: id, restaurantName: restaurant.name })}
          activeOpacity={0.9}
        >
          <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.bookBtnGrad}>
            <Text style={styles.bookBtnText}>Book Table</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function InfoChip({ icon, text, color = COLORS.gray }) {
  return (
    <View style={chipStyles.chip}>
      <Ionicons name={icon} size={12} color={color} />
      <Text style={[chipStyles.text, { color }]}>{text}</Text>
    </View>
  );
}

const chipStyles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.full,
  },
  text: { fontSize: SIZES.xs, fontFamily: FONTS.medium },
});

function OverviewTab({ restaurant }) {
  return (
    <View style={{ gap: SPACING.md, padding: SPACING.lg }}>
      {restaurant.description && (
        <View>
          <Text style={ovStyles.sectionTitle}>About</Text>
          <Text style={ovStyles.desc}>{restaurant.description}</Text>
        </View>
      )}
      <View>
        <Text style={ovStyles.sectionTitle}>Location</Text>
        <View style={ovStyles.locationCard}>
          <Ionicons name="location" size={16} color={COLORS.primary} />
          <Text style={ovStyles.locationText}>
            {restaurant.address?.street}, {restaurant.address?.city}, {restaurant.address?.state}
          </Text>
        </View>
        <TouchableOpacity style={ovStyles.mapBtn}>
          <Ionicons name="map-outline" size={14} color={COLORS.primary} />
          <Text style={ovStyles.mapBtnText}>View on Map</Text>
        </TouchableOpacity>
      </View>
      <View>
        <Text style={ovStyles.sectionTitle}>Hours</Text>
        {(restaurant.operatingHours || []).map((h) => (
          <View key={h.day} style={ovStyles.hourRow}>
            <Text style={ovStyles.dayText}>{h.day?.charAt(0).toUpperCase() + h.day?.slice(1)}</Text>
            <Text style={[ovStyles.hourText, !h.isOpen && { color: COLORS.error }]}>
              {h.isOpen ? h.slots?.map((s) => `${s.open} - ${s.close}`).join(', ') : 'Closed'}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const ovStyles = StyleSheet.create({
  sectionTitle: { fontSize: SIZES.md, fontFamily: FONTS.bold, color: COLORS.black, marginBottom: 8 },
  desc: { fontSize: SIZES.base, color: COLORS.gray, lineHeight: 22, fontFamily: FONTS.regular },
  locationCard: { flexDirection: 'row', gap: 8, alignItems: 'flex-start', backgroundColor: COLORS.background, padding: SPACING.md, borderRadius: BORDER_RADIUS.md },
  locationText: { flex: 1, fontSize: SIZES.base, color: COLORS.dark, fontFamily: FONTS.regular, lineHeight: 20 },
  mapBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  mapBtnText: { fontSize: SIZES.sm, color: COLORS.primary, fontFamily: FONTS.medium },
  hourRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  dayText: { fontSize: SIZES.sm, fontFamily: FONTS.medium, color: COLORS.dark, textTransform: 'capitalize' },
  hourText: { fontSize: SIZES.sm, fontFamily: FONTS.regular, color: COLORS.gray },
});

function MenuTab({ menuData, navigation, restaurantId }) {
  const categories = menuData?.categories || [];
  return (
    <View style={{ padding: SPACING.lg, gap: SPACING.lg }}>
      {categories.map((cat) => (
        <View key={cat.name}>
          <Text style={menuStyles.catTitle}>{cat.name}</Text>
          {cat.items.map((item) => (
            <TouchableOpacity
              key={item._id || item.name}
              style={menuStyles.menuItem}
              onPress={() => navigation.navigate('MenuDetail', { item, restaurantId })}
            >
              <View style={menuStyles.menuInfo}>
                <View style={[menuStyles.vegDot, { backgroundColor: item.isVeg ? COLORS.secondary : COLORS.error }]} />
                <View style={menuStyles.menuText}>
                  <Text style={menuStyles.itemName}>{item.name}</Text>
                  <Text style={menuStyles.itemDesc} numberOfLines={2}>{item.description}</Text>
                </View>
              </View>
              <View style={menuStyles.priceWrap}>
                <Text style={menuStyles.price}>₹{item.price}</Text>
                {item.image && <Image source={{ uri: item.image }} style={menuStyles.itemImage} contentFit="cover" />}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
}

const menuStyles = StyleSheet.create({
  catTitle: { fontSize: SIZES.md, fontFamily: FONTS.bold, color: COLORS.black, marginBottom: SPACING.sm },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuInfo: { flex: 1, flexDirection: 'row', gap: SPACING.sm, marginRight: SPACING.md },
  vegDot: { width: 14, height: 14, borderRadius: 2, marginTop: 2, borderWidth: 1.5, borderColor: 'rgba(0,0,0,0.15)' },
  menuText: { flex: 1 },
  itemName: { fontSize: SIZES.base, fontFamily: FONTS.semiBold, color: COLORS.dark },
  itemDesc: { fontSize: SIZES.xs, color: COLORS.gray, fontFamily: FONTS.regular, marginTop: 2, lineHeight: 17 },
  priceWrap: { alignItems: 'flex-end', gap: 6 },
  price: { fontSize: SIZES.base, fontFamily: FONTS.bold, color: COLORS.primary },
  itemImage: { width: 60, height: 60, borderRadius: BORDER_RADIUS.sm },
});

function ReviewsTab({ reviews }) {
  return (
    <View style={{ padding: SPACING.lg, gap: SPACING.md }}>
      {reviews.map((r, i) => (
        <View key={i} style={reviewStyles.card}>
          <View style={reviewStyles.header}>
            <View style={reviewStyles.avatar}>
              <Text style={reviewStyles.avatarText}>{r.user?.name?.charAt(0) || 'U'}</Text>
            </View>
            <View style={reviewStyles.headerInfo}>
              <Text style={reviewStyles.userName}>{r.user?.name || 'Anonymous'}</Text>
              <Text style={reviewStyles.date}>{r.date || 'Dec 2024'}</Text>
            </View>
            <View style={reviewStyles.ratingBadge}>
              <Ionicons name="star" size={11} color={COLORS.rating} />
              <Text style={reviewStyles.ratingText}>{r.rating}</Text>
            </View>
          </View>
          <Text style={reviewStyles.comment}>{r.comment}</Text>
        </View>
      ))}
    </View>
  );
}

const reviewStyles = StyleSheet.create({
  card: { backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.md, padding: SPACING.md },
  header: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: 8 },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: COLORS.white, fontFamily: FONTS.bold, fontSize: SIZES.base },
  headerInfo: { flex: 1 },
  userName: { fontSize: SIZES.sm, fontFamily: FONTS.bold, color: COLORS.dark },
  date: { fontSize: SIZES.xs, color: COLORS.gray, fontFamily: FONTS.regular },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: '#fff8e1', paddingHorizontal: 7, paddingVertical: 3, borderRadius: BORDER_RADIUS.full },
  ratingText: { fontSize: SIZES.sm, fontFamily: FONTS.bold, color: COLORS.dark },
  comment: { fontSize: SIZES.sm, color: COLORS.gray, lineHeight: 20, fontFamily: FONTS.regular },
});

function OffersTab({ offers }) {
  if (!offers || offers.length === 0) {
    return (
      <View style={{ padding: SPACING.lg, alignItems: 'center', paddingTop: 40 }}>
        <Text style={{ fontSize: 40, marginBottom: 12 }}>🏷️</Text>
        <Text style={{ fontSize: SIZES.base, fontFamily: FONTS.bold, color: COLORS.dark }}>No active offers</Text>
        <Text style={{ fontSize: SIZES.sm, color: COLORS.gray, marginTop: 4 }}>Check back later for deals!</Text>
      </View>
    );
  }
  return (
    <View style={{ padding: SPACING.lg, gap: SPACING.md }}>
      {offers.map((offer, i) => {
        const discountLabel = offer.type === 'percentage'
          ? `${offer.discountValue}% Off`
          : offer.type === 'flat'
          ? `₹${offer.discountValue} Off`
          : offer.type === 'bogo' ? 'Buy 1 Get 1' : offer.type?.replace(/_/g, ' ') || 'Special Offer';
        return (
          <View key={offer._id || i} style={offerStyles.card}>
            <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={offerStyles.gradient}>
              <Text style={offerStyles.emoji}>🎁</Text>
            </LinearGradient>
            <View style={offerStyles.info}>
              <Text style={offerStyles.title}>{offer.title}</Text>
              <Text style={offerStyles.desc}>{discountLabel}{offer.minOrderAmount > 0 ? ` • Min ₹${offer.minOrderAmount}` : ''}</Text>
              <Text style={[offerStyles.desc, { marginTop: 2 }]}>{offer.description}</Text>
              {offer.code && (
                <View style={offerStyles.codeRow}>
                  <Text style={offerStyles.codeLabel}>Use code: </Text>
                  <View style={offerStyles.codeBadge}>
                    <Text style={offerStyles.code}>{offer.code}</Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const offerStyles = StyleSheet.create({
  card: { flexDirection: 'row', backgroundColor: COLORS.white, borderRadius: BORDER_RADIUS.md, overflow: 'hidden', ...SHADOW.sm },
  gradient: { width: 60, alignItems: 'center', justifyContent: 'center' },
  emoji: { fontSize: 24 },
  info: { flex: 1, padding: SPACING.md },
  title: { fontSize: SIZES.base, fontFamily: FONTS.bold, color: COLORS.dark, marginBottom: 4 },
  desc: { fontSize: SIZES.xs, color: COLORS.gray, fontFamily: FONTS.regular, lineHeight: 17 },
  codeRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  codeLabel: { fontSize: SIZES.xs, color: COLORS.gray, fontFamily: FONTS.regular },
  codeBadge: { backgroundColor: COLORS.primaryBg, paddingHorizontal: 8, paddingVertical: 2, borderRadius: BORDER_RADIUS.xs, borderWidth: 1, borderColor: COLORS.primary, borderStyle: 'dashed' },
  code: { fontSize: SIZES.xs, color: COLORS.primary, fontFamily: FONTS.bold },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  floatingHeader: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    left: SPACING.lg,
    right: SPACING.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  floatingBtn: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: BORDER_RADIUS.full,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOW.md,
  },
  floatingRight: { flexDirection: 'row', gap: SPACING.sm },
  gallery: { height: HEADER_HEIGHT },
  heroImage: { width, height: HEADER_HEIGHT },
  infoCard: { padding: SPACING.lg, gap: SPACING.sm, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  infoTop: { gap: 4 },
  nameSection: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, flexWrap: 'wrap' },
  restaurantName: { fontSize: SIZES.h2, fontFamily: FONTS.bold, color: COLORS.black, flex: 1 },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  verifiedText: { fontSize: SIZES.xs, color: COLORS.info, fontFamily: FONTS.medium },
  cuisine: { fontSize: SIZES.sm, color: COLORS.gray, fontFamily: FONTS.regular },
  metaRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  ratingWrap: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  starsRow: { flexDirection: 'row', gap: 1 },
  ratingValue: { fontSize: SIZES.base, fontFamily: FONTS.bold, color: COLORS.dark },
  reviewCount: { fontSize: SIZES.sm, color: COLORS.gray, fontFamily: FONTS.regular },
  chipRow: { flexDirection: 'row', gap: SPACING.sm, flexWrap: 'wrap' },
  amenitiesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  amenityTag: {
    backgroundColor: COLORS.primaryBg,
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  amenityText: { fontSize: SIZES.xs, color: COLORS.primary, fontFamily: FONTS.medium },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  tab: { flex: 1, paddingVertical: 14, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: COLORS.primary },
  tabText: { fontSize: SIZES.sm, fontFamily: FONTS.medium, color: COLORS.gray },
  tabTextActive: { color: COLORS.primary, fontFamily: FONTS.bold },
  tabContent: {},
  bookingCTA: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    paddingBottom: Platform.OS === 'ios' ? 30 : SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    ...SHADOW.lg,
  },
  ctaInfo: {},
  ctaText: { fontSize: SIZES.base, fontFamily: FONTS.bold, color: COLORS.dark },
  ctaSub: { fontSize: SIZES.xs, color: COLORS.gray, fontFamily: FONTS.regular, marginTop: 2 },
  bookBtn: { borderRadius: BORDER_RADIUS.md, overflow: 'hidden' },
  bookBtnGrad: { paddingHorizontal: SPACING.xl, paddingVertical: 14 },
  bookBtnText: { fontSize: SIZES.base, fontFamily: FONTS.bold, color: COLORS.white },
});
