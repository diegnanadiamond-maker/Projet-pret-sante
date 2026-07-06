import React from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

type Props = {
  color?: string;
  width?: number;
  height?: number;
  strokeWidth?: number;
};

// The recurring "vital sign" motif: a stylised ECG heartbeat line used across
// hero headers, dividers and loading states to tie the brand back to health.
export default function PulseLine({ color = '#155EEF', width = 160, height = 40, strokeWidth = 2.5 }: Props) {
  const path = `M0 ${height * 0.5} L${width * 0.18} ${height * 0.5} L${width * 0.27} ${height * 0.18} L${width * 0.35} ${height * 0.86} L${width * 0.43} ${height * 0.08} L${width * 0.5} ${height * 0.5} L${width * 0.66} ${height * 0.5} L${width * 0.74} ${height * 0.3} L${width * 0.82} ${height * 0.5} L${width} ${height * 0.5}`;

  return (
    <View style={{ width, height }}>
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <Path d={path} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </Svg>
    </View>
  );
}
