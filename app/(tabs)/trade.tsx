// app/(tabs)/trade.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FixedHeader } from '../components/FixedHeader';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams } from 'expo-router';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { Watch } from '../types/Watch';

type Mode = 'trade' | 'sell' | 'request';

export default function TradeScreen() {
  // Retrieve and parse watch data from URL parameters (if any)
  const { watch } = useLocalSearchParams() as { watch?: string };
  const watchData: Watch | undefined = watch ? JSON.parse(watch) : undefined;

  // Only one input is required now: reference number (or photo)
  const [formData, setFormData] = useState({
    reference: '',
    photo: null as string | null,
  });

  // Active mode: trade, sell or request.
  const [activeMode, setActiveMode] = useState<Mode>('trade');

  // Request camera and launch camera
  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Camera access is required to take photos');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setFormData((prev) => ({ ...prev, photo: result.assets[0].uri }));
    }
  };

  // Launch image library picker
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setFormData((prev) => ({ ...prev, photo: result.assets[0].uri }));
    }
  };

  // On submission, require at least a reference number or a photo
  const handleSubmit = async () => {
    if (!formData.reference && !formData.photo) {
      Alert.alert('Error', 'Please provide a reference number or add a photo');
      return;
    }

    // Determine the target Firebase collection based on the active mode.
    let collectionName = '';
    if (activeMode === 'trade') collectionName = 'TradeRequests';
    else if (activeMode === 'sell') collectionName = 'SellRequests';
    else if (activeMode === 'request') collectionName = 'Requests';

    try {
      const reqRef = collection(db, collectionName);
      await addDoc(reqRef, {
        reference: formData.reference,
        photo: formData.photo,
        createdAt: new Date().toISOString(),
        mode: activeMode,
        ...(watchData && {
          watchBrand: watchData.brand,
          watchModel: watchData.model,
          watchPrice: watchData.price,
          watchId: watchData.id,
        }),
      });
      Alert.alert(
        'Success',
        `Your ${activeMode} submission has been sent!`,
        [{ text: 'OK', onPress: resetForm }]
      );
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Could not submit your request. Please try again later.');
    }
  };

  const resetForm = () => {
    setFormData({
      reference: '',
      photo: null,
    });
  };

  return (
    <View style={styles.container}>
      <FixedHeader />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Seamless mode toggle container */}
        <View style={styles.toggleContainer}>
          {(['trade', 'sell', 'request'] as Mode[]).map((mode) => (
            <TouchableOpacity
              key={mode}
              style={[
                styles.toggleButton,
                activeMode === mode && styles.toggleButtonActive,
              ]}
              onPress={() => setActiveMode(mode)}
            >
              <Text
                style={[
                  styles.toggleButtonText,
                  activeMode === mode && styles.toggleButtonTextActive,
                ]}
              >
                {mode.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Optionally show watch info */}
        {watchData && (
          <Text style={styles.watchInfo}>
            {`For: ${watchData.brand} ${watchData.model} – $${watchData.price?.toLocaleString()}`}
          </Text>
        )}

        {/* Reference Number Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Reference Number</Text>
          <TextInput
            style={styles.input}
            value={formData.reference}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, reference: text }))
            }
            placeholder="Enter the reference number"
            placeholderTextColor="#888"
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>
            Submit {activeMode.charAt(0).toUpperCase() + activeMode.slice(1)} Request
          </Text>
        </TouchableOpacity>

        {/* Photo Section at the bottom */}
        <View style={styles.photoSection}>
          {formData.photo ? (
            <View style={styles.photoPreviewContainer}>
              <Image
                source={{ uri: formData.photo }}
                style={styles.photoPreview}
              />
              <TouchableOpacity
                style={styles.removePhotoButton}
                onPress={() =>
                  setFormData((prev) => ({ ...prev, photo: null }))
                }
              >
                <Ionicons name="close-circle" size={28} color="#C0392B" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.photoButtonsContainer}>
              <TouchableOpacity style={styles.photoButton} onPress={takePhoto}>
                <Ionicons name="camera-outline" size={28} color="#002d4e" />
                <Text style={styles.photoButtonText}>Take Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
                <Ionicons name="image-outline" size={28} color="#002d4e" />
                <Text style={styles.photoButtonText}>Add Photo</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F7F8',
  },
  // Center all scrollable content horizontally.
  scrollContainer: {
    padding: 24,
    paddingBottom: 48,
    alignItems: 'center',
  },
  // Toggle container now spans full width and is centered.
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#E6EEF7', // Light blue hue for a modern look
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    width: '100%',
    maxWidth: 400,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: '#002d4e',
  },
  toggleButtonText: {
    fontSize: 16,
    color: '#002d4e',
    fontWeight: '600',
  },
  toggleButtonTextActive: {
    color: '#fff',
  },
  watchInfo: {
    fontSize: 16,
    color: '#5A5A5A',
    textAlign: 'center',
    marginBottom: 24,
    width: '100%',
    maxWidth: 400,
  },
  inputGroup: {
    marginBottom: 20,
    width: '100%',
    maxWidth: 400,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#002d4e',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  submitButton: {
    backgroundColor: '#002d4e',
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    marginVertical: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#002d4e',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 3,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  // Photo section at the bottom of the view.
  photoSection: {
    marginTop: 32,
    width: '100%',
    maxWidth: 400,
  },
  photoButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  photoButton: {
    flex: 0.45,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 16,
    // Blue-hued shadow for an elegant touch.
    shadowColor: '#007AFF',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
  },
  photoButtonText: {
    color: '#002d4e',
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  photoPreviewContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
  },
  photoPreview: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  removePhotoButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 16,
    padding: 4,
  },
});

