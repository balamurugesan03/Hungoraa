import React, { useState } from 'react';
import {
  View, Text, SectionList, StyleSheet, TouchableOpacity,
  ActivityIndicator, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { restaurantApi } from '../../api/restaurant.api';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants';


export default function MenuDetailScreen({ navigation, route }) {
  const { restaurantId, restaurantName } = route.params || {};
  const [vegOnly, setVegOnly] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['menu', restaurantId],
    queryFn: () => restaurantApi.getMenu(restaurantId),
  });

  const menu = data?.data?.data?.menu || { categories: [] };
  const sections = menu.categories
    ?.map((cat) => ({
      title: cat.name,
      data: cat.items?.filter((item) => (vegOnly ? item.isVeg : true)) || [],
    }))
    .filter((s) => s.data.length > 0) || [];

  const renderItem = ({ item }) => (
    <View style={[styles.itemCard, !item.isAvailable && styles.unavailable]}>
      <View style={styles.itemInfo}>
        <View style={styles.vegBadgeRow}>
          <View style={[styles.vegDot, { backgroundColor: item.isVeg ? '#2d6a4f' : '#e63946' }]} />
          {!item.isAvailable && (
            <View style={styles.unavailableBadge}><Text style={styles.unavailableText}>Not Available</Text></View>
          )}
        </View>
        <Text style={[styles.itemName, !item.isAvailable && { color: '#ced4da' }]}>{item.name}</Text>
        {item.description ? (
          <Text style={styles.itemDesc} numberOfLines={2}>{item.description}</Text>
        ) : null}
        <View style={styles.itemMeta}>
          <Text style={styles.price}>₹{item.price}</Text>
          {item.calories ? <Text style={styles.calories}>🔥 {item.calories} cal</Text> : null}
        </View>
      </View>
      {item.image?.url && (
        <Image source={{ uri: item.image.url }} style={styles.itemImage} />
      )}
    </View>
  );

  const renderSectionHeader = ({ section }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <View style={styles.sectionLine} />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{restaurantName || 'Menu'}</Text>
        <TouchableOpacity
          style={[styles.vegToggle, vegOnly && styles.vegToggleActive]}
          onPress={() => setVegOnly(!vegOnly)}
        >
          <Text style={[styles.vegToggleText, vegOnly && { color: '#fff' }]}>🌱 Veg</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.center}><ActivityIndicator color={COLORS.primary} size="large" /></View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          stickySectionHeadersEnabled={true}
          ListEmptyComponent={() => (
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>🍽️</Text>
              <Text style={styles.emptyTitle}>No menu items</Text>
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
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#212529', flex: 1, textAlign: 'center' },
  vegToggle: {
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
    borderWidth: 1.5, borderColor: '#2d6a4f',
  },
  vegToggleActive: { backgroundColor: '#2d6a4f' },
  vegToggleText: { fontSize: 12, fontWeight: '700', color: '#2d6a4f' },
  list: { paddingBottom: 40 },
  sectionHeader: {
    backgroundColor: '#f8f9fa', paddingHorizontal: SPACING.md, paddingVertical: 12,
    flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#212529' },
  sectionLine: { flex: 1, height: 1, backgroundColor: '#dee2e6' },
  itemCard: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    backgroundColor: '#fff', marginHorizontal: SPACING.md, marginBottom: 10,
    borderRadius: BORDER_RADIUS.md, padding: SPACING.md,
    elevation: 1, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, shadowOffset: { width: 0, height: 2 },
  },
  unavailable: { opacity: 0.5 },
  itemInfo: { flex: 1, paddingRight: 12 },
  vegBadgeRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  vegDot: { width: 12, height: 12, borderRadius: 2 },
  unavailableBadge: { backgroundColor: '#f1f3f5', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  unavailableText: { fontSize: 10, color: '#868e96', fontWeight: '600' },
  itemName: { fontSize: 15, fontWeight: '700', color: '#212529', marginBottom: 4 },
  itemDesc: { fontSize: 12, color: '#868e96', lineHeight: 18, marginBottom: 8 },
  itemMeta: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  price: { fontSize: 15, fontWeight: '800', color: COLORS.primary },
  calories: { fontSize: 11, color: '#f4a261' },
  itemImage: { width: 80, height: 80, borderRadius: 10 },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#212529' },
});
