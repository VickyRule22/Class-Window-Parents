import React, { useRef, useState } from 'react';
import { View, Text, Image, Pressable, Animated, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Avatar } from './Avatar';
import { colors, font, shadowCard } from '../theme';
import type { Post } from '../data';

export function PostCard({
  post,
  onReport,
  onTrash,
}: {
  post: Post;
  onReport: () => void;
  // remove this post from the feed (a parent hiding something sketchy, or a
  // teacher trashing their own post)
  onTrash?: () => void;
}) {
  const [liked, setLiked] = useState(post.liked);
  const [likes, setLikes] = useState(post.likes);
  const [menuOpen, setMenuOpen] = useState(false);
  const scale = useRef(new Animated.Value(1)).current;

  const toggleLike = () => {
    const next = !liked;
    setLiked(next);
    setLikes((n) => n + (next ? 1 : -1));
    // little pop on the heart
    Animated.sequence([
      Animated.spring(scale, { toValue: 1.25, useNativeDriver: true, speed: 50 }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 20 }),
    ]).start();
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

      {/* post actions: report anything sketchy, or trash it out of the feed */}
      {menuOpen && (
        <>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setMenuOpen(false)} />
          <View style={styles.menu}>
            <Pressable
              style={styles.menuRow}
              onPress={() => {
                setMenuOpen(false);
                onReport();
              }}
            >
              <Ionicons name="flag-outline" size={15} color={colors.textDark2} />
              <Text style={styles.menuTxt}>Report post</Text>
            </Pressable>
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
      <View style={[styles.image, { backgroundColor: post.imageColor }]}>
        <Image source={post.image} style={styles.photo} resizeMode="cover" />
      </View>

      {/* caption */}
      <View style={styles.captionWrap}>
        <Text style={styles.caption}>{post.caption}</Text>
      </View>

      {/* reactions */}
      <View style={styles.reactions}>
        <Pressable
          onPress={toggleLike}
          style={[
            styles.reactionBtn,
            liked
              ? { backgroundColor: colors.reactionLikedBg, borderColor: colors.cardBorderPeach }
              : { backgroundColor: colors.reactionDefaultBg, borderColor: colors.reactionDefaultBorder },
          ]}
        >
          <Animated.View style={{ transform: [{ scale }] }}>
            <Ionicons
              name={liked ? 'heart' : 'heart-outline'}
              size={16}
              color={colors.primaryDeep}
            />
          </Animated.View>
          <Text style={styles.reactionCount}>{likes}</Text>
        </Pressable>
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
