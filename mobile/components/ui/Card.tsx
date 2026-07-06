import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Colors from '@/constants/Colors';
import { Radius, Shadow, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/components/useColorScheme';

export default function Card({
  children,
  style,
  lifted,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  lifted?: boolean;
}) {
  const colors = Colors[useColorScheme() ?? 'light'];

  return (
    <View
      style={[
        styles.base,
        { backgroundColor: colors.surface, borderColor: colors.border },
        lifted ? Shadow.lifted : Shadow.soft,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.md,
  },
});
