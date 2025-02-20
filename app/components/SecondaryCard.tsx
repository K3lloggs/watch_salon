import React, { useState } from "react";
import { View, Image, ScrollView, StyleSheet, Dimensions } from "react-native";
import { Pagination } from "./Pagination";
import { NewArrivalBadge } from "./NewArrivalBadge"; // Import the badge

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface SecondaryCardProps {
  watch: {
    id: string;
    brand: string;
    model: string;
    price: number;
    image: string[];
    movement?: string;
    dial?: string;
    powerReserve?: string;
    strap?: string;
    year?: string;
    box?: boolean;
    papers?: boolean;
    caseMaterial?: string;
    caseDiameter?: string;
    newArrival?: boolean; // ensure newArrival is part of the type
    [key: string]: any;
  };
}

export const SecondaryCard: React.FC<SecondaryCardProps> = ({ watch }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = Array.isArray(watch.image) ? watch.image : [watch.image];

  const handleScroll = (event: any) => {
    const offset = event.nativeEvent.contentOffset.x;
    const index = Math.round(offset / SCREEN_WIDTH);
    setCurrentImageIndex(index);
  };

  return (
    <View style={styles.container}>
      {watch.newArrival && <NewArrivalBadge />}
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        decelerationRate="fast"
        snapToInterval={SCREEN_WIDTH}
      >
        {images.map((img, index) => (
          <View key={index} style={styles.imageContainer}>
            <Image source={{ uri: img }} style={styles.image} resizeMode="cover" />
          </View>
        ))}
      </ScrollView>

      {images.length > 1 && (
        <Pagination currentIndex={currentImageIndex} totalItems={images.length} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 0.9,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
  },
  imageContainer: {
    width: SCREEN_WIDTH,
    height: "100%",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});

export default SecondaryCard;
