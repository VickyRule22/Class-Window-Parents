import React, { useRef, useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet } from 'react-native';
import { colors, font } from '../../theme';
import { noOutline } from '../../onboarding/ui';
import { SubHeader, PrimaryButton, QuietButton } from './ui';

const WORD_HINTS = ['maple', 'otter', 'sunny'];

// Join with a teacher-issued three-word code. QA-notes rules: the join button
// stays disabled until the code is complete, there is no code-sharing prompt
// anywhere (codes come from the teacher, one per family member), and the
// no-code path asks the teacher instead of dead-ending. Joins are
// teacher-approved, so a forwarded code alone gets nobody in.
export function JoinClassroomScreen({
  onBack,
  onJoined,
  notify,
}: {
  onBack: () => void;
  onJoined: () => void;
  notify: (msg: string) => void;
}) {
  const [words, setWords] = useState<string[]>(['', '', '']);
  const inputs = useRef<(TextInput | null)[]>([]);

  const setAt = (i: number, v: string) => {
    const next = [...words];
    next[i] = v.toLowerCase().replace(/[^a-z]/g, '');
    setWords(next);
  };

  const complete = words.every((w) => w.trim());

  return (
    <View style={{ flex: 1 }}>
      <SubHeader title="Join a classroom" onBack={onBack} />
      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.intro}>
          <Text style={styles.emoji}>✉️</Text>
          <Text style={styles.title}>Enter your classroom code</Text>
          <Text style={styles.sub}>
            Your teacher gives each family a code{'\n'}made of three little words.
          </Text>
        </View>

        <View style={styles.boxes}>
          {words.map((w, i) => (
            <TextInput
              key={i}
              ref={(r) => {
                inputs.current[i] = r;
              }}
              value={w}
              onChangeText={(v) => setAt(i, v)}
              placeholder={WORD_HINTS[i]}
              placeholderTextColor={colors.textMuted3}
              autoCapitalize="none"
              onSubmitEditing={() => inputs.current[i + 1]?.focus()}
              style={[styles.box, noOutline]}
            />
          ))}
        </View>
        <Text style={styles.hint}>Your teacher approves the join, so it may take a moment.</Text>

        <PrimaryButton
          label="Join classroom"
          disabled={!complete}
          onPress={() => {
            notify('Joined Bumblebee Room 🐝');
            onJoined();
          }}
        />
        <QuietButton
          label="I don't have a code, ask my teacher"
          onPress={() => notify('Drafts an email to your teacher asking for the code')}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  body: { paddingHorizontal: 16, paddingBottom: 32, gap: 12 },
  intro: { alignItems: 'center', gap: 6, marginTop: 10, marginBottom: 6 },
  emoji: { fontSize: 40 },
  title: { fontFamily: font.heading, fontSize: 18, color: colors.textDark },
  sub: {
    fontFamily: font.regular,
    fontSize: 13.5,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  boxes: { flexDirection: 'row', gap: 8, marginTop: 6 },
  box: {
    flex: 1,
    height: 50,
    borderWidth: 1.5,
    borderColor: colors.divider,
    borderRadius: 12,
    backgroundColor: colors.white,
    textAlign: 'center',
    fontFamily: font.heading,
    fontSize: 16,
    color: colors.textDark,
  },
  hint: {
    fontFamily: font.regular,
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: 8,
  },
});
