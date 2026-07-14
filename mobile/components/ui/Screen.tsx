import React from 'react';
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
    ? { contentContainerStyle: [padded && styles.padded, contentStyle], showsVerticalScrollIndicator: false }
    : { style: [{ flex: 1 }, padded && styles.padded, contentStyle] };

  return (
    <View style={[styles.root, { backgroundColor: colors.background, paddingTop: insets.top }, style]}>
      <Container {...(containerProps as any)}>{children}</Container>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  padded: {
    paddingHorizontal: 22,
  },
});
