import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, font } from '../../theme';
import { noOutline } from '../../onboarding/ui';
import { SubHeader, Card, PrimaryButton } from './ui';

// Give feedback. QA-notes rule: send stays disabled until a rating is picked,
// and the note under the button says where feedback goes.
export function FeedbackScreen({
  onBack,
  notify,
}: {
  onBack: () => void;
  notify: (msg: string) => void;
}) {
  const [rating, setRating] = useState(0);
  const [note, setNote] = useState('');

  return (
    <View style={{ flex: 1 }}>
      <SubHeader title="Give feedback" onBack={onBack} />
      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.intro}>
          <Text style={styles.emoji}>🧡</Text>
          <Text style={styles.title}>How's Class Window going?</Text>
        </View>

        <View style={styles.stars}>
          {[1, 2, 3, 4, 5].map((n) => (
            <Pressable key={n} onPress={() => setRating(n)} hitSlop={4}>
              <Ionicons
                name={n <= rating ? 'star' : 'star-outline'}
                size={32}
                color={n <= rating ? '#f5b942' : colors.textMuted3}
              />
            </Pressable>
          ))}
        </View>

        <Card style={{ paddingVertical: 14 }}>
          <Text style={styles.label}>ANYTHING TO ADD? (OPTIONAL)</Text>
          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder="What do you love? What's missing?"
            placeholderTextColor={colors.textMuted3}
            multiline
            numberOfLines={4}
            style={[styles.textarea, noOutline]}
          />
        </Card>

        <PrimaryButton
          label="Send feedback"
          disabled={rating === 0}
          onPress={() => {
            notify('Thanks for the feedback! 🙌');
            onBack();
          }}
        />
        <Text style={styles.footNote}>
          Feedback goes straight to the Class Window team, never to your school.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  body: { paddingHorizontal: 16, paddingBottom: 32, gap: 14 },
  intro: { alignItems: 'center', gap: 6, marginTop: 8 },
  emoji: { fontSize: 38 },
  title: { fontFamily: font.heading, fontSize: 18, color: colors.textDark },
  stars: { flexDirection: 'row', justifyContent: 'center', gap: 10, marginBottom: 4 },
  label: {
    fontFamily: font.headingBold,
    fontSize: 11,
    letterSpacing: 0.5,
    color: colors.textMuted,
    marginBottom: 8,
  },
  textarea: {
    borderWidth: 1.5,
    borderColor: colors.divider,
    borderRadius: 12,
    padding: 12,
    minHeight: 96,
    textAlignVertical: 'top',
    fontFamily: font.semibold,
    fontSize: 14.5,
    color: colors.textDark,
  },
  footNote: {
    fontFamily: font.regular,
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
