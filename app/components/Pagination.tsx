import React from 'react';
import { View, StyleSheet } from 'react-native';

interface PaginationProps {
  currentIndex: number;
  totalItems: number;
}

export function Pagination({ currentIndex, totalItems }: PaginationProps) {
  return (
    <View style={styles.pagination}>
      {Array.from({ length: totalItems }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.paginationDot,
            index === currentIndex && styles.paginationDotActive,
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  pagination: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    marginRight: 4,
    borderWidth: 0,
  },
  paginationDotActive: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderWidth: 0,
  },
});