import React from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  Dimensions,
} from "react-native";
import { SecondaryCard } from "../components/SecondaryCard";
import { TradeButton } from "../components/TradeButton";
import { MessageButton } from "../components/MessageButton";
import { FixedHeader } from "../components/FixedHeader";
import { StockBadge } from "../components/StockBadge"; // New component added here
import { useWatches } from "../hooks/useWatches";
import { useLocalSearchParams } from "expo-router";
import { BlurView } from "expo-blur";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function DetailScreen() {
  const { id } = useLocalSearchParams();
  const { watches, loading } = useWatches();
  const watch = watches.find((w) => w.id === id);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }
  if (!watch) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text>Watch not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FixedHeader />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <SecondaryCard watch={watch} />

        <BlurView intensity={40} tint="light" style={styles.detailsPanel}>
          {/* Header: Left-to-right layout */}
          <View style={styles.headerSection}>
            {/* Left side: Brand, model, reference number, SKU, and StockBadge */}
            <View style={styles.leftInfo}>
              <Text style={styles.brand}>{watch.brand}</Text>
              <Text style={styles.model}>{watch.model}</Text>
              {watch.referenceNumber && (
                <Text style={styles.referenceNumber}>
                  Ref. {watch.referenceNumber}
                </Text>
              )}
              {watch.sku && (
                <Text style={styles.sku}>SKU: {watch.sku}</Text>
              )}
              <StockBadge />
            </View>
            {/* Right side: Price */}
            <View style={styles.priceContainer}>
              <Text style={styles.price}>
                ${watch.price.toLocaleString()}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TradeButton watch={watch} />
            <MessageButton title="MESSAGE US" />
          </View>

          {/* Specifications */}
          <View style={styles.specsContainer}>
            {watch.caseMaterial && (
              <View style={styles.specRow}>
                <Text style={styles.specLabel}>Case Material</Text>
                <Text style={styles.specValue}>{watch.caseMaterial}</Text>
              </View>
            )}
            {watch.caseDiameter && (
              <View style={styles.specRow}>
                <Text style={styles.specLabel}>Diameter</Text>
                <Text style={styles.specValue}>{watch.caseDiameter}</Text>
              </View>
            )}
            {watch.movement && (
              <View style={styles.specRow}>
                <Text style={styles.specLabel}>Movement</Text>
                <Text style={styles.specValue}>{watch.movement}</Text>
              </View>
            )}
            {watch.dial && (
              <View style={styles.specRow}>
                <Text style={styles.specLabel}>Dial</Text>
                <Text style={styles.specValue}>{watch.dial}</Text>
              </View>
            )}
            {watch.strap && (
              <View style={styles.specRow}>
                <Text style={styles.specLabel}>Strap</Text>
                <Text style={styles.specValue}>{watch.strap}</Text>
              </View>
            )}
            {watch.year && (
              <View style={styles.specRow}>
                <Text style={styles.specLabel}>Year</Text>
                <Text style={styles.specValue}>{watch.year}</Text>
              </View>
            )}
          </View>

          {/* Description */}
          {watch.description && (
            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionTitle}>Description</Text>
              <Text style={styles.descriptionText}>{watch.description}</Text>
            </View>
          )}
        </BlurView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    paddingBottom: 80,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  detailsPanel: {
    marginTop: -20,
    padding: 28,
    borderRadius: 16,
    width: SCREEN_WIDTH,
    alignSelf: "center",
    marginBottom: 16,
  },
  headerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 32,
    paddingTop: 8,
  },
  leftInfo: {
    flex: 1,
    paddingRight: 16,
  },
  brand: {
    fontSize: 30,
    fontWeight: "700",
    color: "#002d4e",
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  model: {
    fontSize: 22,
    fontWeight: "400",
    color: "#002d4e",
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  referenceNumber: {
    fontSize: 13,
    color: "#666",
    fontWeight: "400",
    marginBottom: 4,
  },
  sku: {
    fontSize: 13,
    color: "#666",
    marginBottom: 4,
  },
  priceContainer: {
    justifyContent: "center",
    alignItems: "flex-end",
  },
  price: {
    fontSize: 26,
    fontWeight: "600",
    color: "#002d4e",
    letterSpacing: -0.5,
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginBottom: 32,
  },
  buttonContainer: {
    marginBottom: 40,
    gap: 12,
  },
  specsContainer: {
    marginTop: 16,
  },
  specRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  specLabel: {
    fontSize: 15,
    color: "#666",
    letterSpacing: -0.2,
  },
  specValue: {
    fontSize: 15,
    color: "#002d4e",
    fontWeight: "500",
    letterSpacing: -0.2,
  },
  descriptionContainer: {
    marginTop: 32,
  },
  descriptionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#002d4e",
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  descriptionText: {
    fontSize: 15,
    color: "#444",
    lineHeight: 24,
    letterSpacing: -0.2,
  },
});
