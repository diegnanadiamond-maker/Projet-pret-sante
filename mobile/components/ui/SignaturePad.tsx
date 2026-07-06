import React, { useRef, useState } from 'react';
import { PanResponder, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Colors from '@/constants/Colors';
import { Fonts, Radius } from '@/constants/theme';
import { useColorScheme } from '@/components/useColorScheme';

type Props = {
  onChange?: (hasSignature: boolean) => void;
  height?: number;
};

// Real touch-captured signature: records finger paths as SVG strokes rather
// than faking the "signed" state — small but honest bit of interactivity
// for a step that's meant to feel like a real legal commitment.
export default function SignaturePad({ onChange, height = 160 }: Props) {
  const colors = Colors[useColorScheme() ?? 'light'];
  const [paths, setPaths] = useState<string[]>([]);
  const currentPath = useRef('');

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (e) => {
        const { locationX, locationY } = e.nativeEvent;
        currentPath.current = `M${locationX.toFixed(1)} ${locationY.toFixed(1)}`;
      },
      onPanResponderMove: (e) => {
        const { locationX, locationY } = e.nativeEvent;
        currentPath.current += ` L${locationX.toFixed(1)} ${locationY.toFixed(1)}`;
        setPaths((prev) => {
          const next = [...prev];
          next[next.length] = currentPath.current;
          return next.slice(0, prev.length + 1);
        });
      },
      onPanResponderRelease: () => {
        setPaths((prev) => {
          const finalized = [...prev.filter((_, i) => i !== prev.length - 1), currentPath.current];
          onChange?.(finalized.length > 0);
          return finalized;
        });
        currentPath.current = '';
      },
    }),
  ).current;

  const clear = () => {
    setPaths([]);
    onChange?.(false);
  };

  return (
    <View>
      <View
        {...panResponder.panHandlers}
        style={[styles.pad, { height, backgroundColor: colors.surfaceSunken, borderColor: colors.border }]}
      >
        {paths.length === 0 && <Text style={[styles.placeholder, { color: colors.textMuted }]}>Signez ici avec le doigt</Text>}
        <Svg width="100%" height="100%">
          {paths.map((d, i) => (
            <Path key={i} d={d} stroke={colors.text} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
          ))}
        </Svg>
      </View>
      {paths.length > 0 && (
        <TouchableOpacity onPress={clear} style={styles.clearBtn}>
          <Text style={[styles.clearText, { color: colors.primary }]}>Effacer la signature</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  pad: {
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholder: {
    position: 'absolute',
    fontFamily: Fonts.bodyMedium,
    fontSize: 13,
  },
  clearBtn: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  clearText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 12,
  },
});
