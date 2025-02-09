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

interface MessageButtonProps {
  title?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  onPress?: () => void;
}

export const MessageButton: React.FC<MessageButtonProps> = ({
  title = 'MESSAGE US',
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
    router.push('/(screens)/MessageScreen');
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[styles.buttonContainer, style]}
      activeOpacity={0.85}
    >
      <LinearGradient
        colors={['#e5e5ea', '#c7c7cc']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        <Text style={[styles.buttonText, textStyle]}>{title}</Text>
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
  buttonText: {
    color: '#002d4e',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-medium',
  },
});
