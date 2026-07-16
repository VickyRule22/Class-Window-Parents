import React, { useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import {
  Nunito_700Bold,
  Nunito_800ExtraBold,
} from '@expo-google-fonts/nunito';
import {
  NunitoSans_400Regular,
  NunitoSans_500Medium,
  NunitoSans_600SemiBold,
  NunitoSans_700Bold,
  NunitoSans_800ExtraBold,
} from '@expo-google-fonts/nunito-sans';

import { AppHeader } from './src/components/AppHeader';
import { DeviceFrame } from './src/components/DeviceFrame';
import { BottomNav, TabKey } from './src/components/BottomNav';
import { PrototypeNav, NavLocation } from './src/components/PrototypeNav';
import { Role } from './src/components/RoleSwitcher';
import { ScreenTransition } from './src/components/ScreenTransition';
import { ReportModal } from './src/components/ReportModal';
import { OnboardingFlow } from './src/onboarding/OnboardingFlow';
import { FeedScreen } from './src/screens/FeedScreen';
import { ClassesScreen } from './src/screens/ClassesScreen';
import { WishlistsScreen } from './src/screens/WishlistsScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { colors } from './src/theme';

const TAB_ORDER: TabKey[] = ['feed', 'classes', 'wishlists', 'profile'];

export default function App() {
  // The sign-up flow plays first; "Continue to Class Window" drops into the app.
  const [onboarded, setOnboarded] = useState(false);
  const [tab, setTab] = useState<TabKey>('feed');
  const [direction, setDirection] = useState(1);
  const [reportOpen, setReportOpen] = useState(false);
  const [feedFilter, setFeedFilter] = useState('all');
  const [role, setRole] = useState<Role>('parent');

  const changeTab = (next: TabKey) => {
    if (next === tab) return;
    setDirection(TAB_ORDER.indexOf(next) > TAB_ORDER.indexOf(tab) ? 1 : -1);
    setTab(next);
  };

  // tapping a class card jumps to the feed, filtered to that class
  const openClass = (key: string) => {
    setFeedFilter(key);
    changeTab('feed');
  };

  // sign out returns to the sign-in flow and resets app state for next login
  const signOut = () => {
    setOnboarded(false);
    setTab('feed');
    setFeedFilter('all');
    setReportOpen(false);
    setRole('parent');
  };

  // prototype nav: jump anywhere, any time (user control and freedom)
  const jumpTo = (dest: NavLocation) => {
    if (dest === 'signup') {
      setOnboarded(false);
      setTab('feed');
      setReportOpen(false);
      return;
    }
    if (!onboarded) {
      setOnboarded(true);
      setTab(dest);
      return;
    }
    changeTab(dest);
  };

  // switching persona from the bar also drops you into the app if you're
  // still on onboarding, so the switch is always one tap
  const switchRole = (r: Role) => {
    setRole(r);
    if (!onboarded) setOnboarded(true);
  };

  const [fontsLoaded] = useFonts({
    'Nunito-Bold': Nunito_700Bold,
    'Nunito-ExtraBold': Nunito_800ExtraBold,
    'NunitoSans-Regular': NunitoSans_400Regular,
    'NunitoSans-Medium': NunitoSans_500Medium,
    'NunitoSans-SemiBold': NunitoSans_600SemiBold,
    'NunitoSans-Bold': NunitoSans_700Bold,
    'NunitoSans-ExtraBold': NunitoSans_800ExtraBold,
  });

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: colors.appBg }} />;
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <StatusBar style="dark" />
        <DeviceFrame>
          <PrototypeNav
            location={!onboarded ? 'signup' : tab}
            role={role}
            onJump={jumpTo}
            onRole={switchRole}
          />
          {!onboarded ? (
            <OnboardingFlow onDone={() => setOnboarded(true)} />
          ) : (
            <>
              <AppHeader role={role} onRolePress={() => changeTab('profile')} />
              <View style={styles.screen}>
                <ScreenTransition transitionKey={tab} direction={direction}>
                  {tab === 'feed' && (
                    <FeedScreen
                      onReport={() => setReportOpen(true)}
                      filter={feedFilter}
                      onFilterChange={setFeedFilter}
                    />
                  )}
                  {tab === 'classes' && <ClassesScreen onOpenClass={openClass} />}
                  {tab === 'wishlists' && <WishlistsScreen />}
                  {tab === 'profile' && (
                    <ProfileScreen
                      onSignOut={signOut}
                      role={role}
                      onRoleChange={setRole}
                      onOpenClass={openClass}
                      onReportPost={() => setReportOpen(true)}
                    />
                  )}
                </ScreenTransition>
              </View>
              <BottomNav active={tab} onChange={changeTab} />
              {/* report sheet lives inside the device frame so it stays contained */}
              <ReportModal visible={reportOpen} onClose={() => setReportOpen(false)} />
            </>
          )}
        </DeviceFrame>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  screen: { flex: 1 },
});
