import React, { useState, useCallback } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Image,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FixedHeader } from '../components/FixedHeader';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams } from 'expo-router';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { Watch } from '../types/Watch';

type Mode = 'trade' | 'sell' | 'request';

interface FormData {
  reference: string;
  phoneNumber: string;
  photo: string | null;
}

const MODES: Mode[] = ['trade', 'sell', 'request'];

export default function TradeScreen() {
  // Retrieve watch info from URL parameters, if provided
  const { watch } = useLocalSearchParams() as { watch?: string };
  const watchData: Watch | undefined = watch ? JSON.parse(watch) : undefined;

  const [formData, setFormData] = useState<FormData>({
    reference: '',
    phoneNumber: '',
    photo: null,
  });
  const [activeMode, setActiveMode] = useState<Mode>('trade');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const updateField = useCallback(
    (field: keyof FormData, value: string | null) => {
      setFormData(prev => ({ ...prev, [field]: value }));
    },
    []
  );

  const takePhoto = useCallback(async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Camera access is required to take photos');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 1 });
    if (!result.canceled && result.assets?.[0]?.uri) {
      updateField('photo', result.assets[0].uri);
    }
  }, [updateField]);

  const pickImage = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled && result.assets?.[0]?.uri) {
      updateField('photo', result.assets[0].uri);
    }
  }, [updateField]);

  const resetForm = useCallback(() => {
    setFormData({ reference: '', phoneNumber: '', photo: null });
  }, []);

  const handleSubmit = useCallback(async () => {
    // Basic validation
    if (!formData.reference && !formData.photo) {
      Alert.alert('Error', 'Please provide a reference number or add a photo');
      return;
    }
    if (!formData.phoneNumber) {
      Alert.alert('Error', 'Please provide your phone number');
      return;
    }

    setIsSubmitting(true);

    // Determine collection name based on the active mode
    const collectionName =
      activeMode === 'trade' ? 'TradeRequests' : activeMode === 'sell' ? 'SellRequests' : 'Requests';

    const payload: any = {
      reference: formData.reference,
      phoneNumber: formData.phoneNumber,
      photo: formData.photo,
      createdAt: new Date().toISOString(),
      mode: activeMode,
    };

    if (watchData) {
      payload.watchBrand = watchData.brand;
      payload.watchModel = watchData.model;
      payload.watchPrice = watchData.price;
      payload.watchId = watchData.id;
    }

    try {
      const reqRef = collection(db, collectionName);
      await addDoc(reqRef, payload);
      Alert.alert('Success', `Your ${activeMode} submission has been sent!`, [
        { text: 'OK', onPress: resetForm },
      ]);
    } catch (error) {
      console.error('Submission error:', error);
      Alert.alert('Error', 'Could not submit your request. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  }, [activeMode, formData, resetForm, watchData]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#002d4e" />
      <FixedHeader />
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        {/* Top Section with White Background */}
        <View style={styles.topSection}>
          <View style={styles.toggleContainer}>
            {MODES.map(mode => (
              <TouchableOpacity
                key={mode}
                style={[styles.toggleButton, activeMode === mode && styles.toggleButtonActive]}
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
          {watchData && (
            <Text style={styles.watchInfo}>
              {`For: ${watchData.brand} ${watchData.model} – $${watchData.price?.toLocaleString()}`}
            </Text>
          )}
        </View>

        {/* Middle Section: Reference & Phone Inputs (Centered) */}
        <View style={styles.middleSection}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Reference Number</Text>
            <TextInput
              style={styles.input}
              value={formData.reference}
              onChangeText={text => updateField('reference', text)}
              placeholder="Enter the reference number"
              placeholderTextColor="#888"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={formData.phoneNumber}
              onChangeText={text => updateField('phoneNumber', text)}
              placeholder="Enter your phone number"
              placeholderTextColor="#888"
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* Bottom Section: Photo Controls & Submit Button */}
        <View style={styles.bottomSection}>
          <View style={styles.photoSection}>
            {formData.photo ? (
              <View style={styles.photoPreviewContainer}>
                <Image source={{ uri: formData.photo }} style={styles.photoPreview} />
                <TouchableOpacity
                  style={styles.removePhotoButton}
                  onPress={() => updateField('photo', null)}
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
          <TouchableOpacity
            style={[styles.submitButton, isSubmitting && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitButtonText}>
                Submit {activeMode.charAt(0).toUpperCase() + activeMode.slice(1)} Request
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F7F8',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  // Top Section (white background) with a card-like style
  topSection: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    maxWidth: 400,
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#E6EEF7',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
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
  },
  // Middle Section: Inputs
  middleSection: {
    width: '100%',
    maxWidth: 400,
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
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
  // Bottom Section: Photo & Submit Button
  bottomSection: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    marginBottom: 16,
  },
  photoSection: {
    width: '100%',
    marginBottom: 24,
  },
  photoButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  photoButton: {
    flex: 0.48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 16,
    marginHorizontal: 4,
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
  submitButton: {
    backgroundColor: '#002d4e',
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
    shadowColor: '#002d4e',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 3,
    marginTop: 16,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
});