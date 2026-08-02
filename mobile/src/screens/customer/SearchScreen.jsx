import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput,
  Platform, StatusBar, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { useAppStore } from '../../store/appStore';
import restaurantApi from '../../api/restaurant.api';
import RestaurantCardHorizontal from '../../components/common/RestaurantCardHorizontal';
import { COLORS, FONTS, SIZES, SPACING, BORDER_RADIUS, SHADOW } from '../../constants';

const FILTER_CUISINES = ['Indian', 'Chinese', 'Italian', 'Biryani', 'Pizza', 'Burger', 'Seafood', 'Thai'];
const SORT_OPTIONS = [
  { id: 'relevance', label: 'Relevance' },
  { id: 'rating', label: 'Rating' },
  { id: 'distance', label: 'Distance' },
  { id: 'costLow', label: 'Cost: Low' },
  { id: 'costHigh', label: 'Cost: High' },
];

export default function SearchScreen({ navigation }) {
  const { addRecentSearch, recentSearches } = useAppStore();
  const [query, setQuery] = useState('');
  const [activeQuery, setActiveQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['search', activeQuery, selectedCuisine, sortBy],
    queryFn: () =>
      restaurantApi.search(activeQuery, { cuisine: selectedCuisine, sortBy }).then((r) => r.data.data),
    enabled: !!activeQuery || !!selectedCuisine,
  });

  const handleSearch = useCallback(() => {
    if (!query.trim()) return;
    setActiveQuery(query.trim());
    addRecentSearch(query.trim());
  }, [query]);

  const clearSearch = () => {
    setQuery('');
    setActiveQuery('');
  };

  const results = data?.restaurants || [];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Search Header */}
      <View style={styles.header}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={COLORS.gray} />
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            placeholder="Search restaurants, cuisines..."
            placeholderTextColor={COLORS.lightGray}
            returnKeyType="search"
            onSubmitEditing={handleSearch}
            autoFocus
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={clearSearch}>
              <Ionicons name="close-circle" size={18} color={COLORS.gray} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={[styles.filterBtn, showFilters && styles.filterBtnActive]}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Ionicons name="options-outline" size={18} color={showFilters ? COLORS.white : COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Filters Panel */}
      {showFilters && (
        <View style={styles.filtersPanel}>
          <Text style={styles.filterLabel}>Cuisine</Text>
          <FlatList
            data={FILTER_CUISINES}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterList}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.filterChip, selectedCuisine === item && styles.filterChipActive]}
                onPress={() => setSelectedCuisine(selectedCuisine === item ? '' : item)}
              >
                <Text style={[styles.filterChipText, selectedCuisine === item && styles.filterChipTextActive]}>
                  {item}
                </Text>
              </TouchableOpacity>
            )}
          />
          <Text style={styles.filterLabel}>Sort By</Text>
          <FlatList
            data={SORT_OPTIONS}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterList}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.filterChip, sortBy === item.id && styles.filterChipActive]}
                onPress={() => setSortBy(item.id)}
              >
                <Text style={[styles.filterChipText, sortBy === item.id && styles.filterChipTextActive]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* Recent Searches (no active query) */}
      {!activeQuery && recentSearches.length > 0 && (
        <View style={styles.recentSection}>
          <Text style={styles.recentTitle}>Recent Searches</Text>
          {recentSearches.slice(0, 6).map((term) => (
            <TouchableOpacity
              key={term}
              style={styles.recentItem}
              onPress={() => { setQuery(term); setActiveQuery(term); }}
            >
              <Ionicons name="time-outline" size={16} color={COLORS.gray} />
              <Text style={styles.recentText}>{term}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* No query, no recents */}
      {!activeQuery && recentSearches.length === 0 && (
        <View style={styles.emptySearch}>
          <Text style={styles.emptyEmoji}>🔍</Text>
          <Text style={styles.emptyTitle}>Discover Restaurants</Text>
          <Text style={styles.emptySub}>Search by name, cuisine, or location</Text>
        </View>
      )}

      {/* Results */}
      {activeQuery && (
        <FlatList
          data={results}
          keyExtractor={(item) => item._id || item.id}
          contentContainerStyle={styles.resultsList}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <Text style={styles.resultsCount}>
              {isLoading ? 'Searching...' : `${results.length} results for "${activeQuery}"`}
            </Text>
          }
          ListEmptyComponent={
            !isLoading ? (
              <View style={styles.noResults}>
                <Text style={styles.noResultsEmoji}>😕</Text>
                <Text style={styles.noResultsText}>No restaurants found</Text>
                <Text style={styles.noResultsSub}>Try a different search term</Text>
              </View>
            ) : null
          }
          renderItem={({ item }) => (
            <RestaurantCardHorizontal
              restaurant={item}
              onPress={() => navigation.navigate('RestaurantDetail', { id: item._id || item.id })}
            />
          )}
        />
      )}

      {isLoading && activeQuery && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  header: {
    flexDirection: 'row',
    gap: SPACING.sm,
    padding: SPACING.lg,
    paddingTop: Platform.OS === 'ios' ? 56 : 36,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    height: 48,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  searchInput: { flex: 1, fontSize: SIZES.base, color: COLORS.dark, fontFamily: FONTS.regular },
  filterBtn: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  filterBtnActive: { backgroundColor: COLORS.primary },
  filtersPanel: { backgroundColor: COLORS.white, paddingVertical: SPACING.sm, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  filterLabel: { fontSize: SIZES.xs, fontFamily: FONTS.bold, color: COLORS.gray, paddingHorizontal: SPACING.lg, marginBottom: 6, textTransform: 'uppercase' },
  filterList: { paddingHorizontal: SPACING.lg, gap: SPACING.sm, paddingBottom: SPACING.sm },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  filterChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filterChipText: { fontSize: SIZES.xs, fontFamily: FONTS.medium, color: COLORS.gray },
  filterChipTextActive: { color: COLORS.white },
  recentSection: { padding: SPACING.lg },
  recentTitle: { fontSize: SIZES.base, fontFamily: FONTS.bold, color: COLORS.dark, marginBottom: SPACING.md },
  recentItem: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  recentText: { fontSize: SIZES.base, color: COLORS.dark, fontFamily: FONTS.regular },
  emptySearch: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: SPACING.xl },
  emptyEmoji: { fontSize: 64, marginBottom: SPACING.md },
  emptyTitle: { fontSize: SIZES.lg, fontFamily: FONTS.bold, color: COLORS.dark, marginBottom: 8 },
  emptySub: { fontSize: SIZES.base, color: COLORS.gray, textAlign: 'center', fontFamily: FONTS.regular },
  resultsList: { padding: SPACING.lg, gap: SPACING.md },
  resultsCount: { fontSize: SIZES.sm, color: COLORS.gray, fontFamily: FONTS.regular, marginBottom: SPACING.sm },
  noResults: { alignItems: 'center', paddingVertical: 40 },
  noResultsEmoji: { fontSize: 48, marginBottom: SPACING.md },
  noResultsText: { fontSize: SIZES.lg, fontFamily: FONTS.bold, color: COLORS.dark },
  noResultsSub: { fontSize: SIZES.base, color: COLORS.gray, fontFamily: FONTS.regular, marginTop: 4 },
  loadingOverlay: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.8)' },
});
