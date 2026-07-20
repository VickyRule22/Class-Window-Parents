import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, font } from '../theme';

// Every prototype destination, grouped by the role that sees it. Each one seeds
// a complete starting state in App, so a reviewer can land directly on any
// screen, including states you can normally only reach mid-flow.
export type Dest =
  | 'teacher-unverified'
  | 'teacher-verified'
  | 'teacher-empty'
  | 'teacher-feed'
  | 'teacher-post'
  | 'teacher-compose'
  | 'teacher-classrooms'
  | 'teacher-profile'
  | 'parent-signup'
  | 'parent-new'
  | 'parent-feed'
  | 'parent-classes'
  | 'parent-wishlists'
  | 'parent-profile';

type Item = { key: Dest; label: string; icon: keyof typeof Ionicons.glyphMap };

const TEACHER: Item[] = [
  // not yet confirmed by their school: nothing to do but contact the admin
  { key: 'teacher-unverified', label: 'Unverified', icon: 'lock-closed-outline' },
  // verified by the school, but hasn't named a classroom yet
  { key: 'teacher-verified', label: 'Verified', icon: 'checkmark-circle-outline' },
  { key: 'teacher-empty', label: 'Empty feed', icon: 'sparkles-outline' },
  { key: 'teacher-feed', label: 'Feed', icon: 'home-outline' },
  { key: 'teacher-post', label: 'New post', icon: 'camera-outline' },
  { key: 'teacher-compose', label: 'Compose', icon: 'create-outline' },
  { key: 'teacher-classrooms', label: 'Classrooms', icon: 'school-outline' },
  { key: 'teacher-profile', label: 'Profile', icon: 'person-outline' },
];

const PARENT: Item[] = [
  { key: 'parent-signup', label: 'Sign up', icon: 'sparkles-outline' },
  { key: 'parent-new', label: 'Unverified', icon: 'lock-closed-outline' },
  { key: 'parent-feed', label: 'Feed', icon: 'home-outline' },
  { key: 'parent-classes', label: 'Classes', icon: 'school-outline' },
  { key: 'parent-wishlists', label: 'Wishlists', icon: 'gift-outline' },
  { key: 'parent-profile', label: 'Profile', icon: 'person-outline' },
];

// Always-visible prototype control bar, grouped Teacher then Parent so a
// reviewer can see every screen each role has and jump straight to it.
// Deliberately styled as dark "chrome" so nobody mistakes it for product UI.
export function PrototypeNav({
  dest,
  onGo,
}: {
  dest: Dest | null;
  onGo: (d: Dest) => void;
}) {
  const pills = (items: Item[]) =>
    items.map((it) => {
      const active = dest === it.key;
      return (
        <Pressable
          key={it.key}
          onPress={() => onGo(it.key)}
          style={[styles.pill, active && styles.pillOn]}
        >
          <Ionicons name={it.icon} size={12} color={active ? colors.white : '#c9a58e'} />
          <Text style={[styles.pillTxt, active && styles.pillTxtOn]}>{it.label}</Text>
        </Pressable>
      );
    });

  return (
    <View style={styles.bar}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.rowContent}
      >
        <Text style={styles.tag}>PROTOTYPE</Text>

        <Text style={[styles.group, styles.groupTeacher]}>TEACHER</Text>
        {pills(TEACHER)}

        <View style={styles.divider} />

        <Text style={[styles.group, styles.groupParent]}>PARENT</Text>
        {pills(PARENT)}

        <View style={styles.divider} />

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
  // role section headings, colour-coded so the two groups read apart at a glance
  group: {
    fontFamily: font.extrabold,
    fontSize: 9,
    letterSpacing: 1.2,
    marginHorizontal: 2,
  },
  groupTeacher: { color: '#8fc9e8' },
  groupParent: { color: '#f7a17a' },
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
  pillSoon: { opacity: 0.55 },
  pillTxt: { fontFamily: font.bold, fontSize: 12, color: '#c9a58e' },
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
