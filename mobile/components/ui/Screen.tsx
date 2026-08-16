import React from 'react';
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

type Props = {
  children: React.ReactNode;
  scroll?: boolean;
  padded?: boolean;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
};

export default function Screen({ children, scroll = true, padded = false, style, contentStyle }: Props) {
  const colors = Colors[useColorScheme() ?? 'light'];
  const insets = useSafeAreaInsets();

  const Container = scroll ? ScrollView : View;
  const containerProps = scroll
    ? { contentContainerStyle: [styles.inner, padded && styles.padded, contentStyle], showsVerticalScrollIndicator: false }
    : { style: [{ flex: 1 }, styles.inner, padded && styles.padded, contentStyle] };

  return (
    <LinearGradient
      colors={[colors.gradientStart, colors.gradientEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.root, { paddingTop: insets.top }, style]}
    >
      <Container {...(containerProps as any)}>{children}</Container>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  // Phone-first layouts: on large viewports (RN Web) the content stays a
  // centered column instead of stretching edge to edge.
  inner: {
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
  },
  padded: {
    paddingHorizontal: 22,
  },
});
