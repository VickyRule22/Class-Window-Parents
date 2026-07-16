import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { colors, font } from '../../theme';
import { SubHeader, Card, Field, PrimaryButton, QuietButton } from './ui';

// Change password. QA-notes rule: the update button stays disabled until
// every field is filled, and the forgot path gives instant feedback.
export function ChangePasswordScreen({
  onBack,
  notify,
}: {
  onBack: () => void;
  notify: (msg: string) => void;
}) {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');

  const complete = current.trim() && next.trim() && confirm.trim();

  return (
    <View style={{ flex: 1 }}>
      <SubHeader title="Change password" onBack={onBack} />
      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <Card style={{ paddingVertical: 16 }}>
          <Field
            label="Current password"
            value={current}
            onChangeText={setCurrent}
            placeholder="Your current password"
            secure
          />
          <Field
            label="New password"
            value={next}
            onChangeText={setNext}
            placeholder="At least 8 characters"
            secure
          />
          <View style={{ marginBottom: -10 }}>
            <Field
              label="Confirm new password"
              value={confirm}
              onChangeText={setConfirm}
              placeholder="One more time"
              secure
            />
          </View>
        </Card>

        <Text style={styles.note}>
          Use 8+ characters with a mix of letters and numbers. We'll sign out your other
          devices after the change.
        </Text>

        <PrimaryButton
          label="Update password"
          disabled={!complete}
          onPress={() => {
            notify('Password updated 🔒');
            onBack();
          }}
        />
        <QuietButton
          label="Forgot your current one?"
          onPress={() => notify('Reset link sent to sarah.chen@email.com')}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  body: { paddingHorizontal: 16, paddingBottom: 32, gap: 12 },
  note: {
    fontFamily: font.regular,
    fontSize: 12.5,
    color: colors.textMuted,
    lineHeight: 18,
    marginHorizontal: 4,
  },
});
