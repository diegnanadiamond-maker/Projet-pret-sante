import React, { useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Colors from '@/constants/Colors';
import { Fonts, Radius } from '@/constants/theme';
import { useColorScheme } from '@/components/useColorScheme';

type Props = {
  length?: number;
  value: string;
  onChange: (val: string) => void;
  error?: boolean;
};

// Single hidden input driving `length` visual boxes — keeps native paste-from-SMS
// behaviour working for free instead of juggling refs across separate fields.
export default function OtpInput({ length = 6, value, onChange, error }: Props) {
  const colors = Colors[useColorScheme() ?? 'light'];
  const inputRef = useRef<TextInput>(null);
  const [focused, setFocused] = useState(false);

  const digits = Array.from({ length }).map((_, i) => value[i] ?? '');
  const activeIndex = Math.min(value.length, length - 1);

  return (
    <Pressable onPress={() => inputRef.current?.focus()} style={styles.row}>
      {digits.map((d, i) => {
        const isActive = focused && i === activeIndex;
        return (
          <View
            key={i}
            style={[
              styles.box,
              {
                backgroundColor: colors.surfaceSunken,
                borderColor: error ? colors.danger : isActive ? colors.primary : colors.border,
                borderWidth: isActive ? 2 : 1.5,
              },
            ]}
          >
            <Text style={[styles.digit, { color: colors.text }]}>{d}</Text>
          </View>
        );
      })}
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={(t) => onChange(t.replace(/[^0-9]/g, '').slice(0, length))}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        keyboardType="number-pad"
        maxLength={length}
        autoFocus
        textContentType="oneTimeCode"
        style={styles.hiddenInput}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
  },
  box: {
    width: 46,
    height: 56,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  digit: {
    fontFamily: Fonts.displayBold,
    fontSize: 22,
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    width: 1,
    height: 1,
  },
});
