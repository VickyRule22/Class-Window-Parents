import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ClassCard } from '../components/ClassCard';
import { classes } from '../data';
import { colors, font, shadowSoft } from '../theme';

export function ClassesScreen() {
  return (
    <ScrollView
      style={{ backgroundColor: colors.appBg }}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.greeting}>
        <Text style={styles.hi}>Your Classes</Text>
        <Text style={styles.sub}>Your schools & teachers</Text>
      </View>

      <View style={styles.body}>
        <Text style={styles.sectionLabel}>LINCOLN ELEMENTARY</Text>
        <View style={{ gap: 10 }}>
          {classes.map((c) => (
            <ClassCard key={c.id} row={c} />
          ))}
        </View>

        {/* add another class (dashed) */}
        <View style={styles.addCard}>
          <View style={styles.plusBtn}>
            <Ionicons name="add" size={16} color={colors.textMuted2} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.addTitle}>Add another class</Text>
            <Text style={styles.addSub}>Join with a class code from your teacher</Text>
          </View>
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
  sectionLabel: {
    fontFamily: font.headingBold,
    fontSize: 11,
    color: colors.sectionLabel,
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  addCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#c4b4ac',
    padding: 16,
    ...shadowSoft,
  },
  plusBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderPrimary,
    backgroundColor: colors.appBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addTitle: { fontFamily: font.headingBold, fontSize: 13, color: colors.textDark2 },
  addSub: { fontFamily: font.regular, fontSize: 12, color: colors.textMuted2, marginTop: 1 },
});
