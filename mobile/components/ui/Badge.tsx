import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Fonts, Radius } from '@/constants/theme';

export default function Badge({
  label,
  color,
  bg,
  icon,
}: {
  label: string;
  color: string;
  bg: string;
  icon?: React.ReactNode;
}) {
  return (
    <View style={[styles.base, { backgroundColor: bg }]}>
      {icon}
      <Text style={[styles.text, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.pill,
    alignSelf: 'flex-start',
  },
  text: {
    fontFamily: Fonts.bodyBold,
    fontSize: 10.5,
    letterSpacing: 0.2,
  },
});
