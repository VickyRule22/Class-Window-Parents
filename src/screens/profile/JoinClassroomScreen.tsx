import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { colors, font } from '../../theme';
import { ClassCodeEntry } from '../../components/ClassCodeEntry';
import { SubHeader, PrimaryButton, QuietButton } from './ui';

// Join with a teacher-issued three-word code. Shares ClassCodeEntry with the
// brand-new-parent screen so both follow the same rules: the join button stays
// disabled until the code is complete, there is no code-sharing prompt anywhere
// (codes come from the teacher), and the no-code path asks the teacher instead
// of dead-ending. The code alone gets a family in; teachers rotate it if one
// gets passed around.
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
  const complete = words.every((w) => w.trim());

  return (
    <View style={{ flex: 1 }}>
      <SubHeader title="Join a classroom" onBack={onBack} />
      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.intro}>
          <Text style={styles.emoji}>✉️</Text>
          <Text style={styles.title}>Enter your classroom code</Text>
          <Text style={styles.sub}>
            Ask your child's teacher for the{'\n'}three-word code to their classroom.
          </Text>
        </View>

        <ClassCodeEntry words={words} onChange={setWords} />

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
});
