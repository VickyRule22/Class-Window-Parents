import React, { useState } from 'react';
import { View, Text, TextInput, Image, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, font, shadowSoft } from '../theme';
import { noOutline } from '../onboarding/ui';
import type { PickedPhoto } from './PhotoPickerSheet';

// Caption + share. The photo is already chosen; one field, one button, and a
// classroom picker when the teacher runs more than one room.
export function ComposeScreen({
  photo,
  classrooms,
  onBack,
  onShare,
}: {
  photo: PickedPhoto;
  classrooms: string[];
  onBack: () => void;
  onShare: (caption: string, classroom: string) => void;
}) {
  const [caption, setCaption] = useState('');
  const [target, setTarget] = useState(classrooms[0]);

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
        <Text style={styles.meta}>{target}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={[styles.photoWrap, { backgroundColor: photo.tint }]}>
          <Image source={photo.image} style={styles.photo} resizeMode="cover" />
          <Pressable style={styles.swap} onPress={onBack}>
            <Ionicons name="swap-horizontal" size={14} color={colors.white} />
            <Text style={styles.swapTxt}>Change</Text>
          </Pressable>
        </View>

        {classrooms.length > 1 && (
          <View style={styles.card}>
            <Text style={styles.label}>POST TO</Text>
            <View style={styles.targetRow}>
              {classrooms.map((c) => {
                const on = c === target;
                return (
                  <Pressable
                    key={c}
                    onPress={() => setTarget(c)}
                    style={[styles.targetChip, on && styles.targetChipOn]}
                  >
                    <Text style={[styles.targetTxt, on && styles.targetTxtOn]}>{c}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

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

        <Pressable style={styles.share} onPress={() => onShare(caption.trim(), target)}>
          <Ionicons name="paper-plane" size={18} color={colors.white} />
          <Text style={styles.shareTxt}>Share to the feed</Text>
        </Pressable>
        <Text style={styles.foot}>Goes to every family in {target}.</Text>
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
  targetRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  targetChip: {
    backgroundColor: colors.pillInactive,
    borderRadius: 999,
    paddingHorizontal: 13,
    paddingVertical: 8,
  },
  targetChipOn: {
    backgroundColor: colors.brandSolid,
    shadowColor: colors.primary,
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  targetTxt: { fontFamily: font.bold, fontSize: 13, color: colors.textDark2 },
  targetTxtOn: { color: colors.white },
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
