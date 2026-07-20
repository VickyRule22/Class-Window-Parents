import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SignOutSheet } from '../screens/profile/SignOutSheet';
import { colors, font, shadowSoft } from '../theme';

// A teacher who has signed up but whose school hasn't confirmed them yet.
// Nothing they can do in-app fixes this, so the screen's whole job is to say
// who to go to (their school administrator) and what happens next. No
// classroom-creation affordance: that only unlocks once they're verified.
// This screen sits outside the tab bar, so it carries its own sign-out: without
// it a teacher who signed up on the wrong account would be stuck here.
const STEPS: { icon: keyof typeof Ionicons.glyphMap; title: string; sub: string }[] = [
  {
    icon: 'person-add-outline',
    title: 'Ask your school administrator',
    sub: 'They add you as a teacher at your school.',
  },
  {
    icon: 'mail-outline',
    title: "We'll email you the moment you're added",
    sub: 'Usually the same day, once they get to it.',
  },
  {
    icon: 'school-outline',
    title: 'Then you name your classroom',
    sub: 'You get a join code to share with families.',
  },
];

export function AwaitingVerificationScreen({
  email = 'junie.okafor@lincoln.edu',
  onContactAdmin,
  onSignOut,
}: {
  email?: string;
  onContactAdmin?: () => void;
  onSignOut?: () => void;
}) {
  const [signOutOpen, setSignOutOpen] = useState(false);

  return (
    <View style={styles.root}>
      <ScrollView
        style={{ backgroundColor: colors.appBg }}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Text style={styles.emoji}>🪪</Text>
          <Text style={styles.title}>Your school needs{'\n'}to verify you</Text>
          <Text style={styles.sub}>
            Before you can create a classroom, your school{'\n'}has to confirm you teach there.
          </Text>
        </View>

        <View style={styles.card}>
          {STEPS.map((s, i) => (
            <View key={s.title} style={[styles.step, i < STEPS.length - 1 && styles.stepBorder]}>
              <View style={styles.stepIcon}>
                <Ionicons name={s.icon} size={17} color={colors.primaryDeep} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.stepTitle}>{s.title}</Text>
                <Text style={styles.stepSub}>{s.sub}</Text>
              </View>
            </View>
          ))}
        </View>

        <Pressable style={styles.cta} onPress={onContactAdmin}>
          <Ionicons name="mail-outline" size={17} color={colors.white} />
          <Text style={styles.ctaTxt}>Email my administrator</Text>
        </Pressable>

        <View style={styles.footRow}>
          <Text style={styles.foot}>Signed in as {email}</Text>
          <Pressable
            style={styles.signOut}
            onPress={() => setSignOutOpen(true)}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Sign out"
          >
            <Text style={styles.signOutTxt}>Not you? Sign out</Text>
          </Pressable>
        </View>
      </ScrollView>

      <SignOutSheet
        visible={signOutOpen}
        onClose={() => setSignOutOpen(false)}
        onConfirm={() => {
          setSignOutOpen(false);
          onSignOut?.();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.appBg },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 16,
  },
  hero: { alignItems: 'center', gap: 8 },
  emoji: { fontSize: 52 },
  title: {
    fontFamily: font.heading,
    fontSize: 24,
    color: colors.textDark,
    textAlign: 'center',
    lineHeight: 31,
  },
  sub: {
    fontFamily: font.regular,
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 21,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    ...shadowSoft,
  },
  step: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  stepBorder: { borderBottomWidth: 1, borderColor: colors.cardDivider, paddingBottom: 12 },
  stepIcon: {
    width: 35,
    height: 35,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.settingsIconBg,
  },
  stepTitle: { fontFamily: font.semibold, fontSize: 14.5, color: colors.textDark2 },
  stepSub: { fontFamily: font.regular, fontSize: 13, color: colors.textMuted, marginTop: 1 },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.brandSolid,
    borderRadius: 24,
    paddingVertical: 13,
  },
  ctaTxt: { fontFamily: font.heading, fontSize: 15, color: colors.white },
  footRow: { alignItems: 'center', gap: 6 },
  foot: {
    fontFamily: font.regular,
    fontSize: 12.5,
    color: colors.textMuted,
    textAlign: 'center',
  },
  signOut: { paddingVertical: 2 },
  signOutTxt: { fontFamily: font.bold, fontSize: 12.5, color: colors.primary },
});
