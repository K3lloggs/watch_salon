import React, { useState, useCallback } from 'react';
import {
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Text,
} from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { FixedHeader } from '../components/FixedHeader';

export default function MoreScreen() {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Insert your refresh logic here.
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#002d4e"
        />
      }
    >
      <FixedHeader />

      {/* Section 1: Primary Categories */}
      <Section>
        <Link href="/complications" asChild>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>Complications</Text>
            <Ionicons name="chevron-forward" size={20} color="#002d4e" />
          </TouchableOpacity>
        </Link>

        <Link href="/ladies" asChild>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>Ladies Watches</Text>
            <Ionicons name="chevron-forward" size={20} color="#002d4e" />
          </TouchableOpacity>
        </Link>

        <Link href="/fine-art" asChild>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>Fine Art</Text>
            <Ionicons name="chevron-forward" size={20} color="#002d4e" />
          </TouchableOpacity>
        </Link>
      </Section>

      {/* Section 2: Information */}
      <Section>
        <Text style={styles.sectionTitle}>Information</Text>
        <Link href="/about" asChild>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>About Us</Text>
            <Ionicons name="chevron-forward" size={20} color="#002d4e" />
          </TouchableOpacity>
        </Link>
        <Link href="/contact" asChild>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>Contact Us</Text>
            <Ionicons name="chevron-forward" size={20} color="#002d4e" />
          </TouchableOpacity>
        </Link>
      </Section>

      {/* Section 3: Follow Us */}
      <Section>
        <Text style={styles.sectionTitle}>Follow Us</Text>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => Linking.openURL('https://instagram.com/watchsalon')}
        >
          <Text style={styles.menuText}>Instagram</Text>
          <Ionicons name="chevron-forward" size={20} color="#002d4e" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => Linking.openURL('https://facebook.com/watchsalon')}
        >
          <Text style={styles.menuText}>Facebook</Text>
          <Ionicons name="chevron-forward" size={20} color="#002d4e" />
        </TouchableOpacity>
      </Section>

      {/* Section 4: App */}
      <Section>
        <Text style={styles.sectionTitle}>App</Text>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() =>
            Linking.openURL('https://apps.apple.com/app/your-app-id')
          }
        >
          <Text style={styles.menuText}>Rate the App</Text>
          <Ionicons name="chevron-forward" size={20} color="#002d4e" />
        </TouchableOpacity>
      </Section>
    </ScrollView>
  );
}

const Section: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>{children}</>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#002d4e',
    marginBottom: 12,
    paddingLeft: 8,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuText: {
    fontSize: 16,
    color: '#1a1a1a',
  },
});
