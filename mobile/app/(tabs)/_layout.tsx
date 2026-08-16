import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Tabs } from 'expo-router';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home, Handshake, User } from 'lucide-react-native';
import Animated, { FadeIn, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import Colors from '@/constants/Colors';
import { Fonts, Radius } from '@/constants/theme';
import { useColorScheme } from '@/components/useColorScheme';

const TAB_META: Record<string, { label: string; icon: typeof Home }> = {
  index: { label: 'Accueil', icon: Home },
  partners: { label: 'Partenaires', icon: Handshake },
  profile: { label: 'Profil', icon: User },
};

function DockItem({
  meta,
  focused,
  onPress,
  colors,
}: {
  meta: (typeof TAB_META)[string];
  focused: boolean;
  onPress: () => void;
  colors: (typeof Colors)['light'];
}) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => (scale.value = withSpring(0.92, { damping: 14, stiffness: 260 }))}
      onPressOut={() => (scale.value = withSpring(1, { damping: 14, stiffness: 260 }))}
    >
      <Animated.View
        style={[styles.dockItem, focused && { backgroundColor: colors.primary }, animatedStyle]}
      >
        <meta.icon size={19} color={focused ? '#FFFFFF' : colors.textMuted} strokeWidth={focused ? 2.4 : 2} />
        {focused && (
          <Animated.Text entering={FadeIn.duration(180)} style={styles.dockLabel}>
            {meta.label}
          </Animated.Text>
        )}
      </Animated.View>
    </Pressable>
  );
}

// Floating pill dock, centered whatever the viewport width — replaces the
// default tab bar whose three items drift apart on large (web) screens.
function FloatingDock({ state, navigation }: BottomTabBarProps) {
  const colors = Colors[useColorScheme() ?? 'light'];
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.dockWrap, { paddingBottom: Math.max(insets.bottom, 14) }]}>
      <View style={[styles.dock, { backgroundColor: 'rgba(255,255,255,0.94)' }]}>
        {state.routes.map((route, index) => {
          const meta = TAB_META[route.name];
          if (!meta) return null;
          const focused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return <DockItem key={route.key} meta={meta} focused={focused} onPress={onPress} colors={colors} />;
        })}
      </View>
    </View>
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <LinearGradient
      colors={[colors.gradientStart, colors.gradientEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <Tabs
        tabBar={(props) => <FloatingDock {...props} />}
        screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: 'transparent' } }}
      >
        <Tabs.Screen name="index" />
        <Tabs.Screen name="partners" />
        <Tabs.Screen name="profile" />
      </Tabs>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  dockWrap: {
    alignItems: 'center',
    paddingTop: 10,
    backgroundColor: 'transparent',
  },
  dock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 6,
    borderRadius: Radius.pill,
    shadowColor: '#0B3B3E',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 22,
    elevation: 10,
  },
  dockItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: Radius.pill,
  },
  dockLabel: {
    fontFamily: Fonts.bodyBold,
    fontSize: 12.5,
    color: '#FFFFFF',
  },
});
