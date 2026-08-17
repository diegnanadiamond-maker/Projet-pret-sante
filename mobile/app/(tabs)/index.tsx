import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus, ArrowRight, Smile, Baby, Activity, ChevronRight, HeartPulse } from 'lucide-react-native';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Colors from '@/constants/Colors';
import { Fonts, Radius, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/components/useColorScheme';
import { useData, LoanRequest } from '@/context/DataContext';
import Screen from '@/components/ui/Screen';
import PulseLine from '@/components/ui/PulseLine';

const CARE_LABELS: Record<number, { label: string; icon: any }> = {
  1: { label: 'Soins dentaires', icon: Smile },
  2: { label: 'Maternité & accouchement', icon: Baby },
  3: { label: 'Bilan de santé', icon: Activity },
  4: { label: 'Autre besoin de santé', icon: Plus },
};

export default function DashboardScreen() {
  const router = useRouter();
  const colors = Colors[useColorScheme() ?? 'light'];
  const { fullName, loans } = useData();

  const firstName = fullName.split(' ')[0] || fullName;

  const cardScale = useSharedValue(1);
  const cardStyle = useAnimatedStyle(() => ({ transform: [{ scale: cardScale.value }] }));

  // The arrow chip gently nudges right in a loop to invite the tap.
  const arrowShift = useSharedValue(0);
  useEffect(() => {
    arrowShift.value = withRepeat(
      withSequence(withTiming(5, { duration: 650 }), withTiming(0, { duration: 650 })),
      -1
    );
  }, []);
  const arrowStyle = useAnimatedStyle(() => ({ transform: [{ translateX: arrowShift.value }] }));

  return (
    <Screen padded>
      <Animated.View entering={FadeInDown.duration(350)} style={styles.topRow}>
        <View>
          <Text style={[styles.greeting, { color: colors.headingMuted }]}>Bonjour {firstName} 👋</Text>
          <Text style={[styles.title, { color: colors.heading }]}>Votre espace santé</Text>
        </View>
        <View style={[styles.avatar, { backgroundColor: '#FFFFFF' }]}>
          <Text style={[styles.avatarText, { color: colors.primary }]}>{firstName.charAt(0).toUpperCase()}</Text>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(80).duration(350)}>
        <Pressable
          onPress={() => router.push('/(loan-request)/step-1-care')}
          onPressIn={() => (cardScale.value = withSpring(0.98, { damping: 16, stiffness: 240 }))}
          onPressOut={() => (cardScale.value = withSpring(1, { damping: 16, stiffness: 240 }))}
        >
          <Animated.View style={[styles.ctaShadow, cardStyle]}>
            <LinearGradient
              colors={['#0E7A80', '#19A9B1']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.ctaCard}
            >
              <View style={styles.ctaPulse}>
                <PulseLine color="rgba(255,255,255,0.18)" width={220} height={40} strokeWidth={3} />
              </View>

              <View style={styles.ctaTop}>
                <View style={styles.ctaIconBadge}>
                  <Plus size={26} color={colors.primary} strokeWidth={2.5} />
                </View>
                <Animated.View style={[styles.ctaArrowBadge, arrowStyle]}>
                  <ArrowRight size={17} color="#0E7A80" strokeWidth={2.4} />
                </Animated.View>
              </View>

              <Text style={styles.ctaEyebrow}>DEMANDE DE FINANCEMENT</Text>
              <Text style={styles.ctaTitle}>Nouvelle demande</Text>
              <Text style={styles.ctaSub}>Simulez et obtenez votre financement santé en quelques minutes</Text>
            </LinearGradient>
          </Animated.View>
        </Pressable>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(160).duration(350)} style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.headingMuted }]}>Activité récente</Text>
        {loans.length === 0 ? (
          <View style={styles.emptyCard}>
            <View style={[styles.emptyIcon, { backgroundColor: colors.primarySoft }]}>
              <HeartPulse size={20} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.emptyTitle, { color: colors.text }]}>Aucune activité pour l'instant</Text>
              <Text style={[styles.emptyBody, { color: colors.textMuted }]}>
                Démarrez votre première demande ci-dessus — un parcours simple, sécurisé et transparent.
              </Text>
            </View>
          </View>
        ) : (
          <View style={{ gap: 10 }}>
            {loans.map((loan) => (
              <ActivityRow key={loan.id} loan={loan} colors={colors} onPress={() => router.push({ pathname: '/loan-tracker', params: { id: loan.id } })} />
            ))}
          </View>
        )}
      </Animated.View>
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
    fontSize: 13.5,
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
  ctaShadow: {
    marginTop: Spacing.xl,
    borderRadius: Radius.xl,
    shadowColor: '#0B3B3E',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.28,
    shadowRadius: 24,
    elevation: 10,
  },
  ctaCard: {
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
    width: 38,
    height: 38,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#062E30',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
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
    fontSize: 13.5,
    color: 'rgba(255,255,255,0.82)',
    marginTop: 6,
    lineHeight: 20,
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
  emptyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    borderRadius: Radius.md,
    backgroundColor: 'rgba(255,255,255,0.94)',
  },
  emptyIcon: {
    width: 42,
    height: 42,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontFamily: Fonts.bodyBold,
    fontSize: 14.5,
  },
  emptyBody: {
    fontFamily: Fonts.body,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 2,
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
    fontSize: 12,
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
