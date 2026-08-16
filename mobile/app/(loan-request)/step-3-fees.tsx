import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Wallet, Check, ShieldCheck } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { Fonts, Radius, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/components/useColorScheme';
import Screen from '@/components/ui/Screen';
import StepHeader from '@/components/ui/StepHeader';
import Card from '@/components/ui/Card';
import TextField from '@/components/ui/TextField';
import Button from '@/components/ui/Button';

const FRAIS_DOSSIER = 5000;

const PAYMENT_METHODS = [
  { id: 'om', label: 'Orange Money', logo: require('../../assets/images/orange_money.png') },
  { id: 'mtn', label: 'MTN Mobile Money', logo: require('../../assets/images/mtn_money.png') },
  { id: 'moov', label: 'Moov Money', logo: require('../../assets/images/moov_money.png') },
  { id: 'wave', label: 'Wave', logo: require('../../assets/images/wave.png') },
];

export default function FeesStep() {
  const router = useRouter();
  const colors = Colors[useColorScheme() ?? 'light'];

  const [method, setMethod] = useState<string | null>(null);
  const [phone, setPhone] = useState('');
  const [paying, setPaying] = useState(false);

  const formatPrice = (val: number) => new Intl.NumberFormat('fr-FR').format(val) + ' FCFA';

  const ready = !!method && phone.trim().length >= 8;

  const handlePay = () => {
    if (!ready) return;
    setPaying(true);
    setTimeout(() => {
      setPaying(false);
      router.push('/(loan-request)/step-4-documents');
    }, 1100);
  };

  return (
    <Screen padded>
      <StepHeader step={3} totalSteps={5} />

      <Text style={[styles.title, { color: colors.heading }]}>
        Réglez les <Text style={{ fontFamily: Fonts.displayItalic }}>frais de dossier</Text>
      </Text>
      <Text style={[styles.sub, { color: colors.headingMuted }]}>
        Un paiement unique pour lancer l'étude de votre demande par la banque.
      </Text>

      <Card style={styles.feeCard}>
        <View style={[styles.feeIcon, { backgroundColor: colors.primarySoft }]}>
          <Wallet size={20} color={colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.feeLabel, { color: colors.textMuted }]}>Frais de dossier</Text>
          <Text style={[styles.feeAmount, { color: colors.primary }]}>{formatPrice(FRAIS_DOSSIER)}</Text>
        </View>
      </Card>

      <View style={[styles.policyBanner, { backgroundColor: 'rgba(255,255,255,0.9)', borderColor: 'transparent' }]}>
        <ShieldCheck size={16} color={colors.primary} />
        <Text style={[styles.policyText, { color: colors.text }]}>
          Ces frais couvrent l'étude et le traitement de votre dossier par la banque. Ils sont
          distincts du montant du prêt, qui sera lui versé directement à votre établissement de santé.
        </Text>
      </View>

      <Text style={[styles.formLabel, { color: colors.headingMuted, marginTop: Spacing.lg }]}>Moyen de paiement</Text>
      <View style={{ gap: 10 }}>
        {PAYMENT_METHODS.map((m) => {
          const selected = method === m.id;
          return (
            <TouchableOpacity key={m.id} onPress={() => setMethod(m.id)} activeOpacity={0.8}>
              <Card
                style={[
                  styles.methodRow,
                  { borderColor: selected ? colors.primary : colors.border },
                  selected && { backgroundColor: colors.primarySoft },
                ]}
              >
                <View style={[styles.methodLogoWrap, { borderColor: colors.border }]}>
                  <Image source={m.logo} style={styles.methodLogo} resizeMode="contain" />
                </View>
                <Text style={[styles.methodLabel, { color: colors.text }, selected && { fontFamily: Fonts.bodyBold }]}>
                  {m.label}
                </Text>
                {selected && (
                  <View style={[styles.check, { backgroundColor: colors.primary }]}>
                    <Check size={12} color="#fff" />
                  </View>
                )}
              </Card>
            </TouchableOpacity>
          );
        })}
      </View>

      {method && (
        <View style={{ marginTop: Spacing.md }}>
          <TextField
            label="Numéro à débiter"
            placeholder="Ex: 07 00 00 00 00"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </View>
      )}

      <View style={styles.footer}>
        <Button
          label={`Payer ${formatPrice(FRAIS_DOSSIER)}`}
          onPress={handlePay}
          loading={paying}
          disabled={!ready}
        />
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
  feeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  feeIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  feeLabel: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 11.5,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  feeAmount: {
    fontFamily: Fonts.display,
    fontSize: 20,
    marginTop: 2,
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
  formLabel: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 12,
    marginBottom: 8,
  },
  methodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1.5,
  },
  methodLogoWrap: {
    width: 60,
    height: 40,
    borderRadius: Radius.sm,
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },
  methodLogo: {
    width: '100%',
    height: '100%',
  },
  methodLabel: {
    flex: 1,
    fontFamily: Fonts.bodyMedium,
    fontSize: 13.5,
  },
  check: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    marginTop: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },
});
