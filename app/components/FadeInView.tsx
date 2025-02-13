// app/components/FadeInView.tsx
import React, { useRef, useEffect } from 'react';
import { Animated, StyleProp, ViewStyle } from 'react-native';

interface FadeInViewProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function FadeInView({ children, style }: FadeInViewProps) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  return <Animated.View style={[style, { opacity }]}>{children}</Animated.View>;
}

export default FadeInView;
