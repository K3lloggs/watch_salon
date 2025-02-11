import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const BackButton: React.FC = () => {
  const router = useRouter();

  const handlePress = () => {
    router.back(); // Navigate back to the previous screen
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.container}>
      <Feather name="arrow-left" size={24} color="#000" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 16,
    left: 16,
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Slight white background for contrast
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, // For Android shadow
  },
});

export default BackButton;