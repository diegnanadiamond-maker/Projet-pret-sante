import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Camera, Check, IdCard } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { Fonts, Radius, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/components/useColorScheme';
import Screen from '@/components/ui/Screen';
import StepHeader from '@/components/ui/StepHeader';
import Button from '@/components/ui/Button';

type Side = 'front' | 'back';

export default function KycDocumentScreen() {
  const router = useRouter();
  const colors = Colors[useColorScheme() ?? 'light'];
  const [images, setImages] = useState<Record<Side, string | null>>({ front: null, back: null });
  const [busy, setBusy] = useState<Side | null>(null);

  const capture = async (side: Side) => {
    setBusy(side);
    try {
      const perm = await ImagePicker.requestCameraPermissionsAsync();
      let result;
      if (perm.granted) {
        result = await ImagePicker.launchCameraAsync({ quality: 0.6, allowsEditing: true, aspect: [16, 10] });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({ quality: 0.6, allowsEditing: true, aspect: [16, 10] });
      }
      if (!result.canceled && result.assets?.[0]?.uri) {
        setImages((prev) => ({ ...prev, [side]: result.assets[0].uri }));
      }
    } finally {
      setBusy(null);
    }
  };

  const bothCaptured = !!images.front && !!images.back;

  return (
    <Screen padded>
      <StepHeader title="Pièce d'identité" />

      <View style={styles.intro}>
        <Text style={[styles.title, { color: colors.text }]}>
          Photographiez votre <Text style={{ fontFamily: Fonts.displayItalic }}>CNI</Text>
        </Text>
        <Text style={[styles.sub, { color: colors.textMuted }]}>
          Cadrez bien le document, à plat, sans reflet. Recto puis verso.
        </Text>
      </View>

      <View style={styles.slots}>
        <DocSlot
          label="Recto"
          uri={images.front}
          loading={busy === 'front'}
          onPress={() => capture('front')}
          colors={colors}
        />
        <DocSlot
          label="Verso"
          uri={images.back}
          loading={busy === 'back'}
          onPress={() => capture('back')}
          colors={colors}
        />
      </View>

      <View style={styles.footer}>
        <Button
          label="Continuer vers le selfie"
          onPress={() => router.push('/(kyc)/selfie')}
          disabled={!bothCaptured}
        />
      </View>
    </Screen>
  );
}

function DocSlot({
  label,
  uri,
  loading,
  onPress,
  colors,
}: {
  label: string;
  uri: string | null;
  loading: boolean;
  onPress: () => void;
  colors: any;
}) {
  return (
    <Pressable onPress={onPress} disabled={loading} style={{ flex: 1 }}>
      <View
        style={[
          styles.slot,
          { backgroundColor: colors.surfaceSunken, borderColor: uri ? colors.success : colors.border },
        ]}
      >
        {uri ? (
          <>
            <Image source={{ uri }} style={styles.slotImage} />
            <View style={[styles.checkBadge, { backgroundColor: colors.success }]}>
              <Check size={12} color="#fff" />
            </View>
          </>
        ) : (
          <View style={styles.slotEmpty}>
            <Corner style={[styles.corner, styles.cTL]} color={colors.borderStrong} />
            <Corner style={[styles.corner, styles.cTR]} color={colors.borderStrong} />
            <Corner style={[styles.corner, styles.cBL]} color={colors.borderStrong} />
            <Corner style={[styles.corner, styles.cBR]} color={colors.borderStrong} />
            {loading ? (
              <Text style={[styles.slotHint, { color: colors.textMuted }]}>Ouverture…</Text>
            ) : (
              <>
                <IdCard size={22} color={colors.textMuted} />
                <View style={[styles.camPill, { backgroundColor: colors.primary }]}>
                  <Camera size={14} color="#fff" />
                </View>
              </>
            )}
          </View>
        )}
      </View>
      <Text style={[styles.slotLabel, { color: colors.text }]}>{label}</Text>
    </Pressable>
  );
}

function Corner({ style, color }: { style: any; color: string }) {
  return <View style={[style, { borderColor: color }]} />;
}

const styles = StyleSheet.create({
  intro: {
    gap: 6,
    marginBottom: Spacing.lg,
  },
  title: {
    fontFamily: Fonts.display,
    fontSize: 22,
  },
  sub: {
    fontFamily: Fonts.body,
    fontSize: 13,
    lineHeight: 19,
  },
  slots: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  slot: {
    width: '100%',
    aspectRatio: 16 / 11,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    overflow: 'hidden',
  },
  slotEmpty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  slotImage: {
    width: '100%',
    height: '100%',
  },
  slotHint: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 11,
  },
  slotLabel: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 12.5,
    marginTop: 8,
    textAlign: 'center',
  },
  camPill: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  corner: {
    position: 'absolute',
    width: 18,
    height: 18,
  },
  cTL: { top: 8, left: 8, borderTopWidth: 2.5, borderLeftWidth: 2.5, borderTopLeftRadius: 6 },
  cTR: { top: 8, right: 8, borderTopWidth: 2.5, borderRightWidth: 2.5, borderTopRightRadius: 6 },
  cBL: { bottom: 8, left: 8, borderBottomWidth: 2.5, borderLeftWidth: 2.5, borderBottomLeftRadius: 6 },
  cBR: { bottom: 8, right: 8, borderBottomWidth: 2.5, borderRightWidth: 2.5, borderBottomRightRadius: 6 },
  footer: {
    marginTop: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },
});
