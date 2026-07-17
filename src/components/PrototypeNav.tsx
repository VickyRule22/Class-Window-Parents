import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TabKey } from './BottomNav';
import { colors, font } from '../theme';

export type NavLocation = 'signup' | TabKey;

// Four persona entry points, each dropping you into a specific starting state:
// the two "verified" ones land on a populated feed; the two "unverified" ones
// land on the gate/first-run (parent join code, teacher create-classroom).
export type Persona = 'parent' | 'parent-new' | 'teacher' | 'teacher-new';

const SCREENS: { key: NavLocation; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'signup', label: 'Sign up', icon: 'sparkles-outline' },
  { key: 'feed', label: 'Feed', icon: 'home-outline' },
  { key: 'classes', label: 'Classes', icon: 'school-outline' },
  { key: 'wishlists', label: 'Wishlists', icon: 'gift-outline' },
  { key: 'profile', label: 'Profile', icon: 'person-outline' },
];

const PERSONAS: { key: Persona; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'parent', label: 'Parent', icon: 'person' },
  { key: 'parent-new', label: 'Unverified parent', icon: 'person-add-outline' },
  { key: 'teacher', label: 'Teacher', icon: 'school' },
  { key: 'teacher-new', label: 'Unverified teacher', icon: 'school-outline' },
];

// Always-visible prototype control bar, ported from the design-sandbox top nav.
// Sits above every screen (onboarding included) so a reviewer is never trapped
// in a flow: jump to any screen, switch persona, or reset to sign-up at will.
// Deliberately styled as dark "chrome" so nobody mistakes it for product UI.
export function PrototypeNav({
  location,
  persona,
  onJump,
  onPersona,
}: {
  location: NavLocation;
  persona: Persona | null;
  onJump: (dest: NavLocation) => void;
  onPersona: (p: Persona) => void;
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

        {PERSONAS.map((p) => {
          const active = persona === p.key;
          return (
            <Pressable
              key={p.key}
              onPress={() => onPersona(p.key)}
              style={[styles.pill, active && styles.pillRoleOn]}
            >
              <Ionicons
                name={p.icon}
                size={12}
                color={active ? colors.textDark : '#c9a58e'}
              />
              <Text style={[styles.pillTxt, active && styles.pillTxtRoleOn]}>{p.label}</Text>
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
    // centers the pills on wide viewports; still scrolls on narrow phones
    flexGrow: 1,
    justifyContent: 'center',
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
