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

export default function TradeScreen() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
        photo: null as string | null,
    });

    const takePhoto = async () => {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

        if (permissionResult.granted === false) {
            Alert.alert('Permission Required', 'Camera access is required to take photos');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setFormData(prev => ({ ...prev, photo: result.assets[0].uri }));
        }
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setFormData(prev => ({ ...prev, photo: result.assets[0].uri }));
        }
    };

    const handleSubmit = () => {
        if (!formData.name || !formData.email || !formData.phone) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        if (!formData.photo) {
            Alert.alert('Error', 'Please add at least one photo');
            return;
        }

        console.log('Form submitted:', formData);
        Alert.alert(
            'Success',
            'Your trade request has been submitted. We will contact you soon!',
            [{ text: 'OK', onPress: () => resetForm() }]
        );
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
            <ScrollView style={styles.formContainer}>
                <Text style={styles.title}>Trade Request</Text>

                <View style={styles.photoSection}>
                    {formData.photo ? (
                        <View style={styles.photoPreviewContainer}>
                            <Image source={{ uri: formData.photo }} style={styles.photoPreview} />
                            <TouchableOpacity
                                style={styles.removePhotoButton}
                                onPress={() => setFormData(prev => ({ ...prev, photo: null }))}
                            >
                                <Ionicons name="close-circle" size={24} color="#002d4e" />
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.photoButtons}>
                            <TouchableOpacity style={styles.photoButton} onPress={takePhoto}>
                                <Ionicons name="camera-outline" size={24} color="#002d4e" />
                                <Text style={styles.photoButtonText}>Take Photo</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
                                <Ionicons name="image-outline" size={24} color="#002d4e" />
                                <Text style={styles.photoButtonText}>Add Photo</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Name *</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.name}
                        onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                        placeholder="Your full name"
                        placeholderTextColor="#999"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Email *</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.email}
                        onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
                        placeholder="Your email address"
                        placeholderTextColor="#999"
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Phone *</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.phone}
                        onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
                        placeholder="Your phone number"
                        placeholderTextColor="#999"
                        keyboardType="phone-pad"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Message</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        value={formData.message}
                        onChangeText={(text) => setFormData(prev => ({ ...prev, message: text }))}
                        placeholder="Details about your trade request"
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
        marginBottom: 20,
    },
    photoSection: {
        marginBottom: 24,
    },
    photoButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    photoButton: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e0e0e0',
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
        alignItems: 'center',
    },
    photoPreview: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 16,
    },
    removePhotoButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: '#ffffff',
        borderRadius: 12,
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