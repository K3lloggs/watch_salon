// app/RootLayout.tsx
import { Stack } from 'expo-router';
import { SortProvider } from './context/SortContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { StatusBar } from 'react-native';

export default function RootLayout() {
  return (
    <FavoritesProvider>
      <SortProvider>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <Stack
          screenOptions={{
            headerShown: false, // disable the default header for all screens
          }}
        >
          {/* Main Tab Navigation */}
          <Stack.Screen name="(tabs)" />
          {/* Other Routes */}
          <Stack.Screen name="(screens)/fine-art" />
          <Stack.Screen name="(screens)/fine-art/[id]" />
          <Stack.Screen name="watch/[id]" />
          <Stack.Screen name="Watches" />
          <Stack.Screen name="FilterScreen" />
        </Stack>
      </SortProvider>
    </FavoritesProvider>
  );
}
