import React, { useEffect, useRef } from 'react';
import { Pressable, Animated, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import { tapHaptic } from '../lib/haptics';

/**
 * Sharing a photo is the one thing we want teachers doing, so it gets a
 * circular button lifted out of the tab bar rather than a row in it.
 *
 * Press dips it 5% and springs back; the "+" rotates into an "x" while the
 * picker is open. With no posts yet it pulses once on mount to invite the
 * first tap.
 */
export function PostFab({
  onPress,
  open = false,
  pulse = false,
}: {
  onPress: () => void;
  // picker is showing: turn the + into an x
  open?: boolean;
  // empty feed: nudge the very first post
  pulse?: boolean;
}) {
  const press = useRef(new Animated.Value(0)).current;
  const spin = useRef(new Animated.Value(0)).current;
  const invite = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(spin, {
      toValue: open ? 1 : 0,
      useNativeDriver: true,
      friction: 6,
      tension: 140,
    }).start();
  }, [open]);

  useEffect(() => {
    if (!pulse) return;
    // one gentle breath, a beat after the screen settles
    Animated.sequence([
      Animated.delay(650),
      Animated.spring(invite, { toValue: 1, useNativeDriver: true, friction: 4, tension: 90 }),
      Animated.spring(invite, { toValue: 0, useNativeDriver: true, friction: 5, tension: 120 }),
    ]).start();
  }, [pulse]);

  const scale = Animated.add(
    Animated.multiply(press, -0.05),
    Animated.add(1, Animated.multiply(invite, 0.12)),
  );

  return (
    <Animated.View
      style={[
        styles.wrap,
        { transform: [{ scale }] },
      ]}
    >
      <Pressable
        onPressIn={() => Animated.spring(press, { toValue: 1, useNativeDriver: true, friction: 6, tension: 300 }).start()}
        onPressOut={() => Animated.spring(press, { toValue: 0, useNativeDriver: true, friction: 4, tension: 200 }).start()}
        onPress={() => {
          tapHaptic();
          onPress();
        }}
        style={styles.btn}
        accessibilityRole="button"
        accessibilityLabel={open ? 'Close photo options' : 'Add a photo'}
      >
        <Animated.View
          style={{
            transform: [
              {
                rotate: spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '135deg'] }),
              },
            ],
          }}
        >
          <Ionicons name="add" size={32} color={colors.white} />
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    zIndex: 20,
    borderRadius: 999,
    // soft lift so it reads as floating above the bar
    shadowColor: '#c0563a',
    shadowOpacity: 0.4,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  btn: {
    width: 56,
    height: 56,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.brandSolid,
    borderWidth: 3,
    borderColor: colors.white,
  },
});
