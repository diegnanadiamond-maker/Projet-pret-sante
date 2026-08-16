import React, { useEffect, useState } from 'react';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { HeartPulse, Building2, ShieldCheck } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { Fonts, Radius, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/components/useColorScheme';
import Button from '@/components/ui/Button';
import PulseLine from '@/components/ui/PulseLine';

const AUTOPLAY_INTERVAL = 3800;

const SLIDES = [
  {
    icon: HeartPulse,
    tag: '01 — Soins',
    body: 'La santé ne devrait pas attendre pour des raisons financières.',
  },
  {
    icon: Building2,
    tag: '02 — Partenaires',
    body: 'Comparez les solutions de financement disponibles et choisissez celle qui vous convient.',
  },
  {
    icon: ShieldCheck,
    tag: '03 — Confiance',
    body: 'Votre santé mérite une solution adaptée.',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSlide((prev) => (prev + 1) % SLIDES.length);
    }, AUTOPLAY_INTERVAL);
    return () => clearInterval(timer);
  }, []);

  const current = SLIDES[slide];

  return (
    <ImageBackground
      source={require('../assets/images/men-health-blood-pressure-measuring 1.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <StatusBar style="light" />
      <LinearGradient
        colors={['rgba(6,20,22,0.35)', 'rgba(8,30,32,0.25)', 'rgba(6,40,42,0.65)']}
        locations={[0, 0.45, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={styles.content}>
        <View style={styles.top}>
          <View style={[styles.badge, { backgroundColor: colors.primary }]}>
            <current.icon size={16} color="#FFFFFF" />
            <Text style={styles.badgeText}>{current.tag}</Text>
          </View>

          <Text style={styles.heroTitle}>
            Financez vos soins{'\n'}
            <Text style={[styles.heroTitleItalic, { color: colors.heroAccent }]}>en toute sérénité.</Text>
          </Text>
          <Text style={styles.body}>{current.body}</Text>

          <PulseLine color="#FFFFFF" width={140} height={30} />
        </View>

        <View style={styles.bottom}>
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
            <Button label="Commencer ma demande" onPress={() => router.push('/(auth)/register')} />
            <Button
              label="Se connecter"
              style={{ backgroundColor: colors.secondary }}
              onPress={() => router.push('/(auth)/login')}
            />
            <Text style={styles.tagline}>Un parcours simple, sécurisé et transparent.</Text>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: 64,
    paddingBottom: Spacing.xl,
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
  },
  top: {
    gap: 14,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radius.pill,
    marginBottom: 6,
  },
  badgeText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 12.5,
    color: '#FFFFFF',
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
  body: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 14,
    lineHeight: 20,
    color: 'rgba(255,255,255,0.85)',
    maxWidth: '92%',
  },
  bottom: {
    gap: 18,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  footer: {
    gap: 12,
  },
  tagline: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 12,
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
    marginTop: 4,
  },
});
