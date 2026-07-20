import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

// Thin wrappers so callers can fire feedback freely without guarding. These
// no-op on web (where the prototype is reviewed); on a device they're the
// light buzz that makes a tap feel physical.
export function tapHaptic() {
  if (Platform.OS === 'web') return;
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
}

export function bumpHaptic() {
  if (Platform.OS === 'web') return;
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
}

export function successHaptic() {
  if (Platform.OS === 'web') return;
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
}
