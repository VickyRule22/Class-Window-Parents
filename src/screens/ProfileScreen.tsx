import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Avatar } from '../components/Avatar';
import { colors, font, shadowSoft } from '../theme';

const ACCOUNT_ROWS = [
  { icon: '👤', label: 'Personal info' },
  { icon: '🔒', label: 'Privacy & security' },
  { icon: '❓', label: 'Help & support' },
  { icon: '⭐', label: 'Give Feedback' },
];

export function ProfileScreen() {
  const [notify, setNotify] = useState(true);

  return (
    <ScrollView
      style={{ backgroundColor: colors.appBg }}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.greeting}>
        <Text style={styles.hi}>Profile</Text>
        <Text style={styles.sub}>Your account & preferences</Text>
      </View>

      <View style={styles.body}>
        {/* parent card */}
        <View style={styles.parentCard}>
          <Avatar initials="SC" solid={colors.primaryAlt} size={42} fontSize={16} />
          <View style={{ flex: 1 }}>
            <Text style={styles.parentName}>Sarah Chen</Text>
            <Text style={styles.parentEmail}>sarah.chen@email.com</Text>
          </View>
          <View style={styles.editBtn}>
            <Text style={styles.editTxt}>Edit</Text>
          </View>
        </View>

        {/* notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>NOTIFICATIONS</Text>
          <View style={styles.group}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <View style={styles.emojiBox}>
                  <Text style={styles.emoji}>🔔</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.settingTitle}>New classroom moments</Text>
                  <Text style={styles.settingSub}>Alert when teachers post</Text>
                </View>
              </View>
              <Pressable onPress={() => setNotify((v) => !v)} style={[styles.toggle, notify ? styles.toggleOn : styles.toggleOff]}>
                <View style={[styles.knob, notify ? { alignSelf: 'flex-end' } : { alignSelf: 'flex-start' }]} />
              </Pressable>
            </View>
          </View>
        </View>

        {/* account */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>ACCOUNT</Text>
          <View style={styles.group}>
            {ACCOUNT_ROWS.map((r, i) => (
              <View
                key={r.label}
                style={[
                  styles.accountRow,
                  i < ACCOUNT_ROWS.length - 1 && styles.accountRowBorder,
                ]}
              >
                <View style={styles.settingLeft}>
                  <View style={styles.emojiBox}>
                    <Text style={styles.emoji}>{r.icon}</Text>
                  </View>
                  <Text style={styles.accountLabel}>{r.label}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.textMuted3} />
              </View>
            ))}
          </View>
        </View>

        {/* sign out */}
        <View style={styles.signOut}>
          <Text style={styles.signOutTxt}>Sign Out</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: 32 },
  greeting: { paddingHorizontal: 20, paddingVertical: 8 },
  hi: { fontFamily: font.heading, fontSize: 20, color: colors.textDark },
  sub: { fontFamily: font.semibold, fontSize: 13, color: colors.textMuted, marginTop: 2 },
  body: { paddingHorizontal: 16, paddingTop: 8, gap: 20 },

  parentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 16,
    ...shadowSoft,
  },
  parentName: { fontFamily: font.headingBold, fontSize: 20, color: colors.textDark2 },
  parentEmail: { fontFamily: font.regular, fontSize: 14, color: colors.textMuted },
  editBtn: {
    borderWidth: 1,
    borderColor: colors.cardDivider,
    backgroundColor: colors.appBg,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  editTxt: { fontFamily: font.bold, fontSize: 14, color: colors.primaryAlt },

  section: { gap: 10 },
  sectionLabel: {
    fontFamily: font.headingBold,
    fontSize: 11,
    color: colors.sectionLabel,
    letterSpacing: 0.5,
  },
  group: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 16,
    ...shadowSoft,
  },
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 11, flex: 1 },
  emojiBox: {
    width: 35,
    height: 35,
    borderRadius: 9,
    backgroundColor: colors.settingsIconBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: { fontSize: 16 },
  settingTitle: { fontFamily: font.semibold, fontSize: 15, color: colors.textDark2 },
  settingSub: { fontFamily: font.regular, fontSize: 14, color: colors.textMuted, marginTop: 1 },

  toggle: { width: 42, height: 25, borderRadius: 13, padding: 2, justifyContent: 'center' },
  toggleOn: { backgroundColor: colors.primaryAlt },
  toggleOff: { backgroundColor: colors.borderPrimary },
  knob: { width: 21, height: 21, borderRadius: 11, backgroundColor: colors.white },

  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  accountRowBorder: {
    paddingBottom: 10,
    marginBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.cardDivider,
  },
  accountLabel: { fontFamily: font.semibold, fontSize: 14, color: colors.textDark2 },

  signOut: {
    borderWidth: 1,
    borderColor: colors.borderPrimary,
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  signOutTxt: { fontFamily: font.bold, fontSize: 16, color: colors.primary },
});
