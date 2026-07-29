import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ShieldCheck } from 'lucide-react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import Colors from '@/constants/Colors';
import { Fonts, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/components/useColorScheme';
import { useData } from '@/context/DataContext';
import Screen from '@/components/ui/Screen';
import Button from '@/components/ui/Button';
import PulseDot from '@/components/ui/PulseDot';

export default function KycSuccessScreen() {
  const router = useRouter();
  const colors = Colors[useColorScheme() ?? 'light'];
  const { setIdentityVerified, isBanked } = useData();
  const [ready, setReady] = useState(false);

  const scale = useSharedValue(0.6);
  const opacity = useSharedValue(0);

  useEffect(() => {
    const t = setTimeout(() => {
      setReady(true);
      setIdentityVerified(true);
      scale.value = withSpring(1, { damping: 9, stiffness: 120 });
      opacity.value = withTiming(1, { duration: 300 });
    }, 1700);
    return () => clearTimeout(t);
  }, []);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Screen padded scroll={false}>
      <View style={styles.body}>
        {!ready ? (
          <>
            <PulseDot color={colors.primary} size={14} />
            <Text style={[styles.processingText, { color: colors.textMuted }]}>Analyse de vos documents…</Text>
          </>
        ) : (
          <>
            <Animated.View style={[styles.iconCircle, { backgroundColor: colors.successSoft }, iconStyle]}>
              <ShieldCheck size={40} color={colors.success} />
            </Animated.View>
            <Text style={[styles.title, { color: colors.text }]}>
              Identité <Text style={{ fontFamily: Fonts.displayItalic }}>vérifiée</Text>
            </Text>
            <Text style={[styles.sub, { color: colors.textMuted }]}>
              {isBanked
                ? 'Votre profil est validé. Vous pouvez maintenant simuler et demander votre premier financement santé auprès de votre banque.'
                : "Votre profil est validé. Sans compte bancaire, votre financement passera par Orange Money et son prêt Tiktak."}
            </Text>
          </>
        )}
      </View>

      {ready && (
        <View style={styles.footer}>
          <Button label="Accéder à mon espace" onPress={() => router.replace('/(tabs)')} />
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 12,
  },
  processingText: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 13.5,
    marginTop: 4,
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: Fonts.display,
    fontSize: 26,
  },
  sub: {
    fontFamily: Fonts.body,
    fontSize: 13.5,
    textAlign: 'center',
    lineHeight: 20,
  },
  footer: {
    paddingBottom: Spacing.xxl,
  },
});
