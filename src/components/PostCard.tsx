import React, { useRef, useState } from 'react';
import { View, Text, Image, Pressable, Animated, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Avatar } from './Avatar';
import { HeartButton } from './HeartButton';
import { colors, font, shadowCard } from '../theme';
import type { Post } from '../data';

// Teachers are listed formally ("Mrs. Sarah Johnson"), which is right on a post
// but reads oddly in "Block ...". Drop the title so the menu row and the block
// dialog name the same person the same way.
export const shortName = (name: string) => name.replace(/^(Ms\.|Mr\.|Mrs\.|Miss)\s+/, '');

export function PostCard({
  post,
  onReport,
  onBlock,
  onTrash,
}: {
  post: Post;
  onReport: () => void;
  // a parent shutting this teacher out of their feed entirely. Parents get this
  // instead of trash: hiding one photo does nothing about whoever posted it.
  onBlock?: () => void;
  // a teacher taking their OWN post back down. Never offered to parents, who
  // can't delete someone else's post for everybody.
  onTrash?: () => void;
}) {
  const [liked, setLiked] = useState(post.liked);
  const [likes, setLikes] = useState(post.likes);
  const [menuOpen, setMenuOpen] = useState(false);
  // the big heart that blooms over the photo on a double-tap
  const bloom = useRef(new Animated.Value(0)).current;
  const lastTap = useRef(0);

  const setLike = (next: boolean) => {
    if (next === liked) return;
    setLiked(next);
    setLikes((n) => n + (next ? 1 : -1));
  };

  // Double-tap the photo to like it, the way families already expect from
  // Instagram, so nobody has to hunt for the button. Tapping an already-liked
  // photo still blooms (it just doesn't double-count the like).
  const onPhotoPress = () => {
    const now = Date.now();
    if (now - lastTap.current < 280) {
      lastTap.current = 0;
      setLike(true);
      bloom.setValue(0);
      Animated.sequence([
        Animated.spring(bloom, { toValue: 1, useNativeDriver: true, friction: 4, tension: 120 }),
        Animated.timing(bloom, { toValue: 0, duration: 340, delay: 240, useNativeDriver: true }),
      ]).start();
      return;
    }
    lastTap.current = now;
  };

  return (
    <View style={styles.card}>
      {/* header */}
      <View style={styles.header}>
        <Avatar initials={post.initials} gradient={post.gradient} size={42} fontSize={16} />
        <View style={styles.headerText}>
          <Text style={styles.name}>{post.name}</Text>
          <Text style={styles.meta}>{post.meta}</Text>
        </View>
        <Text style={styles.time}>{post.time}</Text>
        <Pressable
          hitSlop={10}
          onPress={() => setMenuOpen((v) => !v)}
          style={styles.dots}
          accessibilityRole="button"
          accessibilityLabel="Post options"
        >
          <Ionicons name="ellipsis-vertical" size={18} color={colors.textMuted} />
        </Pressable>
      </View>

      {/* post actions: a parent reports or blocks, a teacher reports or trashes */}
      {menuOpen && (
        <>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setMenuOpen(false)} />
          <View style={styles.menu}>
            <Pressable
              style={[styles.menuRow, !onBlock && !onTrash && styles.menuRowLast]}
              onPress={() => {
                setMenuOpen(false);
                onReport();
              }}
            >
              <Ionicons name="flag-outline" size={15} color={colors.textDark2} />
              <Text style={styles.menuTxt}>Report post</Text>
            </Pressable>
            {onBlock && (
              <Pressable
                style={[styles.menuRow, styles.menuRowLast]}
                onPress={() => {
                  setMenuOpen(false);
                  onBlock();
                }}
              >
                <Ionicons name="ban-outline" size={15} color="#d64545" />
                <Text style={[styles.menuTxt, { color: '#d64545' }]}>
                  Block {shortName(post.name)}
                </Text>
              </Pressable>
            )}
            {onTrash && (
              <Pressable
                style={[styles.menuRow, styles.menuRowLast]}
                onPress={() => {
                  setMenuOpen(false);
                  onTrash();
                }}
              >
                <Ionicons name="trash-outline" size={15} color="#d64545" />
                <Text style={[styles.menuTxt, { color: '#d64545' }]}>Move to trash</Text>
              </Pressable>
            )}
          </View>
        </>
      )}

      {/* image */}
      <Pressable
        onPress={onPhotoPress}
        style={[styles.image, { backgroundColor: post.imageColor }]}
      >
        <Image source={post.image} style={styles.photo} resizeMode="cover" />
        <Animated.View
          pointerEvents="none"
          style={[
            styles.bloom,
            {
              opacity: bloom.interpolate({ inputRange: [0, 0.2, 1], outputRange: [0, 0.95, 0.95] }),
              transform: [
                { scale: bloom.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }) },
              ],
            },
          ]}
        >
          <Ionicons name="heart" size={96} color={colors.white} />
        </Animated.View>
      </Pressable>

      {/* caption */}
      <View style={styles.captionWrap}>
        <Text style={styles.caption}>{post.caption}</Text>
      </View>

      {/* reactions */}
      <View style={styles.reactions}>
        <HeartButton liked={liked} count={likes} onToggle={setLike} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.cardBorderPeach,
    borderRadius: 20,
    overflow: 'hidden',
    ...shadowCard,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerText: { flex: 1 },
  name: { fontFamily: font.heading, fontSize: 14, color: colors.textDark },
  meta: { fontFamily: font.semibold, fontSize: 12, color: colors.textMuted, marginTop: 1 },
  time: { fontFamily: font.semibold, fontSize: 11, color: colors.textMuted, opacity: 0.8 },
  dots: { paddingLeft: 2 },
  menu: {
    position: 'absolute',
    top: 40,
    right: 12,
    backgroundColor: colors.white,
    borderRadius: 14,
    paddingVertical: 4,
    minWidth: 178,
    zIndex: 10,
    borderWidth: 1,
    borderColor: colors.cardDivider,
    shadowColor: '#2c1a0e',
    shadowOpacity: 0.16,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.cardDivider,
  },
  menuRowLast: { borderBottomWidth: 0 },
  menuTxt: { fontFamily: font.semibold, fontSize: 14, color: colors.textDark2 },
  image: { height: 269, alignItems: 'center', justifyContent: 'center' },
  photo: { width: '100%', height: '100%' },
  bloom: {
    position: 'absolute',
    alignSelf: 'center',
    shadowColor: '#2c1a0e',
    shadowOpacity: 0.35,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
  },
  captionWrap: { paddingHorizontal: 16, paddingVertical: 12 },
  caption: { fontFamily: font.semibold, fontSize: 14, color: colors.caption, lineHeight: 20 },
  reactions: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12, flexDirection: 'row' },
  reactionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1.5,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  reactionCount: { fontFamily: font.bold, fontSize: 13, color: colors.primaryDeep },
});
