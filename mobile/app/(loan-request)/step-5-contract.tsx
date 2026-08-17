import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { Fonts, Radius, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/components/useColorScheme';
import { useData } from '@/context/DataContext';
import Screen from '@/components/ui/Screen';
import StepHeader from '@/components/ui/StepHeader';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import SignaturePad from '@/components/ui/SignaturePad';

export default function ContractStep() {
  const router = useRouter();
  const colors = Colors[useColorScheme() ?? 'light'];
  const { fullName, establishment, loanAmount, loanDuration, selectedOffer, calculateMonthly, addLoan } = useData();
  const [signed, setSigned] = useState(false);

  const format = (v: number) => new Intl.NumberFormat('fr-FR').format(Math.round(v)) + ' FCFA';
  const monthly = calculateMonthly(loanAmount, loanDuration, selectedOffer?.rate ?? 8.5);

  const confirm = () => {
    const id = addLoan();
    router.replace({ pathname: '/(loan-request)/step-6-success', params: { id } });
  };

  return (
    <Screen padded>
      <StepHeader step={5} totalSteps={5} />

      <Text style={[styles.title, { color: colors.heading }]}>
        Relisez et <Text style={{ fontFamily: Fonts.displayItalic }}>signez</Text>
      </Text>
      <Text style={[styles.sub, { color: colors.headingMuted }]}>Dernière étape avant l'envoi à {selectedOffer?.bank ?? 'la banque'}.</Text>

      <Card style={styles.contractCard}>
        <Text style={[styles.contractHeader, { color: colors.text, borderBottomColor: colors.border }]}>
          ACTE DE CRÉDIT MÉDICAL
        </Text>
        <ContractLine label="Bénéficiaire" value={fullName || 'Kouamé Adou'} colors={colors} />
        <ContractLine label="Banque" value={selectedOffer?.bank ?? '—'} colors={colors} />
        <ContractLine label="Montant" value={format(loanAmount)} colors={colors} bold />
        <ContractLine label="Taux d'intérêt" value={`${(selectedOffer?.rate ?? 8.5).toString().replace('.', ',')}%`} colors={colors} />
        <ContractLine label="Durée" value={`${loanDuration} mois`} colors={colors} />
        <ContractLine label="Mensualité" value={format(monthly)} colors={colors} bold />
        <ContractLine label="Décaissé à" value={establishment} colors={colors} bold last />
      </Card>

      <View style={[styles.disclaimer, { backgroundColor: colors.surfaceSunken, borderColor: 'transparent' }]}>
        <Text style={[styles.disclaimerText, { color: colors.text }]}>
          Les fonds sont versés directement à <Text style={{ fontFamily: Fonts.bodyBold }}>{establishment}</Text> sur
          présentation de la facture pro-forma, jamais sur votre compte personnel.
        </Text>
      </View>

      <Text style={[styles.signLabel, { color: colors.headingMuted }]}>Signature électronique</Text>
      <SignaturePad onChange={setSigned} />

      <View style={styles.footer}>
        <Button label="Confirmer et envoyer" onPress={confirm} disabled={!signed} />
      </View>
    </Screen>
  );
}

function ContractLine({ label, value, colors, bold, last }: any) {
  return (
    <View style={[styles.line, !last && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border }]}>
      <Text style={[styles.lineLabel, { color: colors.textMuted }]}>{label}</Text>
      <Text style={[styles.lineValue, { color: colors.text }, bold && { fontFamily: Fonts.bodyBold }]}>{value}</Text>
    </View>
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
    fontSize: 15,
    marginTop: 6,
    marginBottom: Spacing.lg,
  },
  contractCard: {
    gap: 0,
  },
  contractHeader: {
    fontFamily: Fonts.bodyExtraBold,
    fontSize: 11,
    letterSpacing: 1,
    textAlign: 'center',
    paddingBottom: 12,
    marginBottom: 6,
    borderBottomWidth: 1,
  },
  line: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 9,
  },
  lineLabel: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 13.5,
  },
  lineValue: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 13.5,
  },
  disclaimer: {
    padding: 14,
    borderRadius: Radius.md,
    borderWidth: 1,
    marginTop: Spacing.md,
  },
  disclaimerText: {
    fontFamily: Fonts.body,
    fontSize: 13,
    lineHeight: 19,
  },
  signLabel: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 12,
    marginTop: Spacing.lg,
    marginBottom: 8,
  },
  footer: {
    marginTop: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },
});
