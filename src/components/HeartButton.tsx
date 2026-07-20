import React, { useEffect, useRef } from 'react';
import { View, Text, Pressable, Animated, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, font } from '../theme';
import { tapHaptic, bumpHaptic } from '../lib/haptics';

// Horizontal offsets for the little hearts that float up on a like.
const PARTICLES = [-20, -10, 0, 11, 21];

/**
 * The like control. Liking is the main thing we want families doing, so it gets
 * the delight: the heart pops and fills, a few tiny hearts float away, the
 * count rolls to its next digit, and a long press sends an extra burst.
 *
 * `liked` is owned by the parent so a double-tap on the photo lights this up
 * too; the animations key off that prop changing rather than off the tap.
 */
export function HeartButton({
  liked,
  count,
  onToggle,
}: {
  liked: boolean;
  count: number;
  onToggle: (next: boolean) => void;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const particles = useRef(PARTICLES.map(() => new Animated.Value(0))).current;
  // 0 is the settled position; the effect kicks it to -1/1 and springs back
  const roll = useRef(new Animated.Value(0)).current;
  const first = useRef(true);
  const prevCount = useRef(count);

  const flyParticles = (stagger = 0) => {
    particles.forEach((p, i) => {
      p.setValue(0);
      Animated.timing(p, {
        toValue: 1,
        duration: 620 + i * 40,
        delay: stagger + i * 28,
        useNativeDriver: true,
      }).start();
    });
  };

  // pop + particles whenever the post becomes liked, however that happened
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (!liked) return;
    tapHaptic();
    Animated.sequence([
      Animated.spring(scale, { toValue: 1.3, useNativeDriver: true, friction: 3.5, tension: 180 }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 5, tension: 140 }),
    ]).start();
    flyParticles();
  }, [liked]);

  // count rolls up when it grows, down when it shrinks
  useEffect(() => {
    if (count === prevCount.current) return;
    const up = count > prevCount.current;
    prevCount.current = count;
    roll.setValue(up ? -1 : 1);
    Animated.spring(roll, { toValue: 0, useNativeDriver: true, friction: 7, tension: 150 }).start();
  }, [count]);

  // holding sends extra love: three quick waves of hearts
  const onLongPress = () => {
    bumpHaptic();
    if (!liked) onToggle(true);
    [0, 180, 360].forEach((d) => flyParticles(d));
    Animated.sequence([
      Animated.spring(scale, { toValue: 1.45, useNativeDriver: true, friction: 3, tension: 200 }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 5, tension: 140 }),
    ]).start();
  };

  return (
    <View style={styles.wrap}>
      {/* floating hearts, above the button and non-interactive */}
      <View pointerEvents="none" style={styles.particleLayer}>
        {particles.map((p, i) => (
          <Animated.View
            key={i}
            style={[
              styles.particle,
              {
                opacity: p.interpolate({ inputRange: [0, 0.15, 1], outputRange: [0, 1, 0] }),
                transform: [
                  { translateY: p.interpolate({ inputRange: [0, 1], outputRange: [0, -46] }) },
                  { translateX: PARTICLES[i] * 0.9 },
                  { scale: p.interpolate({ inputRange: [0, 0.3, 1], outputRange: [0.4, 1, 0.7] }) },
                ],
              },
            ]}
          >
            <Ionicons name="heart" size={11} color={colors.primary} />
          </Animated.View>
        ))}
      </View>

      <Pressable
        onPress={() => onToggle(!liked)}
        onLongPress={onLongPress}
        delayLongPress={280}
        style={[
          styles.btn,
          liked
            ? { backgroundColor: colors.reactionLikedBg, borderColor: colors.cardBorderPeach }
            : { backgroundColor: colors.reactionDefaultBg, borderColor: colors.reactionDefaultBorder },
        ]}
      >
        <Animated.View style={{ transform: [{ scale }] }}>
          <Ionicons
            name={liked ? 'heart' : 'heart-outline'}
            size={16}
            color={colors.primaryDeep}
          />
        </Animated.View>
        <View style={styles.countClip}>
          <Animated.View
            style={{
              transform: [
                { translateY: roll.interpolate({ inputRange: [-1, 1], outputRange: [14, -14] }) },
              ],
            }}
          >
            <Text style={styles.count}>{count}</Text>
          </Animated.View>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'relative' },
  particleLayer: {
    position: 'absolute',
    top: -6,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 5,
  },
  particle: { position: 'absolute' },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  countClip: { height: 18, overflow: 'hidden', justifyContent: 'center' },
  count: { fontFamily: font.heading, fontSize: 13, color: colors.primaryDeep },
});
