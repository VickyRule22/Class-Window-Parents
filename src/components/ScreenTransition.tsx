import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, AccessibilityInfo, StyleSheet } from 'react-native';

/**
 * Page transition that keeps the outgoing screen on stage while the incoming
 * one arrives, so a swap is a dissolve rather than a cut followed by a slide.
 *
 * Two variants, because the two places we transition are different problems:
 *
 * - "push" (tabs): you are going somewhere else, and the direction carries
 *   that. The screen travels.
 *
 * - "swap" (sign-up steps): you are staying put and the form is changing under
 *   you. Sign-up and log in draw the same coral hero, the same logomark and the
 *   same cream card, so travelling the whole screen moves a mass of pixels that
 *   did not actually change, and the eye follows that instead of the heading
 *   and fields that did. Cross-dissolving in place makes the identical chrome
 *   land on itself and read as stationary, which leaves the changed content as
 *   the only thing visibly moving. A short lift on the incoming copy points at
 *   it without dragging the frame along.
 *
 * Respects the OS "reduce motion" setting (instant swap, no animation).
 */

// Decelerate curve: quick to leave, long to settle, and critically no overshoot.
// The old ease-out-back sailed past its mark and sprang back, which is what read
// as a jerk once the outgoing screen was also disappearing in one frame.
const EASE = Easing.bezier(0.2, 0, 0, 1);

export function ScreenTransition({
  transitionKey,
  direction,
  variant = 'push',
  children,
}: {
  transitionKey: string;
  direction: number; // 1 = forward, -1 = back
  variant?: 'push' | 'swap';
  children: React.ReactNode;
}) {
  const anim = useRef(new Animated.Value(1)).current;
  const [reduceMotion, setReduceMotion] = useState(false);
  // the screen we are leaving, held on stage until the dissolve finishes
  const [outgoing, setOutgoing] = useState<React.ReactNode>(null);
  const lastChildren = useRef<React.ReactNode>(children);
  const lastKey = useRef(transitionKey);

  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled().then((v) => mounted && setReduceMotion(v));
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => {
      mounted = false;
      // @ts-expect-error older RN returns a function, newer a subscription
      sub?.remove ? sub.remove() : sub?.();
    };
  }, []);

  // Runs before the ref-sync effect below, so lastChildren still holds the
  // screen we are leaving at the moment the key changes.
  useEffect(() => {
    if (lastKey.current === transitionKey) return;
    const leaving = lastChildren.current;
    lastKey.current = transitionKey;

    if (reduceMotion) {
      anim.setValue(1);
      setOutgoing(null);
      return;
    }

    setOutgoing(leaving);
    anim.setValue(0);
    Animated.timing(anim, {
      toValue: 1,
      duration: variant === 'swap' ? 260 : 300,
      easing: EASE,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) setOutgoing(null);
    });
  }, [transitionKey, reduceMotion, variant]);

  useEffect(() => {
    lastChildren.current = children;
  });

  const swap = variant === 'swap';

  // Incoming. In "swap" it only lifts, so the shared chrome never travels.
  const inOpacity = anim.interpolate({
    inputRange: [0, swap ? 0.6 : 0.5, 1],
    outputRange: [0, swap ? 0.9 : 0.75, 1],
    extrapolate: 'clamp',
  });
  const inTranslateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [swap ? 0 : direction * 32, 0],
  });
  const inTranslateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [swap ? 8 : 0, 0],
  });
  const inScale = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [swap ? 1 : 0.975, 1],
  });

  // Outgoing. Fades out ahead of the incoming screen arriving, so the two never
  // both sit at full strength and smear into each other.
  const outOpacity = anim.interpolate({
    inputRange: [0, swap ? 0.5 : 0.4, 1],
    outputRange: [1, 0, 0],
    extrapolate: 'clamp',
  });
  const outTranslateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, swap ? 0 : direction * -24],
  });

  return (
    <Animated.View style={styles.fill}>
      {outgoing !== null && (
        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            { opacity: outOpacity, transform: [{ translateX: outTranslateX }] },
          ]}
        >
          {outgoing}
        </Animated.View>
      )}
      <Animated.View
        style={[
          styles.fill,
          {
            opacity: inOpacity,
            transform: [
              { translateX: inTranslateX },
              { translateY: inTranslateY },
              { scale: inScale },
            ],
          },
        ]}
      >
        {children}
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({ fill: { flex: 1 } });
