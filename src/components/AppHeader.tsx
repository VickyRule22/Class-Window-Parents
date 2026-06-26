import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Logo } from './Logo';
import { colors, font } from '../theme';

// iPhone-style status bar (9:41 + signal/wifi/battery) used across every screen.
function StatusBar() {
  return (
    <View style={styles.statusBar}>
      <Text style={styles.time}>9:41</Text>
      <View style={styles.statusRight}>
        <Ionicons name="cellular" size={15} color={colors.textDark} />
        <Ionicons name="wifi" size={15} color={colors.textDark} />
        <Ionicons name="battery-full" size={22} color={colors.textDark} />
      </View>
    </View>
  );
}

// Top nav: brand lockup, with a thin warm divider underneath.
export function AppHeader() {
  return (
    <View style={styles.wrap}>
      <StatusBar />
      <View style={styles.topNav}>
        <Logo />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { backgroundColor: colors.headerBg },
  statusBar: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
  },
  time: {
    fontFamily: font.semibold,
    fontSize: 15,
    color: colors.textDark,
    letterSpacing: -0.2,
  },
  statusRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  topNav: {
    height: 56,
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
});
