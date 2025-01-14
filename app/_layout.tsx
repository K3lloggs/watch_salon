import { Stack } from 'expo-router';
import { SortProvider } from './context/SortContext';

export default function RootLayout() {
    return (
        <SortProvider>
            <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
        </SortProvider>
    );
}