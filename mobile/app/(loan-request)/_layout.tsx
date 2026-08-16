import { Stack } from 'expo-router';

export default function LoanRequestLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="step-1-care" />
      <Stack.Screen name="step-2-amount" />
      <Stack.Screen name="recap" />
      <Stack.Screen name="step-3-fees" />
      <Stack.Screen name="step-4-documents" />
      <Stack.Screen name="step-5-contract" />
      <Stack.Screen name="step-6-success" options={{ animation: 'fade', gestureEnabled: false }} />
    </Stack>
  );
}
