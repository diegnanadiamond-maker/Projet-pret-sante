import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Plus, ArrowRight, Smile, Baby, Activity, ChevronRight } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { Fonts, Radius, Shadow, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/components/useColorScheme';
import { useData, LoanRequest } from '@/context/DataContext';
import Screen from '@/components/ui/Screen';
import PulseLine from '@/components/ui/PulseLine';

const CARE_LABELS: Record<number, { label: string; icon: any }> = {
  1: { label: 'Prothèse dentaire', icon: Smile },
  2: { label: 'Accouchement', icon: Baby },
  3: { label: 'Bilan de santé', icon: Activity },
  4: { label: 'Autre soin', icon: Plus },
};

export default function DashboardScreen() {
  const router = useRouter();
  const colors = Colors[useColorScheme() ?? 'light'];
  const { fullName, loans } = useData();

  const firstName = fullName.split(' ')[0] || fullName;

  return (
    <Screen padded>
      <View style={styles.topRow}>
        <View>
          <Text style={[styles.greeting, { color: colors.textMuted }]}>Bonjour {firstName} 👋</Text>
          <Text style={[styles.title, { color: colors.text }]}>Votre espace santé</Text>
        </View>
        <View style={[styles.avatar, { backgroundColor: colors.primarySoft }]}>
          <Text style={[styles.avatarText, { color: colors.primary }]}>{firstName.charAt(0).toUpperCase()}</Text>
        </View>
      </View>

      <TouchableOpacity
        activeOpacity={0.9}
        style={[styles.ctaCard, Shadow.lifted, { backgroundColor: colors.primary }]}
        onPress={() => router.push('/(loan-request)/step-1-care')}
      >
        <View style={styles.ctaPulse}>
          <PulseLine color="rgba(255,255,255,0.18)" width={220} height={40} strokeWidth={3} />
        </View>

        <View style={styles.ctaTop}>
          <View style={styles.ctaIconBadge}>
            <Plus size={26} color={colors.primary} strokeWidth={2.5} />
          </View>
          <View style={styles.ctaArrowBadge}>
            <ArrowRight size={16} color="#FFFFFF" />
          </View>
        </View>

        <Text style={styles.ctaEyebrow}>DEMANDE DE FINANCEMENT</Text>
        <Text style={styles.ctaTitle}>Nouvelle demande</Text>
        <Text style={styles.ctaSub}>Simulez et obtenez votre financement santé en quelques minutes</Text>
      </TouchableOpacity>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Activité récente</Text>
        {loans.length === 0 ? (
          <Text style={[styles.emptyActivity, { color: colors.textMuted }]}>
            Aucune activité pour l'instant — démarrez votre première demande ci-dessus.
          </Text>
        ) : (
          <View style={{ gap: 10 }}>
            {loans.map((loan) => (
              <ActivityRow key={loan.id} loan={loan} colors={colors} onPress={() => router.push({ pathname: '/loan-tracker', params: { id: loan.id } })} />
            ))}
          </View>
        )}
      </View>
    </Screen>
  );
}

function ActivityRow({ loan, colors, onPress }: { loan: LoanRequest; colors: any; onPress: () => void }) {
  const care = CARE_LABELS[loan.loanType] ?? CARE_LABELS[1];

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
      <View style={[styles.activityItem, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={[styles.actIcon, { backgroundColor: colors.secondarySoft }]}>
          <care.icon size={18} color={colors.secondary} />
        </View>
        <View style={styles.actInfo}>
          <Text style={[styles.actTitle, { color: colors.text }]}>{care.label}</Text>
          <Text style={[styles.actSubtitle, { color: colors.textMuted }]}>{loan.establishment}</Text>
        </View>
        <View
          style={[
            styles.actBadge,
            { backgroundColor: loan.status === 'active' ? colors.successSoft : colors.accentSkySoft },
          ]}
        >
          <Text
            style={[
              styles.actBadgeText,
              { color: loan.status === 'active' ? colors.success : colors.accentSky },
            ]}
          >
            {loan.status === 'active' ? 'Accepté' : 'En cours'}
          </Text>
        </View>
        <ChevronRight size={16} color={colors.textMuted} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  greeting: {
    fontFamily: Fonts.body,
    fontSize: 12.5,
  },
  title: {
    fontFamily: Fonts.display,
    fontSize: 21,
    marginTop: 2,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 15,
  },
  ctaCard: {
    marginTop: Spacing.xl,
    padding: 22,
    borderRadius: Radius.xl,
    overflow: 'hidden',
  },
  ctaPulse: {
    position: 'absolute',
    right: -20,
    bottom: -6,
  },
  ctaTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ctaIconBadge: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaArrowBadge: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaEyebrow: {
    fontFamily: Fonts.bodyExtraBold,
    fontSize: 10.5,
    letterSpacing: 1,
    color: 'rgba(255,255,255,0.72)',
    marginTop: 22,
  },
  ctaTitle: {
    fontFamily: Fonts.display,
    fontSize: 26,
    color: '#FFFFFF',
    marginTop: 4,
  },
  ctaSub: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 12.5,
    color: 'rgba(255,255,255,0.82)',
    marginTop: 6,
    lineHeight: 18,
    maxWidth: '86%',
  },
  section: {
    marginTop: Spacing.xxl,
    paddingBottom: Spacing.xxl,
  },
  sectionTitle: {
    fontFamily: Fonts.bodyExtraBold,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  emptyActivity: {
    fontFamily: Fonts.body,
    fontSize: 12.5,
    lineHeight: 18,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: Radius.md,
    borderWidth: 1,
    gap: 12,
  },
  actIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actInfo: {
    flex: 1,
  },
  actTitle: {
    fontFamily: Fonts.bodyBold,
    fontSize: 13.5,
  },
  actSubtitle: {
    fontFamily: Fonts.body,
    fontSize: 11,
    marginTop: 1,
  },
  actBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  actBadgeText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 10,
  },
});
