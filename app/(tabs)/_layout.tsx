import React, { useEffect, useRef } from 'react';
import { Animated, View, Text, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SortProvider } from '../context/SortContext';

type TabBarIconProps = {
  name: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
  focused: boolean;
};

function TabBarIcon({ name, color, focused }: TabBarIconProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: focused ? 1.2 : 1,
      friction: 4,
      tension: 100,
      useNativeDriver: true,
    }).start();
  }, [focused]);

  return (
    <Animated.View style={[styles.iconWrapper, { transform: [{ scale: scaleAnim }] }]}>
      <Ionicons name={name} size={28} color={color} />
    </Animated.View>
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
              <TabBarIcon
                name={focused ? 'stopwatch' : 'stopwatch-outline'}
                color={color}
                focused={focused}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="brands"
          options={{
            title: 'BRANDS',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? 'pricetag' : 'pricetag-outline'}
                color={color}
                focused={focused}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="trade"
          options={{
            tabBarLabel: ({ focused }) => (
              <Text style={[styles.stackedLabel, { color: focused ? '#002d4e' : '#7a7a7a' }]}>
                SELL{'\n'}TRADE
              </Text>
            ),
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? 'cash' : 'cash-outline'}
                color={color}
                focused={focused}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="newArrivals"
          options={{
            title: 'NEW',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? 'cube' : 'cube-outline'}
                color={color}
                focused={focused}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="more"
          options={{
            title: 'MORE',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                name={focused ? 'menu' : 'menu-outline'}
                color={color}
                focused={focused}
              />
            ),
          }}
        />
      </Tabs>
    </SortProvider>
  );
}

const styles = StyleSheet.create({
  iconWrapper: {
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