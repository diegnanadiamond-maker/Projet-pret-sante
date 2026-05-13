import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { HeartPulse, Building2, ShieldCheck, ArrowRight } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export default function OnboardingScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0F6E56', '#1D9E75', '#5DCAA5']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <View style={styles.logoCircle}>
          <HeartPulse size={36} color="#fff" />
        </View>
        <Text style={styles.title}>Prêt Santé</Text>
        <Text style={styles.subtitle}>
          Financement rapide pour vos soins médicaux, en quelques étapes simples.
        </Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.featRow}>
          <View style={[styles.featIcon, { backgroundColor: '#E1F5EE' }]}>
            <HeartPulse size={20} color="#0F6E56" />
          </View>
          <View style={styles.featText}>
            <Text style={[styles.featTitle, { color: colors.text }]}>Soins financés rapidement</Text>
            <Text style={styles.featDesc}>Dentaire, accouchement, bilans…</Text>
          </View>
        </View>

        <View style={styles.featRow}>
          <View style={[styles.featIcon, { backgroundColor: '#E6F1FB' }]}>
            <Building2 size={20} color="#185FA5" />
          </View>
          <View style={styles.featText}>
            <Text style={[styles.featTitle, { color: colors.text }]}>Banques partenaires</Text>
            <Text style={styles.featDesc}>Comparez et choisissez la meilleure offre</Text>
          </View>
        </View>

        <View style={styles.featRow}>
          <View style={[styles.featIcon, { backgroundColor: '#FAEEDA' }]}>
            <ShieldCheck size={20} color="#854F0B" />
          </View>
          <View style={styles.featText}>
            <Text style={[styles.featTitle, { color: colors.text }]}>100% sécurisé</Text>
            <Text style={styles.featDesc}>Données chiffrées, conformité locale</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.btnPrimary}
          onPress={() => router.replace('/(tabs)')}
        >
          <Text style={styles.btnPrimaryText}>Créer un compte</Text>
          <ArrowRight size={18} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.btnSecondary, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => router.replace('/(tabs)')}
        >
          <Text style={[styles.btnSecondaryText, { color: colors.text }]}>J'ai déjà un compte</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  hero: {
    paddingTop: 80,
    paddingBottom: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
    gap: 16,
  },
  logoCircle: {
    width: 72,
    height: 72,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  body: {
    padding: 24,
    gap: 16,
  },
  featRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: '#E5E7EB',
    gap: 16,
  },
  featIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featText: {
    flex: 1,
  },
  featTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  featDesc: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  footer: {
    padding: 24,
    paddingBottom: 40,
    gap: 12,
  },
  btnPrimary: {
    backgroundColor: '#1D9E75',
    paddingVertical: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  btnPrimaryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  btnSecondary: {
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnSecondaryText: {
    fontSize: 15,
    fontWeight: '500',
  },
});
