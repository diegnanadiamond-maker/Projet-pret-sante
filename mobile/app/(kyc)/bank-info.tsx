import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Landmark, Hash, CreditCard, ChevronDown } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { Fonts, Radius, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/components/useColorScheme';
import { useData } from '@/context/DataContext';
import Screen from '@/components/ui/Screen';
import StepHeader from '@/components/ui/StepHeader';
import TextField from '@/components/ui/TextField';
import Button from '@/components/ui/Button';

const BANKS = [
  { name: 'SGCI', logo: require('../../assets/images/sgci.png') },
  { name: 'BNI', logo: require('../../assets/images/bni.png') },
  { name: 'Ecobank', logo: require('../../assets/images/ecobank.png') },
  { name: 'Autre banque', logo: null },
];

export default function KycBankInfoScreen() {
  const router = useRouter();
  const colors = Colors[useColorScheme() ?? 'light'];
  const { bankName, setBankName, bankAccountNumber, setBankAccountNumber, bankRibIban, setBankRibIban } = useData();

  const [showPicker, setShowPicker] = useState(false);
  const [error, setError] = useState('');

  const selectedBank = BANKS.find((b) => b.name === bankName);
  const ready = !!bankName && bankAccountNumber.trim().length >= 5 && bankRibIban.trim().length >= 5;

  const handleContinue = () => {
    if (!ready) {
      setError('Renseignez votre banque, votre numéro de compte et votre RIB/IBAN pour continuer.');
      return;
    }
    setError('');
    router.push('/(kyc)/document');
  };

  return (
    <Screen padded>
      <StepHeader title="Coordonnées bancaires" />

      <View style={styles.intro}>
        <Text style={[styles.title, { color: colors.heading }]}>
          Renseignez votre <Text style={{ fontFamily: Fonts.displayItalic }}>compte bancaire</Text>
        </Text>
        <Text style={[styles.sub, { color: colors.headingMuted }]}>
          Les informations renseignées seront utilisées uniquement pour le versement des fonds, selon les conditions de votre financement.
        </Text>
      </View>

      <View style={styles.formGroup}>
        <Text style={[styles.formLabel, { color: colors.headingMuted }]}>Banque</Text>
        <TouchableOpacity
          style={[styles.select, { backgroundColor: colors.surfaceSunken, borderColor: colors.border }]}
          onPress={() => setShowPicker((v) => !v)}
        >
          <View style={styles.selectLeft}>
            {selectedBank?.logo ? (
              <Image source={selectedBank.logo} style={styles.bankLogo} resizeMode="contain" />
            ) : (
              <Landmark size={18} color={colors.textMuted} />
            )}
            <Text style={{ fontFamily: Fonts.bodyMedium, color: bankName ? colors.text : colors.textMuted }}>
              {bankName || 'Choisissez votre banque'}
            </Text>
          </View>
          <ChevronDown size={18} color={colors.textMuted} />
        </TouchableOpacity>
        {showPicker && (
          <View style={[styles.optionsList, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            {BANKS.map((b) => (
              <TouchableOpacity
                key={b.name}
                style={styles.optionItem}
                onPress={() => {
                  setBankName(b.name);
                  setShowPicker(false);
                }}
              >
                {b.logo ? (
                  <Image source={b.logo} style={styles.bankLogo} resizeMode="contain" />
                ) : (
                  <View style={[styles.bankLogo, styles.bankLogoFallback, { borderColor: colors.border }]}>
                    <Landmark size={14} color={colors.textMuted} />
                  </View>
                )}
                <Text style={{ fontFamily: Fonts.bodyMedium, fontSize: 14, color: colors.text }}>{b.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <View style={styles.form}>
        <TextField
          label="Numéro de compte"
          placeholder="Ex: 0123456789"
          value={bankAccountNumber}
          onChangeText={setBankAccountNumber}
          icon={<Hash size={18} color={colors.textMuted} />}
          keyboardType="number-pad"
        />
        <TextField
          label="RIB / IBAN"
          placeholder="Ex: CI93 CI13 0010..."
          value={bankRibIban}
          onChangeText={(v) => setBankRibIban(v.toUpperCase())}
          icon={<CreditCard size={18} color={colors.textMuted} />}
          autoCapitalize="characters"
        />
        {error ? <Text style={[styles.errorText, { color: colors.danger }]}>{error}</Text> : null}
      </View>

      <Text style={[styles.securityNote, { color: colors.headingMuted }]}>
        🔒 Vos données bancaires sont protégées et utilisées uniquement dans le cadre de votre demande.
      </Text>

      <View style={styles.footer}>
        <Button label="Enregistrer mes coordonnées" onPress={handleContinue} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: {
    gap: 6,
    marginBottom: Spacing.lg,
  },
  title: {
    fontFamily: Fonts.display,
    fontSize: 23,
    lineHeight: 29,
    marginTop: Spacing.sm,
  },
  sub: {
    fontFamily: Fonts.body,
    fontSize: 15,
    lineHeight: 21,
  },
  formGroup: {
    gap: 8,
    marginBottom: Spacing.md,
  },
  formLabel: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 13,
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
  selectLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  optionsList: {
    borderRadius: Radius.sm,
    borderWidth: 1,
    overflow: 'hidden',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  bankLogo: {
    width: 26,
    height: 26,
    borderRadius: 7,
    backgroundColor: '#FFFFFF',
  },
  bankLogoFallback: {
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    gap: Spacing.md,
  },
  errorText: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 13.5,
    lineHeight: 20,
  },
  securityNote: {
    fontFamily: Fonts.body,
    fontSize: 13,
    lineHeight: 19,
    marginTop: Spacing.md,
  },
  footer: {
    marginTop: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },
});
