import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SubHeader, SectionLabel, Card, Row, Toggle } from './ui';

// Privacy and security hub. QA-notes rules: photo consent lives in the app,
// delete is called delete in plain words (no "Danger Zone"), and removal works
// like the Mac trash: kept for 30 days, recoverable.
export function PrivacySecurityScreen({
  onBack,
  onChangePassword,
  notify,
}: {
  onBack: () => void;
  onChangePassword: () => void;
  notify: (msg: string) => void;
}) {
  const [photoOk, setPhotoOk] = useState(true);
  const [nameVisible, setNameVisible] = useState(true);

  return (
    <View style={{ flex: 1 }}>
      <SubHeader title="Privacy & security" onBack={onBack} />
      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View>
          <SectionLabel>SIGN-IN</SectionLabel>
          <Card>
            <Row
              icon="key-outline"
              title="Change password"
              sub="Last changed 3 months ago"
              onPress={onChangePassword}
            />
            <Row
              icon="phone-portrait-outline"
              title="Where you're signed in"
              sub="2 devices"
              onPress={() => notify('Would list your active sessions')}
              last
            />
          </Card>
        </View>

        <View>
          <SectionLabel>FAMILY PRIVACY</SectionLabel>
          <Card>
            <Row
              icon="image-outline"
              title="Photo permission"
              sub="Allow my kids in class photos"
              right={<Toggle value={photoOk} onChange={setPhotoOk} />}
            />
            <Row
              icon="pricetag-outline"
              title="Name visibility"
              sub="Show first name to other parents"
              right={<Toggle value={nameVisible} onChange={setNameVisible} />}
              last
            />
          </Card>
        </View>

        <View>
          <SectionLabel>YOUR DATA</SectionLabel>
          <Card>
            <Row
              icon="archive-outline"
              title="Download my data"
              sub="Photos, posts and account info"
              onPress={() => notify('Would email an export within 24 hours')}
            />
            <Row
              icon="document-text-outline"
              title="Privacy policy"
              sub="The plain-English version"
              onPress={() => notify('Opens the privacy policy')}
              last
            />
          </Card>
        </View>

        <View>
          <SectionLabel>DELETE ACCOUNT</SectionLabel>
          <Card>
            <Row
              icon="trash-outline"
              title="Delete my account"
              sub="Kept for 30 days in case you change your mind"
              onPress={() => notify('Would require typed confirmation')}
              danger
              last
            />
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  body: { paddingHorizontal: 16, paddingBottom: 32, gap: 18 },
});
