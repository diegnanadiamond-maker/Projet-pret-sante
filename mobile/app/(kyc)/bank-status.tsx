import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Landmark, Smartphone, ChevronRight } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { Fonts, Radius, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/components/useColorScheme';
import { useData } from '@/context/DataContext';
import Screen from '@/components/ui/Screen';
import StepHeader from '@/components/ui/StepHeader';
import Card from '@/components/ui/Card';

export default function KycBankStatusScreen() {
  const router = useRouter();
  const colors = Colors[useColorScheme() ?? 'light'];
  const { setIsBanked } = useData();

  const choose = (banked: boolean) => {
    setIsBanked(banked);
    router.push(banked ? '/(kyc)/bank-info' : '/(kyc)/document');
  };

  return (
    <Screen padded>
      <StepHeader title="Situation bancaire" />

      <Text style={[styles.title, { color: colors.heading }]}>
        Avez-vous un{' '}
        <Text style={{ fontFamily: Fonts.displayItalic }}>compte bancaire</Text> ?
      </Text>
      <Text style={[styles.sub, { color: colors.headingMuted }]}>
        Cela détermine comment vous recevrez votre financement santé.
      </Text>

      <View style={styles.choices}>
        <TouchableOpacity onPress={() => choose(true)} activeOpacity={0.85}>
          <Card style={styles.choiceCard}>
            <View style={[styles.choiceIcon, { backgroundColor: colors.primarySoft }]}>
              <Landmark size={22} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.choiceTitle, { color: colors.text }]}>Oui, j'ai un compte bancaire</Text>
              <Text style={[styles.choiceBody, { color: colors.textMuted }]}>
                Empruntez directement auprès de votre banque partenaire (SGCI, BNI, Ecobank…).
              </Text>
            </View>
            <ChevronRight size={18} color={colors.textMuted} />
          </Card>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => choose(false)} activeOpacity={0.85}>
          <Card style={styles.choiceCard}>
            <View style={[styles.choiceIcon, { backgroundColor: colors.accentSkySoft }]}>
              <Smartphone size={22} color={colors.accentSky} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.choiceTitle, { color: colors.text }]}>Non, pas de compte bancaire</Text>
              <Text style={[styles.choiceBody, { color: colors.textMuted }]}>
                Pas de souci : votre financement passera par Orange Money et son prêt Tiktak.
              </Text>
            </View>
            <ChevronRight size={18} color={colors.textMuted} />
          </Card>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: Fonts.display,
    fontSize: 24,
    lineHeight: 30,
    marginTop: Spacing.sm,
  },
  sub: {
    fontFamily: Fonts.body,
    fontSize: 13,
    marginTop: 6,
    marginBottom: Spacing.xl,
  },
  choices: {
    gap: Spacing.sm,
  },
  choiceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  choiceIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  choiceTitle: {
    fontFamily: Fonts.bodyBold,
    fontSize: 14.5,
  },
  choiceBody: {
    fontFamily: Fonts.body,
    fontSize: 12,
    marginTop: 3,
    lineHeight: 17,
  },
});
