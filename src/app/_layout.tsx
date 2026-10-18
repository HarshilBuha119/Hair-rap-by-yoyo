import { PlayfairDisplay_600SemiBold, PlayfairDisplay_700Bold, useFonts } from '@expo-google-fonts/playfair-display';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { AppStatusBar } from '@/components/status-bar';
import { C, F } from '@/constants/brand';
import { AppProvider, useApp } from '@/store/app-store';

SplashScreen.preventAutoHideAsync();

function Gate() {
  const [fontsLoaded, fontError] = useFonts({ PlayfairDisplay_600SemiBold, PlayfairDisplay_700Bold });
  const { state } = useApp();
  const ready = (fontsLoaded || !!fontError) && state.ready;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  return (
    <>
      <AppStatusBar />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: C.ivory },
          headerStyle: { backgroundColor: C.ivory },
          headerShadowVisible: false,
          headerTintColor: C.ink,
          headerTitleStyle: { fontFamily: F.serif, fontSize: 18 },
        }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="book" />
        <Stack.Screen name="bag" options={{ headerShown: true, title: 'Your bag' }} />
        <Stack.Screen name="academy" options={{ headerShown: true, title: 'Trendsetter Academy' }} />
        <Stack.Screen name="enquiry" options={{ headerShown: true, title: 'Bridal & at-home' }} />
        <Stack.Screen name="about" options={{ headerShown: true, title: 'About us' }} />
        <Stack.Screen name="memberships" options={{ headerShown: true, title: 'Lounge memberships' }} />
        <Stack.Screen name="login" options={{ presentation: 'modal', headerShown: true, title: 'Sign in' }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <AppProvider>
      <Gate />
    </AppProvider>
  );
}
