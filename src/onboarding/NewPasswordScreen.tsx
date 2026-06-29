import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from '../components/StatusBar';
import { TextField, PrimaryButton } from './ui';
import { colors, font } from '../theme';

// Forgot password, step 2: set a new password. The requirements tick green live
// as the new password satisfies each rule.
export function NewPasswordScreen({
  onBack,
  onSubmit,
}: {
  onBack: () => void;
  onSubmit: () => void;
}) {
  const [pw, setPw] = useState('');
  const [confirm, setConfirm] = useState('');

  const rules = [
    { label: 'At least 8 characters', met: pw.length >= 8 },
    { label: 'Upper & lowercase letters', met: /[a-z]/.test(pw) && /[A-Z]/.test(pw) },
    { label: 'At least one number', met: /[0-9]/.test(pw) },
  ];

  return (
    <View style={styles.root}>
      <StatusBar tint="dark" />

      <Pressable style={styles.back} onPress={onBack} hitSlop={8}>
        <Ionicons name="arrow-back" size={20} color={colors.ink700} />
      </Pressable>

      <View style={styles.content}>
        <View style={styles.headingText}>
          <Text style={styles.title}>Create new password</Text>
          <Text style={styles.sub}>
            Your new password must be different from your previous one.
          </Text>
        </View>

        <View style={styles.fields}>
          <TextField
            label="New password"
            value={pw}
            onChangeText={setPw}
            placeholder="••••••••"
            secureTextEntry
          />
          <TextField
            label="Confirm password"
            value={confirm}
            onChangeText={setConfirm}
            placeholder="••••••••"
            secureTextEntry
          />
        </View>

        <View style={styles.requirements}>
          <Text style={styles.reqLabel}>REQUIREMENTS</Text>
          {rules.map((r) => (
            <View key={r.label} style={styles.reqRow}>
              <Ionicons
                name={r.met ? 'checkmark-circle' : 'ellipse-outline'}
                size={20}
                color={r.met ? '#17b26a' : colors.borderPrimary}
              />
              <Text style={[styles.reqText, r.met && styles.reqTextMet]}>{r.label}</Text>
            </View>
          ))}
        </View>

        <PrimaryButton label="Update Password" onPress={onSubmit} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fef9f5' },
  back: {
    margin: 16,
    width: 40,
    height: 40,
    borderRadius: 24,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { flex: 1, paddingHorizontal: 40, paddingTop: 10, gap: 22 },
  headingText: { gap: 8 },
  title: { fontFamily: font.headingBold, fontSize: 22, color: colors.ink900 },
  sub: { fontFamily: font.medium, fontSize: 16, color: colors.ink700, lineHeight: 22 },
  fields: { gap: 16 },
  requirements: {
    backgroundColor: '#f6f3ef',
    borderRadius: 12,
    padding: 16,
    gap: 10,
  },
  reqLabel: {
    fontFamily: font.headingBold,
    fontSize: 11,
    letterSpacing: 0.6,
    color: colors.textMuted2,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  reqRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  reqText: { fontFamily: font.medium, fontSize: 14, color: colors.textMuted2 },
  reqTextMet: { color: colors.ink700 },
});
