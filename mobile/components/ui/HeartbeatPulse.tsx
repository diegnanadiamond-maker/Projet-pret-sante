import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Heart } from 'lucide-react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';

type Props = {
  color?: string;
  size?: number;
};

// Realistic "lub-dub" heartbeat: two quick thumps then a longer rest, looped —
// used in place of the static ECG line where a livelier motif is wanted.
export default function HeartbeatPulse({ color = '#155EEF', size = 34 }: Props) {
  const scale = useSharedValue(1);
  const ringScale = useSharedValue(1);
  const ringOpacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.22, { duration: 110, easing: Easing.out(Easing.quad) }),
        withTiming(1, { duration: 110, easing: Easing.in(Easing.quad) }),
        withTiming(1.14, { duration: 110, easing: Easing.out(Easing.quad) }),
        withTiming(1, { duration: 140, easing: Easing.in(Easing.quad) }),
        withTiming(1, { duration: 650 }),
      ),
      -1,
      false,
    );

    ringScale.value = withRepeat(
      withSequence(withTiming(1, { duration: 110 }), withTiming(2.4, { duration: 900, easing: Easing.out(Easing.ease) })),
      -1,
      false,
    );
    ringOpacity.value = withRepeat(
      withSequence(
        withTiming(0.35, { duration: 110 }),
        withTiming(0, { duration: 900, easing: Easing.out(Easing.ease) }),
      ),
      -1,
      false,
    );
  }, []);

  const heartStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale.value }],
    opacity: ringOpacity.value,
  }));

  return (
    <View style={{ width: size * 2, height: size * 2, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View
        style={[
          {
            position: 'absolute',
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: 1.5,
            borderColor: color,
          },
          ringStyle,
        ]}
      />
      <Animated.View style={heartStyle}>
        <Heart size={size} color={color} fill={color} />
      </Animated.View>
    </View>
  );
}
