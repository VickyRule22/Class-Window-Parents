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
import { PrototypeNav, Dest } from './src/components/PrototypeNav';
import { Role } from './src/components/RoleSwitcher';
import { ScreenTransition } from './src/components/ScreenTransition';
import { ReportModal } from './src/components/ReportModal';
import { OnboardingFlow } from './src/onboarding/OnboardingFlow';
import { FeedScreen } from './src/screens/FeedScreen';
import { ParentJoinScreen } from './src/screens/ParentJoinScreen';
import { ClassesScreen } from './src/screens/ClassesScreen';
import { JoinClassroomScreen } from './src/screens/profile/JoinClassroomScreen';
import { Toast } from './src/screens/profile/ui';
import { WishlistsScreen } from './src/screens/WishlistsScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { CreateClassroomScreen } from './src/teacher/CreateClassroomScreen';
import { AwaitingVerificationScreen } from './src/teacher/AwaitingVerificationScreen';
import { TeacherFeedScreen } from './src/teacher/TeacherFeedScreen';
import { PhotoPickerSheet, PickedPhoto } from './src/teacher/PhotoPickerSheet';
import { PostFab } from './src/teacher/PostFab';
import { ComposeScreen } from './src/teacher/ComposeScreen';
import { colors, avatarGradients } from './src/theme';
import type { Post } from './src/data';

export type Classroom = { name: string; code: string };

// Join codes are three random words: harder to guess than 6 characters and
// easier to type. The code alone gets a family in; if one gets passed around,
// the teacher rotates it and the old one stops working.
const CODE_WORDS = [
  'maple', 'otter', 'sunny', 'river', 'tiger', 'lemon',
  'cloud', 'panda', 'berry', 'frost', 'wagon', 'daisy',
];
const makeCode = () =>
  Array.from({ length: 3 }, () => CODE_WORDS[Math.floor(Math.random() * CODE_WORDS.length)]).join('-');

const TAB_ORDER: TabKey[] = ['feed', 'classes', 'wishlists', 'profile'];

// A ready-made classroom + a couple of posts, so the "verified teacher" persona
// pill lands straight on a populated teacher feed instead of the first-run.
// The sample teacher, deliberately nothing like the sample parent (Mitch
// Salzberg) or the teachers a parent follows, so nobody confuses the personas.
export const TEACHER_NAME = 'Ms. Junie Okafor';
export const TEACHER_INITIALS = 'JO';
export const TEACHER_EMAIL = 'junie.okafor@lincoln.edu';
// Two rooms, so the teacher feed's class filter has something to filter.
const SEED_CLASSROOM = "Ms. Okafor's 2nd Grade";
const SEED_CLASSROOM_2 = 'After-School Science Club';
// pre-picked photo so the Compose (caption) step is reachable in one jump
const SEED_PHOTO: PickedPhoto = {
  image: require('./assets/figma/posts/sunflowers.png'),
  tint: colors.postBlue,
};
const seedTeacherPosts = (): Post[] => [
  {
    id: 'seed-1',
    initials: TEACHER_INITIALS,
    gradient: avatarGradients.peach,
    name: TEACHER_NAME,
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
    initials: TEACHER_INITIALS,
    gradient: avatarGradients.peach,
    name: TEACHER_NAME,
    meta: SEED_CLASSROOM_2,
    time: 'Yesterday',
    imageColor: colors.postPeach,
    image: require('./assets/figma/posts/science.png'),
    caption:
      'Our seedlings are reaching for the light. Every scientist made a prediction, and almost all were right! 🔬',
    likes: 15,
    liked: true,
  },
  {
    id: 'seed-3',
    initials: TEACHER_INITIALS,
    gradient: avatarGradients.peach,
    name: TEACHER_NAME,
    meta: SEED_CLASSROOM,
    time: '2 days ago',
    imageColor: colors.postBlue,
    image: require('./assets/figma/posts/sunflowers.png'),
    caption:
      'Sunflower gallery is up in the hallway. Every one of them picked their own colours. 🌻',
    likes: 9,
    liked: false,
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
  // which prototype-nav destination is active (highlights the pill). Each one
  // seeds the full starting state for that screen.
  const [dest, setDest] = useState<Dest | null>(null);
  // a fresh parent has no classroom yet: their feed is the join step
  // (enter the teacher's code or scan the QR from the welcome note)
  const [parentJoined, setParentJoined] = useState(false);
  // simulated admin action: this parent was added as a teacher at school,
  // so their feed shows a create-your-classroom banner until they do (or dismiss)
  const [inviteDismissed, setInviteDismissed] = useState(false);

  // teacher first-run: create a classroom, then get nudged into a first post.
  // Teachers can run several classrooms; each carries its own join code.
  // whether the school has confirmed this person teaches there. Until they do,
  // a teacher can't create a classroom at all, so they get the waiting screen.
  const [teacherVerified, setTeacherVerified] = useState(true);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [creatingClassroom, setCreatingClassroom] = useState(false);
  // a joined parent adding one more class: same join-by-code screen, pushed
  // over the Classes list
  const [joiningClass, setJoiningClass] = useState(false);
  const [toast, setToast] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [teacherPosts, setTeacherPosts] = useState<Post[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  // a teacher with a classroom can post, which is what the docked + button does
  const teacherCanPost = role === 'teacher' && classrooms.length > 0;
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

  // brief confirmation toast, shared with the pushed join-a-class screen
  const notify = (msg: string) => {
    setToast(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2200);
  };

  // sign out returns to the sign-in flow and resets app state for next login
  const signOut = () => {
    setOnboarded(false);
    setTab('feed');
    setFeedFilter('all');
    setReportOpen(false);
    setDest(null);
    setRole('parent');
    setHasParentRole(false);
    setHasTeacherRole(false);
    setTeacherVerified(true);
    setParentJoined(false);
    setInviteDismissed(false);
    setClassrooms([]);
    setCreatingClassroom(false);
    setJoiningClass(false);
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
      initials: TEACHER_INITIALS,
      gradient: avatarGradients.peach,
      name: TEACHER_NAME,
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

  // Prototype nav: every pill seeds a complete starting state, so a reviewer can
  // land directly on any screen (including mid-flow states like the photo picker
  // or the caption step). Dual role is only reachable in-app, by earning the
  // second role from Profile.
  const goTo = (d: Dest) => {
    setDest(d);
    setReportOpen(false);
    setPickerOpen(false);
    setComposePhoto(null);
    setCreatingClassroom(false);
    setJoiningClass(false);
    setJustPosted(false);
    setFeedFilter('all');
    setInviteDismissed(true);

    // sign-up replays the onboarding flow, before any role exists
    if (d === 'parent-signup') {
      setOnboarded(false);
      setTab('feed');
      setRole('parent');
      return;
    }
    setOnboarded(true);

    const isTeacher = d.startsWith('teacher');
    setRole(isTeacher ? 'teacher' : 'parent');
    setHasTeacherRole(isTeacher);
    setHasParentRole(!isTeacher);

    if (isTeacher) {
      setParentJoined(false);
      // only the unverified pill is waiting on the school
      setTeacherVerified(d !== 'teacher-unverified');
      if (d === 'teacher-unverified' || d === 'teacher-verified') {
        // no classroom yet: unverified waits on the school, verified names one
        setClassrooms([]);
        setTeacherPosts([]);
      } else {
        setClassrooms([
          { name: SEED_CLASSROOM, code: makeCode() },
          { name: SEED_CLASSROOM_2, code: makeCode() },
        ]);
        // "empty feed" is the real pre-first-post state; everything else is populated
        setTeacherPosts(d === 'teacher-empty' ? [] : seedTeacherPosts());
      }
      if (d === 'teacher-post') setPickerOpen(true);
      if (d === 'teacher-compose') setComposePhoto(SEED_PHOTO);
      setTab(d === 'teacher-classrooms' || d === 'teacher-profile' ? 'profile' : 'feed');
    } else {
      setClassrooms([]);
      setTeacherPosts([]);
      // unverified parent sits at the join-code gate; everyone else has joined
      setParentJoined(d !== 'parent-new');
      setTab(
        d === 'parent-classes'
          ? 'classes'
          : d === 'parent-wishlists'
            ? 'wishlists'
            : d === 'parent-profile'
              ? 'profile'
              : 'feed',
      );
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
          dest={dest}
          onGo={goTo}
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
          ) : role === 'teacher' && !teacherVerified ? (
            // signed up, but the school hasn't confirmed them yet
            <>
              <AppHeader role={role} onRolePress={() => {}} showRole={dualRole} />
              <View style={styles.screen}>
                <AwaitingVerificationScreen
                  onContactAdmin={() => notify('Drafts an email to your school administrator')}
                />
              </View>
            </>
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
                  {/* Classes is the family's list of their kids' teachers, so it
                      is parent-only: a teacher has no business browsing other
                      teachers' classrooms. */}
                  {tab === 'classes' &&
                    role === 'parent' &&
                    (joiningClass ? (
                      <JoinClassroomScreen
                        onBack={() => setJoiningClass(false)}
                        onJoined={() => setJoiningClass(false)}
                        notify={notify}
                      />
                    ) : (
                      <ClassesScreen
                        onOpenClass={openClass}
                        onAddClass={() => setJoiningClass(true)}
                      />
                    ))}
                  {tab === 'wishlists' && <WishlistsScreen />}
                  {tab === 'profile' && (
                    <ProfileScreen
                      // re-key so a nav jump re-reads initialScreen
                      key={dest ?? 'profile'}
                      initialScreen={dest === 'teacher-classrooms' ? 'classrooms' : 'hub'}
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
              <BottomNav
                active={tab}
                onChange={changeTab}
                // Classes is the family's list of other teachers; Wishlists is
                // a placeholder. Dropping both leaves the centre free for the
                // action a teacher is actually here to take.
                hide={role === 'teacher' ? ['classes', 'wishlists'] : []}
                centerGap={teacherCanPost}
              />
              {/* sharing a photo is the teacher's main action, so it gets a
                  docked button lifted out of the bar instead of a row in it */}
              {teacherCanPost && (
                <PostFab
                  onPress={() => setPickerOpen(true)}
                  open={pickerOpen}
                  pulse={teacherPosts.length === 0}
                />
              )}
              {/* report sheet lives inside the device frame so it stays contained */}
              <ReportModal visible={reportOpen} onClose={() => setReportOpen(false)} />
              <Toast message={toast} visible={toastVisible} />
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
