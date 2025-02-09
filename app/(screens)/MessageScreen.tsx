// app/(screens)/MessageScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Linking,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { FixedHeader } from '../components/FixedHeader'; // Adjust the import as needed

export default function MessageScreen() {
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSend = () => {
    if (!message.trim()) {
      Alert.alert('Error', 'Please enter a message before sending.');
      return;
    }
    // Prepare email parameters
    const email = 'closeykid603@outlook.com';
    const subject = 'Message from App';
    const body = encodeURIComponent(message);
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${body}`;

    Linking.openURL(mailtoUrl).catch(() => {
      Alert.alert('Error', 'Failed to open the mail client.');
    });

    // Optionally, navigate back after sending
    router.back();
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
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.title}>Send Us a Message</Text>
            <TextInput
              style={styles.textInput}
              multiline
              placeholder="Enter your message here..."
              placeholderTextColor="#888"
              value={message}
              onChangeText={setMessage}
              textAlignVertical="top"
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
              <Text style={styles.sendButtonText}>Send Message</Text>
            </TouchableOpacity>
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
  content: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#002d4e',
    marginBottom: 24,
  },
  textInput: {
    width: '100%',
    maxWidth: 400,
    height: 150,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
    marginBottom: 24,
  },
  sendButton: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#002d4e',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#002d4e',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 3,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
