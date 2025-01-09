import React from 'react';
import { Feather } from '@expo/vector-icons';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof Feather>['name'];
  color: string;
}) {
  return <Feather size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: useClientOnlyValue(false, true),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Favorites',
          tabBarIcon: ({ color }) => <TabBarIcon name="star" color={color} />,
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <Feather
                    name="info"
                    size={25}
                    color={Colors[colorScheme ?? 'light'].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Brands',
          tabBarIcon: ({ color }) => <TabBarIcon name="tag" color={color} />,
        }}
      />
      <Tabs.Screen
        name="three"
        options={{
          title: 'Pricing',
          tabBarIcon: ({ color }) => <TabBarIcon name="dollar-sign" color={color} />,
        }}
      />
      <Tabs.Screen
        name="four"
        options={{
          title: 'Products',
          tabBarIcon: ({ color }) => <TabBarIcon name="box" color={color} />,
        }}
      />
      <Tabs.Screen
        name="five"
        options={{
          title: 'Menu',
          tabBarIcon: ({ color }) => <TabBarIcon name="menu" color={color} />,
        }}
      />
    </Tabs>
  );
}