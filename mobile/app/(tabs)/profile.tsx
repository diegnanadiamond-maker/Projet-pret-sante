import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { User, IdCard, FileText, BuildingBank, NotebookMedical, Settings, Check, Upload, ChevronRight } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.hero, { backgroundColor: colors.secondary }]}>
        <View style={styles.profileAvatar}>
          <User size={32} color="#fff" />
        </View>
        <Text style={styles.profileName}>Kouamé Adou</Text>
        <Text style={styles.profileInfo}>koua.adou@email.com · +225 07 00 00 00</Text>
      </View>

      <View style={styles.kycContainer}>
        <View style={[styles.kycCard, { borderColor: colors.border, backgroundColor: colors.background }]}>
          <Text style={styles.kycTitle}>Profil KYC complété</Text>
          <View style={[styles.progressBar, { backgroundColor: '#F3F4F6' }]}>
            <View style={[styles.progressFill, { width: '65%', backgroundColor: colors.primary }]} />
          </View>
          <Text style={[styles.kycPct, { color: colors.primary }]}>65% — 2 documents manquants</Text>
        </View>
      </View>

      <View style={styles.menuList}>
        <MenuItem 
          icon={<IdCard size={20} color={colors.primary} />}
          title="Carte Nationale d'Identité"
          subtitle="Recto-verso · Vérifié"
          status="done"
          colors={colors}
        />
        <MenuItem 
          icon={<FileText size={20} color={colors.primary} />}
          title="Bulletins de salaire"
          subtitle="3 derniers mois · Vérifié"
          status="done"
          colors={colors}
        />
        <MenuItem 
          icon={<BuildingBank size={20} color="#854F0B" />}
          title="Relevé bancaire"
          subtitle="Non fourni · En attente"
          status="upload"
          colors={colors}
        />
        <MenuItem 
          icon={<NotebookMedical size={20} color="#854F0B" />}
          title="Devis médical"
          subtitle="Non fourni · En attente"
          status="upload"
          colors={colors}
        />
        <View style={{ height: 16 }} />
        <MenuItem 
          icon={<Settings size={20} color="#6B7280" />}
          title="Paramètres du compte"
          subtitle="Sécurité, notifications"
          status="chevron"
          colors={colors}
        />
      </View>
    </ScrollView>
  );
}

function MenuItem({ icon, title, subtitle, status, colors }: any) {
  return (
    <TouchableOpacity style={[styles.menuItem, { backgroundColor: '#F9FAFB', borderColor: colors.border }]}>
      <View style={styles.menuLead}>{icon}</View>
      <View style={styles.menuText}>
        <Text style={[styles.menuTitle, { color: colors.text }]}>{title}</Text>
        <Text style={styles.menuSubtitle}>{subtitle}</Text>
      </View>
      <View style={styles.menuTrail}>
        {status === 'done' && (
          <View style={[styles.checkCircle, { backgroundColor: colors.primary }]}>
            <Check size={12} color="#fff" />
          </View>
        )}
        {status === 'upload' && <Upload size={18} color="#6B7280" />}
        {status === 'chevron' && <ChevronRight size={18} color="#6B7280" />}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  hero: {
    paddingTop: 30,
    paddingBottom: 50,
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 8,
  },
  profileAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  profileInfo: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  kycContainer: {
    paddingHorizontal: 16,
    marginTop: -25,
  },
  kycCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 0.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  kycTitle: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 10,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  kycPct: {
    fontSize: 11,
    textAlign: 'right',
    fontWeight: '600',
  },
  menuList: {
    padding: 16,
    gap: 8,
    marginTop: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 0.5,
    gap: 14,
  },
  menuLead: {
    width: 24,
    alignItems: 'center',
  },
  menuText: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  menuSubtitle: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 1,
  },
  menuTrail: {
    width: 24,
    alignItems: 'flex-end',
  },
  checkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
