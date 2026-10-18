import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button, Field, Monogram, Screen } from '@/components/ui';
import { C, F, S } from '@/constants/brand';
import { useApp } from '@/store/app-store';

// Demo-only OTP. Production: Firebase Phone Auth or MSG91, verified server-side.
const DEMO_OTP = '1234';

export default function Login() {
  const router = useRouter();
  const { dispatch } = useApp();
  const [step, setStep] = useState<'details' | 'otp'>('details');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const done = () => (router.canGoBack() ? router.back() : router.replace('/'));

  const sendOtp = () => {
    if (name.trim().length < 2) return setError('Please enter your name.');
    if (!/^[6-9]\d{9}$/.test(phone)) return setError('Enter a valid 10-digit mobile number.');
    setError('');
    setStep('otp');
  };

  const verify = () => {
    if (otp !== DEMO_OTP) return setError('That code is not right. Try again.');
    dispatch({ type: 'login', user: { name: name.trim(), phone } });
    done();
  };

  return (
    <Screen topInset={false}>
      <View style={styles.hero}>
        <Monogram size={64} />
        <Text style={styles.title}>{step === 'details' ? 'Welcome' : 'Verify your number'}</Text>
        <Text style={styles.sub}>
          {step === 'details' ? 'Sign in to confirm bookings and earn rewards.' : `We sent a 4-digit code to +91 ${phone}.`}
        </Text>
      </View>

      <View style={styles.form}>
        {step === 'details' ? (
          <>
            <Field label="Your name" value={name} onChangeText={setName} placeholder="e.g. Aarav Shah" autoFocus />
            <Field label="Mobile number" value={phone} onChangeText={(t) => setPhone(t.replace(/\D/g, ''))} placeholder="98765 43210" keyboardType="number-pad" maxLength={10} prefix="+91" />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <Button label="Send code" onPress={sendOtp} />
          </>
        ) : (
          <>
            <Field label="Verification code" value={otp} onChangeText={(t) => setOtp(t.replace(/\D/g, ''))} placeholder="1234" keyboardType="number-pad" maxLength={4} autoFocus />
            <Text style={styles.hint}>Demo build: use code {DEMO_OTP}</Text>
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <Button label="Verify & continue" variant="gold" onPress={verify} />
            <Button label="Change number" variant="ghost" onPress={() => { setStep('details'); setOtp(''); setError(''); }} style={{ marginTop: S.sm }} />
          </>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', paddingTop: S.xl, paddingHorizontal: S.xl },
  title: { fontFamily: F.serifBold, fontSize: 28, color: C.ink, marginTop: S.lg },
  sub: { fontSize: 14, color: C.muted, textAlign: 'center', marginTop: S.xs, lineHeight: 20 },
  form: { padding: S.lg, marginTop: S.lg },
  hint: { fontSize: 13, color: C.gold, fontWeight: '600', marginBottom: S.lg },
  error: { fontSize: 13, color: C.danger, marginBottom: S.md, fontWeight: '600' },
});
