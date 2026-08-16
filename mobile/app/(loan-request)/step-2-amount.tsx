import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import Slider from '@react-native-community/slider';
import Colors from '@/constants/Colors';
import { Fonts, Radius, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/components/useColorScheme';
import { useData } from '@/context/DataContext';
import Screen from '@/components/ui/Screen';
import StepHeader from '@/components/ui/StepHeader';
import Button from '@/components/ui/Button';

export default function AmountStep() {
  const router = useRouter();
  const colors = Colors[useColorScheme() ?? 'light'];
  const { loanAmount, setLoanAmount, loanDuration, setLoanDuration, calculateMonthly } = useData();

  const [monthly, setMonthly] = useState(0);

  useEffect(() => {
    setMonthly(calculateMonthly(loanAmount, loanDuration));
  }, [loanAmount, loanDuration]);

  const formatPrice = (val: number) => new Intl.NumberFormat('fr-FR').format(val) + ' FCFA';

  return (
    <Screen padded>
      <StepHeader step={2} totalSteps={5} />

      <Text style={[styles.title, { color: colors.heading }]}>
        Quel <Text style={{ fontFamily: Fonts.displayItalic }}>montant</Text> vous faut-il ?
      </Text>
      <Text style={[styles.sub, { color: colors.headingMuted }]}>Ajustez le curseur, la mensualité se calcule en direct.</Text>

      <View style={[styles.amountDisplay, { backgroundColor: '#FFFFFF', borderColor: colors.border }]}>
        <Text style={[styles.amountBig, { color: colors.primary }]}>{formatPrice(loanAmount)}</Text>
        <Text style={[styles.amountSmall, { color: colors.textMuted }]}>Déplacez le curseur pour ajuster</Text>
      </View>
      <Slider
        style={{ width: '100%', height: 40, marginTop: 10 }}
        minimumValue={50000}
        maximumValue={2000000}
        step={10000}
        value={loanAmount}
        onValueChange={setLoanAmount}
        minimumTrackTintColor="#FFFFFF"
        maximumTrackTintColor="rgba(255,255,255,0.35)"
        thumbTintColor="#FFFFFF"
      />
      <View style={styles.rangeLabels}>
        <Text style={[styles.rangeText, { color: colors.headingMuted }]}>50 000</Text>
        <Text style={[styles.rangeText, { color: colors.headingMuted }]}>2 000 000 FCFA</Text>
      </View>

      <Text style={[styles.formLabel, { color: colors.headingMuted, marginTop: Spacing.lg }]}>Durée de remboursement</Text>
      <View style={styles.durationGrid}>
        {[6, 12, 18, 24].map((d) => (
          <TouchableOpacity
            key={d}
            style={[
              styles.durationBtn,
              { borderColor: 'transparent', backgroundColor: '#FFFFFF' },
              loanDuration === d && { backgroundColor: colors.primary },
            ]}
            onPress={() => setLoanDuration(d)}
          >
            <Text
              style={[
                styles.durationText,
                { color: colors.text },
                loanDuration === d && { color: '#FFFFFF', fontFamily: Fonts.bodyBold },
              ]}
            >
              {d} mois
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={[styles.simCard, { backgroundColor: colors.primary, borderColor: 'transparent' }]}>
        <View style={styles.simItem}>
          <Text style={[styles.simVal, { color: '#FFFFFF' }]}>{formatPrice(monthly)}</Text>
          <Text style={[styles.simLbl, { color: 'rgba(255,255,255,0.8)' }]}>/ mois</Text>
        </View>
        <View style={styles.simItem}>
          <Text style={[styles.simVal, { color: '#FFFFFF' }]}>8,5%</Text>
          <Text style={[styles.simLbl, { color: 'rgba(255,255,255,0.8)' }]}>Taux de base</Text>
        </View>
        <View style={styles.simItem}>
          <Text style={[styles.simVal, { color: '#FFFFFF' }]}>{formatPrice(monthly * loanDuration)}</Text>
          <Text style={[styles.simLbl, { color: 'rgba(255,255,255,0.8)' }]}>Total</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Button label="Continuer" onPress={() => router.push('/(loan-request)/step-3-fees')} />
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
    marginBottom: Spacing.lg,
  },
  amountDisplay: {
    padding: 20,
    borderRadius: Radius.md,
    borderWidth: 1,
    alignItems: 'center',
  },
  amountBig: {
    fontFamily: Fonts.display,
    fontSize: 28,
  },
  amountSmall: {
    fontFamily: Fonts.body,
    fontSize: 11,
    marginTop: 4,
  },
  rangeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rangeText: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 10,
  },
  formLabel: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 12,
    marginBottom: 8,
  },
  durationGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  durationBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: Radius.sm,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  durationText: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 12,
  },
  simCard: {
    padding: 16,
    borderRadius: Radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.lg,
  },
  simItem: {
    alignItems: 'center',
  },
  simVal: {
    fontFamily: Fonts.bodyBold,
    fontSize: 14.5,
  },
  simLbl: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 10,
    marginTop: 2,
  },
  footer: {
    marginTop: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },
});
