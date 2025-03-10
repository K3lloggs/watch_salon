import React from 'react';
import { View, ActivityIndicator, StyleSheet, Dimensions } from 'react-native';

interface LoadingOverlayProps {
  visible: boolean;
}

export function LoadingOverlay({ visible }: LoadingOverlayProps) {
  if (!visible) return null;

  // Get window dimensions to properly position the loading indicator
  const windowHeight = Dimensions.get('window').height;
  
  return (
    <View style={styles.overlay}>
      {/* Position the activity indicator away from the header area */}
      <View style={[styles.loaderContainer, { top: windowHeight * 0.4 }]}>
        <ActivityIndicator size="large" color="#002d4e" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    zIndex: 9999, // Ensure it's above everything else
  },
  loaderContainer: {
    position: 'absolute',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  }
});