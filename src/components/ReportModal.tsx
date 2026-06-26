import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, font } from '../theme';

const REASONS = ["It's inappropriate", "It's spam", 'Something else'];

export function ReportModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const [step, setStep] = useState<0 | 1>(0);
  const [choice, setChoice] = useState(0);

  const close = () => {
    onClose();
    // reset for next open
    setTimeout(() => {
      setStep(0);
      setChoice(0);
    }, 200);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={close}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={close} />
        <View style={styles.sheet}>
          {step === 0 ? (
            <>
              <View style={styles.header}>
                <Text style={styles.title}>Report a post</Text>
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
                  <Text style={styles.primaryTxt}>Continue</Text>
                </Pressable>
                <Pressable style={styles.secondaryBtn} onPress={close}>
                  <Text style={styles.secondaryTxt}>Cancel</Text>
                </Pressable>
              </View>
            </>
          ) : (
            <>
              <View style={styles.header}>
                <Text style={styles.title}>Report a post</Text>
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
                <Pressable style={styles.secondaryBtn} onPress={close}>
                  <Text style={styles.secondaryTxt}>Contact Us</Text>
                </Pressable>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 64,
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
  header: { paddingTop: 20, paddingHorizontal: 16, paddingBottom: 20 },
  title: { fontFamily: font.semibold, fontSize: 16, color: colors.ink900 },
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
