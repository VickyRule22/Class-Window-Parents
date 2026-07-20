import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, font, shadowSoft } from '../../theme';
import { SubHeader, PrimaryButton, PillNote } from './ui';
import type { Classroom } from '../../../App';

// A teacher's classroom manager: every room they run, each with its
// three-word join code. The code alone gets a family in; if one gets passed
// around, any code can be rotated on the spot (old one dies instantly).
export function TeacherClassroomsScreen({
  classrooms,
  onBack,
  onRotate,
  onAdd,
  notify,
}: {
  classrooms: Classroom[];
  // absent when this renders as the Classes tab rather than a pushed screen
  onBack?: () => void;
  onRotate: (index: number) => void;
  onAdd: () => void;
  notify: (msg: string) => void;
}) {
  return (
    <View style={{ flex: 1 }}>
      <SubHeader title="My classrooms" onBack={onBack} />
      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {classrooms.map((c, i) => (
          <View key={c.name + i} style={styles.card}>
            <View style={styles.cardTop}>
              <View style={styles.roomIcon}>
                <Text style={{ fontSize: 18 }}>🏫</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{c.name}</Text>
                <Text style={styles.meta}>Families join with this code</Text>
              </View>
            </View>
            <View style={styles.codeRow}>
              <View style={styles.codePill}>
                <Ionicons name="key-outline" size={13} color={colors.primaryDeep} />
                <Text style={styles.codeTxt}>{c.code}</Text>
              </View>
              <Pressable
                style={styles.rotateBtn}
                onPress={() => {
                  onRotate(i);
                  notify('New code made. The old one stopped working.');
                }}
              >
                <Ionicons name="refresh" size={14} color={colors.white} />
                <Text style={styles.rotateTxt}>Rotate</Text>
              </Pressable>
            </View>
          </View>
        ))}

        <PillNote icon="🔒">
          Anyone with the code can join. Rotate it anytime and the old code stops
          working; families already in stay in.
        </PillNote>

        <PrimaryButton label="Add another classroom" onPress={onAdd} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  body: { paddingHorizontal: 16, paddingBottom: 32, gap: 14 },
  card: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 16,
    gap: 13,
    ...shadowSoft,
  },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  roomIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.settingsIconBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: { fontFamily: font.heading, fontSize: 16, color: colors.textDark2 },
  meta: { fontFamily: font.regular, fontSize: 12.5, color: colors.textMuted, marginTop: 1 },
  codeRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  codePill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: colors.pillInactive,
    borderRadius: 999,
    paddingHorizontal: 13,
    paddingVertical: 9,
  },
  codeTxt: { fontFamily: font.heading, fontSize: 13.5, color: colors.textDark, letterSpacing: 0.3 },
  rotateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.brandSolid,
    borderRadius: 999,
    paddingHorizontal: 13,
    paddingVertical: 9,
  },
  rotateTxt: { fontFamily: font.heading, fontSize: 12.5, color: colors.white },
});
