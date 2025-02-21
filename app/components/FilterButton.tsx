import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSortContext } from '../context/SortContext';

export function FilterButton() {
  const [visible, setVisible] = useState(false);
  const { sortOption, setSortOption } = useSortContext();

  const toggleFilterOptions = () => {
    setVisible(!visible);
  };

  const handleSelect = (option: "lowToHigh" | "highToLow" | null) => {
    setSortOption(option);
    // The dropdown stays visible; remove the line below if you prefer it to auto-close.
    // setVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.iconButton, styles.filterButton]}
        onPress={toggleFilterOptions}
      >
        <Ionicons name="filter-outline" size={24} color="#000" />
      </TouchableOpacity>
      {visible && (
        <View style={styles.dropdown}>
          <TouchableOpacity
            onPress={() => handleSelect("lowToHigh")}
            style={styles.dropdownItem}
          >
            <Text style={styles.dropdownText}>Price: Low to High</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleSelect("highToLow")}
            style={styles.dropdownItem}
          >
            <Text style={styles.dropdownText}>Price: High to Low</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleSelect(null)}
            style={styles.dropdownItem}
          >
            <Text style={styles.dropdownText}>Clear Filter</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 55, // Adjust as needed for your safe area
    right: 16,
    zIndex: 10,
  },
  iconButton: {
    padding: 8,
  },
  filterButton: {
    backgroundColor: '#fff',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#002d4e',
  },
  dropdown: {
    marginTop: 8,
    width: 180, // Increased width for a bigger dropdown
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  dropdownText: {
    fontSize: 16,
    color: '#002d4e',
  },
});
