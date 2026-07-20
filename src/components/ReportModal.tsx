import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, Animated, Easing, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, font } from '../theme';

// The categories Apple expects a UGC app to offer, kept word for word from the
// App Store safety flows so review sees the same list twice. Harassment and
// safety are their own reasons on purpose: folding them into "inappropriate"
// loses the signal that decides how fast a report gets looked at.
const REASONS = [
  'Inappropriate content',
  'Harassment or bullying',
  'Spam',
  'Safety concern',
  'Something else',
];

export function ReportModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const [step, setStep] = useState<0 | 1>(0);
  const [choice, setChoice] = useState(0);
  const [mounted, setMounted] = useState(visible);
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setMounted(true);
      anim.setValue(0);
      // spring the sheet up from the bottom with a soft settle
      Animated.spring(anim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 9,
        tension: 72,
      }).start();
    } else if (mounted) {
      Animated.timing(anim, {
        toValue: 0,
        duration: 200,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }).start(() => {
        setMounted(false);
        setStep(0);
        setChoice(0);
      });
    }
  }, [visible]);

  const close = () => onClose();

  const sheetTranslate = anim.interpolate({ inputRange: [0, 1], outputRange: [440, 0] });
  const backdropOpacity = anim.interpolate({ inputRange: [0, 1], outputRange: [0, 1], extrapolate: 'clamp' });

  if (!mounted) return null;

  return (
    <View style={[StyleSheet.absoluteFill, styles.overlay]}>
      <Animated.View
        style={[StyleSheet.absoluteFill, styles.backdrop, { opacity: backdropOpacity }]}
      />
      <Pressable style={StyleSheet.absoluteFill} onPress={close} />
      <Animated.View style={[styles.sheet, { transform: [{ translateY: sheetTranslate }] }]}>
          {step === 0 ? (
            <>
              <View style={styles.header}>
                <Text style={styles.title}>Report a post</Text>
                <Text style={styles.sub}>
                  Tell us what's wrong. Our team reviews reports within 24 hours.
                </Text>
                <Pressable hitSlop={8} onPress={close} style={styles.close}>
                  <Ionicons name="close" size={20} color={colors.ink600} />
                </Pressable>
              </View>

              <View style={styles.options}>
                {REASONS.map((r, i) => {
                  const selected = i === choice;
                  return (
                    <Pressable
                      key={r}
                      onPress={() => setChoice(i)}
                      style={[styles.option, selected ? styles.optionOn : styles.optionOff]}
                    >
                      <View style={[styles.radio, selected ? styles.radioOn : styles.radioOff]}>
                        {selected && <View style={styles.radioDot} />}
                      </View>
                      <Text style={styles.optionTxt}>{r}</Text>
                    </Pressable>
                  );
                })}
              </View>

              <View style={styles.actions}>
                <Pressable style={styles.primaryBtn} onPress={() => setStep(1)}>
                  <Text style={styles.primaryTxt}>Submit report</Text>
                </Pressable>
                <Pressable style={styles.secondaryBtn} onPress={close}>
                  <Text style={styles.secondaryTxt}>Cancel</Text>
                </Pressable>
              </View>
            </>
          ) : (
            <>
              <View style={styles.header}>
                <Text style={styles.title}>Report received</Text>
                <Pressable hitSlop={8} onPress={close} style={styles.close}>
                  <Ionicons name="close" size={20} color={colors.ink600} />
                </Pressable>
              </View>

              <View style={styles.confirmBody}>
                <View style={styles.confirmIcon}>
                  <Ionicons name="checkmark" size={26} color={colors.primary} />
                </View>
                <Text style={styles.confirmTxt}>
                  Thank you for reporting this post. We'll review it to ensure it meets our
                  community standards.
                </Text>
              </View>

              <View style={styles.actions}>
                <Pressable style={styles.primaryBtn} onPress={close}>
                  <Text style={styles.primaryTxt}>Done</Text>
                </Pressable>
              </View>
            </>
          )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 64,
  },
  backdrop: {
    backgroundColor: 'rgba(10,10,10,0.7)',
  },
  sheet: {
    backgroundColor: colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 20 },
    elevation: 16,
  },
  header: { paddingTop: 20, paddingHorizontal: 16, paddingBottom: 20, gap: 6 },
  title: { fontFamily: font.semibold, fontSize: 16, color: colors.ink900 },
  sub: {
    fontFamily: font.regular,
    fontSize: 13,
    color: colors.ink600,
    lineHeight: 18,
    paddingRight: 24,
  },
  close: { position: 'absolute', right: 12, top: 12, padding: 8 },

  options: { paddingHorizontal: 16, gap: 12 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 12,
    padding: 16,
    backgroundColor: colors.white,
  },
  optionOn: { borderWidth: 2, borderColor: colors.brandSolid },
  optionOff: { borderWidth: 1, borderColor: colors.borderSecondary },
  optionTxt: { fontFamily: font.medium, fontSize: 14, color: colors.ink700 },
  radio: { width: 16, height: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  radioOn: { backgroundColor: colors.brandSolid },
  radioOff: { borderWidth: 1, borderColor: colors.borderPrimary },
  radioDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.white },

  confirmBody: { paddingHorizontal: 16, alignItems: 'center', gap: 16, paddingTop: 4 },
  confirmIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.caughtUpIconBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmTxt: {
    fontFamily: font.regular,
    fontSize: 14,
    color: colors.ink600,
    textAlign: 'center',
    lineHeight: 20,
  },

  actions: { paddingHorizontal: 16, paddingTop: 24, paddingBottom: 16, gap: 12 },
  primaryBtn: {
    backgroundColor: colors.brandSolid,
    borderRadius: 24,
    paddingVertical: 11,
    alignItems: 'center',
  },
  primaryTxt: { fontFamily: font.semibold, fontSize: 14, color: colors.white },
  secondaryBtn: {
    borderWidth: 1,
    borderColor: colors.borderPrimary,
    borderRadius: 24,
    paddingVertical: 11,
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  secondaryTxt: { fontFamily: font.semibold, fontSize: 14, color: colors.ink700 },
});
