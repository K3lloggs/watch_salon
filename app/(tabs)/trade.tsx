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
import { useLocalSearchParams } from 'expo-router'; // or useRoute from React Navigation
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { Watch } from '../types/Watch';

export default function TradeScreen() {
  // If a watch is passed via route parameters (from TradeButton)
  const { watch } = useLocalSearchParams() as { watch?: Watch };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    photo: null as string | null,
  });

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

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.phone) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    if (!formData.photo) {
      Alert.alert('Error', 'Please add at least one photo');
      return;
    }

    try {
      // Submit the trade request to Firestore
      const tradeRef = collection(db, 'TradeRequests');
      await addDoc(tradeRef, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        photo: formData.photo,
        createdAt: new Date().toISOString(),
      });

      Alert.alert(
        'Success',
        'Your trade request has been submitted. We will contact you soon!',
        [{ text: 'OK', onPress: resetForm }]
      );
    } catch (err) {
      console.error('Error submitting trade:', err);
      Alert.alert('Error', 'Could not submit trade request. Please try again later.');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: '',
      photo: null,
    });
  };

  return (
    <View style={styles.container}>
      <FixedHeader />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Trade Request</Text>
        {watch && (
          <Text style={styles.watchInfo}>
            Trading for: {watch.brand} {watch.model} – ${watch.price?.toLocaleString()}
          </Text>
        )}

        {/* Photo Section */}
        <View style={styles.photoSection}>
          {formData.photo ? (
            <View style={styles.photoPreviewContainer}>
              <Image source={{ uri: formData.photo }} style={styles.photoPreview} />
              <TouchableOpacity
                style={styles.removePhotoButton}
                onPress={() =>
                  setFormData((prev) => ({
                    ...prev,
                    photo: null,
                  }))
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

        {/* Input Fields */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Name *</Text>
          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={(text) => setFormData((prev) => ({ ...prev, name: text }))}
            placeholder="Enter your full name"
            placeholderTextColor="#888"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email *</Text>
          <TextInput
            style={styles.input}
            value={formData.email}
            onChangeText={(text) => setFormData((prev) => ({ ...prev, email: text }))}
            placeholder="Enter your email address"
            placeholderTextColor="#888"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone *</Text>
          <TextInput
            style={styles.input}
            value={formData.phone}
            onChangeText={(text) => setFormData((prev) => ({ ...prev, phone: text }))}
            placeholder="Enter your phone number"
            placeholderTextColor="#888"
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Message</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.message}
            onChangeText={(text) => setFormData((prev) => ({ ...prev, message: text }))}
            placeholder="Share details about your trade request"
            placeholderTextColor="#888"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit Request</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // Overall container with a light background for luxury and ample whitespace.
  container: {
    flex: 1,
    backgroundColor: '#F6F7F8',
  },
  scrollContainer: {
    padding: 24,
    paddingBottom: 48,
  },
  // Title styled with modern, clean typography.
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#002d4e',
    marginBottom: 16,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  watchInfo: {
    fontSize: 16,
    color: '#5A5A5A',
    marginBottom: 24,
    textAlign: 'center',
  },
  // Photo section with a clean, grid-like layout.
  photoSection: {
    marginBottom: 32,
  },
  photoButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  photoButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DADADA',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 12,
    width: '45%',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
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
  // Input fields with a minimal, clean style.
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
  textArea: {
    height: 120,
  },
  // Submit button with a luxurious deep accent and modern typography.
  submitButton: {
    backgroundColor: '#002d4e',
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});


