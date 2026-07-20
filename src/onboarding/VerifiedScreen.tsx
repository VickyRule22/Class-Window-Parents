import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from '../components/StatusBar';
import { FeaturedIcon, PrimaryButton } from './ui';
import { colors, font } from '../theme';

// Getting in is the same for everyone, so this last step is where the two paths
// get explained instead of being split into separate sign-ups: a parent needs a
// code from their teacher, a teacher needs their school to add them. We never
// ask which one you are, because the answer only changes who you go and ask.
const PATHS: { icon: keyof typeof Ionicons.glyphMap; who: string; what: string }[] = [
  {
    icon: 'people-outline',
    who: "If you're a parent",
    what: "Ask your child's teacher for the classroom code.",
  },
  {
    icon: 'school-outline',
    who: "If you're a teacher",
    what: 'Ask your school administrator to add you.',
  },
];

// Step 3: success. Greets them by first name, says where to go next, and hands
// off to the app.
export function VerifiedScreen({
  firstName,
  onContinue,
}: {
  firstName: string;
  onContinue: () => void;
}) {
  return (
    <View style={styles.root}>
      <StatusBar tint="dark" />
      <View style={styles.content}>
        <View style={styles.header}>
          <FeaturedIcon name="checkmark" />
          <View style={styles.headingText}>
            <Text style={styles.title}>You're all set!</Text>
            <Text style={styles.sub}>
              Welcome to Class Window, {firstName}.{'\n'}Here's how you get into a classroom.
            </Text>
          </View>
        </View>

        <View style={styles.paths}>
          {PATHS.map((p, i) => (
            <View key={p.who} style={[styles.path, i < PATHS.length - 1 && styles.pathBorder]}>
              <View style={styles.pathIcon}>
                <Ionicons name={p.icon} size={17} color={colors.primaryDeep} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.pathWho}>{p.who}</Text>
                <Text style={styles.pathWhat}>{p.what}</Text>
              </View>
            </View>
          ))}
        </View>

        <PrimaryButton label="Continue to Class Window" onPress={onContinue} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fef9f5' },
  content: { flex: 1, alignItems: 'center', paddingHorizontal: 32, paddingTop: 88, gap: 22 },
  header: { alignItems: 'center', gap: 20, width: '100%' },
  headingText: { alignItems: 'center', gap: 8 },
  title: { fontFamily: font.headingBold, fontSize: 22, color: colors.ink900, textAlign: 'center' },
  sub: { fontFamily: font.medium, fontSize: 16, color: colors.ink700, textAlign: 'center', lineHeight: 22 },
  paths: {
    alignSelf: 'stretch',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 14,
    gap: 12,
  },
  path: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  pathBorder: { borderBottomWidth: 1, borderColor: colors.cardDivider, paddingBottom: 12 },
  pathIcon: {
    width: 34,
    height: 34,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.settingsIconBg,
  },
  pathWho: { fontFamily: font.semibold, fontSize: 14.5, color: colors.textDark2 },
  pathWhat: { fontFamily: font.regular, fontSize: 13, color: colors.textMuted, marginTop: 1 },
});
