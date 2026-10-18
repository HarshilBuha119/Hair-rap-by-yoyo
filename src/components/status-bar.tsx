import { useIsFocused } from 'expo-router';
import { StatusBar } from 'react-native';

// Translucent status bar so screens draw underneath it and there is no solid black strip.
// React Native keeps a stack of <StatusBar> entries: the most recently mounted one wins and
// popping it restores the previous one, which is how Home switches to light icons over its dark hero.
export function AppStatusBar({ light = false }: { light?: boolean }) {
  return <StatusBar translucent backgroundColor="transparent" barStyle={light ? 'light-content' : 'dark-content'} />;
}

/** Only applies while its screen is focused (tab screens stay mounted when unfocused). */
export function FocusedStatusBar({ light = false }: { light?: boolean }) {
  const focused = useIsFocused();
  return focused ? <AppStatusBar light={light} /> : null;
}
