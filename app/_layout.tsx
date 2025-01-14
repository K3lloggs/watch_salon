import { Stack } from 'expo-router';
import { SortProvider } from './context/SortContext';
import { FavoritesProvider } from './context/FavoritesContext';

export default function RootLayout() {
    return (
        <FavoritesProvider>
            <SortProvider>
                <Stack>
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                    <Stack.Screen name="favorites" options={{
                        title: 'Favorites',
                        headerStyle: {
                            backgroundColor: '#ffffff',
                        },
                        headerTintColor: '#002d4e',
                    }} />
                </Stack>
            </SortProvider>
        </FavoritesProvider>
    );
}