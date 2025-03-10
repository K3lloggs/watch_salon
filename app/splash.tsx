// app/splash.tsx
import * as SplashScreen from 'expo-splash-screen';
import { Image, Animated, View } from 'react-native';
import { useEffect, useState, useRef } from 'react';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync().catch(() => {
  /* reloading the app might trigger some race conditions, ignore them */
});

// Global flag to track if initial app load is complete
let isAppLoaded = false;

// Custom splash component with fade animation
export function AnimatedSplashScreen({ children }) {
  const [isAppReady, setIsAppReady] = useState(false);
  const [isSplashAnimationComplete, setIsSplashAnimationComplete] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isAppReady) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => {
        setIsSplashAnimationComplete(true);
        isAppLoaded = true;
      });
    }
  }, [isAppReady]);

  const onImageLoaded = async () => {
    try {
      await SplashScreen.hideAsync();
      // Wait a bit to allow proper rendering
      await new Promise(resolve => setTimeout(resolve, 500));
      setIsAppReady(true);
    } catch (e) {
      console.warn(e);
    }
  };

  if (!isSplashAnimationComplete) {
    return (
      <View style={{ flex: 1 }}>
        <Animated.View
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: '#ffffff',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: fadeAnim,
            zIndex: 999,
          }}
        >
          <Image
            source={require('../assets/images/shreve_circle.png')}
            style={{ width: 200, height: 200 }}
            onLoadEnd={onImageLoaded}
            fadeDuration={0}
          />
        </Animated.View>
        {isAppReady && children}
      </View>
    );
  }

  return children;
}

// Function to manually hide the splash screen
export const hideSplashScreen = async () => {
  await SplashScreen.hideAsync();
};