import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { FixedHeader } from '../components/FixedHeader';

export default function TradeScreen() {
  const [formData, setFormData] = useState({
    watchName: '',
    fullName: '',
    email: '',
    phone: '',
    comments: '',
  });

  const handleSubmit = () => {
    // Validate form
    if (!formData.watchName || !formData.fullName || !formData.email || !formData.phone) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    // Here you would typically send the data to your backend
    console.log('Form submitted:', formData);
    Alert.alert(
      'Success',
      'Your trade request has been submitted. We will contact you soon!',
      [{ text: 'OK', onPress: () => resetForm() }]
    );
  };

  const resetForm = () => {
    setFormData({
      watchName: '',
      fullName: '',
      email: '',
      phone: '',
      comments: '',
    });
  };

  return (
    <View style={styles.container}>
      <FixedHeader />
      <ScrollView style={styles.formContainer}>
        <Text style={styles.title}>Submit Trade Request</Text>
        <Text style={styles.description}>
          Please provide details about the watch you're interested in and your contact information.
        </Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Watch Name/Model *</Text>
          <TextInput
            style={styles.input}
            value={formData.watchName}
            onChangeText={(text) => setFormData({ ...formData, watchName: text })}
            placeholder="Enter watch name or model"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Your Full Name *</Text>
          <TextInput
            style={styles.input}
            value={formData.fullName}
            onChangeText={(text) => setFormData({ ...formData, fullName: text })}
            placeholder="Enter your full name"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email Address *</Text>
          <TextInput
            style={styles.input}
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            placeholder="Enter your email"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number *</Text>
          <TextInput
            style={styles.input}
            value={formData.phone}
            onChangeText={(text) => setFormData({ ...formData, phone: text })}
            placeholder="Enter your phone number"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Additional Comments</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.comments}
            onChangeText={(text) => setFormData({ ...formData, comments: text })}
            placeholder="Any additional details about your trade request"
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit Request</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  formContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#002d4e',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#002d4e',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#000',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  submitButton: {
    backgroundColor: '#002d4e',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});