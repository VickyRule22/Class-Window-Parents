import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, font } from '../../theme';
import { SubHeader, SectionLabel, Card, Row } from './ui';

const FAQS: { q: string; a: string }[] = [
  {
    q: "Why can't I see photos of my child?",
    a: "Teachers choose which moments to share, and photos only appear for classrooms you've joined. If a classroom is missing, check My classrooms.",
  },
  {
    q: 'Can both parents have accounts?',
    a: 'Yes! Each guardian gets their own code from the teacher and creates their own account. Everyone sees the same feed.',
  },
  {
    q: 'How do I save a photo?',
    a: 'Open any post and tap the download icon. Saving is only available when the teacher has enabled it for that classroom.',
  },
  {
    q: 'Who can see my info?',
    a: 'Only teachers and staff at your school. Other parents see just your first name and last initial.',
  },
];

// FAQs plus the still-stuck paths: contact support, report a post (opens the
// real report sheet, QA note 54), and report an app problem.
export function HelpSupportScreen({
  onBack,
  onReportPost,
  notify,
}: {
  onBack: () => void;
  onReportPost?: () => void;
  notify: (msg: string) => void;
}) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <View style={{ flex: 1 }}>
      <SubHeader title="Help & support" onBack={onBack} />
      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View>
          <SectionLabel>COMMON QUESTIONS</SectionLabel>
          <Card>
            {FAQS.map((f, i) => {
              const isOpen = open === i;
              const last = i === FAQS.length - 1;
              return (
                <Pressable
                  key={f.q}
                  onPress={() => setOpen(isOpen ? null : i)}
                  style={[styles.faq, !last && styles.faqBorder]}
                >
                  <View style={styles.faqHead}>
                    <Text style={styles.faqQ}>{f.q}</Text>
                    <Ionicons
                      name={isOpen ? 'remove' : 'add'}
                      size={17}
                      color={colors.primary}
                    />
                  </View>
                  {isOpen && <Text style={styles.faqA}>{f.a}</Text>}
                </Pressable>
              );
            })}
          </Card>
        </View>

        <View>
          <SectionLabel>STILL STUCK?</SectionLabel>
          <Card>
            <Row
              icon="chatbubble-ellipses-outline"
              title="Contact support"
              sub="We reply within one school day"
              onPress={() => notify('Opens an email to support')}
            />
            <Row
              icon="flag-outline"
              title="Report a post"
              sub="Something inappropriate in a feed"
              onPress={onReportPost ?? (() => notify('Opens the report flow'))}
            />
            <Row
              icon="bug-outline"
              title="Report a problem"
              sub="Something broken or off"
              onPress={() => notify('Opens a problem report form')}
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
  faq: { paddingVertical: 12 },
  faqBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.cardDivider,
  },
  faqHead: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  faqQ: { flex: 1, fontFamily: font.semibold, fontSize: 14.5, color: colors.textDark2 },
  faqA: {
    fontFamily: font.regular,
    fontSize: 13.5,
    color: colors.textMuted,
    lineHeight: 20,
    marginTop: 8,
    paddingRight: 20,
  },
});
