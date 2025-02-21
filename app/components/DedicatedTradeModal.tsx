import React, { useState, useCallback } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Modal from 'react-native-modal';
import { Watch } from '../types/Watch';

interface FormData {
  reference: string;
  phoneNumber: string;
  photo: string | null;
  tradeDetails: string;
}

interface DedicatedTradeModalProps {
  visible: boolean;
  onClose: () => void;
  watch?: Watch;
}

const DedicatedTradeModal: React.FC<DedicatedTradeModalProps> = ({
  visible,
  onClose,
  watch,
}) => {
  const [formData, setFormData] = useState<FormData>({
    reference: '',
    phoneNumber: '',
    photo: null,
    tradeDetails: '',
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const updateField = useCallback(
    (field: keyof FormData, value: string | null) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const takePhoto = useCallback(async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Camera access is required to take photos');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });
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

  const handleSubmit = useCallback(() => {
    if (!formData.reference && !formData.photo) {
      Alert.alert(
        'Missing Information',
        'Please provide a reference number or add a photo of your watch.'
      );
      return;
    }
    if (!formData.phoneNumber) {
      Alert.alert('Missing Information', 'Please provide your contact number.');
      return;
    }
    if (!formData.tradeDetails) {
      Alert.alert(
        'Missing Information',
        'Please provide details about the watch you want to trade.'
      );
      return;
    }

    setIsSubmitting(true);

    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        'Trade Request Sent',
        'We will contact you shortly to discuss the trade details.',
        [{ text: 'OK', onPress: onClose }]
      );
    }, 2000);
  }, [formData, onClose]);

  const renderWatchDetails = useCallback(() => {
    if (!watch) return null;
    return (
      <View style={styles.watchInfoCard}>
        <Text style={styles.watchInfoTitle}>Trading For</Text>
        <Text style={styles.watchInfoDetails}>
          {watch.brand} {watch.model}
        </Text>
        <Text style={styles.watchInfoSpecs}>
          {watch.caseMaterial && `${watch.caseMaterial} • `}
          {watch.caseDiameter && `${watch.caseDiameter} • `}
          {watch.movement}
        </Text>
        {watch.price && (
          <Text style={styles.watchInfoPrice}>
            ${watch.price.toLocaleString()}
          </Text>
        )}
        {watch.referenceNumber && (
          <Text style={styles.watchInfoRef}>
            Ref: {watch.referenceNumber}
          </Text>
        )}
        {Array.isArray(watch.images) && watch.images.length ? (
          <View style={styles.watchImagesContainer}>
            {watch.images.map((url, idx) => (
              <Image key={idx} source={{ uri: url }} style={styles.watchImage} />
            ))}
          </View>
        ) : null}
      </View>
    );
  }, [watch]);

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      swipeDirection="down"
      onSwipeComplete={onClose}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      style={styles.modalStyle}
    >
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <SafeAreaView style={styles.fullScreenContainer}>
            {/* Drag Indicator */}
            <View style={styles.swipeIndicator} />

            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Trade Request</Text>
            </View>

            {/* Content */}
            <View style={styles.contentContainer}>
              {renderWatchDetails()}

              <View style={styles.formSection}>
                {/* Row for Reference & Phone Number */}
                <View style={styles.rowContainer}>
                  <View style={[styles.inputGroup, styles.halfWidth]}>
                    <Text style={styles.label}>Reference Number</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.reference}
                      onChangeText={(text) => updateField('reference', text)}
                      placeholder="Ref Number"
                      placeholderTextColor="#888"
                    />
                  </View>
                  <View style={[styles.inputGroup, styles.halfWidth, { marginLeft: 10 }]}>
                    <Text style={styles.label}>Phone Number</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.phoneNumber}
                      onChangeText={(text) => updateField('phoneNumber', text)}
                      placeholder="Phone Number"
                      placeholderTextColor="#888"
                      keyboardType="phone-pad"
                    />
                  </View>
                </View>
                {/* Trade Details */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Trade Details</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={formData.tradeDetails}
                    onChangeText={(text) => updateField('tradeDetails', text)}
                    placeholder="Describe the watch you'd like to trade (brand, model, condition)"
                    placeholderTextColor="#888"
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                </View>
                {/* Photo Section */}
                <View style={styles.photoSection}>
                  <Text style={styles.label}>Watch Photos</Text>
                  {formData.photo ? (
                    <View style={styles.photoPreviewContainer}>
                      <Image 
                        source={{ uri: formData.photo }} 
                        style={styles.photoPreview}
                      />
                      <TouchableOpacity
                        style={styles.removePhotoButton}
                        onPress={() => updateField('photo', null)}
                      >
                        <Ionicons name="close-circle" size={28} color="#C0392B" />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View style={styles.photoButtonsContainer}>
                      <TouchableOpacity 
                        style={styles.photoButton} 
                        onPress={takePhoto}
                      >
                        <Ionicons name="camera-outline" size={28} color="#002d4e" />
                        <Text style={styles.photoButtonText}>Take Photo</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.photoButton} 
                        onPress={pickImage}
                      >
                        <Ionicons name="image-outline" size={28} color="#002d4e" />
                        <Text style={styles.photoButtonText}>Upload Photo</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            </View>

            {/* Submit Button */}
            <View style={styles.submitContainer}>
              <TouchableOpacity
                style={[styles.submitButton, isSubmitting && styles.buttonDisabled]}
                onPress={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.submitButtonText}>
                    Submit Trade Request
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default DedicatedTradeModal;

const styles = StyleSheet.create({
  flex: { flex: 1 },
  modalStyle: {
    margin: 0,
  },
  fullScreenContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  swipeIndicator: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ccc',
    marginVertical: 10,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#002d4e',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  watchInfoCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#002d4e',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  watchInfoTitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 4,
  },
  watchInfoDetails: {
    fontSize: 20,
    fontWeight: '600',
    color: '#002d4e',
    marginBottom: 4,
  },
  watchInfoSpecs: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
  },
  watchInfoPrice: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0F766E',
    marginBottom: 4,
  },
  watchInfoRef: {
    fontSize: 14,
    color: '#64748B',
  },
  watchImagesContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  watchImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 8,
  },
  formSection: {
    flex: 1,
    justifyContent: 'space-around',
    marginTop: 10,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#002d4e',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  textArea: {
    height: 80,
    paddingTop: 8,
  },
  photoSection: {
    marginTop: 10,
  },
  photoButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  photoButton: {
    flex: 0.48,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    ...Platform.select({
      ios: {
        shadowColor: '#002d4e',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  photoButtonText: {
    color: '#002d4e',
    marginTop: 6,
    fontSize: 14,
    fontWeight: '600',
  },
  photoPreviewContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  photoPreview: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  removePhotoButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 16,
    padding: 4,
  },
  submitContainer: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: '#fff',
  },
  submitButton: {
    backgroundColor: '#002d4e',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#002d4e',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
});
