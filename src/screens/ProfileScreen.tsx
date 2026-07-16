import React, { useRef, useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Avatar } from '../components/Avatar';
import { RoleSwitcher, Role } from '../components/RoleSwitcher';
import { ScreenTransition } from '../components/ScreenTransition';
import { classes } from '../data';
import { colors, font, shadowSoft } from '../theme';
import { SectionLabel, Card, Row, Toast } from './profile/ui';
import { PersonalInfoScreen } from './profile/PersonalInfoScreen';
import { ClassroomsScreen } from './profile/ClassroomsScreen';
import { JoinClassroomScreen } from './profile/JoinClassroomScreen';
import { NotificationsScreen } from './profile/NotificationsScreen';
import { PrivacySecurityScreen } from './profile/PrivacySecurityScreen';
import { ChangePasswordScreen } from './profile/ChangePasswordScreen';
import { HelpSupportScreen } from './profile/HelpSupportScreen';
import { FeedbackScreen } from './profile/FeedbackScreen';
import { SignOutSheet } from './profile/SignOutSheet';

type SubScreen =
  | 'hub'
  | 'personal'
  | 'classrooms'
  | 'join'
  | 'notifications'
  | 'security'
  | 'password'
  | 'help'
  | 'feedback';

// Profile is a mini-stack: the hub plus one working screen behind every
// action row. Same directional slide the tab bar uses.
export function ProfileScreen({
  onSignOut,
  role,
  onRoleChange,
  onOpenClass,
  onReportPost,
}: {
  onSignOut: () => void;
  role: Role;
  onRoleChange: (r: Role) => void;
  onOpenClass?: (key: string) => void;
  onReportPost?: () => void;
}) {
  const stack = useRef<SubScreen[]>(['hub']);
  const [screen, setScreen] = useState<SubScreen>('hub');
  const [direction, setDirection] = useState(1);
  const [signOutOpen, setSignOutOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const notify = (msg: string) => {
    setToast(msg);
    setToastVisible(true);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastVisible(false), 2200);
  };

  const go = (next: SubScreen) => {
    stack.current.push(next);
    setDirection(1);
    setScreen(next);
  };
  const back = () => {
    if (stack.current.length < 2) return;
    stack.current.pop();
    setDirection(-1);
    setScreen(stack.current[stack.current.length - 1]);
  };
  // after joining, land on My classrooms rather than replaying the code entry
  const backToClassrooms = () => {
    stack.current = ['hub', 'classrooms'];
    setDirection(-1);
    setScreen('classrooms');
  };

  return (
    <View style={{ flex: 1 }}>
      <ScreenTransition transitionKey={screen} direction={direction}>
        {screen === 'hub' && (
          <ScrollView
            style={{ backgroundColor: colors.appBg }}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.greeting}>
              <Text style={styles.hi}>Profile</Text>
              <Text style={styles.sub}>Your account & preferences</Text>
            </View>

            <View style={styles.body}>
              {/* parent card: tapping the photo opens the picker, not a form */}
              <View style={styles.parentCard}>
                <View style={styles.parentTop}>
                  <Pressable onPress={() => notify('Photo picker would open')}>
                    <Avatar initials="SC" solid={colors.primaryAlt} size={46} fontSize={16} />
                  </Pressable>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.parentName}>Sarah Chen</Text>
                    <Text style={styles.parentEmail}>sarah.chen@email.com</Text>
                  </View>
                  <Pressable style={styles.editBtn} onPress={() => go('personal')}>
                    <Text style={styles.editTxt}>Edit</Text>
                  </Pressable>
                </View>
                <View style={styles.chipRow}>
                  {classes.map((c) => (
                    <View key={c.id} style={styles.classChip}>
                      <Avatar initials={c.initials} gradient={c.gradient} size={22} fontSize={9} />
                      <Text style={styles.classChipTxt}>{c.meta.split(' · ')[0]}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* one account can be both parent and teacher */}
              <RoleSwitcher role={role} onChange={onRoleChange} />

              <View style={styles.section}>
                <SectionLabel>FAMILY</SectionLabel>
                <Card>
                  <Row
                    icon="school-outline"
                    title="My classrooms"
                    sub={`${classes.length} joined at Lincoln Elementary`}
                    onPress={() => go('classrooms')}
                  />
                  <Row
                    icon="add-circle-outline"
                    title="Join a classroom"
                    sub="Enter a code from your teacher"
                    onPress={() => go('join')}
                    last
                  />
                </Card>
              </View>

              <View style={styles.section}>
                <SectionLabel>ACCOUNT</SectionLabel>
                <Card>
                  <Row
                    icon="person-outline"
                    title="Personal info"
                    sub="Name, photo, email, phone"
                    onPress={() => go('personal')}
                  />
                  <Row
                    icon="notifications-outline"
                    title="Notifications"
                    sub="Posts, reminders, weekly digest"
                    onPress={() => go('notifications')}
                  />
                  <Row
                    icon="lock-closed-outline"
                    title="Privacy & security"
                    sub="Password, photo permissions"
                    onPress={() => go('security')}
                    last
                  />
                </Card>
              </View>

              <View style={styles.section}>
                <SectionLabel>SUPPORT</SectionLabel>
                <Card>
                  <Row
                    icon="help-circle-outline"
                    title="Help & support"
                    sub="FAQs and contact us"
                    onPress={() => go('help')}
                  />
                  <Row
                    icon="star-outline"
                    title="Give feedback"
                    sub="Tell us how we're doing"
                    onPress={() => go('feedback')}
                    last
                  />
                </Card>
              </View>

              <Pressable style={styles.signOut} onPress={() => setSignOutOpen(true)}>
                <Text style={styles.signOutTxt}>Sign Out</Text>
              </Pressable>
            </View>
          </ScrollView>
        )}

        {screen === 'personal' && <PersonalInfoScreen onBack={back} notify={notify} />}
        {screen === 'classrooms' && (
          <ClassroomsScreen
            onBack={back}
            onJoin={() => go('join')}
            onOpenClass={onOpenClass}
            notify={notify}
          />
        )}
        {screen === 'join' && (
          <JoinClassroomScreen onBack={back} onJoined={backToClassrooms} notify={notify} />
        )}
        {screen === 'notifications' && <NotificationsScreen onBack={back} />}
        {screen === 'security' && (
          <PrivacySecurityScreen
            onBack={back}
            onChangePassword={() => go('password')}
            notify={notify}
          />
        )}
        {screen === 'password' && <ChangePasswordScreen onBack={back} notify={notify} />}
        {screen === 'help' && (
          <HelpSupportScreen onBack={back} onReportPost={onReportPost} notify={notify} />
        )}
        {screen === 'feedback' && <FeedbackScreen onBack={back} notify={notify} />}
      </ScreenTransition>

      <SignOutSheet
        visible={signOutOpen}
        onClose={() => setSignOutOpen(false)}
        onConfirm={() => {
          setSignOutOpen(false);
          onSignOut();
        }}
      />
      <Toast message={toast} visible={toastVisible} />
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: 32 },
  greeting: { paddingHorizontal: 20, paddingVertical: 8 },
  hi: { fontFamily: font.heading, fontSize: 20, color: colors.textDark },
  sub: { fontFamily: font.semibold, fontSize: 13, color: colors.textMuted, marginTop: 2 },
  body: { paddingHorizontal: 16, paddingTop: 8, gap: 20 },

  parentCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 16,
    gap: 13,
    ...shadowSoft,
  },
  parentTop: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  parentName: { fontFamily: font.headingBold, fontSize: 20, color: colors.textDark2 },
  parentEmail: { fontFamily: font.regular, fontSize: 14, color: colors.textMuted },
  editBtn: {
    borderWidth: 1,
    borderColor: colors.cardDivider,
    backgroundColor: colors.appBg,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  editTxt: { fontFamily: font.bold, fontSize: 14, color: colors.primaryAlt },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  classChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.pillInactive,
    borderRadius: 999,
    paddingLeft: 4,
    paddingRight: 11,
    paddingVertical: 4,
  },
  classChipTxt: { fontFamily: font.bold, fontSize: 12, color: colors.textDark2 },

  section: { gap: 0 },

  signOut: {
    borderWidth: 1,
    borderColor: colors.borderPrimary,
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  signOutTxt: { fontFamily: font.bold, fontSize: 16, color: colors.primary },
});
