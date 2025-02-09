import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

interface TradeButtonProps {
  title?: string;
  watch?: any;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  onPress?: () => void;
}

export const TradeButton: React.FC<TradeButtonProps> = ({
  title = 'TRADE FOR THIS WATCH',
  watch,
  style,
  textStyle,
  onPress,
}) => {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
      return;
    }
    router.push({
      pathname: '/trade',
      params: { watch: JSON.stringify(watch) },
    });
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[styles.buttonContainer, style]}
      activeOpacity={0.9}
    >
      <LinearGradient
        colors={['#002d4e', '#0056b3']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        <Text style={[styles.text, textStyle]}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    height: 50,
    borderRadius: 12,
    overflow: 'hidden',
    // Default margins (can be overridden for inline layout)
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 4,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-medium',
  },
});
