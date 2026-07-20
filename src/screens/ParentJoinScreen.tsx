import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { colors, font, shadowSoft } from '../theme';
import { ClassCodeEntry } from '../components/ClassCodeEntry';

// A brand-new parent's home: no classroom yet, so the feed IS the join step.
// The teacher's three-word code is the only way in. We make no claim about how
// the code reached them (no note was necessarily sent home), just where to get
// one: their child's teacher.
export function ParentJoinScreen({ onJoined }: { onJoined: () => void }) {
  const [words, setWords] = useState<string[]>(['', '', '']);
  const complete = words.every((w) => w.trim());

  return (
    <ScrollView
      style={{ backgroundColor: colors.appBg }}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.emoji}>🎒</Text>
      <Text style={styles.title}>Let's find your{'\n'}child's classroom</Text>
      <Text style={styles.sub}>
        Ask your child's teacher for the{'\n'}three-word code to their classroom.
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>THREE-WORD CODE</Text>
        <ClassCodeEntry words={words} onChange={setWords} />
        <Pressable
          disabled={!complete}
          onPress={onJoined}
          style={[styles.join, !complete && styles.joinOff]}
        >
          <Text style={styles.joinTxt}>Join classroom</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 12,
  },
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
    marginBottom: 6,
  },
  card: {
    alignSelf: 'stretch',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    gap: 14,
    ...shadowSoft,
  },
  label: {
    fontFamily: font.headingBold,
    fontSize: 11,
    letterSpacing: 0.5,
    color: colors.textMuted,
  },
  join: {
    backgroundColor: colors.brandSolid,
    borderRadius: 24,
    paddingVertical: 13,
    alignItems: 'center',
  },
  joinOff: { opacity: 0.45 },
  joinTxt: { fontFamily: font.heading, fontSize: 15, color: colors.white },
});
