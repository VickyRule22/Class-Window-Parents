import React, { useRef, useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, font, shadowSoft } from '../theme';
import { noOutline } from '../onboarding/ui';

const CODE_LEN = 6;

// A brand-new parent's home: no classroom yet, so the feed IS the join step.
// Type the teacher's code or scan the QR from the welcome note; either one
// drops them straight into their child's feed.
export function ParentJoinScreen({ onJoined }: { onJoined: () => void }) {
  const [code, setCode] = useState<string[]>(Array(CODE_LEN).fill(''));
  const inputs = useRef<(TextInput | null)[]>([]);

  const setAt = (i: number, v: string) => {
    const ch = v.slice(-1).toUpperCase();
    const next = [...code];
    next[i] = ch;
    setCode(next);
    if (ch && i < CODE_LEN - 1) inputs.current[i + 1]?.focus();
  };

  const complete = code.every((c) => c.trim());

  return (
    <ScrollView
      style={{ backgroundColor: colors.appBg }}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.emoji}>🎒</Text>
      <Text style={styles.title}>Let's find your{'\n'}child's classroom</Text>
      <Text style={styles.sub}>
        Your teacher sent home a welcome note with{'\n'}a code and a QR square. Either works!
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>CLASSROOM CODE</Text>
        <View style={styles.boxes}>
          {code.map((c, i) => (
            <TextInput
              key={i}
              ref={(r) => {
                inputs.current[i] = r;
              }}
              value={c}
              onChangeText={(v) => setAt(i, v)}
              maxLength={1}
              autoCapitalize="characters"
              style={[styles.box, noOutline]}
            />
          ))}
        </View>
        <Pressable
          disabled={!complete}
          onPress={onJoined}
          style={[styles.join, !complete && styles.joinOff]}
        >
          <Text style={styles.joinTxt}>Join classroom</Text>
        </Pressable>
      </View>

      <View style={styles.orRow}>
        <View style={styles.orLine} />
        <Text style={styles.orTxt}>or</Text>
        <View style={styles.orLine} />
      </View>

      <Pressable style={styles.scan} onPress={onJoined}>
        <Ionicons name="qr-code-outline" size={20} color={colors.primaryDeep} />
        <Text style={styles.scanTxt}>Scan the QR code</Text>
      </Pressable>
      <Text style={styles.foot}>No note yet? Ask your child's teacher for the code.</Text>
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
  boxes: { flexDirection: 'row', gap: 8, justifyContent: 'center' },
  box: {
    width: 44,
    height: 54,
    borderWidth: 1.5,
    borderColor: colors.divider,
    borderRadius: 12,
    backgroundColor: colors.white,
    textAlign: 'center',
    fontFamily: font.heading,
    fontSize: 20,
    color: colors.textDark,
  },
  join: {
    backgroundColor: colors.brandSolid,
    borderRadius: 24,
    paddingVertical: 13,
    alignItems: 'center',
  },
  joinOff: { opacity: 0.45 },
  joinTxt: { fontFamily: font.heading, fontSize: 15, color: colors.white },

  orRow: { flexDirection: 'row', alignItems: 'center', gap: 10, alignSelf: 'stretch' },
  orLine: { flex: 1, height: 1, backgroundColor: colors.divider },
  orTxt: { fontFamily: font.bold, fontSize: 12, color: colors.textMuted },

  scan: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    backgroundColor: colors.settingsIconBg,
    borderRadius: 24,
    paddingVertical: 14,
  },
  scanTxt: { fontFamily: font.heading, fontSize: 15, color: colors.primaryDeep },
  foot: { fontFamily: font.regular, fontSize: 12.5, color: colors.textMuted },
});
