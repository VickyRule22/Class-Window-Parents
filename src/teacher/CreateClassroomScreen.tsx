import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet } from 'react-native';
import { colors, font, shadowSoft } from '../theme';
import { noOutline } from '../onboarding/ui';

// First thing a teacher sees after verifying their email: name the classroom.
// One field, one button. Tappable suggestions compose the name for them
// (name + grade + subject) so the fastest path is two taps.
const SUGGESTIONS = [
  "Ms. Chen's Class",
  "Ms. Chen's 2nd Grade",
  '2nd Grade Science',
  'Room 14',
];

export function CreateClassroomScreen({ onCreate }: { onCreate: (name: string) => void }) {
  const [name, setName] = useState('');
  const ready = name.trim().length > 0;

  return (
    <ScrollView
      style={{ backgroundColor: colors.appBg }}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.hero}>
        <Text style={styles.emoji}>🏫</Text>
        <Text style={styles.title}>You're in! Let's make{'\n'}your classroom</Text>
        <Text style={styles.sub}>
          Give it a name families will recognize.{'\n'}You can always change it later.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>CLASSROOM NAME</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="e.g. Ms. Chen's 2nd Grade"
          placeholderTextColor={colors.textMuted3}
          style={[styles.input, noOutline]}
        />
        <Text style={styles.hintLabel}>Tap to use:</Text>
        <View style={styles.chips}>
          {SUGGESTIONS.map((s) => (
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
      <Text style={styles.foot}>Families join later with a code only you hand out.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingBottom: 40, gap: 18, flexGrow: 1, justifyContent: 'center' },
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
