// app/_layout.tsx
import { Stack } from 'expo-router';
import { SortProvider } from './context/SortContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { Ionicons } from '@expo/vector-icons';

export default function RootLayout() {
  return (
    <FavoritesProvider>
      <SortProvider>
        <Stack screenOptions={{
          headerLeft: () => <Ionicons name="chevron-back" size={24} color="#000000" />,
          headerBackVisible: false,
        }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen 
            name="fine-art" 
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen 
            name="fine-art/[id]" 
            options={{
              headerShown: false,
            }}
          />
        </Stack>
      </SortProvider>
    </FavoritesProvider>
  );
}