import { StyleSheet, Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { FONT } from '../theme';

const GOLD = '#F9A91B';
const RED = '#CD302B';

/**
 * Centred "Hungora" masthead — serif wordmark in the logo's two-tone palette
 * ("go" red, the rest gold), each half with its own soft glow, flanked by
 * fading gold hairlines. Eases in once on mount.
 */
export default function Brandmark({ style }) {
  return (
    <Animated.View
      entering={FadeInDown.duration(620).springify().damping(16)}
      style={[styles.row, style]}
    >
      <LinearGradient
        colors={['transparent', 'rgba(249,169,27,0.6)']}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.rule}
      />

      <Text style={styles.word} accessibilityRole="header" accessibilityLabel="Hungora">
        <Text style={styles.gold}>Hun</Text>
        <Text style={styles.red}>go</Text>
        <Text style={styles.gold}>ra</Text>
      </Text>

      <LinearGradient
        colors={['rgba(249,169,27,0.6)', 'transparent']}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.rule}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingTop: 6,
    paddingBottom: 12,
  },
  rule: {
    height: 1.5,
    width: 30,
    borderRadius: 1,
  },
  word: {
    fontFamily: FONT.displayBold,
    fontSize: 25,
    letterSpacing: 0.4,
  },
  gold: {
    color: GOLD,
    textShadowColor: 'rgba(249,169,27,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 12,
  },
  red: {
    color: RED,
    textShadowColor: 'rgba(205,48,43,0.42)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 11,
  },
});
