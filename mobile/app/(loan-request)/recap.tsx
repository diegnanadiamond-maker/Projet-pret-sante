import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Smile, Baby, Activity, Plus, FileCheck2 } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { Fonts, Radius, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/components/useColorScheme';
import { useData } from '@/context/DataContext';
import Screen from '@/components/ui/Screen';
import StepHeader from '@/components/ui/StepHeader';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const CARE_LABELS: Record<number, { label: string; icon: any }> = {
  1: { label: 'Soins dentaires', icon: Smile },
  2: { label: 'Maternité & accouchement', icon: Baby },
  3: { label: 'Bilan de santé', icon: Activity },
  4: { label: 'Autre besoin de santé', icon: Plus },
};

export default function RecapStep() {
  const router = useRouter();
  const colors = Colors[useColorScheme() ?? 'light'];
  const { loanType, establishment, loanAmount, loanDuration, calculateMonthly, selectedOffer } = useData();

  const care = CARE_LABELS[loanType] ?? CARE_LABELS[1];
  const monthly = calculateMonthly(loanAmount, loanDuration);
  const format = (v: number) => new Intl.NumberFormat('fr-FR').format(Math.round(v)) + ' FCFA';

  return (
    <Screen padded>
      <StepHeader title="Récapitulatif" />

      <View style={styles.intro}>
        <View style={[styles.iconBadge, { backgroundColor: 'rgba(255,255,255,0.9)' }]}>
          <FileCheck2 size={22} color={colors.primary} />
        </View>
        <Text style={[styles.title, { color: colors.heading }]}>
          Votre demande est <Text style={{ fontFamily: Fonts.displayItalic }}>prête</Text>
        </Text>
        <Text style={[styles.sub, { color: colors.headingMuted }]}>
          Voici le récapitulatif de votre demande de financement.
        </Text>
      </View>

      <Card style={styles.recapCard}>
        <RecapLine label="Besoin financé" value={care.label} colors={colors} />
        <RecapLine label="Établissement" value={establishment} colors={colors} />
        <RecapLine label="Financé par" value={selectedOffer?.bank ?? '—'} colors={colors} />
        <RecapLine label="Montant demandé" value={format(loanAmount)} colors={colors} bold />
        <RecapLine label="Durée" value={`${loanDuration} mois`} colors={colors} />
        <RecapLine label="Mensualité estimée" value={format(monthly)} colors={colors} bold last />
      </Card>

      <Text style={[styles.note, { color: colors.headingMuted }]}>
        Ce financement sera assuré par {selectedOffer?.bank ?? 'votre partenaire'}, associé à votre profil lors de
        votre inscription.
      </Text>

      <View style={styles.footer}>
        <Button label="Poursuivre ma demande" onPress={() => router.push('/(loan-request)/step-3-fees')} />
      </View>
    </Screen>
  );
}

function RecapLine({ label, value, colors, bold, last }: any) {
  return (
    <View style={[styles.line, !last && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border }]}>
      <Text style={[styles.lineLabel, { color: colors.textMuted }]}>{label}</Text>
      <Text style={[styles.lineValue, { color: colors.text }, bold && { fontFamily: Fonts.bodyBold }]} numberOfLines={2}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  intro: {
    gap: 6,
    marginBottom: Spacing.lg,
  },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  title: {
    fontFamily: Fonts.display,
    fontSize: 24,
    lineHeight: 30,
  },
  sub: {
    fontFamily: Fonts.body,
    fontSize: 13,
    lineHeight: 19,
  },
  recapCard: {
    gap: 0,
  },
  line: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
  },
  lineLabel: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 12.5,
  },
  lineValue: {
    flex: 1,
    fontFamily: Fonts.bodySemiBold,
    fontSize: 12.5,
    textAlign: 'right',
  },
  note: {
    fontFamily: Fonts.body,
    fontSize: 12,
    lineHeight: 17,
    marginTop: Spacing.md,
  },
  footer: {
    gap: 12,
    marginTop: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },
});
