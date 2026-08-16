import React from 'react';
import { Tabs } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Home, Handshake, User } from 'lucide-react-native';

import Colors from '@/constants/Colors';
import { Fonts } from '@/constants/theme';
import { useColorScheme } from '@/components/useColorScheme';

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
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.tabIconDefault,
          tabBarStyle: {
            backgroundColor: 'transparent',
            borderTopWidth: 0,
            elevation: 0,
            shadowOpacity: 0,
            height: 78,
            paddingBottom: 14,
            paddingTop: 8,
          },
          tabBarItemStyle: {
            paddingVertical: 2,
          },
          tabBarLabelStyle: {
            fontFamily: Fonts.bodyBold,
            fontSize: 10.5,
            lineHeight: 13,
          },
          tabBarIconStyle: {
            marginBottom: 1,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Accueil',
            tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="partners"
          options={{
            title: 'Partenaires',
            tabBarIcon: ({ color, size }) => <Handshake size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profil',
            tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
          }}
        />
      </Tabs>
    </LinearGradient>
  );
}
