import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MessageCircle } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { Fonts, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/components/useColorScheme';
import { useData } from '@/context/DataContext';
import Screen from '@/components/ui/Screen';
import StepHeader from '@/components/ui/StepHeader';
import OtpInput from '@/components/ui/OtpInput';
import Button from '@/components/ui/Button';
import HeartbeatPulse from '@/components/ui/HeartbeatPulse';

const RESEND_SECONDS = 45;

export default function OtpScreen() {
  const router = useRouter();
  const colors = Colors[useColorScheme() ?? 'light'];
  const { mode, phone: phoneParam } = useLocalSearchParams<{ mode?: string; phone?: string }>();
  const { setIsAuthenticated, identityVerified } = useData();

  const [code, setCode] = useState('');
  const [seconds, setSeconds] = useState(RESEND_SECONDS);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const maskedPhone = phoneParam ? phoneParam.replace(/(\d{2})\d+(\d{2})/, '$1 •• •• $2') : '•• •• •• ••';

  const handleVerify = () => {
    if (code.length < 6) {
      setError(true);
      return;
    }
    setError(false);
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setIsAuthenticated(true);
      if (mode === 'login' && identityVerified) {
        router.replace('/(tabs)');
      } else {
        router.replace('/(kyc)/intro');
      }
    }, 900);
  };

  const handleResend = () => {
    if (seconds > 0) return;
    setSeconds(RESEND_SECONDS);
    setCode('');
  };

  return (
    <Screen padded scroll={false}>
      <StepHeader step={2} totalSteps={2} />
      <View style={styles.body}>
        <View style={[styles.iconCircle, { backgroundColor: 'rgba(255,255,255,0.9)' }]}>
          <MessageCircle size={26} color={colors.primary} />
        </View>

        <Text style={[styles.title, { color: colors.heading }]}>
          Vérifiez votre <Text style={{ fontFamily: Fonts.displayItalic }}>numéro</Text>
        </Text>
        <Text style={[styles.sub, { color: colors.headingMuted }]}>
          Un code à 6 chiffres a été envoyé par SMS au{'\n'}
          <Text style={{ fontFamily: Fonts.bodyBold, color: colors.heading }}>{maskedPhone}</Text>
        </Text>

        <View style={styles.otpWrap}>
          <OtpInput value={code} onChange={(v) => { setCode(v); setError(false); }} error={error} />
          {error && <Text style={[styles.errorText, { color: colors.danger }]}>Code incomplet ou incorrect.</Text>}
        </View>

        <View style={styles.resendRow}>
          <Text style={[styles.resendText, { color: colors.headingMuted }]}>
            {seconds > 0 ? `Renvoyer le code dans ${seconds}s` : "Vous n'avez rien reçu ?"}
          </Text>
          {seconds === 0 && (
            <Text style={[styles.resendLink, { color: colors.heading }]} onPress={handleResend}>
              Renvoyer le SMS
            </Text>
          )}
        </View>

        <View style={{ marginTop: Spacing.lg }}>
          <HeartbeatPulse color={colors.primary} size={30} />
        </View>
      </View>

      <View style={styles.footer}>
        <Button label="Vérifier le code" onPress={handleVerify} loading={verifying} disabled={code.length < 6} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
    paddingTop: Spacing.xl,
    gap: 14,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  title: {
    fontFamily: Fonts.display,
    fontSize: 24,
    textAlign: 'center',
  },
  sub: {
    fontFamily: Fonts.body,
    fontSize: 13.5,
    textAlign: 'center',
    lineHeight: 20,
  },
  otpWrap: {
    marginTop: Spacing.lg,
    gap: 10,
    alignItems: 'center',
  },
  errorText: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 12,
  },
  resendRow: {
    marginTop: Spacing.md,
    alignItems: 'center',
    gap: 4,
  },
  resendText: {
    fontFamily: Fonts.body,
    fontSize: 12.5,
  },
  resendLink: {
    fontFamily: Fonts.bodyBold,
    fontSize: 13,
  },
  footer: {
    paddingBottom: Spacing.xl,
  },
});
