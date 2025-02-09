import React, { useState } from 'react';
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
  KeyboardTypeOptions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { FixedHeader } from '../components/FixedHeader';

function CustomInput({
  value,
  onChangeText,
  placeholder,
  keyboardType,
  multiline,
  style,
}: {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  keyboardType?: KeyboardTypeOptions;
  multiline?: boolean;
  style?: any;
}) {
  return (
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
      />
    </View>
  );
}

export default function MessageScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSend = async () => {
    if (!name.trim() || !email.trim() || !phone.trim() || 
        !subject.trim() || !message.trim()) {
      Alert.alert('Error', 'Please fill out all fields.');
      return;
    }
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
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.container}>
          <FixedHeader />
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.title}>Send Message</Text>
            
            <BlurView intensity={50} tint="light" style={styles.formContainer}>
              <CustomInput
                placeholder="Full Name"
                value={name}
                onChangeText={setName}
              />

              <CustomInput
                placeholder="Email Address"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
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
                style={styles.sendButton}
                onPress={handleSend}
              >
                <Text style={styles.sendButtonText}>SEND MESSAGE</Text>
              </TouchableOpacity>

              <View style={styles.contactInfo}>
                <View style={styles.contactRow}>
                  <Ionicons name="call-outline" size={20} color="#002d4e" />
                  <Text style={styles.contactText}>617-267-9100</Text>
                </View>
                <View style={styles.contactRow}>
                  <Ionicons name="location-outline" size={20} color="#002d4e" />
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
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#002d4e',
    marginBottom: 24,
    marginTop: 8,
  },
  formContainer: {
    padding: 24,
    borderRadius: 16,
    overflow: 'hidden',
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
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1,
  },
  contactInfo: {
    marginTop: 24,
    gap: 12,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  contactText: {
    fontSize: 16,
    color: '#002d4e',
    fontWeight: '500',
  },
});