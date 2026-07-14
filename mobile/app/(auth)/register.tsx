import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { User, Mail, Phone, Lock } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { Fonts, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/components/useColorScheme';
import { useData } from '@/context/DataContext';
import Screen from '@/components/ui/Screen';
import StepHeader from '@/components/ui/StepHeader';
import TextField from '@/components/ui/TextField';
import Button from '@/components/ui/Button';

export default function RegisterScreen() {
  const router = useRouter();
  const colors = Colors[useColorScheme() ?? 'light'];
  const { setFullName, setPhone, setEmail } = useData();

  const [name, setName] = useState('');
  const [phoneVal, setPhoneVal] = useState('');
  const [emailVal, setEmailVal] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!name.trim() || phoneVal.trim().length < 8 || !emailVal.includes('@') || password.length < 6) {
      setError('Vérifiez vos informations : téléphone (8 chiffres min.), email valide et mot de passe (6 caractères min.).');
      return;
    }
    setError('');
    setFullName(name.trim());
    setPhone(phoneVal.trim());
    setEmail(emailVal.trim());
    router.push({ pathname: '/(auth)/otp', params: { mode: 'register', phone: phoneVal.trim() } });
  };

  return (
    <Screen padded>
      <StepHeader step={1} totalSteps={2} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.intro}>
          <Text style={[styles.eyebrow, { color: colors.primary }]}>Bienvenue</Text>
          <Text style={[styles.title, { color: colors.text }]}>
            Créez votre <Text style={{ fontFamily: Fonts.displayItalic }}>espace santé</Text>
          </Text>
          <Text style={[styles.sub, { color: colors.textMuted }]}>
            Quelques informations pour ouvrir votre dossier de financement médical.
          </Text>
        </View>

        <View style={styles.form}>
          <TextField
            label="Nom complet"
            placeholder="Kouamé Adou"
            value={name}
            onChangeText={setName}
            icon={<User size={18} color={colors.textMuted} />}
            autoCapitalize="words"
          />
          <TextField
            label="Numéro de téléphone"
            placeholder="07 00 00 00 00"
            value={phoneVal}
            onChangeText={setPhoneVal}
            icon={<Phone size={18} color={colors.textMuted} />}
            keyboardType="phone-pad"
          />
          <TextField
            label="Adresse email"
            placeholder="vous@exemple.com"
            value={emailVal}
            onChangeText={setEmailVal}
            icon={<Mail size={18} color={colors.textMuted} />}
            keyboardType="email-address"
            autoCapitalize="none"
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
        </View>

        <View style={styles.footer}>
          <Button label="Recevoir mon code de vérification" onPress={handleSubmit} />
          <Text style={[styles.switchText, { color: colors.textMuted }]}>
            Déjà un compte ?{' '}
            <Text style={{ fontFamily: Fonts.bodyBold, color: colors.text }} onPress={() => router.replace('/(auth)/login')}>
              Se connecter
            </Text>
          </Text>
          <Text style={[styles.legal, { color: colors.textMuted }]}>
            En continuant, vous acceptez les Conditions d'utilisation et la Politique de confidentialité de Prêt Santé.
          </Text>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: {
    gap: 8,
    marginBottom: Spacing.lg,
  },
  eyebrow: {
    fontFamily: Fonts.bodyExtraBold,
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
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
    lineHeight: 18,
  },
  footer: {
    marginTop: Spacing.xl,
    gap: Spacing.sm,
    paddingBottom: Spacing.xxl,
    alignItems: 'center',
  },
  switchText: {
    fontFamily: Fonts.body,
    fontSize: 13,
    marginTop: 4,
  },
  legal: {
    fontFamily: Fonts.body,
    fontSize: 11,
    lineHeight: 16,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
});
