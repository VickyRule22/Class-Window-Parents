import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from '../components/StatusBar';
import { FeaturedIcon, TextField, PrimaryButton } from './ui';
import { colors, font } from '../theme';

// Forgot password, step 1: enter your email to get a reset link.
export function ForgotPasswordScreen({
  onBack,
  onSubmit,
  onLogIn,
}: {
  onBack: () => void;
  onSubmit: () => void;
  onLogIn: () => void;
}) {
  const [email, setEmail] = useState('');

  return (
    <View style={styles.root}>
      <StatusBar tint="dark" />

      <Pressable style={styles.back} onPress={onBack} hitSlop={8}>
        <Ionicons name="arrow-back" size={20} color={colors.ink700} />
      </Pressable>

      <View style={styles.content}>
        <View style={styles.header}>
          <FeaturedIcon name="key-outline" />
          <View style={styles.headingText}>
            <Text style={styles.title}>Forgot your password?</Text>
            <Text style={styles.sub}>
              No worries. Enter your email and we'll send you a reset link
            </Text>
          </View>
        </View>

        <TextField
          label="Email address"
          value={email}
          onChangeText={setEmail}
          placeholder="your@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <PrimaryButton label="Send Reset Link" onPress={onSubmit} />

        <Text style={styles.remember}>
          Remember it?{' '}
          <Text style={styles.link} onPress={onLogIn}>
            Log in
          </Text>
        </Text>
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
  content: { flex: 1, alignItems: 'center', paddingHorizontal: 56, paddingTop: 26, gap: 24 },
  header: { alignItems: 'center', gap: 24, width: '100%' },
  headingText: { alignItems: 'center', gap: 8 },
  title: { fontFamily: font.headingBold, fontSize: 22, color: colors.ink900, textAlign: 'center' },
  sub: {
    fontFamily: font.medium,
    fontSize: 16,
    color: colors.ink700,
    textAlign: 'center',
    lineHeight: 22,
  },
  remember: { fontFamily: font.medium, fontSize: 16, color: colors.ink700, textAlign: 'center' },
  link: { fontFamily: font.semibold, color: '#ec623c' },
});
