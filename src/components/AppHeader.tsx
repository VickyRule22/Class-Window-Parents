import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Logo } from './Logo';
import { StatusBar } from './StatusBar';
import { RoleChip, Role } from './RoleSwitcher';
import { colors } from '../theme';

// Top nav: brand lockup on the left, current-view chip on the right, thin warm
// divider underneath. The role chip only renders for dual-role accounts (a
// teacher who is also a parent); single-role users never see role UI.
export function AppHeader({
  role,
  onRolePress,
  showRole = true,
}: {
  role: Role;
  onRolePress: () => void;
  showRole?: boolean;
}) {
  return (
    <View style={styles.wrap}>
      <StatusBar />
      <View style={styles.topNav}>
        <Logo />
        {showRole ? <RoleChip role={role} onPress={onRolePress} /> : <View />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { backgroundColor: colors.headerBg },
  topNav: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
});
