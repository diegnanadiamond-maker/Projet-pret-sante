import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Smile, Baby, Activity, Plus, FileClock, ShieldCheck, Banknote, Check, CalendarDays, FolderX } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { Fonts, Radius, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/components/useColorScheme';
import { useData } from '@/context/DataContext';
import Screen from '@/components/ui/Screen';
import StepHeader from '@/components/ui/StepHeader';
import Card from '@/components/ui/Card';

const CARE_LABELS: Record<number, { label: string; icon: any }> = {
  1: { label: 'Prothèse dentaire', icon: Smile },
  2: { label: 'Accouchement', icon: Baby },
  3: { label: 'Bilan de santé', icon: Activity },
  4: { label: 'Autre soin', icon: Plus },
};

const TRACK_STEPS = [
  { icon: FileClock, label: 'Demande envoyée' },
  { icon: ShieldCheck, label: 'Examen bancaire' },
  { icon: Banknote, label: 'Décaissement' },
];

function formatFCFA(v: number) {
  return new Intl.NumberFormat('fr-FR').format(Math.round(v)) + ' FCFA';
}

export default function LoanTrackerScreen() {
  const colors = Colors[useColorScheme() ?? 'light'];
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { loans, calculateMonthly } = useData();

  const loan = loans.find((l) => l.id === id);

  if (!loan) {
    return (
      <Screen padded contentStyle={{ flex: 1 }}>
        <StepHeader title="Suivi de mon prêt" />
        <View style={styles.notFoundWrap}>
          <View style={[styles.notFoundIcon, { backgroundColor: colors.accentSkySoft }]}>
            <FolderX size={26} color={colors.accentSky} />
          </View>
          <Text style={[styles.notFoundTitle, { color: colors.text }]}>Dossier introuvable</Text>
          <Text style={[styles.notFoundBody, { color: colors.textMuted }]}>
            Cette demande n'existe plus ou a été supprimée.
          </Text>
        </View>
      </Screen>
    );
  }

  const monthly = calculateMonthly(loan.loanAmount, loan.loanDuration, loan.selectedOffer?.rate ?? 8.5);
  const activeStepIndex = loan.status === 'in_review' ? 1 : 2;
  const care = CARE_LABELS[loan.loanType] ?? CARE_LABELS[1];

  return (
    <Screen padded>
      <StepHeader title="Suivi de mon prêt" />

      <View style={styles.contextRow}>
        <View style={[styles.contextIcon, { backgroundColor: colors.secondarySoft }]}>
          <care.icon size={18} color={colors.secondary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.contextTitle, { color: colors.text }]}>{care.label}</Text>
          <Text style={[styles.contextSub, { color: colors.textMuted }]}>{loan.establishment}</Text>
        </View>
        <View
          style={[styles.contextBadge, { backgroundColor: loan.status === 'active' ? colors.successSoft : colors.accentSkySoft }]}
        >
          <Text style={[styles.contextBadgeText, { color: loan.status === 'active' ? colors.success : colors.accentSky }]}>
            {loan.status === 'active' ? 'Accepté' : 'En cours'}
          </Text>
        </View>
      </View>

      <View style={styles.trackBlock}>
        <Text style={[styles.trackAmount, { color: colors.text }]}>{formatFCFA(loan.loanAmount)}</Text>
        <Text style={[styles.trackSub, { color: colors.textMuted }]}>
          {loan.selectedOffer ? `${loan.selectedOffer.bank} · ${loan.loanDuration} mois` : `${loan.loanDuration} mois`}
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.textMuted, marginTop: Spacing.xl }]}>Suivi de la demande</Text>

        <View style={styles.trackSteps}>
          {TRACK_STEPS.map((s, i) => {
            const done = i < activeStepIndex;
            const active = i === activeStepIndex;
            return (
              <View key={i} style={styles.trackStepRow}>
                {i < TRACK_STEPS.length - 1 && (
                  <View style={[styles.trackLine, { backgroundColor: done ? colors.primary : colors.border }]} />
                )}
                <View
                  style={[
                    styles.trackDot,
                    {
                      backgroundColor: done || active ? colors.primary : colors.surface,
                      borderColor: done || active ? colors.primary : colors.border,
                    },
                  ]}
                >
                  {done ? <Check size={15} color="#fff" /> : <s.icon size={15} color={done || active ? '#fff' : colors.textMuted} />}
                </View>
                <Text
                  style={[
                    styles.trackStepLabel,
                    { color: done || active ? colors.text : colors.textMuted, fontFamily: active ? Fonts.bodyBold : Fonts.bodyMedium },
                  ]}
                >
                  {s.label}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      {loan.status === 'active' && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Échéancier</Text>
          <View style={{ gap: 10 }}>
            {[1, 2, 3].map((n) => (
              <Card key={n} style={styles.payRow}>
                <View style={[styles.payIcon, { backgroundColor: colors.secondarySoft }]}>
                  <CalendarDays size={16} color={colors.secondary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.payTitle, { color: colors.text }]}>Échéance {n}</Text>
                  <Text style={[styles.paySub, { color: colors.textMuted }]}>25/0{n + 5}/2026</Text>
                </View>
                <Text style={[styles.payAmount, { color: colors.text }]}>{formatFCFA(monthly)}</Text>
              </Card>
            ))}
          </View>
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  notFoundWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingBottom: 60,
  },
  notFoundIcon: {
    width: 56,
    height: 56,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  notFoundTitle: {
    fontFamily: Fonts.bodyBold,
    fontSize: 16,
  },
  notFoundBody: {
    fontFamily: Fonts.body,
    fontSize: 13,
    textAlign: 'center',
  },
  contextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  contextIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contextTitle: {
    fontFamily: Fonts.bodyBold,
    fontSize: 14.5,
  },
  contextSub: {
    fontFamily: Fonts.body,
    fontSize: 12,
    marginTop: 1,
  },
  contextBadge: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 12,
  },
  contextBadgeText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 10.5,
  },
  trackBlock: {
    marginTop: Spacing.sm,
  },
  trackAmount: {
    fontFamily: Fonts.display,
    fontSize: 30,
  },
  trackSub: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 13,
    marginTop: 2,
  },
  trackSteps: {
    marginTop: 4,
  },
  trackStepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 11,
    position: 'relative',
  },
  trackDot: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  trackStepLabel: {
    fontSize: 14.5,
  },
  trackLine: {
    position: 'absolute',
    left: 16.25,
    top: 45,
    width: 2,
    height: 22,
  },
  section: {
    marginTop: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },
  sectionTitle: {
    fontFamily: Fonts.bodyExtraBold,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  payRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  payIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payTitle: {
    fontFamily: Fonts.bodyBold,
    fontSize: 13,
  },
  paySub: {
    fontFamily: Fonts.body,
    fontSize: 11,
    marginTop: 1,
  },
  payAmount: {
    fontFamily: Fonts.bodyBold,
    fontSize: 13,
  },
});
