import React, { useState, useCallback } from 'react';
import {
  SafeAreaView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  ActivityIndicator,
  KeyboardTypeOptions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { FixedHeader } from '../components/FixedHeader'; // Using your FixedHeader

// Hide the default Expo Router header (which displays the path)
export const unstable_settings = {
  headerShown: false,
};

interface CustomInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  keyboardType?: KeyboardTypeOptions;
  multiline?: boolean;
  style?: any;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}

const CustomInput: React.FC<CustomInputProps> = ({
  value,
  onChangeText,
  placeholder,
  keyboardType,
  multiline = false,
  style,
  autoCapitalize = 'none',
}) => (
  <View style={styles.inputWrapper}>
    <TextInput
      style={[styles.input, style]}
      placeholder={placeholder}
      placeholderTextColor="#8E8E93"
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      multiline={multiline}
      textAlignVertical={multiline ? 'top' : 'center'}
      autoCapitalize={autoCapitalize}
      autoCorrect={false}
      returnKeyType="done"
      accessible
      accessibilityLabel={placeholder}
    />
  </View>
);

export default function MessageScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  // Basic email validation
  const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  const handleSend = useCallback(async () => {
    Keyboard.dismiss();
    if (!name.trim() || !email.trim() || !phone.trim() || !subject.trim() || !message.trim()) {
      Alert.alert('Error', 'Please fill out all fields.');
      return;
    }
    if (!isValidEmail(email.trim())) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }
    if (sending) return;

    setSending(true);
    try {
      await addDoc(collection(db, 'Messages'), {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        subject: subject.trim(),
        message: message.trim(),
        createdAt: serverTimestamp(),
      });
      Alert.alert('Success', 'Your message has been sent.');
      setName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
      router.back();
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send your message. Please try again.');
    } finally {
      setSending(false);
    }
  }, [name, email, phone, subject, message, sending, router]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.container}>
          {/* FixedHeader now serves as our header with an integrated back button */}
          <FixedHeader title="Send Message" showBackButton />
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <BlurView intensity={50} tint="light" style={styles.formContainer}>
              <CustomInput
                placeholder="Full Name"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
              <CustomInput
                placeholder="Email Address"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <CustomInput
                placeholder="Phone Number"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
              <CustomInput
                placeholder="Subject"
                value={subject}
                onChangeText={setSubject}
              />
              <CustomInput
                placeholder="Your Message"
                value={message}
                onChangeText={setMessage}
                multiline
                style={styles.messageInput}
              />
              <TouchableOpacity
                style={[styles.sendButton, sending && styles.disabledButton]}
                onPress={handleSend}
                disabled={sending}
                accessibilityRole="button"
                accessibilityLabel="Send Message"
              >
                {sending ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.sendButtonText}>SEND MESSAGE</Text>
                )}
              </TouchableOpacity>
              <View style={styles.contactInfo}>
                <View style={styles.contactRow}>
                  <Text style={styles.contactText}>617-267-9100</Text>
                </View>
                <View style={styles.contactRow}>
                  <Text style={styles.contactText}>39 Newbury Street, Boston</Text>
                </View>
              </View>
            </BlurView>
          </ScrollView>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 16,
    paddingTop: 20, // Ensure content appears below the FixedHeader
    paddingBottom: 20,
  },
  formContainer: {
    padding: 24,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.85)',
    marginBottom: 32,
  },
  inputWrapper: {
    marginBottom: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    overflow: 'hidden',
  },
  input: {
    padding: 16,
    fontSize: 16,
    color: '#002d4e',
    backgroundColor: '#F5F5F5',
  },
  messageInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  sendButton: {
    backgroundColor: '#002d4e',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 24,
  },
  disabledButton: {
    opacity: 0.7,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1,
  },
  contactInfo: {
    marginTop: 24,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactText: {
    fontSize: 16,
    color: '#002d4e',
    fontWeight: '500',
    marginLeft: 12,
  },
});
