import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { ScreenTransition } from '../components/ScreenTransition';
import { InviteJoinScreen } from './InviteJoinScreen';
import { LogInScreen } from './LogInScreen';
import { ForgotPasswordScreen } from './ForgotPasswordScreen';
import { NewPasswordScreen } from './NewPasswordScreen';
import { VerifyEmailScreen } from './VerifyEmailScreen';
import { VerifiedScreen } from './VerifiedScreen';
import { colors } from '../theme';

type Step = 'join' | 'login' | 'forgot' | 'newpass' | 'verify' | 'verified';
const ORDER: Step[] = ['join', 'login', 'forgot', 'newpass', 'verify', 'verified'];

// The three-step sign-up flow shown before the main app. Carries the name + email
// the parent types so later screens can greet them, and animates between steps
// using the same directional transition the app's tabs use.
export function OnboardingFlow({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState<Step>('join');
  const [direction, setDirection] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const go = (next: Step) => {
    setDirection(ORDER.indexOf(next) > ORDER.indexOf(step) ? 1 : -1);
    setStep(next);
  };

  const firstName = name.trim().split(/\s+/)[0] || 'there';

  return (
    <View style={styles.root}>
      <ScreenTransition transitionKey={step} direction={direction}>
        {step === 'join' && (
          <InviteJoinScreen
            name={name}
            email={email}
            onName={setName}
            onEmail={setEmail}
            onSubmit={() => go('verify')}
            onLogIn={() => go('login')}
          />
        )}
        {step === 'login' && (
          <LogInScreen
            onLogIn={onDone}
            onSignUp={() => go('join')}
            onForgot={() => go('forgot')}
          />
        )}
        {step === 'forgot' && (
          <ForgotPasswordScreen
            onBack={() => go('login')}
            onSubmit={() => go('newpass')}
            onLogIn={() => go('login')}
          />
        )}
        {step === 'newpass' && (
          <NewPasswordScreen onBack={() => go('forgot')} onSubmit={() => go('login')} />
        )}
        {step === 'verify' && (
          <VerifyEmailScreen email={email} onBack={() => go('join')} onVerify={() => go('verified')} />
        )}
        {step === 'verified' && <VerifiedScreen firstName={firstName} onContinue={onDone} />}
      </ScreenTransition>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.appBg },
});
