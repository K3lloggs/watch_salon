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

const SpecRow: React.FC<{ label: string; value: string | undefined }> = ({ label, value }) => {
  if (!value) return null;
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

  return (
    <SafeAreaView style={styles.container}>
      <FixedHeader showBackButton={true} watch={watch} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <SecondaryCard watch={watch} />
        <BlurView intensity={40} tint="light" style={styles.detailsPanel}>
          <View style={styles.headerSection}>
            <Text style={styles.brand}>{watch.brand}</Text>
            <Text style={styles.model}>{watch.model}</Text>
            <View style={styles.stockPriceContainer}>
              <StockBadge />
              <LikeList watchId={watch.id} initialLikes={watch.likes || 0} />
              <Text style={styles.price}>${watch.price.toLocaleString()}</Text>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <TradeButton watch={watch} />
            <MessageButton title="MESSAGE US" />
          </View>
          <View style={styles.specsContainer}>
            <SpecRow label="Case Material" value={watch.caseMaterial} />
            <SpecRow label="Diameter" value={watch.caseDiameter} />
            <SpecRow label="Movement" value={watch.movement} />
            <SpecRow label="Dial" value={watch.dial} />
          </View>
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionTitle}>Description</Text>
            <Text style={styles.descriptionText}>{watch.description}</Text>
          </View>
        </BlurView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContent: { paddingBottom: 80 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  detailsPanel: { marginTop: -20, padding: 28, borderRadius: 16, width: SCREEN_WIDTH, alignSelf: "center", marginBottom: 16 },
  headerSection: { marginBottom: 24, paddingTop: 8 },
  brand: { fontSize: 30, fontWeight: "700", color: "#002d4e", marginBottom: 4 },
  model: { fontSize: 22, fontWeight: "400", color: "#002d4e", marginBottom: 8 },
  stockPriceContainer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  price: { fontSize: 22, fontWeight: "600", color: "#002d4e" },
  buttonContainer: { marginBottom: 40, flexDirection: "row", justifyContent: "space-around" },
  specsContainer: { marginTop: 16 },
  specRow: { flexDirection: "row", alignItems: "flex-start", paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#f0f0f0" },
  specLabel: { fontSize: 15, color: "#666", width: 120 },
  specValue: { fontSize: 15, color: "#002d4e", fontWeight: "500", flex: 1 },
  descriptionContainer: { marginTop: 32, paddingHorizontal: 16 },
  descriptionTitle: { fontSize: 20, fontWeight: "600", color: "#002d4e", marginBottom: 12 },
  descriptionText: { fontSize: 15, color: "#444", lineHeight: 26, textAlign: "justify" },
});
