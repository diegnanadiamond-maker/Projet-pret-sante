import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import {
  IdCard,
  FileText,
  Building2,
  Stethoscope,
  Settings,
  Check,
  Upload,
  ChevronRight,
  LogOut,
  BellRing,
  ShieldCheck,
} from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { Fonts, Radius, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/components/useColorScheme';
import { useData } from '@/context/DataContext';
import Screen from '@/components/ui/Screen';

export default function ProfileScreen() {
  const router = useRouter();
  const colors = Colors[useColorScheme() ?? 'light'];
  const {
    fullName,
    phone,
    email,
    kycDocs,
    setKycDocs,
    kycPct,
    identityVerified,
    setIdentityVerified,
    setIsAuthenticated,
  } = useData();

  const handleSimulateUpload = (key: keyof typeof kycDocs) => {
    if (!kycDocs[key]) {
      setKycDocs((prev) => ({ ...prev, [key]: true }));
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIdentityVerified(false);
    setKycDocs({ cni: false, bulletins: false, releve: false, devis: false });
    router.replace('/(auth)/register');
  };

  return (
    <Screen>
      <View style={styles.hero}>
        <View style={[styles.profileAvatar, { backgroundColor: '#FFFFFF' }]}>
          <Text style={[styles.profileAvatarText, { color: colors.primary }]}>{(fullName.charAt(0) || 'K').toUpperCase()}</Text>
        </View>
        <Text style={[styles.profileName, { color: colors.heading }]}>{fullName || 'Kouamé Adou'}</Text>
        <Text style={[styles.profileInfo, { color: colors.headingMuted }]}>{email || 'vous@exemple.com'} · {phone || '+225 07 00 00 00'}</Text>
        {identityVerified && (
          <View style={[styles.verifiedPill, { backgroundColor: colors.successSoft }]}>
            <ShieldCheck size={12} color={colors.success} />
            <Text style={[styles.verifiedText, { color: colors.success }]}>Identité vérifiée</Text>
          </View>
        )}
      </View>

      <View style={styles.kycContainer}>
        <View style={[styles.kycCard, { borderColor: colors.border, backgroundColor: colors.surface }]}>
          <Text style={[styles.kycTitle, { color: colors.textMuted }]}>Coffre de documents</Text>
          <View style={[styles.progressBar, { backgroundColor: colors.surfaceSunken }]}>
            <View style={[styles.progressFill, { width: `${kycPct}%`, backgroundColor: colors.primary }]} />
          </View>
          <Text style={[styles.kycPct, { color: colors.primary }]}>
            {kycPct}% — {kycPct === 100 ? 'Dossier complet' : `${Object.values(kycDocs).filter((v) => !v).length} documents manquants`}
          </Text>
        </View>
      </View>

      <View style={styles.menuList}>
        <MenuItem
          icon={<IdCard size={20} color={colors.primary} />}
          title="Carte Nationale d'Identité"
          subtitle={kycDocs.cni ? 'Recto-verso · Vérifié' : 'Document manquant'}
          status={kycDocs.cni ? 'done' : 'upload'}
          onPress={() => handleSimulateUpload('cni')}
          colors={colors}
        />
        <MenuItem
          icon={<FileText size={20} color={colors.primary} />}
          title="Bulletins de salaire"
          subtitle={kycDocs.bulletins ? '3 derniers mois · Vérifié' : 'Document manquant'}
          status={kycDocs.bulletins ? 'done' : 'upload'}
          onPress={() => handleSimulateUpload('bulletins')}
          colors={colors}
        />
        <MenuItem
          icon={<Building2 size={20} color={kycDocs.releve ? colors.primary : colors.accentSky} />}
          title="Relevé bancaire"
          subtitle={kycDocs.releve ? 'Fourni · Vérifié' : 'Non fourni · En attente'}
          status={kycDocs.releve ? 'done' : 'upload'}
          onPress={() => handleSimulateUpload('releve')}
          colors={colors}
        />
        <MenuItem
          icon={<Stethoscope size={20} color={kycDocs.devis ? colors.primary : colors.accentSky} />}
          title="Devis médical"
          subtitle={kycDocs.devis ? 'Fourni · Vérifié' : 'Non fourni · En attente'}
          status={kycDocs.devis ? 'done' : 'upload'}
          onPress={() => handleSimulateUpload('devis')}
          colors={colors}
        />

        <View style={{ height: 8 }} />

        <MenuItem
          icon={<BellRing size={20} color={colors.textMuted} />}
          title="Notifications"
          subtitle="SMS et rappels d'échéances"
          status="chevron"
          colors={colors}
        />
        <MenuItem
          icon={<Settings size={20} color={colors.textMuted} />}
          title="Paramètres du compte"
          subtitle="Sécurité, mot de passe"
          status="chevron"
          colors={colors}
        />

        <TouchableOpacity
          style={[styles.logoutBtn, { borderColor: colors.dangerSoft, backgroundColor: colors.dangerSoft }]}
          onPress={handleLogout}
        >
          <LogOut size={18} color={colors.danger} />
          <Text style={[styles.logoutText, { color: colors.danger }]}>Se déconnecter</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

function MenuItem({ icon, title, subtitle, status, onPress, colors }: any) {
  return (
    <TouchableOpacity
      style={[styles.menuItem, { backgroundColor: colors.surface, borderColor: colors.border }]}
      onPress={onPress}
      disabled={status === 'done' || status === 'chevron'}
    >
      <View style={styles.menuLead}>{icon}</View>
      <View style={styles.menuText}>
        <Text style={[styles.menuTitle, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.menuSubtitle, { color: colors.textMuted }]}>{subtitle}</Text>
      </View>
      <View style={styles.menuTrail}>
        {status === 'done' && (
          <View style={[styles.checkCircle, { backgroundColor: colors.primary }]}>
            <Check size={12} color="#fff" />
          </View>
        )}
        {status === 'upload' && <Upload size={18} color={colors.textMuted} />}
        {status === 'chevron' && <ChevronRight size={18} color={colors.textMuted} />}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  hero: {
    paddingTop: 24,
    paddingBottom: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 6,
  },
  profileAvatar: {
    width: 68,
    height: 68,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  profileAvatarText: {
    fontFamily: Fonts.displayBold,
    fontSize: 24,
  },
  profileName: {
    fontFamily: Fonts.display,
    fontSize: 19,
  },
  profileInfo: {
    fontFamily: Fonts.body,
    fontSize: 11.5,
  },
  verifiedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    marginTop: 8,
  },
  verifiedText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 10.5,
  },
  kycContainer: {
    paddingHorizontal: 16,
    marginTop: 4,
  },
  kycCard: {
    padding: 16,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  kycTitle: {
    fontFamily: Fonts.bodyBold,
    fontSize: 11.5,
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
    fontFamily: Fonts.bodyBold,
    fontSize: 11,
    textAlign: 'right',
  },
  menuList: {
    padding: 16,
    gap: 8,
    marginTop: 16,
    paddingBottom: 40,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: Radius.sm,
    borderWidth: 1,
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
    fontFamily: Fonts.bodyBold,
    fontSize: 13.5,
  },
  menuSubtitle: {
    fontFamily: Fonts.body,
    fontSize: 11,
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
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 14,
    borderRadius: Radius.sm,
    borderWidth: 1,
    marginTop: 12,
  },
  logoutText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 13.5,
  },
});
