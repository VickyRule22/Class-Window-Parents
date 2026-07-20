import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Animated,
  StyleSheet,
  ViewStyle,
  KeyboardTypeOptions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, font, shadowSoft } from '../../theme';
import { noOutline } from '../../onboarding/ui';

// Shared building blocks for the Profile sub-screens. Same card/row/toggle
// language as the rest of the app, with the QA-notes rules baked in:
// green active toggles, primary buttons that stay disabled until the form
// is complete, and plain-spoken labels.

// onBack is optional so the same header serves a pushed sub-screen (with a back
// chevron) and a top-level tab (without one, since there's nowhere to go back to).
export function SubHeader({ title, onBack }: { title: string; onBack?: () => void }) {
  return (
    <View style={styles.subHead}>
      {onBack && (
        <Pressable
          hitSlop={8}
          onPress={onBack}
          style={styles.backBtn}
          accessibilityRole="button"
          accessibilityLabel="Back"
        >
          <Ionicons name="chevron-back" size={20} color={colors.primaryDeep} />
        </Pressable>
      )}
      <Text style={styles.subTitle}>{title}</Text>
    </View>
  );
}

export function SectionLabel({ children }: { children: string }) {
  return <Text style={styles.sectionLabel}>{children}</Text>;
}

export function Card({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Row({
  icon,
  title,
  sub,
  onPress,
  right,
  last,
  danger,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  sub?: string;
  onPress?: () => void;
  right?: React.ReactNode;
  last?: boolean;
  danger?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={[styles.row, !last && styles.rowBorder]}
    >
      <View style={[styles.rowIcon, danger && styles.rowIconDanger]}>
        <Ionicons
          name={icon}
          size={17}
          color={danger ? '#d64545' : colors.primaryDeep}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.rowTitle, danger && { color: '#d64545' }]}>{title}</Text>
        {!!sub && <Text style={styles.rowSub}>{sub}</Text>}
      </View>
      {right ??
        (onPress ? (
          <Ionicons name="chevron-forward" size={17} color={colors.textMuted3} />
        ) : null)}
    </Pressable>
  );
}

// Green when ON, per Tori's QA note: orange reads as a warning state.
export function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;
  useEffect(() => {
    Animated.spring(anim, {
      toValue: value ? 1 : 0,
      useNativeDriver: false,
      friction: 8,
      tension: 90,
    }).start();
  }, [value]);
  const bg = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.divider, colors.toggleOn],
  });
  const shift = anim.interpolate({ inputRange: [0, 1], outputRange: [2, 19] });
  return (
    <Pressable onPress={() => onChange(!value)} hitSlop={6}>
      <Animated.View style={[styles.toggle, { backgroundColor: bg }]}>
        <Animated.View style={[styles.knob, { transform: [{ translateX: shift }] }]} />
      </Animated.View>
    </Pressable>
  );
}

export function PrimaryButton({
  label,
  onPress,
  disabled,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[styles.primaryBtn, disabled && styles.primaryBtnOff]}
    >
      <Text style={styles.primaryTxt}>{label}</Text>
    </Pressable>
  );
}

export function QuietButton({
  label,
  onPress,
  danger,
}: {
  label: string;
  onPress: () => void;
  danger?: boolean;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.quietBtn, danger && styles.quietBtnDanger]}>
      <Text style={[styles.quietTxt, danger && { color: '#d64545' }]}>{label}</Text>
    </Pressable>
  );
}

export function Field({
  label,
  value,
  onChangeText,
  placeholder,
  hint,
  secure,
  keyboardType,
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  hint?: string;
  secure?: boolean;
  keyboardType?: KeyboardTypeOptions;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted3}
        secureTextEntry={secure}
        keyboardType={keyboardType}
        autoCapitalize="none"
        style={[styles.input, noOutline]}
      />
      {!!hint && <Text style={styles.hint}>{hint}</Text>}
    </View>
  );
}

export function PillNote({ icon, children }: { icon: string; children: string }) {
  return (
    <View style={styles.pillNote}>
      <Text style={{ fontSize: 14 }}>{icon}</Text>
      <Text style={styles.pillNoteTxt}>{children}</Text>
    </View>
  );
}

// Small bottom toast so every action gives feedback (QA note: no silent taps).
export function Toast({ message, visible }: { message: string; visible: boolean }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(anim, {
      toValue: visible ? 1 : 0,
      useNativeDriver: true,
      friction: 9,
      tension: 80,
    }).start();
  }, [visible]);
  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [24, 0] });
  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.toast, { opacity: anim, transform: [{ translateY }] }]}
    >
      <Text style={styles.toastTxt}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  subHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  backBtn: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: colors.pillInactive,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subTitle: { fontFamily: font.heading, fontSize: 19, color: colors.textDark, flex: 1 },

  sectionLabel: {
    fontFamily: font.headingBold,
    fontSize: 11,
    letterSpacing: 0.5,
    color: colors.sectionLabel,
    marginBottom: 10,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 6,
    ...shadowSoft,
  },

  row: { flexDirection: 'row', alignItems: 'center', gap: 11, paddingVertical: 11 },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.cardDivider,
  },
  rowIcon: {
    width: 35,
    height: 35,
    borderRadius: 9,
    backgroundColor: colors.settingsIconBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowIconDanger: { backgroundColor: '#fbe3e3' },
  rowTitle: { fontFamily: font.semibold, fontSize: 15, color: colors.textDark2 },
  rowSub: { fontFamily: font.regular, fontSize: 13, color: colors.textMuted, marginTop: 1 },

  toggle: { width: 44, height: 26, borderRadius: 13, justifyContent: 'center' },
  knob: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.white,
    shadowColor: '#2c1a0e',
    shadowOpacity: 0.18,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },

  primaryBtn: {
    backgroundColor: colors.brandSolid,
    borderRadius: 24,
    paddingVertical: 13,
    alignItems: 'center',
  },
  primaryBtnOff: { opacity: 0.45 },
  primaryTxt: { fontFamily: font.bold, fontSize: 15, color: colors.white },
  quietBtn: {
    backgroundColor: colors.pillInactive,
    borderRadius: 24,
    paddingVertical: 12,
    alignItems: 'center',
  },
  quietBtnDanger: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#f3d2d2',
  },
  quietTxt: { fontFamily: font.bold, fontSize: 14, color: colors.textDark2 },

  field: { marginBottom: 14 },
  fieldLabel: {
    fontFamily: font.headingBold,
    fontSize: 11,
    letterSpacing: 0.5,
    color: colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: 6,
    marginLeft: 2,
  },
  input: {
    borderWidth: 1.5,
    borderColor: colors.divider,
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 13,
    paddingVertical: 11,
    fontFamily: font.semibold,
    fontSize: 15,
    color: colors.textDark,
  },
  hint: { fontFamily: font.regular, fontSize: 12, color: colors.textMuted, marginTop: 5, marginLeft: 2 },

  pillNote: {
    flexDirection: 'row',
    gap: 9,
    alignItems: 'flex-start',
    backgroundColor: colors.settingsIconBg,
    borderRadius: 12,
    padding: 13,
  },
  pillNoteTxt: {
    flex: 1,
    fontFamily: font.semibold,
    fontSize: 12.5,
    lineHeight: 18,
    color: colors.primaryDeep,
  },

  toast: {
    position: 'absolute',
    bottom: 18,
    alignSelf: 'center',
    backgroundColor: colors.textDark,
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 10,
    maxWidth: '88%',
  },
  toastTxt: { fontFamily: font.bold, fontSize: 13, color: colors.white, textAlign: 'center' },
});
