import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Smile, Baby, Activity, Plus, ChevronDown } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { Fonts, Radius, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/components/useColorScheme';
import { useData } from '@/context/DataContext';
import Screen from '@/components/ui/Screen';
import StepHeader from '@/components/ui/StepHeader';
import Button from '@/components/ui/Button';

const CARE_TYPES = [
  { id: 1, icon: Smile, label: 'Prothèse dentaire' },
  { id: 2, icon: Baby, label: 'Accouchement' },
  { id: 3, icon: Activity, label: 'Bilan de santé' },
  { id: 4, icon: Plus, label: 'Autre soin' },
];

const ESTABLISHMENTS = ['Clinique Avicenne – Abidjan', 'Centre Médical IBK – Plateau', 'Polyclinique Internationale'];

export default function CareTypeStep() {
  const router = useRouter();
  const colors = Colors[useColorScheme() ?? 'light'];
  const { loanType, setLoanType, establishment, setEstablishment } = useData();
  const [showPicker, setShowPicker] = React.useState(false);

  return (
    <Screen padded>
      <StepHeader step={1} totalSteps={4} />

      <Text style={[styles.title, { color: colors.text }]}>
        Quel soin allez-vous{' '}
        <Text style={{ fontFamily: Fonts.displayItalic }}>financer</Text> ?
      </Text>
      <Text style={[styles.sub, { color: colors.textMuted }]}>Choisissez la catégorie qui correspond le mieux.</Text>

      <View style={styles.grid}>
        {CARE_TYPES.map((c) => {
          const selected = loanType === c.id;
          return (
            <TouchableOpacity
              key={c.id}
              style={[
                styles.card,
                {
                  backgroundColor: selected ? colors.primarySoft : colors.surface,
                  borderColor: selected ? colors.primary : colors.border,
                },
              ]}
              onPress={() => setLoanType(c.id)}
            >
              <c.icon size={24} color={selected ? colors.primary : colors.textMuted} />
              <Text style={[styles.cardLabel, { color: selected ? colors.primary : colors.text }, selected && { fontFamily: Fonts.bodyBold }]}>
                {c.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.formGroup}>
        <Text style={[styles.formLabel, { color: colors.textMuted }]}>Établissement de santé</Text>
        <TouchableOpacity
          style={[styles.select, { backgroundColor: colors.surfaceSunken, borderColor: colors.border }]}
          onPress={() => setShowPicker((v) => !v)}
        >
          <Text style={{ fontFamily: Fonts.bodyMedium, color: colors.text }}>{establishment}</Text>
          <ChevronDown size={18} color={colors.textMuted} />
        </TouchableOpacity>
        {showPicker && (
          <View style={[styles.optionsList, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            {ESTABLISHMENTS.map((e) => (
              <TouchableOpacity
                key={e}
                style={styles.optionItem}
                onPress={() => {
                  setEstablishment(e);
                  setShowPicker(false);
                }}
              >
                <Text style={{ fontFamily: Fonts.bodyMedium, fontSize: 13, color: colors.text }}>{e}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <Button label="Continuer" onPress={() => router.push('/(loan-request)/step-2-amount')} />
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  card: {
    width: '48%',
    padding: 16,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    alignItems: 'center',
    gap: 8,
  },
  cardLabel: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 12,
    textAlign: 'center',
  },
  formGroup: {
    gap: 8,
    marginTop: Spacing.xl,
  },
  formLabel: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 12,
    paddingHorizontal: 2,
  },
  select: {
    padding: 15,
    borderRadius: Radius.sm,
    borderWidth: 1.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionsList: {
    borderRadius: Radius.sm,
    borderWidth: 1,
    overflow: 'hidden',
  },
  optionItem: {
    padding: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  footer: {
    marginTop: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },
});
