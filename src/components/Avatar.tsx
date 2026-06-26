import React from 'react';
import { Text, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, font } from '../theme';

type Props = {
  initials: string;
  gradient?: [string, string];
  solid?: string;
  size?: number;
  fontSize?: number;
  style?: ViewStyle;
};

// Gradient (or solid) rounded avatar with white initials, per the Figma post/class avatars.
export function Avatar({ initials, gradient, solid, size = 42, fontSize = 16, style }: Props) {
  const radius = size / 2;
  const tint = gradient ?? [solid ?? colors.primaryAlt, solid ?? colors.primaryAlt];
  return (
    <LinearGradient
      colors={tint}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 0 }}
      style={[{ width: size, height: size, borderRadius: radius }, styles.wrap, style]}
    >
      <Text style={[styles.txt, { fontSize }]}>{initials}</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
  txt: {
    fontFamily: font.bold,
    color: colors.white,
    letterSpacing: 0.8,
    includeFontPadding: false,
  },
});
