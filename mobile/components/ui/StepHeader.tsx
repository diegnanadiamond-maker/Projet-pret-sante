import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { Fonts, Radius, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/components/useColorScheme';

type Props = {
  title?: string;
  step?: number;
  totalSteps?: number;
  onBack?: () => void;
  showBack?: boolean;
};

// Shared header for stacked (non-tab) flows: back arrow + optional step dots.
// Bleeds out of the parent Screen's own horizontal padding (-22) so the back
// button can sit close to the true screen edge instead of stacking paddings.
export default function StepHeader({ title, step, totalSteps, onBack, showBack = true }: Props) {
  const router = useRouter();
  const colors = Colors[useColorScheme() ?? 'light'];

  return (
    <View style={styles.row}>
      {showBack ? (
        <TouchableOpacity
          onPress={onBack ?? (() => router.back())}
          style={[styles.backBtn, { backgroundColor: 'rgba(255,255,255,0.22)', borderColor: 'rgba(255,255,255,0.3)' }]}
        >
          <ArrowLeft size={18} color="#FFFFFF" />
        </TouchableOpacity>
      ) : (
        <View style={styles.spacer} />
      )}

      {title ? (
        <View style={[styles.titleBadge, { backgroundColor: colors.primary }]}>
          <Text style={styles.titleBadgeText} numberOfLines={1}>
            {title}
          </Text>
        </View>
      ) : (
        <View style={{ flex: 1 }} />
      )}

      {totalSteps ? (
        <View style={styles.dots}>
          {Array.from({ length: totalSteps }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  backgroundColor: i < (step ?? 0) ? '#FFFFFF' : 'rgba(255,255,255,0.35)',
                  width: i === (step ?? 0) - 1 ? 18 : 6,
                },
              ]}
            />
          ))}
        </View>
      ) : (
        <View style={styles.spacer} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: -22,
    paddingHorizontal: 10,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
    gap: Spacing.sm,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  spacer: {
    width: 40,
    height: 40,
  },
  titleBadge: {
    flexShrink: 1,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: Radius.pill,
  },
  titleBadgeText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 13.5,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    width: 40,
    justifyContent: 'flex-end',
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
});
