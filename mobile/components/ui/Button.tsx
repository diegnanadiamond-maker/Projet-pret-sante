import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/Colors';
import { Fonts, Radius, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/components/useColorScheme';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost';

type Props = {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  icon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  fullWidth?: boolean;
};

export default function Button({
  label,
  onPress,
  variant = 'primary',
  icon,
  trailingIcon,
  disabled,
  loading,
  style,
  fullWidth = true,
}: Props) {
  const colors = Colors[useColorScheme() ?? 'light'];

  const handlePress = () => {
    if (disabled || loading) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  };

  const bg =
    variant === 'primary' ? colors.primary : variant === 'secondary' ? colors.secondary : 'transparent';
  const textColor =
    variant === 'primary' || variant === 'secondary' ? '#FFFFFF' : variant === 'outline' ? colors.text : colors.primary;
  const borderColor = variant === 'outline' ? colors.borderStrong : 'transparent';

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: bg,
          borderColor,
          borderWidth: variant === 'outline' ? 1.5 : 0,
          opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
          width: fullWidth ? '100%' : undefined,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <View style={styles.content}>
          {icon}
          <Text style={[styles.label, { color: textColor }]}>{label}</Text>
          {trailingIcon}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 17,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
  },
  label: {
    fontFamily: Fonts.bodyBold,
    fontSize: 15.5,
    letterSpacing: 0.1,
  },
});
