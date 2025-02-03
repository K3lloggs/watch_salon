// app/_layout.tsx
import { Stack } from 'expo-router';
import { SortProvider } from './context/SortContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'react-native';


export default function RootLayout() {
  return (
    <FavoritesProvider>
      <SortProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <Stack screenOptions={{
          headerLeft: () => <Ionicons name="chevron-back" size={24} color="#000000" />,
          headerBackVisible: false,
        }}>
          {/* Main Tab Navigation */}
          <Stack.Screen 
            name="(tabs)" 
            options={{ headerShown: false }} 
          />

          {/* Art Routes */}
          <Stack.Screen 
            name="(screens)/fine-art" 
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen 
            name="(screens)/fine-art/[id]" 
            options={{
              headerShown: false,
            }}
          />

          {/* Watch Routes */}
          <Stack.Screen 
            name="watch/[id]" 
            options={{
              headerShown: false,
            }}
          />
        </Stack>
      </SortProvider>
    </FavoritesProvider>
  );
}