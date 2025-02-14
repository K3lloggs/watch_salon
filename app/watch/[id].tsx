// app/watch/[id].tsx

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
import { StockBadge } from "../components/StockBadge";
import { LikeList } from "../components/LikeList";
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
      <FixedHeader showBackButton={true} watch={watch} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <SecondaryCard watch={watch} />

        <BlurView intensity={40} tint="light" style={styles.detailsPanel}>
          {/* Header: Left-to-right layout */}
          <View style={styles.headerSection}>
            {/* Brand and Model */}
            <Text style={styles.brand}>{watch.brand}</Text>
            <Text style={styles.model} numberOfLines={2}>
              {watch.model}
            </Text>

            {/* Reference and SKU */}
            <View style={styles.infoContainer}>
              <View style={styles.leftInfo}>
                {watch.referenceNumber && (
                  <Text style={styles.referenceNumber}>
                    Ref. {watch.referenceNumber}
                  </Text>
                )}
                {watch.sku && (
                  <Text style={styles.sku}>SKU: {watch.sku}</Text>
                )}
              </View>
            </View>

            {/* Stock Badge and Price Row */}
            <View style={styles.stockPriceContainer}>
              <View style={styles.stockBadgeWrapper}>
                <StockBadge />
              </View>
              <View style={styles.priceContainer}>
                <LikeList 
                  watchId={watch.id}
                  initialLikes={watch.likes || 0}
                />
                <Text style={styles.price}>${watch.price.toLocaleString()}</Text>
              </View>
            </View>
          </View>

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
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Box</Text>
              <Text style={styles.specValue}>{watch.box ? "Yes" : "No"}</Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Papers</Text>
              <Text style={styles.specValue}>{watch.papers ? "Yes" : "No"}</Text>
            </View>
          </View>

          {/* Description */}
          {watch.description && (
            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionTitle}>Description</Text>
              <Text style={styles.descriptionText}>{watch.description}</Text>
            </View>
          )}
        </BlurView>

        {/* Heritage Footer */}
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>
            Shreve, Crump & Low • Horological Excellence Since 1796
          </Text>
        </View>
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
    marginBottom: 24,
    paddingTop: 8,
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
    letterSpacing: -0.3,
    marginBottom: 8,
  },
  infoContainer: {
    marginBottom: 12,
  },
  leftInfo: {
    flex: 1,
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
  },
  stockPriceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 0,
  },
  stockBadgeWrapper: {
    width: SCREEN_WIDTH * 0.3,
    overflow: "hidden",
  },
  priceContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
  price: {
    fontSize: 22,
    fontWeight: "600",
    color: "#002d4e",
    letterSpacing: -0.3,
    marginTop: 0,
  },
  buttonContainer: {
    marginBottom: 40,
    gap: 1,
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
  footerContainer: {
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  footerText: {
    fontSize: 15,
    color: "#002d4e",
    textAlign: "center",
    letterSpacing: 1,
    fontWeight: "300",
    textTransform: "uppercase",
  },
});