import React, { useState, useCallback, useMemo } from 'react';
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
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { FixedHeader } from '../components/FixedHeader';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { Watch } from '../types/Watch';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type Mode = 'trade' | 'sell' | 'request';

interface FormData {
  reference: string;
  phoneNumber: string;
  email: string;
  message: string;
  photo: string | null;
}

const MODES: Mode[] = ['trade', 'sell', 'request'];

export default function TradeScreen() {
  const router = useRouter();
  const { watch } = useLocalSearchParams() as { watch?: string };
  const watchData: Watch | undefined = watch ? JSON.parse(watch) : undefined;

  const [isFocused, setIsFocused] = useState(false);
  useFocusEffect(
    useCallback(() => {
      setIsFocused(true);
      return () => setIsFocused(false);
    }, [])
  );

  const [formData, setFormData] = useState<FormData>({
    reference: '',
    phoneNumber: '',
    email: '',
    message: '',
    photo: null,
  });
  const [activeMode, setActiveMode] = useState<Mode>('trade');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Helper to update form fields
  const updateField = useCallback(
    (field: keyof FormData, value: string | null) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleBackPress = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  }, [currentStep, router]);

  const takePhoto = useCallback(async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Camera access is required to take photos');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
      aspect: [4, 3],
    });
    if (!result.canceled && result.assets?.[0]?.uri) {
      updateField('photo', result.assets[0].uri);
    }
  }, [updateField]);

  const pickImage = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
      aspect: [4, 3],
    });
    if (!result.canceled && result.assets?.[0]?.uri) {
      updateField('photo', result.assets[0].uri);
    }
  }, [updateField]);

  const resetForm = useCallback(() => {
    setFormData({
      reference: '',
      phoneNumber: '',
      email: '',
      message: '',
      photo: null,
    });
    setCurrentStep(1);
  }, []);

  const handleSubmit = useCallback(async () => {
    // Validate form based on current step
    if (currentStep === 1) {
      if (!formData.reference && !formData.photo) {
        Alert.alert('Missing Information', 'Please provide a reference number or add a photo');
        return;
      }
      // Move to next step
      setCurrentStep(2);
      return;
    }

    // Validation for final step
    if (!formData.phoneNumber) {
      Alert.alert('Missing Information', 'Please provide your phone number');
      return;
    }

    if (!formData.email) {
      Alert.alert('Missing Information', 'Please provide your email address');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    // Select Firestore collection based on active mode
    const collectionName =
      activeMode === 'trade'
        ? 'TradeRequests'
        : activeMode === 'sell'
        ? 'SellRequests'
        : 'Requests';

    const payload: any = {
      reference: formData.reference,
      phoneNumber: formData.phoneNumber,
      email: formData.email,
      message: formData.message,
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
      Alert.alert(
        'Request Submitted',
        `Thank you! Your ${activeMode} request has been sent. We'll be in touch soon.`,
        [
          { 
            text: 'Back to Watches', 
            onPress: () => {
              resetForm();
              router.replace('/');
            } 
          }
        ]
      );
    } catch (error) {
      console.error('Submission error:', error);
      Alert.alert('Error', 'Could not submit your request. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  }, [activeMode, formData, resetForm, watchData, currentStep, router]);

  // Compute whether we can proceed based on form completeness
  const canProceed = useMemo(() => {
    if (currentStep === 1) {
      return !!formData.reference || !!formData.photo;
    } else {
      return !!formData.phoneNumber && !!formData.email;
    }
  }, [formData, currentStep]);

  // Action button text based on current step
  const actionButtonText = useMemo(() => {
    if (currentStep === 1) {
      return 'Continue';
    } else {
      return `Submit ${activeMode.charAt(0).toUpperCase() + activeMode.slice(1)} Request`;
    }
  }, [currentStep, activeMode]);

  // Header text based on active mode
  const headerText = useMemo(() => {
    switch (activeMode) {
      case 'trade':
        return 'Trade In Your Watch';
      case 'sell':
        return 'Sell Your Watch';
      case 'request':
        return 'Request Information';
    }
  }, [activeMode]);

  return (
    <View style={styles.mainContainer}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      <FixedHeader 
        title={headerText}
        showBackButton={true}
        onBack={handleBackPress}
      />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Step Indicator */}
          <View style={styles.stepIndicator}>
            <View style={styles.stepLine}>
              <View style={[styles.stepLineProgress, { width: currentStep === 1 ? '50%' : '100%' }]} />
            </View>
            <View style={styles.stepsRow}>
              <View style={[styles.stepCircle, { backgroundColor: '#002d4e' }]}>
                <Text style={styles.stepNumber}>1</Text>
              </View>
              <View style={[styles.stepCircle, currentStep >= 2 ? styles.activeStep : styles.inactiveStep]}>
                <Text style={[styles.stepNumber, currentStep >= 2 ? styles.activeStepText : styles.inactiveStepText]}>2</Text>
              </View>
            </View>
          </View>

          {/* Mode Toggle */}
          <View style={styles.toggleContainer}>
            {MODES.map((mode) => (
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

          {/* Watch Information Card */}
          {watchData && isFocused && (
            <BlurView intensity={15} tint="light" style={styles.watchCard}>
              <View style={styles.watchIconContainer}>
                <Ionicons name="watch-outline" size={24} color="#002d4e" />
              </View>
              <View style={styles.watchInfoContent}>
                <Text style={styles.watchBrand}>{watchData.brand}</Text>
                <Text style={styles.watchModel}>{watchData.model}</Text>
                <Text style={styles.watchPrice}>${watchData.price?.toLocaleString()}</Text>
              </View>
            </BlurView>
          )}

          {/* Step 1: Watch Information */}
          {currentStep === 1 && (
            <>
              <Text style={styles.sectionTitle}>Watch Details</Text>
              
              {/* Reference Number Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Reference Number</Text>
                <TextInput
                  style={styles.input}
                  value={formData.reference}
                  onChangeText={(text) => updateField('reference', text)}
                  placeholder="Enter watch reference (e.g., 116610LN)"
                  placeholderTextColor="#8E8E8E"
                />
              </View>

              {/* Photo Section */}
              <View style={styles.photoSection}>
                <Text style={styles.label}>Watch Photo</Text>
                {formData.photo ? (
                  <View style={styles.photoPreviewContainer}>
                    <Image source={{ uri: formData.photo }} style={styles.photoPreview} />
                    <TouchableOpacity
                      style={styles.removePhotoButton}
                      onPress={() => updateField('photo', null)}
                    >
                      <Ionicons name="close-circle" size={28} color="#FFFFFF" />
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
                      <Text style={styles.photoButtonText}>Upload Photo</Text>
                    </TouchableOpacity>
                  </View>
                )}
                <Text style={styles.helperText}>
                  {formData.photo 
                    ? "Tap the photo to change it" 
                    : "A clear photo helps us with your valuation"}
                </Text>
              </View>
            </>
          )}

          {/* Step 2: Contact Information */}
          {currentStep === 2 && (
            <>
              <Text style={styles.sectionTitle}>Contact Information</Text>
              
              {/* Phone Number Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Phone Number</Text>
                <TextInput
                  style={styles.input}
                  value={formData.phoneNumber}
                  onChangeText={(text) => updateField('phoneNumber', text)}
                  placeholder="Enter your phone number"
                  placeholderTextColor="#8E8E8E"
                  keyboardType="phone-pad"
                />
              </View>

              {/* Email Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email Address</Text>
                <TextInput
                  style={styles.input}
                  value={formData.email}
                  onChangeText={(text) => updateField('email', text)}
                  placeholder="Enter your email address"
                  placeholderTextColor="#8E8E8E"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              {/* Optional Message */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Message (Optional)</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={formData.message}
                  onChangeText={(text) => updateField('message', text)}
                  placeholder="Add any additional information or questions"
                  placeholderTextColor="#8E8E8E"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            </>
          )}

          <TouchableOpacity
            style={[
              styles.actionButton, 
              !canProceed && styles.actionButtonDisabled
            ]}
            onPress={handleSubmit}
            disabled={!canProceed || isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Text style={styles.actionButtonText}>{actionButtonText}</Text>
                <Ionicons 
                  name={currentStep === 1 ? "arrow-forward" : "paper-plane-outline"} 
                  size={20} 
                  color="#FFFFFF" 
                  style={styles.actionButtonIcon}
                />
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 10,
  },
  stepIndicator: {
    width: '100%', 
    marginBottom: 24,
  },
  stepLine: {
    position: 'absolute',
    top: 12,
    left: 32,
    right: 32,
    height: 3,
    backgroundColor: '#E0E0E0',
    zIndex: 1,
  },
  stepLineProgress: {
    height: '100%',
    backgroundColor: '#002d4e',
    width: '50%',
  },
  stepsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    zIndex: 2,
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeStep: {
    backgroundColor: '#002d4e',
  },
  inactiveStep: {
    backgroundColor: '#E0E0E0',
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  activeStepText: {
    color: '#FFFFFF',
  },
  inactiveStepText: {
    color: '#7D7D7D',
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#E6EEF7',
    borderRadius: 12,
    marginBottom: 24,
    width: '100%',
    overflow: 'hidden',
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleButtonActive: {
    backgroundColor: '#002d4e',
  },
  toggleButtonText: {
    fontSize: 14,
    color: '#002d4e',
    fontWeight: '600',
  },
  toggleButtonTextActive: {
    color: '#fff',
  },
  watchCard: {
    width: '100%',
    borderRadius: 16,
    marginBottom: 24,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 45, 78, 0.1)',
  },
  watchIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 45, 78, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  watchInfoContent: {
    flex: 1,
  },
  watchBrand: {
    fontSize: 16,
    fontWeight: '700',
    color: '#002d4e',
    marginBottom: 2,
  },
  watchModel: {
    fontSize: 14,
    color: '#4A4A4A',
    marginBottom: 4,
  },
  watchPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#002d4e',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#002d4e',
    marginBottom: 16,
  },
  inputGroup: {
    width: '100%',
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
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 12,
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
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
  },
  photoButtonText: {
    color: '#002d4e',
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  photoPreviewContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 8,
  },
  photoPreview: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  removePhotoButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 16,
    padding: 4,
  },
  helperText: {
    fontSize: 12,
    color: '#7D7D7D',
    marginTop: 8,
    textAlign: 'center',
  },
  actionButton: {
    backgroundColor: '#002d4e',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 16,
    flexDirection: 'row',
  },
  actionButtonDisabled: {
    backgroundColor: '#B0BEC5',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  actionButtonIcon: {
    marginLeft: 8,
  },
});