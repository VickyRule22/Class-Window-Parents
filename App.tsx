import React, { useState } from 'react';
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
import { BottomNav, TabKey } from './src/components/BottomNav';
import { ReportModal } from './src/components/ReportModal';
import { FeedScreen } from './src/screens/FeedScreen';
import { ClassesScreen } from './src/screens/ClassesScreen';
import { WishlistsScreen } from './src/screens/WishlistsScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { colors } from './src/theme';

export default function App() {
  const [tab, setTab] = useState<TabKey>('feed');
  const [reportOpen, setReportOpen] = useState(false);

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
        <View style={styles.phone}>
          <AppHeader />
          <View style={styles.screen}>
            {tab === 'feed' && <FeedScreen onReport={() => setReportOpen(true)} />}
            {tab === 'classes' && <ClassesScreen />}
            {tab === 'wishlists' && <WishlistsScreen />}
            {tab === 'profile' && <ProfileScreen />}
          </View>
          <BottomNav active={tab} onChange={setTab} />
        </View>
        <ReportModal visible={reportOpen} onClose={() => setReportOpen(false)} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  phone: {
    flex: 1,
    backgroundColor: colors.appBg,
    width: '100%',
    maxWidth: 430,
    alignSelf: 'center',
  },
  screen: { flex: 1 },
});
