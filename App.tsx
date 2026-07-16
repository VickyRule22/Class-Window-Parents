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
import { CreateClassroomScreen } from './src/teacher/CreateClassroomScreen';
import { TeacherFeedScreen } from './src/teacher/TeacherFeedScreen';
import { PhotoPickerSheet, PickedPhoto } from './src/teacher/PhotoPickerSheet';
import { ComposeScreen } from './src/teacher/ComposeScreen';
import { colors, avatarGradients } from './src/theme';
import type { Post } from './src/data';

const TAB_ORDER: TabKey[] = ['feed', 'classes', 'wishlists', 'profile'];

export default function App() {
  // The sign-up flow plays first; "Continue to Class Window" drops into the app.
  const [onboarded, setOnboarded] = useState(false);
  const [tab, setTab] = useState<TabKey>('feed');
  const [direction, setDirection] = useState(1);
  const [reportOpen, setReportOpen] = useState(false);
  const [feedFilter, setFeedFilter] = useState('all');
  const [role, setRole] = useState<Role>('parent');

  // teacher first-run: create a classroom, then get nudged into a first post
  const [classroomName, setClassroomName] = useState<string | null>(null);
  const [teacherPosts, setTeacherPosts] = useState<Post[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [composePhoto, setComposePhoto] = useState<PickedPhoto | null>(null);
  const [justPosted, setJustPosted] = useState(false);

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
    setClassroomName(null);
    setTeacherPosts([]);
    setPickerOpen(false);
    setComposePhoto(null);
    setJustPosted(false);
  };

  // teacher picked a photo and wrote a caption: it lands on the feed
  const sharePost = (caption: string) => {
    if (!composePhoto || !classroomName) return;
    const post: Post = {
      id: `t${Date.now()}`,
      initials: 'SC',
      gradient: avatarGradients.peach,
      name: 'Ms. Sarah Chen',
      meta: classroomName,
      time: 'Just now',
      imageColor: composePhoto.tint,
      image: composePhoto.image,
      caption: caption || 'Our classroom today 🧡',
      likes: 0,
      liked: false,
    };
    setTeacherPosts((p) => [post, ...p]);
    setComposePhoto(null);
    setJustPosted(true);
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
        {/* reviewer chrome: lives on the viewport, above the phone mockup,
            because it's a prototype control, not part of the app */}
        <PrototypeNav
          location={!onboarded ? 'signup' : tab}
          role={role}
          onJump={jumpTo}
          onRole={switchRole}
        />
        <DeviceFrame>
          {!onboarded ? (
            <OnboardingFlow onDone={() => setOnboarded(true)} />
          ) : role === 'teacher' && !classroomName ? (
            // teacher first-run: verified email, straight into naming the classroom
            <>
              <AppHeader role={role} onRolePress={() => {}} />
              <View style={styles.screen}>
                <CreateClassroomScreen onCreate={setClassroomName} />
              </View>
            </>
          ) : composePhoto && classroomName ? (
            // focused caption + share step, no tab bar to wander off to
            <>
              <AppHeader role={role} onRolePress={() => {}} />
              <View style={styles.screen}>
                <ComposeScreen
                  photo={composePhoto}
                  classroomName={classroomName}
                  onBack={() => {
                    setComposePhoto(null);
                    setPickerOpen(true);
                  }}
                  onShare={sharePost}
                />
              </View>
            </>
          ) : (
            <>
              <AppHeader role={role} onRolePress={() => changeTab('profile')} />
              <View style={styles.screen}>
                <ScreenTransition transitionKey={`${tab}-${role}`} direction={direction}>
                  {tab === 'feed' && role === 'teacher' && classroomName ? (
                    <TeacherFeedScreen
                      classroomName={classroomName}
                      posts={teacherPosts}
                      justPosted={justPosted}
                      onNewPost={() => setPickerOpen(true)}
                      onReport={() => setReportOpen(true)}
                    />
                  ) : (
                    tab === 'feed' && (
                      <FeedScreen
                        onReport={() => setReportOpen(true)}
                        filter={feedFilter}
                        onFilterChange={setFeedFilter}
                      />
                    )
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
              {/* teacher photo picker springs up over the feed */}
              <PhotoPickerSheet
                visible={pickerOpen}
                onClose={() => setPickerOpen(false)}
                onPick={(photo) => {
                  setPickerOpen(false);
                  setComposePhoto(photo);
                }}
              />
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
