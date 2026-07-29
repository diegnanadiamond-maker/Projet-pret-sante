import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { IdCard, FileText, Building2, Stethoscope, Check, Upload, ShieldCheck } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { Fonts, Radius, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/components/useColorScheme';
import { useData } from '@/context/DataContext';
import Screen from '@/components/ui/Screen';
import StepHeader from '@/components/ui/StepHeader';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function DocumentsStep() {
  const router = useRouter();
  const colors = Colors[useColorScheme() ?? 'light'];
  const { kycDocs, setKycDocs, establishment, isBanked, selectedOffer } = useData();

  // Client's own bank already holds this on file — mark it fulfilled automatically.
  // Clients without a bank account (Orange Money Tiktak) never need it at all.
  useEffect(() => {
    if (isBanked && !kycDocs.releve) {
      setKycDocs((prev) => ({ ...prev, releve: true }));
    }
  }, [isBanked]);

  const toggle = (key: 'releve' | 'devis') => {
    if (!kycDocs[key]) setKycDocs((prev) => ({ ...prev, [key]: true }));
  };

  const ready = (isBanked ? kycDocs.releve : true) && kycDocs.devis;

  return (
    <Screen padded>
      <StepHeader step={4} totalSteps={5} />

      <Text style={[styles.title, { color: colors.text }]}>
        Complétez votre <Text style={{ fontFamily: Fonts.displayItalic }}>dossier</Text>
      </Text>
      <Text style={[styles.sub, { color: colors.textMuted }]}>
        Un seul justificatif suffit pour ce financement, le reste est déjà dans votre profil vérifié.
      </Text>

      <View style={[styles.policyBanner, { backgroundColor: colors.secondarySoft, borderColor: colors.border }]}>
        <ShieldCheck size={16} color={colors.secondary} />
        <Text style={[styles.policyText, { color: colors.text }]}>
          Par sécurité, {selectedOffer?.bank ?? 'votre organisme prêteur'} verse les fonds directement à{' '}
          <Text style={{ fontFamily: Fonts.bodyBold }}>{establishment}</Text>, jamais sur votre compte. La facture
          pro-forma justifie le montant demandé.
        </Text>
      </View>

      <View style={{ gap: 10, marginTop: Spacing.lg }}>
        <Card style={styles.row}>
          <View style={[styles.icon, { backgroundColor: colors.primarySoft }]}>
            <IdCard size={18} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.rowTitle, { color: colors.text }]}>Carte d'identité</Text>
            <Text style={[styles.rowSub, { color: colors.textMuted }]}>Déjà vérifiée</Text>
          </View>
          <View style={[styles.check, { backgroundColor: colors.success }]}>
            <Check size={12} color="#fff" />
          </View>
        </Card>

        <Card style={styles.row}>
          <View style={[styles.icon, { backgroundColor: colors.primarySoft }]}>
            <FileText size={18} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.rowTitle, { color: colors.text }]}>Bulletins de salaire</Text>
            <Text style={[styles.rowSub, { color: colors.textMuted }]}>Déjà vérifiés</Text>
          </View>
          <View style={[styles.check, { backgroundColor: colors.success }]}>
            <Check size={12} color="#fff" />
          </View>
        </Card>

        {isBanked && (
          <Card style={styles.row}>
            <View style={[styles.icon, { backgroundColor: colors.primarySoft }]}>
              <Building2 size={18} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.rowTitle, { color: colors.text }]}>Relevé bancaire (3 mois)</Text>
              <Text style={[styles.rowSub, { color: colors.textMuted }]}>Fourni automatiquement par votre banque</Text>
            </View>
            <View style={[styles.check, { backgroundColor: colors.success }]}>
              <Check size={12} color="#fff" />
            </View>
          </Card>
        )}

        <TouchableOpacity onPress={() => toggle('devis')} activeOpacity={0.8}>
          <Card style={styles.row}>
            <View style={[styles.icon, { backgroundColor: kycDocs.devis ? colors.primarySoft : colors.accentSkySoft }]}>
              <Stethoscope size={18} color={kycDocs.devis ? colors.primary : colors.accentSky} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.rowTitle, { color: colors.text }]}>Facture pro-forma (devis)</Text>
              <Text style={[styles.rowSub, { color: colors.textMuted }]}>
                {kycDocs.devis ? 'Téléversée' : `Établie par ${establishment}`}
              </Text>
            </View>
            {kycDocs.devis ? (
              <View style={[styles.check, { backgroundColor: colors.success }]}>
                <Check size={12} color="#fff" />
              </View>
            ) : (
              <View style={[styles.uploadPill, { backgroundColor: colors.primary }]}>
                <Upload size={13} color="#fff" />
                <Text style={styles.uploadPillText}>Charger</Text>
              </View>
            )}
          </Card>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Button label="Relire et signer le contrat" onPress={() => router.push('/(loan-request)/step-5-contract')} disabled={!ready} />
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
    lineHeight: 19,
    marginTop: 6,
  },
  policyBanner: {
    flexDirection: 'row',
    gap: 10,
    padding: 14,
    borderRadius: Radius.md,
    borderWidth: 1,
    marginTop: Spacing.md,
  },
  policyText: {
    flex: 1,
    fontFamily: Fonts.body,
    fontSize: 12,
    lineHeight: 17,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowTitle: {
    fontFamily: Fonts.bodyBold,
    fontSize: 13.5,
  },
  rowSub: {
    fontFamily: Fonts.body,
    fontSize: 11,
    marginTop: 1,
  },
  check: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: Radius.pill,
  },
  uploadPillText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 11,
    color: '#fff',
  },
  footer: {
    marginTop: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },
});
