import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, font } from '../theme';

// Ways in, and that's it. Everyone signs up the same way, then you're either
// in the teacher app or the parent app. Once inside, the phone's own bottom
// nav gets you around, so this bar deliberately does NOT list every screen:
// it's a way to enter the prototype, not a sitemap.
//
// "Unverified" is the one exception. A teacher waiting on their school can't
// be reached from any of the others, because every one of them lands you
// already verified, so without its own pill that whole state is unreviewable.
export type Dest = 'signup' | 'teacher' | 'unverified' | 'parent';

type Item = { key: Dest; label: string; icon: keyof typeof Ionicons.glyphMap };

const ITEMS: Item[] = [
  { key: 'signup', label: 'Sign up', icon: 'sparkles-outline' },
  { key: 'teacher', label: 'Teacher', icon: 'school-outline' },
  { key: 'unverified', label: 'Unverified', icon: 'lock-closed-outline' },
  { key: 'parent', label: 'Parent', icon: 'people-outline' },
];

// Always-visible prototype control bar. Deliberately styled as dark "chrome" so
// nobody mistakes it for product UI.
export function PrototypeNav({
  dest,
  onGo,
}: {
  dest: Dest | null;
  onGo: (d: Dest) => void;
}) {
  return (
    <View style={styles.bar}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.rowContent}
      >
        <Text style={styles.tag}>PROTOTYPE</Text>

        {ITEMS.map((it) => {
          const active = dest === it.key;
          return (
            <Pressable
              key={it.key}
              onPress={() => onGo(it.key)}
              style={[styles.pill, active && styles.pillOn]}
            >
              <Ionicons name={it.icon} size={13} color={active ? colors.white : '#c9a58e'} />
              <Text style={[styles.pillTxt, active && styles.pillTxtOn]}>{it.label}</Text>
            </Pressable>
          );
        })}

        <View style={styles.divider} />

        <View style={[styles.pill, styles.pillSoon]}>
          <Ionicons name="briefcase-outline" size={13} color="#c9a58e" />
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
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 9,
    flexGrow: 1,
    justifyContent: 'center',
  },
  tag: {
    fontFamily: font.extrabold,
    fontSize: 9,
    letterSpacing: 1.2,
    color: '#a2887c',
    marginRight: 6,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 999,
    paddingHorizontal: 13,
    paddingVertical: 7,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  pillOn: { backgroundColor: colors.brandSolid },
  pillSoon: { opacity: 0.55 },
  pillTxt: { fontFamily: font.bold, fontSize: 12.5, color: '#c9a58e' },
  pillTxtOn: { color: colors.white },
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
