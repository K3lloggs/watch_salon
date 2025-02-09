// app/(screens)/MessageScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { FixedHeader } from '../components/FixedHeader';
// Firebase imports (using the modular SDK)
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebaseConfig'; // Ensure this file is set up with your Firebase config

export default function MessageScreen() {
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSend = async () => {
    if (!message.trim()) {
      Alert.alert('Error', 'Please enter a message before sending.');
      return;
    }

    try {
      // Save the message to the "Messages" collection in Firestore
      await addDoc(collection(db, 'Messages'), {
        message: message.trim(),
        createdAt: serverTimestamp(),
      });
      Alert.alert('Success', 'Your message has been sent.');
      setMessage('');
      router.back(); // Navigate back after successful submission
    } catch (error) {
      console.error('Error adding document: ', error);
      Alert.alert('Error', 'Failed to send your message.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <FixedHeader />
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.messageCard}>
              <Text style={styles.cardTitle}>Get In Touch</Text>
              <Text style={styles.cardSubtitle}>We’d love to hear from you.</Text>
              <TextInput
                style={styles.textInput}
                multiline
                placeholder="Enter your message here..."
                placeholderTextColor="#999"
                value={message}
                onChangeText={setMessage}
                textAlignVertical="top"
              />
              <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                <Text style={styles.sendButtonText}>Send Message</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F7F8',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  messageCard: {
    width: '100%',
    maxWidth: 500,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#002d4e',
    marginBottom: 8,
    textAlign: 'center',
  },
  cardSubtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  textInput: {
    width: '100%',
    height: 150,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fafafa',
    marginBottom: 24,
  },
  sendButton: {
    backgroundColor: '#002d4e',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
