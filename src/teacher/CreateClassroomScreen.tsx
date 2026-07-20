import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, font, shadowSoft } from '../theme';
import { noOutline } from '../onboarding/ui';
import { SignOutSheet } from '../screens/profile/SignOutSheet';

// First thing a teacher sees after verifying their email: name the classroom.
// One field, one button. The chips are SAMPLE titles to riff on, not guesses
// about who the teacher is: tap one, then edit it into your own.
const SAMPLES = [
  "Ms. Chen's 2nd Grade Science",
  "Mr. Lopez's Kindergarten",
  'Room 14',
  'The Sunflower Room',
];

export function CreateClassroomScreen({
  onCreate,
  onCancel,
  email = 'junie.okafor@lincoln.edu',
  onSignOut,
}: {
  onCreate: (name: string) => void;
  // present when a teacher who already has classrooms is adding another, or
  // when a parent walked in here from their Profile
  onCancel?: () => void;
  email?: string;
  // present when this screen is the whole app: a brand-new teacher with no tab
  // bar, no back, and otherwise no way off it if they signed up as the wrong
  // person. The same escape the awaiting-verification screen carries.
  onSignOut?: () => void;
}) {
  const [name, setName] = useState('');
  const [signOutOpen, setSignOutOpen] = useState(false);
  const ready = name.trim().length > 0;
  const addingAnother = !!onCancel;

  return (
    <View style={styles.root}>
    <ScrollView
      style={{ backgroundColor: colors.appBg }}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {addingAnother && (
        <Pressable
          onPress={onCancel}
          style={styles.backBtn}
          accessibilityRole="button"
          accessibilityLabel="Back"
        >
          <Ionicons name="chevron-back" size={20} color={colors.primaryDeep} />
        </Pressable>
      )}
      <View style={styles.hero}>
        <Text style={styles.emoji}>🏫</Text>
        <Text style={styles.title}>
          {addingAnother ? 'Add another\nclassroom' : "You're in! Let's make\nyour classroom"}
        </Text>
        <Text style={styles.sub}>
          Give it a name families will recognize.{'\n'}You can always change it later.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>CLASSROOM NAME</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Your name, grade, or subject"
          placeholderTextColor={colors.textMuted3}
          style={[styles.input, noOutline]}
        />
        <Text style={styles.hintLabel}>Sample titles, tap one and make it yours:</Text>
        <View style={styles.chips}>
          {SAMPLES.map((s) => (
            <Pressable key={s} onPress={() => setName(s)} style={styles.chip}>
              <Text style={styles.chipTxt}>{s}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <Pressable
        disabled={!ready}
        onPress={() => onCreate(name.trim())}
        style={[styles.cta, !ready && styles.ctaOff]}
      >
        <Text style={styles.ctaTxt}>Create my classroom</Text>
      </Pressable>
      <Text style={styles.foot}>
        Each classroom gets its own three-word join code. Share it with your families,
        and rotate it anytime.
      </Text>

      {onSignOut && (
        <View style={styles.footRow}>
          <Text style={styles.signedIn}>Signed in as {email}</Text>
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
      )}
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
  content: { paddingHorizontal: 20, paddingBottom: 40, gap: 18, flexGrow: 1, justifyContent: 'center' },
  footRow: { alignItems: 'center', gap: 6, marginTop: 4 },
  signedIn: {
    fontFamily: font.regular,
    fontSize: 12.5,
    color: colors.textMuted,
    textAlign: 'center',
  },
  signOut: { paddingVertical: 2 },
  signOutTxt: { fontFamily: font.bold, fontSize: 12.5, color: colors.primary },
  backBtn: {
    position: 'absolute',
    top: 10,
    left: 16,
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: colors.pillInactive,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  hero: { alignItems: 'center', gap: 10 },
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
  card: { backgroundColor: colors.white, borderRadius: 16, padding: 16, ...shadowSoft },
  label: {
    fontFamily: font.headingBold,
    fontSize: 11,
    letterSpacing: 0.5,
    color: colors.textMuted,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1.5,
    borderColor: colors.divider,
    borderRadius: 12,
    paddingHorizontal: 13,
    paddingVertical: 12,
    fontFamily: font.semibold,
    fontSize: 16,
    color: colors.textDark,
  },
  hintLabel: { fontFamily: font.semibold, fontSize: 12, color: colors.textMuted, marginTop: 12, marginBottom: 7 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  chip: {
    backgroundColor: colors.pillInactive,
    borderRadius: 999,
    paddingHorizontal: 13,
    paddingVertical: 8,
  },
  chipTxt: { fontFamily: font.bold, fontSize: 13, color: colors.textDark2 },
  cta: {
    backgroundColor: colors.brandSolid,
    borderRadius: 26,
    paddingVertical: 15,
    alignItems: 'center',
  },
  ctaOff: { opacity: 0.45 },
  ctaTxt: { fontFamily: font.heading, fontSize: 16, color: colors.white },
  foot: {
    fontFamily: font.regular,
    fontSize: 12.5,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
