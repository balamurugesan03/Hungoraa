import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated, Platform, StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, SPACING, BORDER_RADIUS, SHADOW } from '../../constants';

export default function BookingSuccessScreen({ navigation, route }) {
  const { bookingCode, restaurantName, date, time, guests } = route.params;

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 1, tension: 60, friction: 7, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={['#1B5E8F', '#0C2F4E']} style={styles.bg}>

        <Animated.View style={[styles.successCircle, { transform: [{ scale: scaleAnim }] }]}>
          <LinearGradient colors={[COLORS.secondary, '#40916c']} style={styles.successCircleGrad}>
            <Ionicons name="checkmark" size={52} color={COLORS.white} />
          </LinearGradient>
        </Animated.View>

        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <Text style={styles.title}>Booking Confirmed! 🎉</Text>
          <Text style={styles.subtitle}>Your table has been reserved successfully</Text>

          <View style={styles.bookingCard}>
            <View style={styles.bookingCodeRow}>
              <Text style={styles.bookingCodeLabel}>Booking ID</Text>
              <Text style={styles.bookingCode}>#{bookingCode || 'DS2024001'}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailsGrid}>
              <BookingDetail icon="restaurant" label="Restaurant" value={restaurantName} />
              <BookingDetail icon="calendar" label="Date" value={date} />
              <BookingDetail icon="time" label="Time" value={time} />
              <BookingDetail icon="people" label="Guests" value={`${guests} people`} />
            </View>
          </View>

          <View style={styles.infoBox}>
            <Ionicons name="information-circle-outline" size={16} color={COLORS.info} />
            <Text style={styles.infoText}>
              A confirmation has been sent to your email and phone. Show your Booking ID at the restaurant.
            </Text>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.viewBookingBtn}
              onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Customer' }] })}
            >
              <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.viewBookingGrad}>
                <Text style={styles.viewBookingText}>View My Bookings</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.homeBtn}
              onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Customer' }] })}
            >
              <Text style={styles.homeBtnText}>Back to Home</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

      </LinearGradient>
    </View>
  );
}

function BookingDetail({ icon, label, value }) {
  return (
    <View style={detailStyles.row}>
      <View style={detailStyles.iconWrap}>
        <Ionicons name={`${icon}-outline`} size={14} color={COLORS.primary} />
      </View>
      <Text style={detailStyles.label}>{label}</Text>
      <Text style={detailStyles.value}>{value}</Text>
    </View>
  );
}

const detailStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, paddingVertical: 8 },
  iconWrap: { width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.primaryBg, alignItems: 'center', justifyContent: 'center' },
  label: { flex: 1, fontSize: SIZES.sm, color: COLORS.gray, fontFamily: FONTS.regular },
  value: { fontSize: SIZES.sm, fontFamily: FONTS.bold, color: COLORS.dark, maxWidth: '55%', textAlign: 'right' },
});

const styles = StyleSheet.create({
  container: { flex: 1 },
  bg: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: SPACING.xl },
  successCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: SPACING.lg,
    ...SHADOW.lg,
  },
  successCircleGrad: { flex: 1, borderRadius: 50, alignItems: 'center', justifyContent: 'center' },
  content: { alignItems: 'center', width: '100%' },
  title: { fontSize: SIZES.h2, fontFamily: FONTS.bold, color: COLORS.white, textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: SIZES.base, color: 'rgba(255,255,255,0.7)', textAlign: 'center', fontFamily: FONTS.regular, marginBottom: SPACING.xl },
  bookingCard: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.xl,
    width: '100%',
    padding: SPACING.lg,
    ...SHADOW.lg,
    marginBottom: SPACING.md,
  },
  bookingCodeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  bookingCodeLabel: { fontSize: SIZES.sm, color: COLORS.gray, fontFamily: FONTS.regular },
  bookingCode: { fontSize: SIZES.lg, fontFamily: FONTS.bold, color: COLORS.primary },
  divider: { height: 1, backgroundColor: COLORS.border, marginBottom: SPACING.sm },
  detailsGrid: {},
  infoBox: {
    flexDirection: 'row',
    gap: SPACING.sm,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    width: '100%',
    alignItems: 'flex-start',
  },
  infoText: { flex: 1, fontSize: SIZES.xs, color: 'rgba(255,255,255,0.75)', fontFamily: FONTS.regular, lineHeight: 18 },
  actions: { width: '100%', gap: SPACING.sm },
  viewBookingBtn: { borderRadius: BORDER_RADIUS.md, overflow: 'hidden' },
  viewBookingGrad: { paddingVertical: 16, alignItems: 'center' },
  viewBookingText: { fontSize: SIZES.base, fontFamily: FONTS.bold, color: COLORS.white },
  homeBtn: {
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.4)',
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: 14,
    alignItems: 'center',
  },
  homeBtnText: { fontSize: SIZES.base, fontFamily: FONTS.medium, color: 'rgba(255,255,255,0.8)' },
});
