import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SvgXml } from 'react-native-svg';
import { Logomark } from '../components/Logo';
import { StatusBar } from '../components/StatusBar';
import { TextField, PrimaryButton } from './ui';
import { doodlesSvg } from './doodlesSvg';
import { colors, font } from '../theme';

// "Log in to your account". Same coral hero + cream card as the sign-up screen,
// reached from the "Log in instead" link. Log In drops into the app; "Sign up"
// goes back to the create-account screen.
export function LogInScreen({
  onLogIn,
  onSignUp,
}: {
  onLogIn: () => void;
  onSignUp: () => void;
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[colors.primary, '#f9a66a']}
        start={{ x: 0.08, y: 0 }}
        end={{ x: 0.85, y: 0.6 }}
        style={StyleSheet.absoluteFill}
      />
      <View pointerEvents="none" style={styles.doodles}>
        <SvgXml xml={doodlesSvg} width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />
      </View>

      <StatusBar tint="light" />

      <View style={styles.logoSection}>
        <Logomark size={52} color="#e9e2da" />
        <Text style={styles.wordmark}>Class Window</Text>
      </View>

      <View style={styles.cardOuter}>
        <View style={styles.card}>
          <ScrollView
            contentContainerStyle={styles.cardContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.heading}>
              <Text style={styles.title}>Log in to your account</Text>
              <Text style={styles.sub}>
                Don't have an account?{' '}
                <Text style={styles.link} onPress={onSignUp}>
                  Sign up
                </Text>
              </Text>
            </View>

            <View style={styles.fields}>
              <TextField
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="your@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TextField
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                secureTextEntry
              />
            </View>

            <View style={styles.actions}>
              <PrimaryButton label="Log In" onPress={onLogIn} />
              <Pressable hitSlop={8}>
                <Text style={styles.forgot}>Forgot password?</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.primary },
  doodles: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.9 },
  logoSection: { alignItems: 'center', gap: 10, paddingVertical: 30 },
  wordmark: {
    fontFamily: font.heading,
    fontSize: 34,
    color: colors.white,
    letterSpacing: -0.4,
    includeFontPadding: false,
  },
  cardOuter: { flex: 1, paddingHorizontal: 24 },
  card: {
    flex: 1,
    backgroundColor: '#fef9f5',
    borderTopLeftRadius: 48,
    borderTopRightRadius: 48,
    overflow: 'hidden',
  },
  cardContent: { paddingHorizontal: 32, paddingTop: 32, paddingBottom: 28, gap: 24 },
  heading: { gap: 8, alignItems: 'center' },
  title: {
    fontFamily: font.headingBold,
    fontSize: 22,
    color: colors.ink900,
    textAlign: 'center',
  },
  sub: { fontFamily: font.medium, fontSize: 16, color: colors.ink700, textAlign: 'center' },
  link: { fontFamily: font.semibold, color: '#ec623c' },
  fields: { gap: 16 },
  actions: { gap: 16, alignItems: 'center' },
  forgot: { fontFamily: font.semibold, fontSize: 16, color: '#ec623c', textAlign: 'center' },
});
