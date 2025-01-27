import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  StyleProp,
  Platform,
} from 'react-native';
import { FixedHeader } from './FixedHeader';

interface TradeButtonProps {
  title?: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const TradeButton: React.FC<TradeButtonProps> = ({
  title = 'Request Trade',
  onPress,
  style,
  textStyle,
}) => {
  return (
    
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, style]}
      activeOpacity={0.8}
    >
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16, // 16-point radius
    borderWidth: 2,
    borderColor: '#002d4e', // Outline color
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginVertical: 20,
    // Subtle shadow
    shadowColor: '#002d4e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4, // For Android shadow
  },
  text: {
    color: '#002d4e',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif',
  },
});
