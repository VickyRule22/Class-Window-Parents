import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SubHeader, SectionLabel, Card, Row, Toggle, PillNote } from './ui';

// Notification preferences. QA-notes rules: positive "allow" phrasing (never
// "Pause"), no explanatory copy under simple toggles, and green = ON.
export function NotificationsScreen({ onBack }: { onBack: () => void }) {
  const [moments, setMoments] = useState(true);
  const [announcements, setAnnouncements] = useState(true);
  const [events, setEvents] = useState(true);
  const [wishlists, setWishlists] = useState(false);
  const [digest, setDigest] = useState(true);
  const [quiet, setQuiet] = useState(true);

  return (
    <View style={{ flex: 1 }}>
      <SubHeader title="Notifications" onBack={onBack} />
      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View>
          <SectionLabel>CLASSROOM ACTIVITY</SectionLabel>
          <Card>
            <Row
              icon="camera-outline"
              title="New classroom moments"
              right={<Toggle value={moments} onChange={setMoments} />}
            />
            <Row
              icon="megaphone-outline"
              title="Announcements"
              right={<Toggle value={announcements} onChange={setAnnouncements} />}
            />
            <Row
              icon="calendar-outline"
              title="Event reminders"
              right={<Toggle value={events} onChange={setEvents} />}
            />
            <Row
              icon="gift-outline"
              title="Wishlist updates"
              right={<Toggle value={wishlists} onChange={setWishlists} />}
              last
            />
          </Card>
        </View>

        <View>
          <SectionLabel>EMAIL</SectionLabel>
          <Card>
            <Row
              icon="mail-outline"
              title="Weekly digest"
              sub="Sunday recap of the week"
              right={<Toggle value={digest} onChange={setDigest} />}
              last
            />
          </Card>
        </View>

        <View>
          <SectionLabel>QUIET HOURS</SectionLabel>
          <Card>
            <Row
              icon="moon-outline"
              title="Quiet overnight"
              sub="No pushes 8:00 PM to 7:00 AM"
              right={<Toggle value={quiet} onChange={setQuiet} />}
              last
            />
          </Card>
        </View>

        <PillNote icon="🧡">
          Changes save instantly. You can always catch up in the feed, notifications never
          gate content.
        </PillNote>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  body: { paddingHorizontal: 16, paddingBottom: 32, gap: 18 },
});
