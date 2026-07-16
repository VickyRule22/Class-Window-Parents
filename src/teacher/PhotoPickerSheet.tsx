import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  Animated,
  Easing,
  StyleSheet,
  ImageSourcePropType,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, font } from '../theme';

export type PickedPhoto = { image: ImageSourcePropType; tint: string };

// Prototype photo picker: springs up like the report sheet with a camera tile
// plus a small library grid, standing in for the OS picker.
const LIBRARY: PickedPhoto[] = [
  { image: require('../../assets/figma/posts/science.png'), tint: colors.postPeach },
  { image: require('../../assets/figma/posts/fieldday.png'), tint: colors.postGreen },
  { image: require('../../assets/figma/posts/sunflowers.png'), tint: colors.postBlue },
];

export function PhotoPickerSheet({
  visible,
  onClose,
  onPick,
}: {
  visible: boolean;
  onClose: () => void;
  onPick: (photo: PickedPhoto) => void;
}) {
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
      }).start(() => setMounted(false));
    }
  }, [visible]);

  if (!mounted) return null;

  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [420, 0] });

  return (
    <View style={[StyleSheet.absoluteFill, styles.overlay]}>
      <Animated.View style={[StyleSheet.absoluteFill, styles.backdrop, { opacity: anim }]} />
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      <Animated.View style={[styles.sheet, { transform: [{ translateY }] }]}>
        <View style={styles.header}>
          <Text style={styles.title}>Add a photo</Text>
          <Pressable hitSlop={8} onPress={onClose} style={styles.close}>
            <Ionicons name="close" size={20} color={colors.ink600} />
          </Pressable>
        </View>

        <View style={styles.grid}>
          {/* live photo: in the real app this opens the camera */}
          <Pressable style={styles.cameraTile} onPress={() => onPick(LIBRARY[0])}>
            <Ionicons name="camera" size={26} color={colors.primaryDeep} />
            <Text style={styles.cameraTxt}>Take a{'\n'}photo</Text>
          </Pressable>
          {LIBRARY.map((p, i) => (
            <Pressable key={i} style={styles.tile} onPress={() => onPick(p)}>
              <Image source={p.image} style={styles.tileImg} resizeMode="cover" />
            </Pressable>
          ))}
        </View>
        <Text style={styles.foot}>Photos stay inside Class Window, only your families see them.</Text>
      </Animated.View>
    </View>
  );
}

const TILE = 76;

const styles = StyleSheet.create({
  overlay: { justifyContent: 'flex-end', paddingHorizontal: 12, paddingBottom: 12, zIndex: 30 },
  backdrop: { backgroundColor: 'rgba(44,26,14,0.4)' },
  sheet: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 20 },
    elevation: 16,
  },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  title: { fontFamily: font.heading, fontSize: 17, color: colors.textDark, flex: 1 },
  close: { padding: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  cameraTile: {
    width: TILE,
    height: TILE,
    borderRadius: 14,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.cardBorderPeach,
    backgroundColor: colors.settingsIconBg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  cameraTxt: {
    fontFamily: font.bold,
    fontSize: 10.5,
    color: colors.primaryDeep,
    textAlign: 'center',
    lineHeight: 13,
  },
  tile: { width: TILE, height: TILE, borderRadius: 14, overflow: 'hidden' },
  tileImg: { width: '100%', height: '100%' },
  foot: { fontFamily: font.regular, fontSize: 11.5, color: colors.textMuted, marginTop: 14 },
});
