import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  ImageBackground,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { HeartPulse, Building2, ShieldCheck } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { Fonts, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/components/useColorScheme';
import Button from '@/components/ui/Button';
import PulseLine from '@/components/ui/PulseLine';

const { width } = Dimensions.get('window');
const AUTOPLAY_INTERVAL = 3800;

const SLIDES = [
  {
    icon: HeartPulse,
    tag: '01 — Soins',
    title: 'Vos soins financés en 48h',
    body: 'Dentaire, accouchement, bilans, chirurgie — avancez sans attendre votre prochaine paie.',
  },
  {
    icon: Building2,
    tag: '02 — Banques',
    title: 'Le meilleur taux, comparé pour vous',
    body: 'Nos partenaires bancaires se disputent votre dossier. Vous choisissez la meilleure offre.',
  },
  {
    icon: ShieldCheck,
    tag: '03 — Sécurité',
    title: 'Identité vérifiée, données protégées',
    body: 'Vérification en quelques minutes, conforme aux normes locales de confidentialité.',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [slide, setSlide] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / width);
    if (i !== slide) setSlide(i);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setSlide((prev) => {
        const next = (prev + 1) % SLIDES.length;
        scrollRef.current?.scrollTo({ x: next * width, animated: true });
        return next;
      });
    }, AUTOPLAY_INTERVAL);
    return () => clearInterval(timer);
  }, []);

  return (
    <LinearGradient
      colors={[colors.gradientStart, colors.gradientEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <StatusBar style="light" />
      <ImageBackground
        source={require('../assets/images/men-health-blood-pressure-measuring 1.png')}
        style={styles.hero}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(8,30,32,0.15)', 'rgba(14,90,94,0.55)', 'rgba(18,135,140,0.9)', colors.gradientStart]}
          locations={[0, 0.55, 0.85, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>
            La santé n'attend pas.{'\n'}
            <Text style={[styles.heroTitleItalic, { color: colors.heroAccent }]}>Votre financement non plus.</Text>
          </Text>

          <PulseLine color="#FFFFFF" width={140} height={30} />
        </View>
      </ImageBackground>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        style={styles.slider}
      >
        {SLIDES.map((s, i) => (
          <View key={i} style={[styles.slide, { width }]}>
            <View style={styles.slideIcon}>
              <s.icon size={30} color="#FFFFFF" />
            </View>
            <Text style={[styles.slideTag, { color: '#FFFFFF' }]}>{s.tag}</Text>
            <Text style={[styles.slideTitle, { color: colors.heading }]}>{s.title}</Text>
            <Text style={[styles.slideBody, { color: colors.headingMuted }]}>{s.body}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.dots}>
        {SLIDES.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              { backgroundColor: i === slide ? '#FFFFFF' : 'rgba(255,255,255,0.35)', width: i === slide ? 20 : 6 },
            ]}
          />
        ))}
      </View>

      <View style={styles.footer}>
        <Button label="Créer un compte" onPress={() => router.push('/(auth)/register')} />
        <Button
          label="J'ai déjà un compte"
          style={{ backgroundColor: colors.secondary }}
          onPress={() => router.push('/(auth)/login')}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  hero: {
    height: '40%',
    paddingTop: 64,
    paddingBottom: 28,
    paddingHorizontal: Spacing.lg,
    overflow: 'hidden',
  },
  heroContent: {
    gap: 18,
  },
  heroTitle: {
    fontFamily: Fonts.display,
    fontSize: 30,
    lineHeight: 37,
    color: '#FFFFFF',
  },
  heroTitleItalic: {
    fontFamily: Fonts.displayItalic,
  },
  slider: {
    marginTop: 14,
  },
  slide: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    gap: 10,
  },
  slideIcon: {
    marginBottom: 4,
  },
  slideTag: {
    fontFamily: Fonts.bodyExtraBold,
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  slideTitle: {
    fontFamily: Fonts.display,
    fontSize: 21,
    lineHeight: 27,
  },
  slideBody: {
    fontFamily: Fonts.body,
    fontSize: 13.5,
    lineHeight: 20,
    maxWidth: '92%',
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: 18,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  footer: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
    gap: 12,
    marginTop: 'auto',
  },
});
