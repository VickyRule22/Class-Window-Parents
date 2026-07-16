import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TabKey } from './BottomNav';
import { Role } from './RoleSwitcher';
import { colors, font } from '../theme';

export type NavLocation = 'signup' | TabKey;

const SCREENS: { key: NavLocation; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'signup', label: 'Sign up', icon: 'sparkles-outline' },
  { key: 'feed', label: 'Feed', icon: 'home-outline' },
  { key: 'classes', label: 'Classes', icon: 'school-outline' },
  { key: 'wishlists', label: 'Wishlists', icon: 'gift-outline' },
  { key: 'profile', label: 'Profile', icon: 'person-outline' },
];

// Always-visible prototype control bar, ported from the design-sandbox top nav.
// Sits above every screen (onboarding included) so a reviewer is never trapped
// in a flow: jump to any screen, switch persona, or reset to sign-up at will.
// Deliberately styled as dark "chrome" so nobody mistakes it for product UI.
export function PrototypeNav({
  location,
  role,
  onJump,
  onRole,
}: {
  location: NavLocation;
  role: Role;
  onJump: (dest: NavLocation) => void;
  onRole: (r: Role) => void;
}) {
  return (
    <View style={styles.bar}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.rowContent}
      >
        <Text style={styles.tag}>PROTOTYPE</Text>

        {SCREENS.map((s) => {
          const active = location === s.key;
          return (
            <Pressable
              key={s.key}
              onPress={() => onJump(s.key)}
              style={[styles.pill, active && styles.pillOn]}
            >
              <Ionicons
                name={s.icon}
                size={12}
                color={active ? colors.white : '#c9a58e'}
              />
              <Text style={[styles.pillTxt, active && styles.pillTxtOn]}>{s.label}</Text>
            </Pressable>
          );
        })}

        <View style={styles.divider} />

        {(['parent', 'teacher'] as Role[]).map((r) => {
          const active = role === r;
          return (
            <Pressable
              key={r}
              onPress={() => onRole(r)}
              style={[styles.pill, active && styles.pillRoleOn]}
            >
              <Ionicons
                name={r === 'parent' ? 'person' : 'school'}
                size={12}
                color={active ? colors.textDark : '#c9a58e'}
              />
              <Text style={[styles.pillTxt, active && styles.pillTxtRoleOn]}>
                {r === 'parent' ? 'Parent' : 'Teacher'}
              </Text>
            </Pressable>
          );
        })}

        <View style={[styles.pill, styles.pillSoon]}>
          <Ionicons name="briefcase-outline" size={12} color="#c9a58e" />
          <Text style={styles.pillTxt}>Admin</Text>
          <View style={styles.soonPill}>
            <Text style={styles.soonTxt}>SOON</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: colors.textDark,
    zIndex: 40,
  },
  rowContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  tag: {
    fontFamily: font.extrabold,
    fontSize: 9,
    letterSpacing: 1.2,
    color: '#a2887c',
    marginRight: 4,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 6,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  pillOn: { backgroundColor: colors.brandSolid },
  pillRoleOn: { backgroundColor: colors.pillInactive },
  pillSoon: { opacity: 0.55 },
  pillTxt: { fontFamily: font.bold, fontSize: 12, color: '#c9a58e' },
  pillTxtOn: { color: colors.white },
  pillTxtRoleOn: { color: colors.textDark },
  divider: {
    width: 1,
    height: 18,
    backgroundColor: 'rgba(255,255,255,0.18)',
    marginHorizontal: 4,
  },
  soonPill: {
    backgroundColor: '#f5b942',
    borderRadius: 999,
    paddingHorizontal: 6,
    paddingVertical: 1.5,
  },
  soonTxt: { fontFamily: font.extrabold, fontSize: 8, letterSpacing: 0.6, color: colors.textDark },
});
