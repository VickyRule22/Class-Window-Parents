import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { colors, font } from '../theme';
import { noOutline } from '../onboarding/ui';

const PLACEHOLDER = 'maple-otter-sunny';

/**
 * The three-word join code as ONE field.
 *
 * Teachers hand the code out as a single string in a text or an email, so the
 * thing a parent actually does is paste it. Three separate boxes fought that:
 * you had to split the code up yourself. Here anything reasonable lands
 * correctly, because separators are normalised as you type:
 *
 *   "maple otter sunny"  ->  maple-otter-sunny
 *   "Maple, Otter Sunny" ->  maple-otter-sunny
 *   "maple-otter-sunny"  ->  unchanged
 *
 * The three bars underneath keep the "it's three words" signal that the boxes
 * used to carry, without making anyone type into three places.
 */
export function ClassCodeEntry({
  words,
  onChange,
}: {
  words: string[];
  onChange: (next: string[]) => void;
}) {
  const [raw, setRaw] = useState(words.filter(Boolean).join('-'));
  const [focused, setFocused] = useState(false);

  const handle = (text: string) => {
    const lower = text.toLowerCase();
    // they just typed a separator: keep it so the next word can start
    const trailingSep = /[^a-z]$/.test(lower);
    const parts = lower.split(/[^a-z]+/).filter(Boolean).slice(0, 3);

    let next = parts.join('-');
    if (trailingSep && parts.length < 3) next += '-';

    setRaw(next);
    onChange([parts[0] ?? '', parts[1] ?? '', parts[2] ?? '']);
  };

  const filled = raw.split('-').filter(Boolean).length;

  return (
    <View style={styles.wrap}>
      <TextInput
        value={raw}
        onChangeText={handle}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={PLACEHOLDER}
        placeholderTextColor={colors.textMuted3}
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="off"
        spellCheck={false}
        returnKeyType="done"
        style={[styles.input, noOutline, focused && styles.inputFocused]}
      />

      {/* one bar per word, filling as the code comes together */}
      <View style={styles.bars}>
        {[0, 1, 2].map((i) => (
          <View key={i} style={[styles.bar, i < filled && styles.barOn]} />
        ))}
      </View>

      <Text style={styles.hint}>
        {filled === 3 ? 'Looks good' : 'Three words, like ' + PLACEHOLDER}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 10 },
  input: {
    height: 62,
    borderWidth: 1.5,
    borderColor: colors.divider,
    borderRadius: 14,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    textAlign: 'center',
    fontFamily: font.heading,
    fontSize: 20,
    letterSpacing: 0.3,
    color: colors.textDark,
  },
  inputFocused: { borderColor: colors.cardBorderPeach },
  bars: { flexDirection: 'row', gap: 6, paddingHorizontal: 2 },
  bar: {
    flex: 1,
    height: 4,
    borderRadius: 999,
    backgroundColor: colors.divider,
  },
  barOn: { backgroundColor: colors.brandSolid },
  hint: {
    fontFamily: font.regular,
    fontSize: 12.5,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
