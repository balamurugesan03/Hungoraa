import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput,
  ActivityIndicator, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { restaurantApi } from '../../api/restaurant.api';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants';

const SORT_OPTIONS = [
  { label: 'Relevance', value: 'relevance' },
  { label: 'Rating', value: 'rating' },
  { label: 'Price ↑', value: 'price_asc' },
  { label: 'Price ↓', value: 'price_desc' },
];

export default function RestaurantListScreen({ navigation, route }) {
  const { city, cuisine, title } = route.params || {};
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('relevance');

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['restaurant-list', city, cuisine, search, sort],
    queryFn: () => restaurantApi.getAll({ city, cuisine, search, sort }).then((r) => r.data.data),
  });

  const restaurants = data?.restaurants || [];

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={() => navigation.navigate('RestaurantDetail', { restaurantId: item._id })}
    >
      <View style={styles.imageWrap}>
        {item.coverImages?.[0]?.url
          ? <Image source={{ uri: item.coverImages[0].url }} style={styles.image} />
          : <View style={styles.imageFallback}><Text style={{ fontSize: 36 }}>🍽️</Text></View>}
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingText}>⭐ {item.averageRating?.toFixed(1)}</Text>
        </View>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.cuisine} numberOfLines={1}>{item.cuisine?.join(' · ')}</Text>
        <View style={styles.cardMeta}>
          <Text style={styles.city}>📍 {item.city}</Text>
          <Text style={styles.price}>{'₹'.repeat(item.priceRange || 2)}</Text>
          <TouchableOpacity
            style={styles.bookBtn}
            onPress={() => navigation.navigate('Booking', { restaurantId: item._id, restaurantName: item.name })}
          >
            <Text style={styles.bookBtnText}>Book</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title || 'Restaurants'}</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Search */}
      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search restaurants..."
          placeholderTextColor="#ced4da"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Sort */}
      <View style={styles.sortRow}>
        {SORT_OPTIONS.map((opt) => (
          <TouchableOpacity
            key={opt.value}
            style={[styles.sortChip, sort === opt.value && styles.sortChipActive]}
            onPress={() => setSort(opt.value)}
          >
            <Text style={[styles.sortChipText, sort === opt.value && styles.sortChipTextActive]}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {isLoading ? (
        <View style={styles.center}><ActivityIndicator color={COLORS.primary} size="large" /></View>
      ) : (
        <FlatList
          data={restaurants}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          onRefresh={refetch}
          refreshing={isLoading}
          ListEmptyComponent={() => (
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>🍴</Text>
              <Text style={styles.emptyTitle}>No restaurants found</Text>
              <Text style={styles.emptyText}>Try adjusting your filters</Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm,
    backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f1f3f5',
  },
  backBtn: { padding: 8 },
  backText: { fontSize: 22, color: COLORS.primary },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#212529' },
  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', marginHorizontal: SPACING.md, marginTop: SPACING.sm,
    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10,
    borderWidth: 1, borderColor: '#e9ecef',
  },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14, color: '#212529' },
  sortRow: {
    flexDirection: 'row', paddingHorizontal: SPACING.md, paddingVertical: 10, gap: 8,
  },
  sortChip: {
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20,
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#dee2e6',
  },
  sortChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  sortChipText: { fontSize: 12, color: '#495057', fontWeight: '500' },
  sortChipTextActive: { color: '#fff', fontWeight: '700' },
  list: { padding: SPACING.md, gap: 14 },
  card: {
    backgroundColor: '#fff', borderRadius: BORDER_RADIUS.lg, overflow: 'hidden',
    elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 4 },
  },
  imageWrap: { height: 160, position: 'relative' },
  image: { width: '100%', height: '100%' },
  imageFallback: { flex: 1, backgroundColor: '#f1f3f5', justifyContent: 'center', alignItems: 'center' },
  ratingBadge: {
    position: 'absolute', top: 10, right: 10,
    backgroundColor: 'rgba(0,0,0,0.65)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10,
  },
  ratingText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  cardBody: { padding: SPACING.md },
  name: { fontSize: 16, fontWeight: '700', color: '#212529', marginBottom: 4 },
  cuisine: { fontSize: 12, color: '#868e96', marginBottom: 10 },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  city: { fontSize: 12, color: '#868e96', flex: 1 },
  price: { fontSize: 13, color: '#495057' },
  bookBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 14, paddingVertical: 7, borderRadius: 10 },
  bookBtnText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  empty: { alignItems: 'center', paddingTop: 60, paddingHorizontal: 40 },
  emptyIcon: { fontSize: 56, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#212529', marginBottom: 8 },
  emptyText: { fontSize: 14, color: '#868e96', textAlign: 'center' },
});
