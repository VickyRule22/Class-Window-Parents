import React, { useState } from 'react';
import { View, Text, TextInput, Image, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, font, shadowSoft } from '../theme';
import { noOutline } from '../onboarding/ui';
import type { PickedPhoto } from './PhotoPickerSheet';

// Caption + share. The photo is already chosen; one field, one button.
export function ComposeScreen({
  photo,
  classroomName,
  onBack,
  onShare,
}: {
  photo: PickedPhoto;
  classroomName: string;
  onBack: () => void;
  onShare: (caption: string) => void;
}) {
  const [caption, setCaption] = useState('');

  return (
    <View style={{ flex: 1, backgroundColor: colors.appBg }}>
      <View style={styles.head}>
        <Pressable
          hitSlop={8}
          onPress={onBack}
          style={styles.back}
          accessibilityRole="button"
          accessibilityLabel="Back"
        >
          <Ionicons name="chevron-back" size={20} color={colors.primaryDeep} />
        </Pressable>
        <Text style={styles.title}>New post</Text>
        <Text style={styles.meta}>{classroomName}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={[styles.photoWrap, { backgroundColor: photo.tint }]}>
          <Image source={photo.image} style={styles.photo} resizeMode="cover" />
          <Pressable style={styles.swap} onPress={onBack}>
            <Ionicons name="swap-horizontal" size={14} color={colors.white} />
            <Text style={styles.swapTxt}>Change</Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>CAPTION</Text>
          <TextInput
            value={caption}
            onChangeText={setCaption}
            placeholder="Tell families about this moment… what were the kids up to?"
            placeholderTextColor={colors.textMuted3}
            multiline
            numberOfLines={4}
            style={[styles.input, noOutline]}
          />
        </View>

        <Pressable style={styles.share} onPress={() => onShare(caption.trim())}>
          <Ionicons name="paper-plane" size={18} color={colors.white} />
          <Text style={styles.shareTxt}>Share to the feed</Text>
        </Pressable>
        <Text style={styles.foot}>Goes to every family in {classroomName}.</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  back: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: colors.pillInactive,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontFamily: font.heading, fontSize: 19, color: colors.textDark, flex: 1 },
  meta: { fontFamily: font.bold, fontSize: 12, color: colors.textMuted },

  body: { paddingHorizontal: 16, paddingBottom: 32, gap: 14 },
  photoWrap: { borderRadius: 18, overflow: 'hidden', aspectRatio: 4 / 3 },
  photo: { width: '100%', height: '100%' },
  swap: {
    position: 'absolute',
    right: 10,
    top: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(44,26,14,0.55)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  swapTxt: { fontFamily: font.bold, fontSize: 11.5, color: colors.white },

  card: { backgroundColor: colors.white, borderRadius: 16, padding: 14, ...shadowSoft },
  label: {
    fontFamily: font.headingBold,
    fontSize: 11,
    letterSpacing: 0.5,
    color: colors.textMuted,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1.5,
    borderColor: colors.divider,
    borderRadius: 12,
    padding: 12,
    minHeight: 92,
    textAlignVertical: 'top',
    fontFamily: font.semibold,
    fontSize: 14.5,
    color: colors.textDark,
  },
  share: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    backgroundColor: colors.brandSolid,
    borderRadius: 26,
    paddingVertical: 15,
  },
  shareTxt: { fontFamily: font.heading, fontSize: 16, color: colors.white },
  foot: { fontFamily: font.regular, fontSize: 12, color: colors.textMuted, textAlign: 'center' },
});
