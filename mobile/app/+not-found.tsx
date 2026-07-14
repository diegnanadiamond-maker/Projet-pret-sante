import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Compass } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { Fonts, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/components/useColorScheme';

export default function NotFoundScreen() {
  const colors = Colors[useColorScheme() ?? 'light'];

  return (
    <>
      <Stack.Screen options={{ title: 'Introuvable', headerShown: false }} />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.iconCircle, { backgroundColor: colors.primarySoft }]}>
          <Compass size={26} color={colors.primary} />
        </View>
        <Text style={[styles.title, { color: colors.text }]}>
          Cet écran n'existe <Text style={{ fontFamily: Fonts.displayItalic }}>pas</Text>
        </Text>
        <Link href="/" style={styles.link}>
          <Text style={[styles.linkText, { color: colors.primary }]}>Retour à l'accueil</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
    gap: 12,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: Fonts.display,
    fontSize: 20,
    textAlign: 'center',
  },
  link: {
    marginTop: 8,
    paddingVertical: 12,
  },
  linkText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 14,
  },
});
