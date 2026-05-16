import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Plus, Building2, FileUp, Calendar, Check, Smile, Activity, Stethoscope } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

import { useData } from '@/context/DataContext';

export default function DashboardScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { kycPct } = useData();

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.secondary }]}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greetingText}>Bonjour 👋</Text>
            <Text style={styles.userName}>Kouamé Adou</Text>
          </View>
          <View style={styles.avatar}>
            <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: '#fff' }} />
          </View>
        </View>
      </View>

      <View style={styles.balanceCardContainer}>
        <View style={[styles.balanceCard, { borderColor: colors.border, backgroundColor: colors.background }]}>
          <View style={{ flex: 1 }}>
            <Text style={styles.balanceLabel}>{kycPct < 100 ? "Finalisez votre profil" : "Prêt en cours"}</Text>
            <Text style={[styles.balanceAmount, { color: colors.text }]}>{kycPct < 100 ? `${kycPct}% complété` : "350 000 FCFA"}</Text>
            <Text style={[styles.balanceSub, { color: colors.primary }]}>
              {kycPct < 100 ? "Ajoutez les documents manquants" : "Prochain versement : 25 juin"}
            </Text>
          </View>
          <TouchableOpacity 
            style={[styles.statusPill, { backgroundColor: kycPct < 100 ? '#FAEEDA' : colors.lightGreen }]}
            onPress={() => router.push('/(tabs)/profile')}
          >
            {kycPct === 100 && <Check size={12} color={colors.secondary} />}
            <Text style={[styles.statusText, { color: kycPct < 100 ? '#854F0B' : colors.secondary }]}>
              {kycPct < 100 ? "Action requise" : "Actif"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actions rapides</Text>
        <View style={styles.quickActions}>
          <QuickActionButton 
            icon={<Plus size={24} color={colors.primary} />} 
            label="Nouveau prêt" 
            onPress={() => router.push('/(tabs)/loan')}
          />
          <QuickActionButton 
            icon={<Building2 size={24} color="#185FA5" />} 
            label="Banques" 
            onPress={() => router.push('/(tabs)/banks')}
          />
          <QuickActionButton 
            icon={<FileUp size={24} color="#854F0B" />} 
            label="Documents" 
          />
          <QuickActionButton 
            icon={<Calendar size={24} color="#A32D2D" />} 
            label="Échéancier" 
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Activité récente</Text>
        <View style={styles.activityList}>
          <ActivityItem 
            icon={<Smile size={18} color={colors.secondary} />}
            iconBg={colors.lightGreen}
            title="Prothèse dentaire"
            subtitle="Clinique Avicenne · 15 mai"
            status="Accepté"
            statusType="ok"
            colors={colors}
          />
          <ActivityItem 
            icon={<Stethoscope size={18} color="#185FA5" />}
            iconBg="#E6F1FB"
            title="Bilan de santé"
            subtitle="Centre Médical IBK · 2 mai"
            status="En cours"
            statusType="pending"
            colors={colors}
          />
        </View>
      </View>
    </ScrollView>
  );
}

function UserIcon({ size, color }: { size: number, color: string }) {
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color }} />
  );
}

function QuickActionButton({ icon, label, onPress }: { icon: React.ReactNode, label: string, onPress?: () => void }) {
  return (
    <TouchableOpacity style={styles.qaBtn} onPress={onPress}>
      <View style={styles.qaIconContainer}>{icon}</View>
      <Text style={styles.qaLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

function ActivityItem({ icon, iconBg, title, subtitle, status, statusType, colors }: any) {
  const statusColors = statusType === 'ok' ? 
    { bg: colors.lightGreen, text: colors.secondary } : 
    { bg: '#FAEEDA', text: '#854F0B' };

  return (
    <View style={[styles.activityItem, { backgroundColor: '#F9FAFB', borderColor: colors.border }]}>
      <View style={[styles.actIcon, { backgroundColor: iconBg }]}>{icon}</View>
      <View style={styles.actInfo}>
        <Text style={[styles.actTitle, { color: colors.text }]}>{title}</Text>
        <Text style={styles.actSubtitle}>{subtitle}</Text>
      </View>
      <View style={[styles.actBadge, { backgroundColor: statusColors.bg }]}>
        <Text style={[styles.actBadgeText, { color: statusColors.text }]}>{status}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greetingText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginTop: 2,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  balanceCardContainer: {
    paddingHorizontal: 16,
    marginTop: -25,
  },
  balanceCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 0.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  balanceLabel: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 22,
    fontWeight: '700',
  },
  balanceSub: {
    fontSize: 11,
    marginTop: 4,
    fontWeight: '500',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  qaBtn: {
    width: '23%',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F9FAFB',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: '#E5E7EB',
  },
  qaIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  qaLabel: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
    fontWeight: '500',
  },
  activityList: {
    gap: 10,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 0.5,
    gap: 12,
  },
  actIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actInfo: {
    flex: 1,
  },
  actTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  actSubtitle: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 1,
  },
  actBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  actBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
});
