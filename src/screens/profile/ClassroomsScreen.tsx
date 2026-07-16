import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Avatar } from '../../components/Avatar';
import { classes } from '../../data';
import { colors, font, shadowSoft } from '../../theme';
import { SubHeader, PrimaryButton, QuietButton, PillNote } from './ui';

// MVP model: a parent joins CLASSROOMS, not kids (QA note 25: no
// child-classroom association for MVP). Reuses the same class list the
// Classes tab shows so the prototype stays one world.
export function ClassroomsScreen({
  onBack,
  onJoin,
  onOpenClass,
  notify,
}: {
  onBack: () => void;
  onJoin: () => void;
  onOpenClass?: (key: string) => void;
  notify: (msg: string) => void;
}) {
  return (
    <View style={{ flex: 1 }}>
      <SubHeader title="My classrooms" onBack={onBack} />
      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {classes.map((c) => (
          <View key={c.id} style={styles.card}>
            <View style={styles.cardTop}>
              <Avatar initials={c.initials} gradient={c.gradient} size={46} fontSize={16} />
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{c.name}</Text>
                <Text style={styles.meta}>
                  {c.meta} · {c.school}
                </Text>
              </View>
            </View>
            <View style={styles.cardActions}>
              <View style={{ flex: 1 }}>
                <QuietButton
                  label="View feed"
                  onPress={() =>
                    onOpenClass ? onOpenClass(c.initials) : notify('Opens this classroom feed')
                  }
                />
              </View>
              <View style={{ flex: 1 }}>
                <QuietButton
                  label="Leave"
                  danger
                  onPress={() => notify('Would confirm before leaving')}
                />
              </View>
            </View>
          </View>
        ))}

        <PillNote icon="🔒">
          Classroom codes come from your teacher, one per family member. Please don't pass
          codes along, it keeps the classroom private.
        </PillNote>

        <PrimaryButton label="Join a classroom" onPress={onJoin} />
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
    gap: 14,
    ...shadowSoft,
  },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 13 },
  name: { fontFamily: font.heading, fontSize: 16, color: colors.textDark2 },
  meta: { fontFamily: font.regular, fontSize: 12.5, color: colors.textMuted, marginTop: 1 },
  cardActions: { flexDirection: 'row', gap: 8 },
});
