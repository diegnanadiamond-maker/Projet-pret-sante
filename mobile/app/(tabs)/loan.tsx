import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Smile, Baby, Activity, Plus, ArrowRight, ChevronDown } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import Slider from '@react-native-community/slider';

import { useData } from '@/context/DataContext';

export default function LoanRequestScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const { 
    loanAmount, setLoanAmount, 
    loanDuration, setLoanDuration, 
    loanType, setLoanType,
    calculateMonthly
  } = useData();

  const [monthly, setMonthly] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const m = calculateMonthly(loanAmount, loanDuration);
    setMonthly(m);
    setTotal(m * loanDuration);
  }, [loanAmount, loanDuration]);

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('fr-FR').format(val) + ' FCFA';
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.formBody}>
        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Type de soin</Text>
          <View style={styles.typeGrid}>
            <TypeCard 
              id={1} 
              icon={<Smile size={24} color={loanType === 1 ? colors.primary : '#1D9E75'} />} 
              label="Prothèse dentaire" 
              selected={loanType === 1} 
              onPress={() => setLoanType(1)}
              colors={colors}
            />
            <TypeCard 
              id={2} 
              icon={<Baby size={24} color={loanType === 2 ? colors.primary : '#1D9E75'} />} 
              label="Accouchement" 
              selected={loanType === 2} 
              onPress={() => setLoanType(2)}
              colors={colors}
            />
            <TypeCard 
              id={3} 
              icon={<Activity size={24} color={loanType === 3 ? colors.primary : '#1D9E75'} />} 
              label="Bilan de santé" 
              selected={loanType === 3} 
              onPress={() => setLoanType(3)}
              colors={colors}
            />
            <TypeCard 
              id={4} 
              icon={<Plus size={24} color={loanType === 4 ? colors.primary : '#1D9E75'} />} 
              label="Autre soin" 
              selected={loanType === 4} 
              onPress={() => setLoanType(4)}
              colors={colors}
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Établissement de santé</Text>
          <TouchableOpacity style={[styles.select, { backgroundColor: '#F9FAFB', borderColor: colors.border }]}>
            <Text style={{ color: colors.text }}>Clinique Avicenne – Abidjan</Text>
            <ChevronDown size={18} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Montant souhaité</Text>
          <View style={[styles.amountDisplay, { backgroundColor: '#F9FAFB', borderColor: colors.border }]}>
            <Text style={[styles.amountBig, { color: colors.secondary }]}>{formatPrice(loanAmount)}</Text>
            <Text style={styles.amountSmall}>Déplacez le curseur pour ajuster</Text>
          </View>
          <Slider
            style={{ width: '100%', height: 40, marginTop: 8 }}
            minimumValue={50000}
            maximumValue={1000000}
            step={10000}
            value={loanAmount}
            onValueChange={setLoanAmount}
            minimumTrackTintColor={colors.primary}
            maximumTrackTintColor={colors.border}
            thumbTintColor={colors.primary}
          />
          <View style={styles.rangeLabels}>
            <Text style={styles.rangeText}>50 000</Text>
            <Text style={styles.rangeText}>1 000 000 FCFA</Text>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>Durée de remboursement</Text>
          <View style={styles.durationGrid}>
            {[6, 12, 18, 24].map((d) => (
              <TouchableOpacity 
                key={d}
                style={[
                  styles.durationBtn, 
                  { borderColor: colors.border },
                  loanDuration === d && { backgroundColor: colors.lightGreen, borderColor: colors.primary }
                ]}
                onPress={() => setLoanDuration(d)}
              >
                <Text style={[
                  styles.durationText, 
                  { color: colors.text },
                  loanDuration === d && { color: colors.secondary, fontWeight: '700' }
                ]}>
                  {d} mois
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={[styles.simCard, { backgroundColor: colors.lightGreen, borderColor: '#9FE1CB' }]}>
          <View style={styles.simItem}>
            <Text style={[styles.simVal, { color: colors.secondary }]}>{formatPrice(monthly)}</Text>
            <Text style={[styles.simLbl, { color: colors.primary }]}>/ mois</Text>
          </View>
          <View style={styles.simItem}>
            <Text style={[styles.simVal, { color: colors.secondary }]}>8,5%</Text>
            <Text style={[styles.simLbl, { color: colors.primary }]}>Taux</Text>
          </View>
          <View style={styles.simItem}>
            <Text style={[styles.simVal, { color: colors.secondary }]}>{formatPrice(total)}</Text>
            <Text style={[styles.simLbl, { color: colors.primary }]}>Total</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.btnPrimary, { backgroundColor: colors.primary }]}
          onPress={() => router.push('/(tabs)/banks')}
        >
          <Text style={styles.btnPrimaryText}>Voir les offres</Text>
          <ArrowRight size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function TypeCard({ id, icon, label, selected, onPress, colors }: any) {
  return (
    <TouchableOpacity 
      style={[
        styles.typeCard, 
        { backgroundColor: '#F9FAFB', borderColor: colors.border },
        selected && { borderColor: colors.primary, backgroundColor: colors.lightGreen }
      ]} 
      onPress={onPress}
    >
      {icon}
      <Text style={[styles.typeLabel, { color: colors.text }, selected && { fontWeight: '600' }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formBody: {
    padding: 16,
    gap: 20,
  },
  formGroup: {
    gap: 8,
  },
  formLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    paddingHorizontal: 4,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  typeCard: {
    width: '48%',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    gap: 8,
  },
  typeLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  select: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 0.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amountDisplay: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 0.5,
    alignItems: 'center',
  },
  amountBig: {
    fontSize: 28,
    fontWeight: '700',
  },
  amountSmall: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 4,
  },
  rangeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  rangeText: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  durationGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  durationBtn: {
    width: '23%',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  durationText: {
    fontSize: 12,
  },
  simCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  simItem: {
    alignItems: 'center',
  },
  simVal: {
    fontSize: 15,
    fontWeight: '700',
  },
  simLbl: {
    fontSize: 10,
    marginTop: 2,
    fontWeight: '500',
  },
  btnPrimary: {
    marginTop: 8,
    paddingVertical: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 40,
  },
  btnPrimaryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
