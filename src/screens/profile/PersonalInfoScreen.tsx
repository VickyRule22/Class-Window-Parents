import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Avatar } from '../../components/Avatar';
import { colors, font } from '../../theme';
import { SubHeader, Card, Field, PrimaryButton } from './ui';

// Edit name / email / phone. Tapping the photo goes straight to the picker
// (QA note: photo tap should never route to a form page).
export function PersonalInfoScreen({
  onBack,
  notify,
}: {
  onBack: () => void;
  notify: (msg: string) => void;
}) {
  const [first, setFirst] = useState('Mitch');
  const [last, setLast] = useState('Salzberg');
  const [email, setEmail] = useState('mitch.salzberg@email.com');
  const [phone, setPhone] = useState('(864) 555-0119');

  const complete = first.trim() && last.trim() && email.trim();

  return (
    <View style={{ flex: 1 }}>
      <SubHeader title="Personal info" onBack={onBack} />
      <ScrollView
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.photoWrap}>
          <Pressable onPress={() => notify('Photo picker would open')}>
            <Avatar initials="MS" solid={colors.primaryAlt} size={84} fontSize={28} />
          </Pressable>
          <Pressable
            style={styles.changePhoto}
            onPress={() => notify('Photo picker would open')}
          >
            <Text style={styles.changePhotoTxt}>Change photo</Text>
          </Pressable>
        </View>

        <Card style={{ paddingVertical: 16 }}>
          <Field label="First name" value={first} onChangeText={setFirst} />
          <Field label="Last name" value={last} onChangeText={setLast} />
          <Field
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            hint="We'll send a confirmation link if you change this."
          />
          <View style={{ marginBottom: -10 }}>
            <Field
              label="Phone (optional)"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              hint="Only teachers at your school can see this."
            />
          </View>
        </Card>

        <PrimaryButton
          label="Save changes"
          disabled={!complete}
          onPress={() => {
            notify('Profile updated 🎉');
            onBack();
          }}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  body: { paddingHorizontal: 16, paddingBottom: 32, gap: 18 },
  photoWrap: { alignItems: 'center', gap: 10, marginTop: 4 },
  changePhoto: {
    backgroundColor: colors.pillInactive,
    borderRadius: 999,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  changePhotoTxt: { fontFamily: font.headingBold, fontSize: 13, color: colors.primaryDeep },
});
