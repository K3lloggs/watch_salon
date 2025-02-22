import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSortContext } from '../context/SortContext';

export function FilterButton() {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownAnim = useRef(new Animated.Value(0)).current;
  const { sortOption, setSortOption } = useSortContext();

  const toggleFilterOptions = () => {
    if (!dropdownVisible) {
      setDropdownVisible(true);
      Animated.timing(dropdownAnim, {
        toValue: 1,
        duration: 250,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(dropdownAnim, {
        toValue: 0,
        duration: 200,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }).start(() => setDropdownVisible(false));
    }
  };

  const handleSelect = (option: "lowToHigh" | "highToLow" | null) => {
    setSortOption(option);
    Animated.timing(dropdownAnim, {
      toValue: 0,
      duration: 200,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start(() => setDropdownVisible(false));
  };

  const animatedStyle = {
    opacity: dropdownAnim,
    transform: [
      {
        scale: dropdownAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0.95, 1],
        }),
      },
    ],
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.filterButton} onPress={toggleFilterOptions}>
        <Ionicons name="filter-outline" size={24} color="#002d4e" />
      </TouchableOpacity>
      {dropdownVisible && (
        <Animated.View style={[styles.dropdown, animatedStyle]}>
          <TouchableOpacity onPress={() => handleSelect("lowToHigh")} style={styles.dropdownItem}>
            <Text style={styles.dropdownText}>Price: Low to High</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleSelect("highToLow")} style={styles.dropdownItem}>
            <Text style={styles.dropdownText}>Price: High to Low</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleSelect(null)} style={styles.dropdownItem}>
            <Text style={styles.dropdownText}>Clear Filter</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 55,
    right: 16,
    zIndex: 10,
  },
  filterButton: {
    padding: 10,
   
    borderRadius: 50,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
  },
  dropdown: {
    position: 'absolute',
    top: 50,
    right: 0,
    width: 200,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  dropdownText: {
    fontSize: 16,
    color: '#002d4e',
    fontWeight: '500',
  },
});
