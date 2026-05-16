import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Star, ChevronRight } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

import { useData } from '@/context/DataContext';

export default function BankOffersScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const { loanAmount, loanDuration, calculateMonthly } = useData();

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('fr-FR').format(val);
  };

  const calculateOfferMonthly = (rate: number) => {
    const r = rate / 100 / 12;
    const m = loanAmount * r * Math.pow(1 + r, loanDuration) / (Math.pow(1 + r, loanDuration) - 1);
    return formatPrice(Math.round(m));
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{`3 offres disponibles pour ${formatPrice(loanAmount)} FCFA sur ${loanDuration} mois`}</Text>
      </View>

      <View style={styles.list}>
        <OfferCard 
          bank="SGCI Santé +"
          bankFullName="Société Générale CI"
          rate="7,9%"
          monthly={calculateOfferMonthly(7.9)}
          delay="48h"
          isBest={true}
          onPress={() => router.push('/(tabs)/profile')}
          colors={colors}
        />

        <OfferCard 
          bank="BNI Crédit Santé"
          bankFullName="Banque Nationale d'Investissement"
          rate="9,2%"
          monthly={calculateOfferMonthly(9.2)}
          delay="72h"
          colors={colors}
        />

        <OfferCard 
          bank="ECOBANK Flex"
          bankFullName="Ecobank Côte d'Ivoire"
          rate="10,5%"
          monthly={calculateOfferMonthly(10.5)}
          delay="5 jours"
          colors={colors}
        />
      </View>
    </ScrollView>
  );
}

function OfferCard({ bank, bankFullName, rate, monthly, delay, isBest, onPress, colors }: any) {
  return (
    <View style={[styles.card, { borderColor: colors.border, backgroundColor: colors.background }, isBest && { borderColor: colors.primary, borderWidth: 1.5 }]}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={[styles.bankName, { color: colors.text }]}>{bank}</Text>
          <Text style={styles.bankSub}>{bankFullName}</Text>
        </View>
        {isBest && (
          <View style={[styles.bestBadge, { backgroundColor: colors.primary }]}>
            <Text style={styles.bestBadgeText}>Meilleure offre</Text>
          </View>
        )}
      </View>

      <View style={styles.stats}>
        <StatBox value={rate} label="Taux" colors={colors} />
        <StatBox value={monthly} label="/ mois (FCFA)" colors={colors} />
        <StatBox value={delay} label="Délai" colors={colors} />
      </View>

      <TouchableOpacity 
        style={[styles.btn, isBest ? { backgroundColor: colors.primary } : { backgroundColor: '#F9FAFB', borderWidth: 0.5, borderColor: colors.border }]}
        onPress={onPress}
      >
        <Text style={[styles.btnText, isBest ? { color: '#fff' } : { color: colors.text }]}>Choisir cette offre</Text>
        <ChevronRight size={16} color={isBest ? '#fff' : colors.text} />
      </TouchableOpacity>
    </View>
  );
}

function StatBox({ value, label, colors }: any) {
  return (
    <View style={[styles.statBox, { backgroundColor: '#F9FAFB', borderColor: colors.border }]}>
      <Text style={[styles.statValue, { color: colors.text }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  list: {
    padding: 16,
    gap: 16,
  },
  card: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 0.5,
    gap: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  bankName: {
    fontSize: 16,
    fontWeight: '700',
  },
  bankSub: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  bestBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  bestBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  stats: {
    flexDirection: 'row',
    gap: 8,
  },
  statBox: {
    flex: 1,
    padding: 10,
    borderRadius: 12,
    borderWidth: 0.5,
    alignItems: 'center',
    gap: 2,
  },
  statValue: {
    fontSize: 15,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
  },
  btn: {
    paddingVertical: 14,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  btnText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
