import React from 'react';
import { View, Animated, StyleSheet } from 'react-native';

interface PaginationProps {
  scrollX: Animated.Value;
  cardWidth: number;
  totalItems: number;
}

export function Pagination({ scrollX, cardWidth, totalItems }: PaginationProps) {
  return (
    <View style={styles.pagination}>
      {Array.from({ length: totalItems }).map((_, index) => {
        const inputRange = [
          (index - 1) * cardWidth,
          index * cardWidth,
          (index + 1) * cardWidth,
        ];
        const dotSize = scrollX.interpolate({
          inputRange,
          outputRange: [6, 10, 6],
          extrapolate: 'clamp',
        });
        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.5, 1, 0.5],
          extrapolate: 'clamp',
        });
        return (
          <Animated.View
            key={index}
            style={[
              styles.paginationDot,
              { width: dotSize, height: dotSize, opacity },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  pagination: {
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationDot: {
    borderRadius: 50,
    marginHorizontal: 6,
    backgroundColor: '#002d4e',
  },
});
