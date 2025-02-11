import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import ShareButton from './ShareButton';
import { Watch } from '../types/Watch';

export function FixedHeader({ title = "Watch Salon", watch, showBackButton = false }: { title?: string; watch?: Watch; showBackButton?: boolean }) {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <View style={styles.buttonContainer}>
                    {showBackButton && (
                        <Feather 
                            name="arrow-left" 
                            size={24} 
                            color="#002d4e" 
                            onPress={() => router.back()}
                        />
                    )}
                </View>
                <Text style={styles.title}>{title}</Text>
                <View style={styles.buttonContainer}>
                    {watch && (
                        <ShareButton
                            title={`Check out this ${watch.brand} ${watch.model}`}
                            message={`I found this amazing ${watch.brand} ${watch.model} on Watch Salon`}
                            url={`https://watchsalon.com/watches/${watch.id}`}
                            size={24}
                            color="#002d4e"
                            style={styles.shareButton}
                        />
                    )}
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#ffffff',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#002d4e',
        flex: 1,
        textAlign: 'center',
    },
    buttonContainer: {
        width: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    shareButton: {
        padding: 0, // Remove default padding from ShareButton
    }
});