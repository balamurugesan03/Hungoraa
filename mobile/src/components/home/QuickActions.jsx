import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import PhotoImage from '../ui/PhotoImage';
import { SPACING, RADII, FONT } from '../../theme';

const U = (id) => `https://images.unsplash.com/${id}?w=600&q=70&auto=format&fit=crop`;

const ACTIONS = [
  {
    id: 'book',
    img: 'photo-1517248135467-4c7edcad34c4',
    label: 'Book a Table',
    hint: 'Reserve ahead',
    tint: ['rgba(12,47,78,0)', 'rgba(9,32,54,0.55)', 'rgba(9,32,54,0.94)'],
    accent: '#4FA0DE',
  },
  {
    id: 'dinein',
    img: 'photo-1592861956120-e524fc739696',
    label: 'Dine In',
    hint: 'Walk in & pay',
    tint: ['rgba(60,32,8,0)', 'rgba(60,32,8,0.5)', 'rgba(46,26,8,0.94)'],
    accent: '#F3BB55',
  },
];

/**
 * The two primary diner actions as image cards that lift off the navy Home
 * ground — photo + colour-tinted scrim, a top accent bar, press-scale, and a
 * staggered ease-in.
 */
export default function QuickActions({ onPress }) {
  return (
    <View style={styles.row}>
      {ACTIONS.map((a, i) => (
        <Animated.View
          key={a.id}
          entering={FadeInDown.duration(500).delay(60 + i * 90)}
          style={styles.cell}
        >
          <Pressable
            style={({ pressed }) => [styles.card, pressed && styles.pressed]}
            onPress={() => onPress?.(a.id)}
            android_ripple={{ color: 'rgba(255,255,255,0.12)' }}
          >
            <PhotoImage uri={U(a.img)} style={styles.photo} radius={RADII.lg} fallbackIcon="restaurant">
              <LinearGradient colors={a.tint} style={StyleSheet.absoluteFill} pointerEvents="none" />
              <View style={[styles.accent, { backgroundColor: a.accent }]} />
              <View style={styles.content}>
                <Text style={styles.label}>{a.label}</Text>
                <View style={styles.hintRow}>
                  <Text style={styles.hint}>{a.hint}</Text>
                  <Ionicons name="arrow-forward" size={13} color="rgba(255,255,255,0.9)" />
                </View>
              </View>
            </PhotoImage>
          </Pressable>
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  cell: {
    flex: 1,
    borderRadius: RADII.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 18,
    elevation: 9,
  },
  card: {
    borderRadius: RADII.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
  },
  pressed: {
    transform: [{ scale: 0.965 }],
    opacity: 0.94,
  },
  photo: {
    height: 138,
    justifyContent: 'flex-end',
  },
  accent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  content: {
    padding: SPACING.sm + 2,
  },
  label: {
    fontFamily: FONT.semiBold,
    fontSize: 15,
    color: '#FFFFFF',
  },
  hintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 3,
  },
  hint: {
    fontFamily: FONT.regular,
    fontSize: 11,
    color: 'rgba(255,255,255,0.82)',
  },
});
