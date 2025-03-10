import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import { Tabs, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SortProvider } from '../context/SortContext';
import { useLoading } from '../context/LoadingContext';

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
  const pathname = usePathname();
  const { hideLoading } = useLoading();
  const previousPathRef = useRef(pathname);

  // Immediately disable loading state on mount, never re-render due to loading changes
  useEffect(() => {
    hideLoading();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Just track pathname changes without causing side effects
  useEffect(() => {
    previousPathRef.current = pathname;
  }, [pathname]);

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
            fontSize: 10,
            fontWeight: '500',
            marginTop: 2,
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
            title: 'TRADE',
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
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 2,
  },
});