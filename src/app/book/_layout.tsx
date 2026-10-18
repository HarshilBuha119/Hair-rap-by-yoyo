import { Stack } from 'expo-router';

import { C, F } from '@/constants/brand';

export default function BookLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: C.ivory },
        headerShadowVisible: false,
        headerTintColor: C.ink,
        headerTitleStyle: { fontFamily: F.serif, fontSize: 18 },
        contentStyle: { backgroundColor: C.ivory },
      }}>
      <Stack.Screen name="schedule" options={{ title: 'Choose a time' }} />
      <Stack.Screen name="review" options={{ title: 'Review & confirm' }} />
      <Stack.Screen name="confirmed" options={{ headerShown: false, gestureEnabled: false }} />
    </Stack>
  );
}
