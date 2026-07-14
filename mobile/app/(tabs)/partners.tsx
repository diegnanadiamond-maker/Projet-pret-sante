import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowRight, Star, Check, MapPin, Stethoscope } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { Fonts, Radius, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/components/useColorScheme';
import { useData } from '@/context/DataContext';
import Screen from '@/components/ui/Screen';
import Card from '@/components/ui/Card';

const BANKS = [
  { name: 'SGCI', full: "Société Générale Côte d'Ivoire", rate: 7.9, delay: '48h', rating: 4.8, logo: require('../../assets/images/sgci.png') },
  { name: 'BNI', full: "Banque Nationale d'Investissement", rate: 9.2, delay: '72h', rating: 4.4, logo: require('../../assets/images/bni.png') },
  { name: 'Ecobank', full: "Ecobank Côte d'Ivoire", rate: 10.5, delay: '5 jours', rating: 4.1, logo: require('../../assets/images/ecobank.png') },
];

const CLINICS = [
  { name: 'Clinique Avicenne', location: 'Abidjan · Cocody', specialty: 'Chirurgie générale', rating: 4.7 },
  { name: 'Centre Médical IBK', location: 'Abidjan · Plateau', specialty: 'Médecine générale', rating: 4.5 },
  { name: 'Polyclinique Internationale', location: 'Abidjan · Marcory', specialty: 'Maternité & pédiatrie', rating: 4.6 },
];

const COMPARE_ROWS: { label: string; render: (b: (typeof BANKS)[number], monthly: (rate: number) => number) => string }[] = [
  { label: 'Taux', render: (b) => `${b.rate}`.replace('.', ',') + '%' },
  { label: 'Mensualité', render: (b, monthly) => formatFCFA(monthly(b.rate)) },
  { label: 'Délai', render: (b) => b.delay },
  { label: 'Note', render: (b) => `${b.rating} ★` },
];

function formatFCFA(v: number) {
  return new Intl.NumberFormat('fr-FR').format(Math.round(v)) + ' FCFA';
}

export default function PartnersScreen() {
  const router = useRouter();
  const colors = Colors[useColorScheme() ?? 'light'];
  const { loanAmount, loanDuration, calculateMonthly } = useData();
  const [tab, setTab] = useState<'clinics' | 'banks'>('banks');
  const [selected, setSelected] = useState<string[]>([]);

  const toggleSelect = (name: string) => {
    setSelected((prev) => (prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]));
  };

  const compared = BANKS.filter((b) => selected.includes(b.name));
  const monthlyFor = (rate: number) => calculateMonthly(loanAmount, loanDuration, rate);

  return (
    <Screen padded>
      <Text style={[styles.header, { color: colors.text }]}>
        Nos <Text style={{ fontFamily: Fonts.displayItalic }}>partenaires</Text>
      </Text>
      <Text style={[styles.sub, { color: colors.textMuted }]}>
        Cliniques agréées et banques qui financent vos soins de santé.
      </Text>

      <View style={[styles.segmented, { backgroundColor: colors.surfaceSunken }]}>
        <TouchableOpacity
          style={[styles.segment, tab === 'clinics' && { backgroundColor: colors.primary }]}
          onPress={() => setTab('clinics')}
        >
          <Text style={[styles.segmentText, { color: tab === 'clinics' ? '#FFFFFF' : colors.textMuted }]}>Cliniques</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.segment, tab === 'banks' && { backgroundColor: colors.primary }]}
          onPress={() => setTab('banks')}
        >
          <Text style={[styles.segmentText, { color: tab === 'banks' ? '#FFFFFF' : colors.textMuted }]}>Banques</Text>
        </TouchableOpacity>
      </View>

      {tab === 'clinics' ? (
        <View style={{ gap: 12, marginTop: Spacing.lg }}>
          {CLINICS.map((c) => (
            <Card key={c.name} style={styles.partnerCard}>
              <View style={[styles.avatar, { backgroundColor: colors.secondarySoft }]}>
                <Stethoscope size={18} color={colors.secondary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.partnerName, { color: colors.text }]}>{c.name}</Text>
                <View style={styles.metaRow}>
                  <MapPin size={11} color={colors.textMuted} />
                  <Text style={[styles.metaText, { color: colors.textMuted }]}>{c.location}</Text>
                </View>
                <View style={styles.metaRow}>
                  <Text style={[styles.metaText, { color: colors.primary, fontFamily: Fonts.bodySemiBold }]}>{c.specialty}</Text>
                  <View style={styles.metaDot} />
                  <Star size={11} color={colors.accentSky} fill={colors.accentSky} />
                  <Text style={[styles.metaText, { color: colors.textMuted }]}>{c.rating}</Text>
                </View>
              </View>
            </Card>
          ))}
        </View>
      ) : (
        <>
          <Text style={[styles.hint, { color: colors.textMuted }]}>
            {selected.length < 2
              ? 'Sélectionnez au moins 2 banques pour les comparer.'
              : `Comparaison de ${selected.length} banques pour ${new Intl.NumberFormat('fr-FR').format(loanAmount)} FCFA sur ${loanDuration} mois.`}
          </Text>

          <View style={{ gap: 12, marginTop: Spacing.sm }}>
            {BANKS.map((b) => {
              const isSelected = selected.includes(b.name);
              return (
                <TouchableOpacity key={b.name} activeOpacity={0.85} onPress={() => toggleSelect(b.name)}>
                  <Card
                    style={[
                      styles.partnerCard,
                      isSelected ? { borderColor: colors.primary, borderWidth: 1.5 } : undefined,
                    ]}
                  >
                    <View style={[styles.logoWrap, { borderColor: colors.border }]}>
                      <Image source={b.logo} style={styles.logoImage} resizeMode="contain" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.partnerName, { color: colors.text }]}>{b.name}</Text>
                      <Text style={[styles.metaText, { color: colors.textMuted }]}>{b.full}</Text>
                      <View style={styles.metaRow}>
                        <Text style={[styles.metaText, { color: colors.primary, fontFamily: Fonts.bodySemiBold }]}>
                          Taux {`${b.rate}`.replace('.', ',')}%
                        </Text>
                        <View style={styles.metaDot} />
                        <Text style={[styles.metaText, { color: colors.textMuted }]}>{b.delay}</Text>
                        <View style={styles.metaDot} />
                        <Star size={11} color={colors.accentSky} fill={colors.accentSky} />
                        <Text style={[styles.metaText, { color: colors.textMuted }]}>{b.rating}</Text>
                      </View>
                    </View>
                    <View
                      style={[
                        styles.checkbox,
                        {
                          backgroundColor: isSelected ? colors.primary : 'transparent',
                          borderColor: isSelected ? colors.primary : colors.borderStrong,
                        },
                      ]}
                    >
                      {isSelected && <Check size={13} color="#FFFFFF" />}
                    </View>
                  </Card>
                </TouchableOpacity>
              );
            })}
          </View>

          {compared.length >= 2 && (
            <Card style={styles.compareCard}>
              <Text style={[styles.compareTitle, { color: colors.text }]}>Comparatif</Text>
              <View style={styles.compareHeaderRow}>
                <View style={styles.compareLabelCol} />
                {compared.map((b) => (
                  <View key={b.name} style={styles.compareCol}>
                    <Text style={[styles.compareBankName, { color: colors.text }]} numberOfLines={1}>
                      {b.name}
                    </Text>
                  </View>
                ))}
              </View>
              {COMPARE_ROWS.map((row) => (
                <View key={row.label} style={[styles.compareRow, { borderTopColor: colors.border }]}>
                  <View style={styles.compareLabelCol}>
                    <Text style={[styles.compareLabel, { color: colors.textMuted }]}>{row.label}</Text>
                  </View>
                  {compared.map((b) => (
                    <View key={b.name} style={styles.compareCol}>
                      <Text style={[styles.compareValue, { color: colors.text }]}>{row.render(b, monthlyFor)}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </Card>
          )}
        </>
      )}

      <TouchableOpacity
        style={[styles.ctaBanner, { backgroundColor: colors.secondary }]}
        onPress={() => router.push('/(loan-request)/step-1-care')}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.ctaTitle}>Simulez votre prêt santé</Text>
          <Text style={styles.ctaSub}>Choisissez une clinique et une banque en direct</Text>
        </View>
        <View style={styles.ctaArrow}>
          <ArrowRight size={16} color={colors.secondary} />
        </View>
      </TouchableOpacity>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    fontFamily: Fonts.display,
    fontSize: 25,
    marginTop: Spacing.xs,
  },
  sub: {
    fontFamily: Fonts.body,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 6,
  },
  segmented: {
    flexDirection: 'row',
    borderRadius: Radius.pill,
    padding: 4,
    marginTop: Spacing.lg,
  },
  segment: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: Radius.pill,
    alignItems: 'center',
  },
  segmentText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 13,
  },
  hint: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 12,
    marginTop: Spacing.md,
  },
  partnerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrap: {
    width: 52,
    height: 52,
    borderRadius: Radius.sm,
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  partnerName: {
    fontFamily: Fonts.bodyBold,
    fontSize: 14.5,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 4,
  },
  metaText: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 10.5,
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#C7D2E3',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compareCard: {
    marginTop: Spacing.md,
    gap: 0,
  },
  compareTitle: {
    fontFamily: Fonts.bodyBold,
    fontSize: 14,
    marginBottom: 10,
  },
  compareHeaderRow: {
    flexDirection: 'row',
    paddingBottom: 8,
  },
  compareRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  compareLabelCol: {
    width: 78,
    justifyContent: 'center',
  },
  compareLabel: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 11.5,
  },
  compareCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compareBankName: {
    fontFamily: Fonts.bodyBold,
    fontSize: 12,
    textAlign: 'center',
  },
  compareValue: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 12,
    textAlign: 'center',
  },
  ctaBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 18,
    borderRadius: Radius.lg,
    marginTop: Spacing.xl,
    marginBottom: Spacing.xxl,
  },
  ctaTitle: {
    fontFamily: Fonts.bodyBold,
    fontSize: 14.5,
    color: '#FFFFFF',
  },
  ctaSub: {
    fontFamily: Fonts.body,
    fontSize: 11.5,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 2,
  },
  ctaArrow: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
