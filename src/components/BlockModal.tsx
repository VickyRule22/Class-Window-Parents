import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, Animated, Easing, StyleSheet } from 'react-native';
import { colors, font } from '../theme';

/**
 * Blocking a teacher, in the two steps the App Store safety flows use: ask
 * first, then say plainly what happened. Copy is carried over word for word
 * from those flows, including "our team will be notified", which is the part
 * that tells a worried parent a human sees this and not just their own feed.
 *
 * Confirming actually pulls that teacher's posts out of the feed, so the
 * result screen is describing something the parent can then go and see.
 */
export function BlockModal({
  name,
  visible,
  onClose,
  onConfirm,
}: {
  // whose posts get hidden, shown in both steps so nobody blocks the wrong person
  name: string;
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const [blocked, setBlocked] = useState(false);
  const [mounted, setMounted] = useState(visible);
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setMounted(true);
      anim.setValue(0);
      Animated.spring(anim, { toValue: 1, useNativeDriver: true, friction: 9, tension: 72 }).start();
    } else if (mounted) {
      Animated.timing(anim, {
        toValue: 0,
        duration: 200,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }).start(() => {
        setMounted(false);
        setBlocked(false);
      });
    }
  }, [visible]);

  if (!mounted) return null;

  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [360, 0] });

  return (
    <View style={[StyleSheet.absoluteFill, styles.overlay]}>
      <Animated.View style={[StyleSheet.absoluteFill, styles.backdrop, { opacity: anim }]} />
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      <Animated.View style={[styles.sheet, { transform: [{ translateY }] }]}>
        {!blocked ? (
          <>
            <Text style={styles.emoji}>🚫</Text>
            <Text style={styles.title}>Block {name}?</Text>
            <Text style={styles.sub}>You won't see their posts, and our team will be notified.</Text>
            <Pressable
              style={styles.confirmBtn}
              onPress={() => {
                onConfirm();
                setBlocked(true);
              }}
              accessibilityRole="button"
              accessibilityLabel={`Block ${name}`}
            >
              <Text style={styles.confirmTxt}>Block</Text>
            </Pressable>
            <Pressable style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelTxt}>Cancel</Text>
            </Pressable>
          </>
        ) : (
          <>
            <Text style={styles.emoji}>✅</Text>
            <Text style={styles.title}>Blocked</Text>
            <Text style={styles.sub}>You won't see posts from {name} anymore.</Text>
            <Pressable style={styles.doneBtn} onPress={onClose} accessibilityRole="button">
              <Text style={styles.doneTxt}>Done</Text>
            </Pressable>
          </>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { justifyContent: 'flex-end', paddingHorizontal: 12, paddingBottom: 12, zIndex: 30 },
  backdrop: { backgroundColor: 'rgba(44,26,14,0.4)' },
  sheet: {
    backgroundColor: colors.white,
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 20 },
    elevation: 16,
  },
  emoji: { fontSize: 34 },
  title: { fontFamily: font.heading, fontSize: 18, color: colors.textDark, marginTop: 8 },
  sub: {
    fontFamily: font.regular,
    fontSize: 13.5,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 19,
    marginTop: 6,
    marginBottom: 16,
  },
  confirmBtn: {
    alignSelf: 'stretch',
    borderWidth: 1,
    borderColor: '#f3d2d2',
    borderRadius: 24,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  confirmTxt: { fontFamily: font.bold, fontSize: 15, color: '#d64545' },
  cancelBtn: {
    alignSelf: 'stretch',
    backgroundColor: colors.pillInactive,
    borderRadius: 24,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  cancelTxt: { fontFamily: font.bold, fontSize: 15, color: colors.textDark2 },
  doneBtn: {
    alignSelf: 'stretch',
    backgroundColor: colors.brandSolid,
    borderRadius: 24,
    paddingVertical: 12,
    alignItems: 'center',
  },
  doneTxt: { fontFamily: font.bold, fontSize: 15, color: colors.white },
});
