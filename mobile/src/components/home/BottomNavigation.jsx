import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLOR, SPACING, RADII, ELEVATION, FONT } from '../../theme';

const ITEMS = [
  { id: 'dineout', label: 'Dine Out', lib: 'mc', icon: 'silverware-fork-knife' },
  { id: 'quick', label: 'Quick', lib: 'ion', icon: 'flash-outline' },
  { id: 'offers', label: 'Offers', lib: 'ion', icon: 'pricetag-outline' },
  { id: 'bookings', label: 'Bookings', lib: 'ion', icon: 'calendar-outline' },
];

function TabIcon({ lib, icon, color, size }) {
  if (lib === 'mc') return <MaterialCommunityIcons name={icon} size={size} color={color} />;
  return <Ionicons name={icon} size={size} color={color} />;
}

/** Floating rounded bottom nav — cream pill, terracotta active state. */
export default function BottomNavigation({ active = 'dineout', onChange, bottomInset = 0 }) {
  return (
    <View style={[styles.wrap, { paddingBottom: bottomInset ? bottomInset - 4 : 8 }]}>
      <View style={[styles.bar, ELEVATION.lg]}>
        {ITEMS.map((item) => {
          const on = item.id === active;
          const color = on ? COLOR.terracotta : COLOR.inkFaint;
          return (
            <Pressable key={item.id} style={styles.item} onPress={() => onChange && onChange(item.id)}>
              <TabIcon lib={item.lib} icon={item.icon} color={color} size={22} />
              <Text style={[styles.label, { color, fontFamily: on ? FONT.semiBold : FONT.medium }]}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: SPACING.md },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 64,
    paddingHorizontal: SPACING.xs,
    borderRadius: RADII.lg,
    backgroundColor: COLOR.surface,
    borderWidth: 1,
    borderColor: COLOR.hairline,
  },
  item: { flex: 1, alignItems: 'center', gap: 3 },
  label: { fontSize: 10 },
});
