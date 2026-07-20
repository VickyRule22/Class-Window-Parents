import React, { useRef } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { colors, font } from '../theme';
import { noOutline } from '../onboarding/ui';

const WORD_HINTS = ['maple', 'otter', 'sunny'];

// The three-word join code, one word per row. Side-by-side boxes clipped the
// words on a phone, so each word gets a full-width field with its position
// numbered. Typing a space or hyphen jumps to the next word, and pasting the
// whole code at once ("maple-otter-sunny") drops the words into place.
export function ClassCodeEntry({
  words,
  onChange,
}: {
  words: string[];
  onChange: (next: string[]) => void;
}) {
  const inputs = useRef<(TextInput | null)[]>([]);

  const setAt = (i: number, raw: string) => {
    const parts = raw
      .toLowerCase()
      .split(/[^a-z]+/)
      .filter(Boolean);
    const next = [...words];

    // more than one word arrived at once: spread it across the rows from here
    if (parts.length > 1) {
      parts.slice(0, next.length - i).forEach((p, n) => {
        next[i + n] = p;
      });
      onChange(next);
      inputs.current[Math.min(i + parts.length - 1, next.length - 1)]?.focus();
      return;
    }

    next[i] = parts[0] ?? '';
    onChange(next);
    // a trailing separator means "done with this word"
    if (next[i] && /[^a-z]$/.test(raw)) inputs.current[i + 1]?.focus();
  };

  return (
    <View style={styles.rows}>
      {words.map((w, i) => (
        <View key={i} style={[styles.row, !!w && styles.rowFilled]}>
          <View style={[styles.num, !!w && styles.numFilled]}>
            <Text style={[styles.numTxt, !!w && styles.numTxtFilled]}>{i + 1}</Text>
          </View>
          <TextInput
            ref={(r) => {
              inputs.current[i] = r;
            }}
            value={w}
            onChangeText={(v) => setAt(i, v)}
            placeholder={WORD_HINTS[i]}
            placeholderTextColor={colors.textMuted3}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType={i === words.length - 1 ? 'done' : 'next'}
            onSubmitEditing={() => inputs.current[i + 1]?.focus()}
            style={[styles.input, noOutline]}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  rows: { gap: 10 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    height: 54,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    borderColor: colors.divider,
    borderRadius: 14,
    backgroundColor: colors.white,
  },
  rowFilled: { borderColor: colors.cardBorderPeach },
  num: {
    width: 24,
    height: 24,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.pillInactive,
  },
  numFilled: { backgroundColor: colors.brandSolid },
  numTxt: { fontFamily: font.extrabold, fontSize: 11, color: colors.textMuted },
  numTxtFilled: { color: colors.white },
  input: {
    flex: 1,
    fontFamily: font.heading,
    fontSize: 17,
    color: colors.textDark,
  },
});
