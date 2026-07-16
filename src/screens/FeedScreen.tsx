import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PostCard } from '../components/PostCard';
import { posts, feedFilters } from '../data';
import { colors, font } from '../theme';

export function FeedScreen({
  onReport,
  filter,
  onFilterChange,
  teacherInvite,
}: {
  onReport: () => void;
  filter: string;
  onFilterChange: (key: string) => void;
  // set when a school admin has added this parent as a teacher: a feed banner
  // nudges them to create their classroom, which unlocks the role switcher
  teacherInvite?: { onSetup: () => void; onDismiss: () => void } | null;
}) {
  // posts the parent trashed out of their own feed (doesn't touch anyone else's)
  const [trashed, setTrashed] = useState<string[]>([]);
  const pool = posts.filter((p) => !trashed.includes(p.id));
  const visible = filter === 'all' ? pool : pool.filter((p) => p.initials === filter);
  const activeLabel = feedFilters.find((f) => f.key === filter)?.label ?? '';
  const subtitle =
    filter === 'all'
      ? "3 new moments from your kids' classrooms"
      : `${visible.length} ${visible.length === 1 ? 'moment' : 'moments'} from ${activeLabel.split(' ·')[0]}`;

  return (
    <ScrollView
      style={{ backgroundColor: colors.appBg }}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* admin added this parent as a teacher: nudge to set up the classroom */}
      {teacherInvite && (
        <View style={styles.inviteBanner}>
          <Text style={styles.inviteEmoji}>🎉</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.inviteTitle}>Lincoln Elementary added you as a teacher!</Text>
            <Text style={styles.inviteSub}>Set up your classroom to start sharing moments.</Text>
            <View style={styles.inviteActions}>
              <Pressable style={styles.inviteCta} onPress={teacherInvite.onSetup}>
                <Text style={styles.inviteCtaTxt}>Create my classroom</Text>
              </Pressable>
              <Pressable style={styles.inviteLater} onPress={teacherInvite.onDismiss}>
                <Text style={styles.inviteLaterTxt}>Not now</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}

      {/* greeting */}
      <View style={styles.greeting}>
        <Text style={styles.hi}>Good morning ☀️</Text>
        <Text style={styles.sub}>{subtitle}</Text>
      </View>

      {/* filter pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {feedFilters.map((f) => {
          const active = f.key === filter;
          return (
            <Pressable
              key={f.key}
              onPress={() => onFilterChange(f.key)}
              style={[styles.pill, active ? styles.pillActive : styles.pillInactive]}
            >
              <Text style={[styles.pillTxt, { color: active ? colors.white : colors.textMuted }]}>
                {f.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* posts */}
      <View style={styles.feed}>
        {visible.map((p) => (
          <PostCard
            key={p.id}
            post={p}
            onReport={onReport}
            onTrash={() => setTrashed((t) => [...t, p.id])}
          />
        ))}

        {/* caught up */}
        <View style={styles.caughtUp}>
          <View style={styles.cuIcon}>
            <Ionicons name="checkmark" size={30} color={colors.primary} />
          </View>
          <View style={{ alignItems: 'center', gap: 8 }}>
            <Text style={styles.cuTitle}>You're all caught up!</Text>
            <Text style={styles.cuSub}>Check back later for more moments.</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: 24 },
  inviteBanner: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: colors.settingsIconBg,
    borderWidth: 1,
    borderColor: colors.cardBorderPeach,
    borderRadius: 16,
    padding: 14,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 4,
  },
  inviteEmoji: { fontSize: 22 },
  inviteTitle: { fontFamily: font.headingBold, fontSize: 14.5, color: colors.textDark },
  inviteSub: { fontFamily: font.regular, fontSize: 12.5, color: colors.caption, marginTop: 2 },
  inviteActions: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 10 },
  inviteCta: {
    backgroundColor: colors.brandSolid,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  inviteCtaTxt: { fontFamily: font.heading, fontSize: 12.5, color: colors.white },
  inviteLater: { paddingVertical: 8 },
  inviteLaterTxt: { fontFamily: font.bold, fontSize: 12.5, color: colors.textMuted },
  greeting: { paddingHorizontal: 20, paddingVertical: 8 },
  hi: { fontFamily: font.heading, fontSize: 20, color: colors.textDark },
  sub: { fontFamily: font.semibold, fontSize: 13, color: colors.textMuted, marginTop: 2 },
  filterRow: { paddingHorizontal: 20, paddingVertical: 6, gap: 8 },
  pill: {
    height: 32,
    borderRadius: 999,
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  pillActive: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  pillInactive: { backgroundColor: colors.pillInactive },
  pillTxt: { fontFamily: font.bold, fontSize: 12 },
  feed: { paddingHorizontal: 16, paddingTop: 8, gap: 10 },
  caughtUp: { alignItems: 'center', gap: 24, paddingVertical: 32 },
  cuIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.caughtUpIconBg,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOpacity: 0.2,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  cuTitle: { fontFamily: font.heading, fontSize: 18, color: colors.textDark },
  cuSub: { fontFamily: font.semibold, fontSize: 13, color: colors.textMuted },
});
