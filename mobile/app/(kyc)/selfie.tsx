import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Camera, Check, ScanFace } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { Fonts, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/components/useColorScheme';
import Screen from '@/components/ui/Screen';
import StepHeader from '@/components/ui/StepHeader';
import Button from '@/components/ui/Button';

export default function KycSelfieScreen() {
  const router = useRouter();
  const colors = Colors[useColorScheme() ?? 'light'];
  const [uri, setUri] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const capture = async () => {
    setBusy(true);
    try {
      const perm = await ImagePicker.requestCameraPermissionsAsync();
      let result;
      if (perm.granted) {
        result = await ImagePicker.launchCameraAsync({
          quality: 0.6,
          allowsEditing: true,
          aspect: [1, 1],
          cameraType: ImagePicker.CameraType.front,
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({ quality: 0.6, allowsEditing: true, aspect: [1, 1] });
      }
      if (!result.canceled && result.assets?.[0]?.uri) {
        setUri(result.assets[0].uri);
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen padded scroll={false}>
      <StepHeader title="Selfie de contrôle" />

      <View style={styles.body}>
        <Text style={[styles.title, { color: colors.heading }]}>
          Regardez droit dans <Text style={{ fontFamily: Fonts.displayItalic }}>l'objectif</Text>
        </Text>
        <Text style={[styles.sub, { color: colors.headingMuted }]}>
          Visage bien visible, sans lunettes de soleil ni casquette.
        </Text>

        <Pressable onPress={capture} disabled={busy} style={styles.frameWrap}>
          <View
            style={[
              styles.frame,
              { borderColor: uri ? colors.success : colors.borderStrong, backgroundColor: colors.surfaceSunken },
            ]}
          >
            {uri ? (
              <Image source={{ uri }} style={styles.photo} />
            ) : (
              <ScanFace size={44} color={colors.textMuted} strokeWidth={1.2} />
            )}
          </View>
          <View
            style={[
              styles.captureBtn,
              { backgroundColor: uri ? colors.success : colors.primary },
            ]}
          >
            {uri ? <Check size={18} color="#fff" /> : <Camera size={18} color="#fff" />}
          </View>
        </Pressable>

        <Text style={[styles.hint, { color: colors.headingMuted }]}>
          {busy ? 'Ouverture de la caméra…' : uri ? 'Photo capturée · appuyez pour reprendre' : 'Appuyez pour prendre le selfie'}
        </Text>
      </View>

      <View style={styles.footer}>
        <Button label="Lancer la vérification" onPress={() => router.replace('/(kyc)/success')} disabled={!uri} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
    paddingTop: Spacing.lg,
    gap: 10,
  },
  title: {
    fontFamily: Fonts.display,
    fontSize: 23,
    textAlign: 'center',
  },
  sub: {
    fontFamily: Fonts.body,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: Spacing.lg,
  },
  frameWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  frame: {
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 3,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  captureBtn: {
    position: 'absolute',
    bottom: 4,
    right: 12,
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  hint: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 12,
    marginTop: Spacing.md,
  },
  footer: {
    paddingBottom: Spacing.xxl,
  },
});
