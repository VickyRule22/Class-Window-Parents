import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, font } from '../theme';

export type TabKey = 'feed' | 'classes' | 'wishlists' | 'profile';

const TABS: { key: TabKey; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'feed', label: 'Home', icon: 'home-outline' },
  { key: 'classes', label: 'Classes', icon: 'school-outline' },
  { key: 'wishlists', label: 'Wishlists', icon: 'gift-outline' },
  { key: 'profile', label: 'Profile', icon: 'person-outline' },
];

export function BottomNav({
  active,
  onChange,
}: {
  active: TabKey;
  onChange: (t: TabKey) => void;
}) {
  return (
    <View style={styles.bar}>
      {TABS.map((t) => {
        const isActive = t.key === active;
        const tint = isActive ? colors.primary : colors.navInactive;
        return (
          <Pressable
            key={t.key}
            style={styles.tab}
            onPress={() => onChange(t.key)}
            hitSlop={8}
          >
            <View style={[styles.iconWrap, isActive && styles.iconWrapActive]}>
              <Ionicons name={t.icon} size={24} color={tint} />
            </View>
            <Text style={[styles.label, { color: tint }]}>{t.label}</Text>
          </Pressable>
        );
      })}
    </View>
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
  tab: { width: 61, alignItems: 'center', gap: 4 },
  iconWrap: { paddingBottom: 4 },
  iconWrapActive: {
    borderBottomWidth: 1.4,
    borderBottomColor: colors.primary,
  },
  label: {
    fontFamily: font.extrabold,
    fontSize: 10,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
});
