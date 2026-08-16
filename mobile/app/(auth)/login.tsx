import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Phone, Lock, HeartPulse } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { Fonts, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/components/useColorScheme';
import { useData } from '@/context/DataContext';
import Screen from '@/components/ui/Screen';
import StepHeader from '@/components/ui/StepHeader';
import TextField from '@/components/ui/TextField';
import Button from '@/components/ui/Button';

export default function LoginScreen() {
  const router = useRouter();
  const colors = Colors[useColorScheme() ?? 'light'];
  const { setPhone } = useData();

  const [phoneVal, setPhoneVal] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (phoneVal.trim().length < 8 || password.length < 1) {
      setError('Saisissez votre numéro et votre mot de passe.');
      return;
    }
    setError('');
    setPhone(phoneVal.trim());
    router.push({ pathname: '/(auth)/otp', params: { mode: 'login', phone: phoneVal.trim() } });
  };

  return (
    <Screen padded>
      <StepHeader showBack title="" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.intro}>
          <View style={[styles.iconCircle, { backgroundColor: 'rgba(255,255,255,0.9)' }]}>
            <HeartPulse size={22} color={colors.primary} />
          </View>
          <Text style={[styles.title, { color: colors.heading }]}>
            Content de vous <Text style={{ fontFamily: Fonts.displayItalic }}>revoir</Text>
          </Text>
          <Text style={[styles.sub, { color: colors.headingMuted }]}>
            Connectez-vous pour suivre vos dossiers de financement.
          </Text>
        </View>

        <View style={styles.form}>
          <TextField
            label="Numéro de téléphone"
            placeholder="07 00 00 00 00"
            value={phoneVal}
            onChangeText={setPhoneVal}
            icon={<Phone size={18} color={colors.textMuted} />}
            keyboardType="phone-pad"
          />
          <TextField
            label="Mot de passe"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            icon={<Lock size={18} color={colors.textMuted} />}
            isPassword
          />
          {error ? <Text style={[styles.errorText, { color: colors.danger }]}>{error}</Text> : null}
          <Text style={[styles.forgot, { color: colors.heading }]}>Mot de passe oublié ?</Text>
        </View>

        <View style={styles.footer}>
          <Button label="Se connecter" onPress={handleSubmit} />
          <Text style={[styles.switchText, { color: colors.headingMuted }]}>
            Pas encore de compte ?{' '}
            <Text style={{ fontFamily: Fonts.bodyBold, color: colors.heading }} onPress={() => router.replace('/(auth)/register')}>
              Créer un compte
            </Text>
          </Text>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: {
    gap: 10,
    marginBottom: Spacing.lg,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  title: {
    fontFamily: Fonts.display,
    fontSize: 26,
    lineHeight: 32,
  },
  sub: {
    fontFamily: Fonts.body,
    fontSize: 13.5,
    lineHeight: 20,
  },
  form: {
    gap: Spacing.md,
  },
  errorText: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 12.5,
  },
  forgot: {
    fontFamily: Fonts.bodyBold,
    fontSize: 13,
    textAlign: 'right',
  },
  footer: {
    marginTop: Spacing.xl,
    gap: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  switchText: {
    fontFamily: Fonts.body,
    fontSize: 13,
  },
});
