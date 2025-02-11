import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  View,
  Platform,
  StyleSheet as RNStyleSheet,
} from 'react-native';
import Svg, { Defs, Rect, Stop, LinearGradient } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';

interface PhotoButtonProps {
  label: string;
  iconName: React.ComponentProps<typeof Ionicons>['name'];
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

export const PhotoButton: React.FC<PhotoButtonProps> = ({
  label,
  iconName,
  onPress,
  style,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[photoButtonStyles.buttonContainer, style]}
    >
      <View style={photoButtonStyles.gradientWrapper}>
        <Svg width="100%" height="100%" style={RNStyleSheet.absoluteFill}>
          <Defs>
            <LinearGradient id="photoGrad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor="#007AFF" />
              <Stop offset="0.33" stopColor="#0056b3" />
              <Stop offset="0.66" stopColor="#002d4e" />
              <Stop offset="1" stopColor="#007AFF" />
            </LinearGradient>
          </Defs>
          <Rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            rx="12"
            ry="12"
            stroke="url(#photoGrad)"
            strokeWidth="4"
            fill="none"
          />
        </Svg>
        <View style={photoButtonStyles.innerContainer}>
          <Ionicons name={iconName} size={24} color="#002d4e" />
          <Text style={photoButtonStyles.buttonText}>{label}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const photoButtonStyles = StyleSheet.create({
  buttonContainer: {
    height: 50,
    borderRadius: 12,
    overflow: 'hidden',
    marginVertical: 8,
    marginHorizontal: 8,
    width: '48%', // so two buttons can sit side-by-side
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 4,
  },
  gradientWrapper: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    borderRadius: 8, // (12 - 4 for the border thickness)
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4, // space to show the gradient border
    flexDirection: 'row',
  },
  buttonText: {
    color: '#002d4e',
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 8,
    textTransform: 'uppercase',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-medium',
  },
});
