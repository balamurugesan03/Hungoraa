import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SIZES } from '../../constants';

export default function SplashScreen({ navigation }) {
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(scaleAnim, { toValue: 1, tension: 50, friction: 8, useNativeDriver: true }),
        Animated.timing(opacityAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      ]),
      Animated.delay(200),
      Animated.timing(slideAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(() => {
      navigation.replace('Onboarding');
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient colors={['#1B5E8F', '#0C2F4E', '#081E33']} style={styles.container} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
      <StatusBar barStyle="light-content" />
      <Animated.View style={{ transform: [{ scale: scaleAnim }], opacity: opacityAnim }}>
        <Text style={styles.emoji}>🍽️</Text>
      </Animated.View>
      <Animated.View style={{ opacity: opacityAnim, transform: [{ translateY: slideAnim }] }}>
        <Text style={styles.appName}>
          <Text style={styles.appNameGold}>Hun</Text><Text style={styles.appNameRed}>go</Text><Text style={styles.appNameGold}>ra</Text>
        </Text>
        <Text style={styles.tagline}>Your Table, Your Way</Text>
      </Animated.View>
      <Animated.View style={[styles.dotsContainer, { opacity: opacityAnim }]}>
        <View style={[styles.dot, styles.dotActive]} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  emoji: {
    fontSize: 72,
    textAlign: 'center',
    marginBottom: 8,
  },
  appName: {
    fontSize: 40,
    fontFamily: FONTS.extraBold,
    color: COLORS.white,
    textAlign: 'center',
    letterSpacing: -1,
  },
  appNameGold: { color: '#F9A91B' },
  appNameRed: { color: '#CD302B' },
  tagline: {
    fontSize: SIZES.md,
    fontFamily: FONTS.regular,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    marginTop: 8,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 48,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  dotActive: {
    backgroundColor: COLORS.white,
    width: 24,
  },
});
