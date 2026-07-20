import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, ScrollView, Animated, Easing, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PostCard } from '../components/PostCard';
import { colors, font, shadowCard } from '../theme';
import type { Post } from '../data';

const IDEAS = ['First-day smiles 😊', 'Art projects 🎨', 'Science wins 🔬', 'Story time 📚', 'Recess heroes ⚽'];

// Teacher home. Before the first post it's a pep talk: what to share and one
// big bouncing button to share it. After that, it's their classroom feed with
// a quieter new-post button up top.
export function TeacherFeedScreen({
  classrooms,
  posts,
  justPosted,
  onNewPost,
  onReport,
  onTrashPost,
}: {
  classrooms: string[];
  posts: Post[];
  justPosted: boolean;
  onNewPost: () => void;
  onReport: () => void;
  // teacher trashing one of their own posts
  onTrashPost?: (id: string) => void;
}) {
  const headline = classrooms.length === 1 ? classrooms[0] : 'Your classrooms';
  // 'all', or one of this teacher's own classroom names
  const [filter, setFilter] = useState('all');
  const shown = filter === 'all' ? posts : posts.filter((p) => p.meta === filter);
  const bob = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;

  // gentle idle motion: camera bobs, button breathes
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bob, { toValue: 1, duration: 900, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(bob, { toValue: 0, duration: 900, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ]),
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 1100, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 1100, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ]),
    ).start();
  }, []);

  const bobY = bob.interpolate({ inputRange: [0, 1], outputRange: [0, -8] });
  const pulseScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.045] });

  if (posts.length === 0) {
    return (
      <ScrollView
        style={{ backgroundColor: colors.appBg }}
        contentContainerStyle={styles.emptyContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.Text style={[styles.bigEmoji, { transform: [{ translateY: bobY }] }]}>
          📸
        </Animated.Text>
        <Text style={styles.emptyTitle}>{classrooms[classrooms.length - 1]} is ready!</Text>
        <Text style={styles.emptySub}>
          Share your first classroom moment.{'\n'}Families are excited to peek inside.
        </Text>

        <View style={styles.ideas}>
          {IDEAS.map((idea) => (
            <View key={idea} style={styles.ideaChip}>
              <Text style={styles.ideaTxt}>{idea}</Text>
            </View>
          ))}
        </View>

        <Animated.View style={{ transform: [{ scale: pulseScale }], alignSelf: 'stretch' }}>
          <Pressable style={styles.bigBtn} onPress={onNewPost}>
            <Ionicons name="camera" size={22} color={colors.white} />
            <Text style={styles.bigBtnTxt}>Share your first moment</Text>
          </Pressable>
        </Animated.View>
        <Text style={styles.emptyFoot}>Snap a photo or pick one from your library.</Text>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={{ backgroundColor: colors.appBg }}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.greeting}>
        <Text style={styles.hi}>{headline}</Text>
        <Text style={styles.sub}>
          {shown.length} {shown.length === 1 ? 'moment' : 'moments'} shared with families
        </Text>
      </View>

      {/* Filter across the rooms this teacher runs. Only their own classrooms
          appear here: a teacher never sees another teacher's classes. */}
      {classrooms.length > 1 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {['all', ...classrooms].map((key) => {
            const active = key === filter;
            return (
              <Pressable
                key={key}
                onPress={() => setFilter(key)}
                style={[styles.pill, active ? styles.pillActive : styles.pillInactive]}
              >
                <Text style={[styles.pillTxt, { color: active ? colors.white : colors.textMuted }]}>
                  {key === 'all' ? 'All Classes' : key}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      )}

      {justPosted && (
        <View style={styles.liveBanner}>
          <Ionicons name="checkmark-circle" size={16} color="#2e9e5b" />
          <Text style={styles.liveTxt}>Your moment is live on the classroom feed 🎉</Text>
        </View>
      )}

      {/* posting lives on the floating + button, which follows you down the
          feed. A second full-width button at the top only competed with it. */}
      <View style={styles.cards}>
        {shown.map((p) => (
          <PostCard
            key={p.id}
            post={p}
            onReport={onReport}
            onTrash={onTrashPost ? () => onTrashPost(p.id) : undefined}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  emptyContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 40,
    gap: 14,
  },
  bigEmoji: { fontSize: 64 },
  emptyTitle: {
    fontFamily: font.heading,
    fontSize: 23,
    color: colors.textDark,
    textAlign: 'center',
  },
  emptySub: {
    fontFamily: font.regular,
    fontSize: 14.5,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 21,
  },
  ideas: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginVertical: 6 },
  ideaChip: {
    backgroundColor: colors.settingsIconBg,
    borderRadius: 999,
    paddingHorizontal: 13,
    paddingVertical: 8,
  },
  ideaTxt: { fontFamily: font.bold, fontSize: 12.5, color: colors.primaryDeep },
  bigBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: colors.brandSolid,
    borderRadius: 30,
    paddingVertical: 18,
    ...shadowCard,
  },
  bigBtnTxt: { fontFamily: font.heading, fontSize: 17, color: colors.white },
  emptyFoot: { fontFamily: font.regular, fontSize: 12.5, color: colors.textMuted },

  content: { paddingBottom: 32 },
  greeting: { paddingHorizontal: 20, paddingVertical: 8 },
  hi: { fontFamily: font.heading, fontSize: 20, color: colors.textDark },
  sub: { fontFamily: font.semibold, fontSize: 13, color: colors.textMuted, marginTop: 2 },
  // same filter pills the family feed uses, so the two feeds read as one app
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
  liveBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: '#e9f7ee',
    borderRadius: 12,
    paddingHorizontal: 13,
    paddingVertical: 10,
    marginHorizontal: 16,
    marginBottom: 10,
  },
  liveTxt: { fontFamily: font.bold, fontSize: 12.5, color: '#2e7d4f', flex: 1 },
  cards: { paddingHorizontal: 16, paddingTop: 4, gap: 16 },
});
