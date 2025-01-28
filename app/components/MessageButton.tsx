import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  StyleProp,
  Platform,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface MessageButtonProps {
  title?: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const MessageButton: React.FC<MessageButtonProps> = ({
  title = 'MESSAGE US',
  onPress,
  style,
  textStyle,
}) => {
  return (
    <TouchableOpacity 
      onPress={onPress} 
      style={[styles.buttonContainer, style]}
      activeOpacity={0.9}
    >
      <LinearGradient
        colors={['#002851', '#004B96']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradientBorder}
      >
        <View style={styles.innerContainer}>
          <Text style={[styles.text, textStyle]}>{title}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    height: 50,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 4,
    overflow: 'hidden', // Important for gradient
  },
  gradientBorder: {
    flex: 1,
    padding: 1, // This creates the border effect
  },
  innerContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3,
  },
  text: {
    color: '#002851',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif-medium',
  },
});