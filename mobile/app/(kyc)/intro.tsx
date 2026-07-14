import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Landmark, IdCard, ScanFace, Clock3, ShieldCheck } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { Fonts, Radius, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/components/useColorScheme';
import Screen from '@/components/ui/Screen';
import StepHeader from '@/components/ui/StepHeader';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

const STEPS = [
  { icon: Landmark, title: 'Coordonnées bancaires', body: 'Votre banque et vos identifiants de compte, pour le décaissement.' },
  { icon: IdCard, title: "Pièce d'identité", body: 'CNI, passeport ou carte consulaire — recto et verso.' },
  { icon: ScanFace, title: 'Selfie de contrôle', body: 'Un selfie rapide pour confirmer que c\'est bien vous.' },
  { icon: Clock3, title: '2 minutes chrono', body: 'Analyse automatique, résultat immédiat.' },
];

export default function KycIntroScreen() {
  const router = useRouter();
  const colors = Colors[useColorScheme() ?? 'light'];

  return (
    <Screen padded>
      <StepHeader showBack={false} title="Vérification d'identité" />

      <View style={styles.hero}>
        <View style={[styles.iconCircle, { backgroundColor: colors.secondarySoft }]}>
          <ShieldCheck size={28} color={colors.secondary} />
        </View>
        <Text style={[styles.title, { color: colors.text }]}>
          Confirmons que c'est bien{' '}
          <Text style={{ fontFamily: Fonts.displayItalic }}>vous</Text>
        </Text>
        <Text style={[styles.sub, { color: colors.textMuted }]}>
          Une vérification rapide et sécurisée, exigée par nos banques partenaires avant tout financement.
        </Text>
      </View>

      <View style={styles.stepsList}>
        {STEPS.map((s, i) => (
          <Card key={i} style={styles.stepCard}>
            <View style={[styles.stepIcon, { backgroundColor: colors.primarySoft }]}>
              <s.icon size={20} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.stepTitle, { color: colors.text }]}>{s.title}</Text>
              <Text style={[styles.stepBody, { color: colors.textMuted }]}>{s.body}</Text>
            </View>
          </Card>
        ))}
      </View>

      <View style={styles.footer}>
        <Button label="Commencer la vérification" onPress={() => router.push('/(kyc)/bank-info')} />
        <Button
          label="Passer la vérification pour l'instant"
          variant="outline"
          style={{ backgroundColor: colors.surfaceSunken, borderWidth: 0, marginTop: 10 }}
          onPress={() => router.replace('/(tabs)')}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: 'center',
    gap: 10,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: Fonts.display,
    fontSize: 25,
    textAlign: 'center',
    lineHeight: 31,
  },
  sub: {
    fontFamily: Fonts.body,
    fontSize: 13.5,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 8,
  },
  stepsList: {
    gap: Spacing.sm,
  },
  stepCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  stepIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepTitle: {
    fontFamily: Fonts.bodyBold,
    fontSize: 14,
  },
  stepBody: {
    fontFamily: Fonts.body,
    fontSize: 12,
    marginTop: 2,
    lineHeight: 17,
  },
  footer: {
    marginTop: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },
});
