import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, AccessibilityInfo, StyleSheet } from 'react-native';

/**
 * Directional page transition for tab content. The header and tab bar stay
 * anchored; only the screen body moves. Switching forward through the tabs
 * pushes the new screen in from the right, switching back pushes from the left,
 * with a soft fade and a hair of scale so it settles rather than snaps.
 *
 * Respects the OS "reduce motion" setting (renders an instant cross-fade-free swap).
 */
export function ScreenTransition({
  transitionKey,
  direction,
  children,
}: {
  transitionKey: string;
  direction: number; // 1 = forward, -1 = back
  children: React.ReactNode;
}) {
  const anim = useRef(new Animated.Value(1)).current;
  const [reduceMotion, setReduceMotion] = useState(false);
  const first = useRef(true);

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

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return; // no entrance animation on initial mount
    }
    if (reduceMotion) {
      anim.setValue(1);
      return;
    }
    anim.setValue(0);
    Animated.timing(anim, {
      toValue: 1,
      duration: 380,
      // ease-out with a touch of overshoot so the screen arrives and settles
      easing: Easing.out(Easing.back(1.7)),
      useNativeDriver: true,
    }).start();
  }, [transitionKey, reduceMotion]);

  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [direction * 32, 0],
  });
  const opacity = anim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0.75, 1],
    extrapolate: 'clamp',
  });
  const scale = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.975, 1],
  });

  return (
    <Animated.View style={[styles.fill, { opacity, transform: [{ translateX }, { scale }] }]}>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({ fill: { flex: 1 } });
