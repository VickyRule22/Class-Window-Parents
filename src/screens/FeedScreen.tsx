import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PostCard } from '../components/PostCard';
import { posts } from '../data';
import { colors, font } from '../theme';

const FILTERS = [
  { label: 'All Classes', active: true },
  { label: 'Mrs. Johnson · 2nd', active: false },
  { label: 'Mr. Patel · PE', active: false },
  { label: 'Ms. Rivera · Art', active: false },
];

export function FeedScreen({ onReport }: { onReport: () => void }) {
  return (
    <ScrollView
      style={{ backgroundColor: colors.appBg }}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* greeting */}
      <View style={styles.greeting}>
        <Text style={styles.hi}>Good morning ☀️</Text>
        <Text style={styles.sub}>3 new moments from your kids' classrooms</Text>
      </View>

      {/* filter pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {FILTERS.map((f) => (
          <View
            key={f.label}
            style={[styles.pill, f.active ? styles.pillActive : styles.pillInactive]}
          >
            <Text
              style={[
                styles.pillTxt,
                { color: f.active ? colors.white : colors.textMuted },
              ]}
            >
              {f.label}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* posts */}
      <View style={styles.feed}>
        {posts.map((p) => (
          <PostCard key={p.id} post={p} onReport={onReport} />
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
