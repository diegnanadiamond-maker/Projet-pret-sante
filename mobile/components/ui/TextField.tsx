import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, TouchableOpacity, View } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { Fonts, Radius, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/components/useColorScheme';

type Props = TextInputProps & {
  label: string;
  icon?: React.ReactNode;
  error?: string;
  isPassword?: boolean;
};

export default function TextField({ label, icon, error, isPassword, ...inputProps }: Props) {
  const colors = Colors[useColorScheme() ?? 'light'];
  const [focused, setFocused] = useState(false);
  const [secure, setSecure] = useState(!!isPassword);

  return (
    <View style={styles.wrap}>
      <Text style={[styles.label, { color: colors.headingMuted }]}>{label}</Text>
      <View
        style={[
          styles.field,
          {
            backgroundColor: colors.surfaceSunken,
            borderColor: error ? colors.danger : focused ? colors.primary : colors.border,
          },
        ]}
      >
        {icon}
        <TextInput
          {...inputProps}
          secureTextEntry={secure}
          placeholderTextColor={colors.textMuted}
          onFocus={(e) => {
            setFocused(true);
            inputProps.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            inputProps.onBlur?.(e);
          }}
          style={[styles.input, { color: colors.text }]}
        />
        {isPassword && (
          <TouchableOpacity onPress={() => setSecure((s) => !s)} hitSlop={10}>
            {secure ? <Eye size={18} color={colors.textMuted} /> : <EyeOff size={18} color={colors.textMuted} />}
          </TouchableOpacity>
        )}
      </View>
      {error ? <Text style={[styles.error, { color: colors.danger }]}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 8,
  },
  label: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 12.5,
    paddingHorizontal: 2,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    borderWidth: 1.5,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.md,
    height: 54,
  },
  input: {
    flex: 1,
    fontFamily: Fonts.bodyMedium,
    fontSize: 15,
    height: '100%',
  },
  error: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 11.5,
    paddingHorizontal: 2,
  },
});
