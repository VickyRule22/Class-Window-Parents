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
import { PrototypeNav, NavLocation, Persona } from './src/components/PrototypeNav';
import { Role } from './src/components/RoleSwitcher';
import { ScreenTransition } from './src/components/ScreenTransition';
import { ReportModal } from './src/components/ReportModal';
import { OnboardingFlow } from './src/onboarding/OnboardingFlow';
import { FeedScreen } from './src/screens/FeedScreen';
import { ParentJoinScreen } from './src/screens/ParentJoinScreen';
import { ClassesScreen } from './src/screens/ClassesScreen';
import { WishlistsScreen } from './src/screens/WishlistsScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { CreateClassroomScreen } from './src/teacher/CreateClassroomScreen';
import { TeacherFeedScreen } from './src/teacher/TeacherFeedScreen';
import { PhotoPickerSheet, PickedPhoto } from './src/teacher/PhotoPickerSheet';
import { ComposeScreen } from './src/teacher/ComposeScreen';
import { colors, avatarGradients } from './src/theme';
import type { Post } from './src/data';

export type Classroom = { name: string; code: string };

// Join codes are three random words: harder to guess than 6 characters and
// easier to type. Forwarding is handled socially (teacher approves every join,
// and can rotate the code), not by making the code cryptic.
const CODE_WORDS = [
  'maple', 'otter', 'sunny', 'river', 'tiger', 'lemon',
  'cloud', 'panda', 'berry', 'frost', 'wagon', 'daisy',
];
const makeCode = () =>
  Array.from({ length: 3 }, () => CODE_WORDS[Math.floor(Math.random() * CODE_WORDS.length)]).join('-');

const TAB_ORDER: TabKey[] = ['feed', 'classes', 'wishlists', 'profile'];

// A ready-made classroom + a couple of posts, so the "verified teacher" persona
// pill lands straight on a populated teacher feed instead of the first-run.
const SEED_CLASSROOM = "Ms. Chen's 2nd Grade Science";
const seedTeacherPosts = (): Post[] => [
  {
    id: 'seed-1',
    initials: 'SC',
    gradient: avatarGradients.peach,
    name: 'Ms. Sarah Chen',
    meta: SEED_CLASSROOM,
    time: '2h ago',
    imageColor: colors.postGreen,
    image: require('./assets/figma/posts/fieldday.png'),
    caption:
      'Field day was a blast! Relay races, parachute games, and so much teamwork today. 🏃',
    likes: 12,
    liked: false,
  },
  {
    id: 'seed-2',
    initials: 'SC',
    gradient: avatarGradients.peach,
    name: 'Ms. Sarah Chen',
    meta: SEED_CLASSROOM,
    time: 'Yesterday',
    imageColor: colors.postPeach,
    image: require('./assets/figma/posts/science.png'),
    caption:
      'Our seedlings are reaching for the light. Every scientist made a prediction, and almost all were right! 🔬',
    likes: 15,
    liked: true,
  },
];

export default function App() {
  // The sign-up flow plays first; "Continue to Class Window" drops into the app.
  const [onboarded, setOnboarded] = useState(false);
  const [tab, setTab] = useState<TabKey>('feed');
  const [direction, setDirection] = useState(1);
  const [reportOpen, setReportOpen] = useState(false);
  const [feedFilter, setFeedFilter] = useState('all');
  // active view + which roles this account has actually earned. Roles come
  // from how you got in (parent code vs classroom setup), never a free toggle;
  // the in-app switcher only appears once an account holds both.
  const [role, setRole] = useState<Role>('parent');
  const [hasParentRole, setHasParentRole] = useState(false);
  const [hasTeacherRole, setHasTeacherRole] = useState(false);
  const dualRole = hasParentRole && hasTeacherRole;
  // which prototype-nav persona pill is active (highlights the pill; null on the
  // sign-up screen). The pill also seeds the matching starting state.
  const [persona, setPersona] = useState<Persona | null>(null);
  // a fresh parent has no classroom yet: their feed is the join step
  // (enter the teacher's code or scan the QR from the welcome note)
  const [parentJoined, setParentJoined] = useState(false);
  // simulated admin action: this parent was added as a teacher at school,
  // so their feed shows a create-your-classroom banner until they do (or dismiss)
  const [inviteDismissed, setInviteDismissed] = useState(false);

  // teacher first-run: create a classroom, then get nudged into a first post.
  // Teachers can run several classrooms; each carries its own join code.
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [creatingClassroom, setCreatingClassroom] = useState(false);
  const [joinRequest, setJoinRequest] = useState<'pending' | 'handled'>('pending');
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
    setPersona(null);
    setRole('parent');
    setHasParentRole(false);
    setHasTeacherRole(false);
    setParentJoined(false);
    setInviteDismissed(false);
    setClassrooms([]);
    setCreatingClassroom(false);
    setJoinRequest('pending');
    setTeacherPosts([]);
    setPickerOpen(false);
    setComposePhoto(null);
    setJustPosted(false);
  };

  // parent adds their teacher side: run the classroom first-run; the teacher
  // role is granted when a classroom actually exists
  const startTeacherSetup = () => {
    setRole('teacher');
    setTab('feed');
    if (classrooms.length > 0) setHasTeacherRole(true);
  };

  const addClassroom = (name: string) => {
    setClassrooms((prev) => [...prev, { name, code: makeCode() }]);
    setHasTeacherRole(true);
    setCreatingClassroom(false);
  };

  // rotating kills the old code instantly; anyone who already joined stays
  const rotateCode = (index: number) => {
    setClassrooms((prev) =>
      prev.map((c, i) => (i === index ? { ...c, code: makeCode() } : c)),
    );
  };

  // teacher picked a photo, wrote a caption, and chose which classroom gets it
  const sharePost = (caption: string, classroom: string) => {
    if (!composePhoto) return;
    const post: Post = {
      id: `t${Date.now()}`,
      initials: 'SC',
      gradient: avatarGradients.peach,
      name: 'Ms. Sarah Chen',
      meta: classroom,
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

  // prototype nav: jump anywhere, any time (user control and freedom). Which
  // feed you land on (populated vs the join gate / first-run) is decided by the
  // persona pills, not here, so a plain screen jump never changes that state.
  const jumpTo = (dest: NavLocation) => {
    if (dest === 'signup') {
      setOnboarded(false);
      setTab('feed');
      setReportOpen(false);
      setPersona(null);
      return;
    }
    if (!onboarded) {
      setOnboarded(true);
      setTab(dest);
      return;
    }
    changeTab(dest);
  };

  // Persona pills simulate GETTING IN as a specific starting state:
  //  - parent:       a joined family, straight to the populated feed
  //  - parent-new:   a brand-new parent, at the join-code gate (unverified)
  //  - teacher:      a set-up teacher, on a populated classroom feed
  //  - teacher-new:  a brand-new teacher, at the create-classroom first-run
  // Dual role is only reachable in-app, by earning the second role from Profile.
  const selectPersona = (p: Persona) => {
    setPersona(p);
    setOnboarded(true);
    setTab('feed');
    setFeedFilter('all');
    setReportOpen(false);
    setPickerOpen(false);
    setComposePhoto(null);
    setCreatingClassroom(false);
    setJustPosted(false);
    setInviteDismissed(true);

    const isTeacher = p === 'teacher' || p === 'teacher-new';
    setRole(isTeacher ? 'teacher' : 'parent');
    setHasParentRole(!isTeacher);
    setHasTeacherRole(isTeacher);

    if (isTeacher) {
      setParentJoined(false);
      if (p === 'teacher') {
        setClassrooms([{ name: SEED_CLASSROOM, code: makeCode() }]);
        setTeacherPosts(seedTeacherPosts());
        setJoinRequest('pending');
      } else {
        setClassrooms([]);
        setTeacherPosts([]);
      }
    } else {
      setClassrooms([]);
      setTeacherPosts([]);
      // verified parent = joined feed; unverified = the join-code gate
      setParentJoined(p === 'parent');
    }
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
          persona={persona}
          onJump={jumpTo}
          onPersona={selectPersona}
        />
        <DeviceFrame>
          {!onboarded ? (
            // the sign-up flow is the parent way in, so finishing it earns the parent role
            <OnboardingFlow
              onDone={() => {
                setOnboarded(true);
                setHasParentRole(true);
              }}
            />
          ) : role === 'teacher' && (classrooms.length === 0 || creatingClassroom) ? (
            // teacher first-run (or adding another classroom): name it.
            // Creating the first one is what earns the teacher role.
            <>
              <AppHeader role={role} onRolePress={() => {}} showRole={dualRole} />
              <View style={styles.screen}>
                <CreateClassroomScreen
                  onCreate={addClassroom}
                  onCancel={
                    classrooms.length > 0 ? () => setCreatingClassroom(false) : undefined
                  }
                />
              </View>
            </>
          ) : composePhoto && classrooms.length > 0 ? (
            // focused caption + share step, no tab bar to wander off to
            <>
              <AppHeader role={role} onRolePress={() => {}} showRole={dualRole} />
              <View style={styles.screen}>
                <ComposeScreen
                  photo={composePhoto}
                  classrooms={classrooms.map((c) => c.name)}
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
              <AppHeader
                role={role}
                onRolePress={() => changeTab('profile')}
                showRole={dualRole}
              />
              <View style={styles.screen}>
                <ScreenTransition transitionKey={`${tab}-${role}`} direction={direction}>
                  {tab === 'feed' && role === 'teacher' && classrooms.length > 0 ? (
                    <TeacherFeedScreen
                      classrooms={classrooms.map((c) => c.name)}
                      posts={teacherPosts}
                      justPosted={justPosted}
                      joinRequest={joinRequest === 'pending'}
                      onJoinHandled={() => setJoinRequest('handled')}
                      onNewPost={() => setPickerOpen(true)}
                      onReport={() => setReportOpen(true)}
                      onTrashPost={(id) =>
                        setTeacherPosts((prev) => prev.filter((p) => p.id !== id))
                      }
                    />
                  ) : tab === 'feed' && !parentJoined ? (
                    // brand-new parent: the feed is the join step until they
                    // enter a code or scan the QR
                    <ParentJoinScreen onJoined={() => setParentJoined(true)} />
                  ) : (
                    tab === 'feed' && (
                      <FeedScreen
                        onReport={() => setReportOpen(true)}
                        filter={feedFilter}
                        onFilterChange={setFeedFilter}
                        teacherInvite={
                          role === 'parent' && !hasTeacherRole && !inviteDismissed
                            ? {
                                onSetup: startTeacherSetup,
                                onDismiss: () => setInviteDismissed(true),
                              }
                            : null
                        }
                      />
                    )
                  )}
                  {tab === 'classes' && <ClassesScreen onOpenClass={openClass} />}
                  {tab === 'wishlists' && <WishlistsScreen />}
                  {tab === 'profile' && (
                    <ProfileScreen
                      onSignOut={signOut}
                      role={role}
                      roles={{ parent: hasParentRole, teacher: hasTeacherRole }}
                      onRoleChange={setRole}
                      onStartTeacherSetup={startTeacherSetup}
                      onBecameParent={() => {
                        setHasParentRole(true);
                        setParentJoined(true);
                      }}
                      teacherClassrooms={classrooms}
                      onRotateCode={rotateCode}
                      onAddClassroom={() => {
                        setCreatingClassroom(true);
                        setTab('feed');
                      }}
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
