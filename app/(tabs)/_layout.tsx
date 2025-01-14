import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SortProvider } from '../context/SortContext';

function TabBarIcon({
  name,
  color,
}: {
  name: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
}) {
  return (
    <View style={styles.iconContainer}>
      <Ionicons name={name} size={28} color={color} />
    </View>
  );
}

export default function TabLayout() {
  return (
    <SortProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#ffffff',
            borderTopWidth: 1,
            borderTopColor: '#cccccc',
            height: 90,
            paddingBottom: 20,
            paddingTop: 10,
          },
          tabBarActiveTintColor: '#002d4e',
          tabBarInactiveTintColor: '#7a7a7a',
          tabBarLabelStyle: {
            textTransform: 'uppercase',
            fontSize: 10,
            fontWeight: '500',
            marginTop: 5,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'ALL',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'star' : 'star-outline'} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="brands"
          options={{
            title: 'BRANDS',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'pricetag' : 'pricetag-outline'} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="trade"
          options={{
            tabBarLabel: ({ focused }) => (
              <Text style={[
                styles.stackedLabel,
                { color: focused ? '#002d4e' : '#7a7a7a' }
              ]}>
                TRADE{'\n'}REQUEST
              </Text>
            ),
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'cash' : 'cash-outline'} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="four"
          options={{
            title: 'NEW',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'cube' : 'cube-outline'} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="menu"
          options={{
            title: 'MENU',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'menu' : 'menu-outline'} color={color} />
            ),
          }}
        />
      </Tabs>
    </SortProvider>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  stackedLabel: {
    textAlign: 'center',
    textTransform: 'uppercase',
    fontSize: 10,
    fontWeight: '500',
    lineHeight: 14,
  },
});