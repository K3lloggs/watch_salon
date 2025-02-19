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

/**
 * Renders a single specification row if a valid value exists.
 */
interface SpecRowProps {
  label: string;
  value: string | null | undefined;
}

const SpecRow: React.FC<SpecRowProps> = ({ label, value }) => {
  if (value === null || value === undefined || value === "") return null;
  return (
    <View style={styles.specRow}>
      <Text style={styles.specLabel}>{label}</Text>
      <Text style={styles.specValue}>{value}</Text>
    </View>
  );
};

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

  // Build an array of spec entries to avoid repetitive code.
  const specEntries = [
    { label: "Case Material", value: watch.caseMaterial },
    { label: "Diameter", value: watch.caseDiameter },
    { label: "Movement", value: watch.movement },
    {
      label: "Complications",
      value:
        watch.complications && watch.complications.length > 0
          ? watch.complications.join(", ")
          : null,
    },
    { label: "Dial", value: watch.dial },
    { label: "Power Reserve", value: watch.powerReserve },
    { label: "Strap", value: watch.strap },
    { label: "Year", value: watch.year },
    { label: "Box", value: watch.box !== undefined ? (watch.box ? "Yes" : "No") : null },
    { label: "Papers", value: watch.papers !== undefined ? (watch.papers ? "Yes" : "No") : null },
    { label: "Warranty", value: watch.warranty },
    {
      label: "Exhibition Caseback",
      value:
        watch.exhibitionCaseback !== undefined
          ? watch.exhibitionCaseback
            ? "Yes"
            : "No"
          : null,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <FixedHeader showBackButton={true} watch={watch} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <SecondaryCard watch={watch} />

        <BlurView intensity={40} tint="light" style={styles.detailsPanel}>
          {/* Header Section */}
          <View style={styles.headerSection}>
            <Text style={styles.brand}>{watch.brand}</Text>
            <Text style={styles.model}>{watch.model}</Text>

            <View style={styles.infoContainer}>
              <View style={styles.leftInfo}>
                {watch.referenceNumber && (
                  <Text style={styles.referenceNumber}>
                    Ref. {watch.referenceNumber}
                  </Text>
                )}
                {watch.sku && <Text style={styles.sku}>SKU: {watch.sku}</Text>}
              </View>
            </View>

            <View style={styles.stockPriceContainer}>
              <View style={styles.stockBadgeWrapper}>
                <StockBadge />
              </View>
              <View style={styles.priceContainer}>
                <LikeList watchId={watch.id} initialLikes={watch.likes || 0} />
                <Text style={styles.price}>
                  ${watch.price.toLocaleString()}
                </Text>
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
            {specEntries.map((spec, index) => (
              <SpecRow key={index} label={spec.label} value={spec.value} />
            ))}
          </View>
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
    flexWrap: "wrap",
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
    alignItems: "flex-start",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  specLabel: {
    fontSize: 15,
    color: "#666",
    letterSpacing: -0.2,
    width: 120, // Fixed width approximating 12 characters
  },
  specValue: {
    fontSize: 15,
    color: "#002d4e",
    fontWeight: "500",
    letterSpacing: -0.2,
    flex: 1,
    marginLeft: 12, // 12 units of space from the label
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
    lineHeight: 26,
    letterSpacing: 0,
    textAlign: "justify",
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
