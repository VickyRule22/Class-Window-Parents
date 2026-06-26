import React, { useEffect, useRef } from 'react';
import { Text, Pressable, Animated, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, font } from '../theme';

export type TabKey = 'feed' | 'classes' | 'wishlists' | 'profile';

const TABS: { key: TabKey; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'feed', label: 'Home', icon: 'home-outline' },
  { key: 'classes', label: 'Classes', icon: 'school-outline' },
  { key: 'wishlists', label: 'Wishlists', icon: 'gift-outline' },
  { key: 'profile', label: 'Profile', icon: 'person-outline' },
];

function NavTab({
  label,
  icon,
  active,
  onPress,
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  active: boolean;
  onPress: () => void;
}) {
  // becomes-active spring (icon lifts + pops, underline grows in)
  const sel = useRef(new Animated.Value(active ? 1 : 0)).current;
  // momentary press squish
  const press = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(sel, {
      toValue: active ? 1 : 0,
      useNativeDriver: true,
      friction: 6,
      tension: 160,
    }).start();
  }, [active]);

  const lift = sel.interpolate({ inputRange: [0, 1], outputRange: [0, -3] });
  const pressScale = press.interpolate({ inputRange: [0, 1], outputRange: [1, 0.86] });
  const popScale = sel.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 1.18, 1.08] });
  const underlineScale = sel.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });
  const underlineOpacity = sel.interpolate({ inputRange: [0, 0.4, 1], outputRange: [0, 0, 1] });
  const tint = active ? colors.primary : colors.navInactive;

  return (
    <Pressable
      style={styles.tab}
      onPress={onPress}
      hitSlop={8}
      onPressIn={() =>
        Animated.spring(press, { toValue: 1, useNativeDriver: true, friction: 7, tension: 300 }).start()
      }
      onPressOut={() =>
        Animated.spring(press, { toValue: 0, useNativeDriver: true, friction: 5, tension: 200 }).start()
      }
    >
      <Animated.View
        style={[styles.iconWrap, { transform: [{ translateY: lift }, { scale: Animated.multiply(popScale, pressScale) }] }]}
      >
        <Ionicons name={icon} size={24} color={tint} />
      </Animated.View>
      <Animated.View
        style={[styles.underline, { opacity: underlineOpacity, transform: [{ scaleX: underlineScale }] }]}
      />
      <Text style={[styles.label, { color: tint }]}>{label}</Text>
    </Pressable>
  );
}

export function BottomNav({
  active,
  onChange,
}: {
  active: TabKey;
  onChange: (t: TabKey) => void;
}) {
  return (
    <Animated.View style={styles.bar}>
      {TABS.map((t) => (
        <NavTab
          key={t.key}
          label={t.label}
          icon={t.icon}
          active={t.key === active}
          onPress={() => onChange(t.key)}
        />
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 30,
    backgroundColor: colors.white,
    paddingTop: 12,
    paddingBottom: 28,
    paddingHorizontal: 20,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(216,208,200,0.6)',
    shadowColor: '#2c1a0e',
    shadowOpacity: 0.08,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: -4 },
    elevation: 12,
  },
  tab: { width: 61, alignItems: 'center' },
  iconWrap: { height: 24, justifyContent: 'center' },
  underline: {
    width: 22,
    height: 2,
    borderRadius: 2,
    marginTop: 5,
    backgroundColor: colors.primary,
  },
  label: {
    marginTop: 3,
    fontFamily: font.extrabold,
    fontSize: 10,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
});
