import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { PartyPopper } from 'lucide-react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import Colors from '@/constants/Colors';
import { Fonts, Radius, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/components/useColorScheme';
import { useData } from '@/context/DataContext';
import Screen from '@/components/ui/Screen';
import Button from '@/components/ui/Button';
import PulseLine from '@/components/ui/PulseLine';

export default function LoanSuccessStep() {
  const router = useRouter();
  const colors = Colors[useColorScheme() ?? 'light'];
  const { selectedOffer, loanAmount } = useData();
  const { id } = useLocalSearchParams<{ id?: string }>();

  const scale = useSharedValue(0.6);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 9, stiffness: 120 });
    opacity.value = withTiming(1, { duration: 350 });
  }, []);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const format = (v: number) => new Intl.NumberFormat('fr-FR').format(Math.round(v)) + ' FCFA';

  return (
    <Screen padded scroll={false}>
      <View style={styles.body}>
        <Animated.View style={[styles.iconCircle, { backgroundColor: 'rgba(255,255,255,0.9)' }, iconStyle]}>
          <PartyPopper size={38} color={colors.primary} />
        </Animated.View>

        <Text style={[styles.title, { color: colors.heading }]}>
          Dossier <Text style={{ fontFamily: Fonts.displayItalic }}>envoyé</Text> !
        </Text>
        <Text style={[styles.sub, { color: colors.headingMuted }]}>
          {selectedOffer?.bank ?? 'La banque'} examine votre demande de {format(loanAmount)}.{'\n'}
          Réponse attendue sous {selectedOffer?.delay ?? '48h'}.
        </Text>

        <View style={{ marginTop: Spacing.lg }}>
          <PulseLine color="#FFFFFF" width={130} height={26} />
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          label="Suivre mon dossier"
          onPress={() => (id ? router.replace({ pathname: '/loan-tracker', params: { id } }) : router.replace('/(tabs)'))}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: Radius.xl,
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
