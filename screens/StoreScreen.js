import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const teams = [
  { id: "1", name: "Barcelona" },
  { id: "2", name: "Real Madrid" },
  { id: "3", name: "Arsenal" },
  { id: "4", name: "AC Milan" },
  { id: "5", name: "Chelsea" },
  { id: "6", name: "Liverpool" },
  { id: "7", name: "Manchester City" },
  { id: "8", name: "Manchester United" },
];

export default function StoreScreen() {
  const navigation = useNavigation();
  const [search, setSearch] = useState("");

  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(search.toLowerCase())
  );

  const screenWidth = Dimensions.get("window").width;
  const cardWidth = (screenWidth - 48) / 2; // 2 columns with padding & margin

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, { width: cardWidth }]}
      onPress={() => navigation.navigate("TeamProducts", { teamName: item.name })}
    >
      <Image source={require("../assets/jersey.png")} style={styles.image} />
      <Text style={styles.teamName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search for a team..."
        placeholderTextColor="#999"
        value={search}
        onChangeText={setSearch}
        style={styles.searchInput}
      />
      <FlatList
        data={filteredTeams}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No teams found.</Text>
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  searchInput: {
    backgroundColor: "#f2f2f2",
    height: 42,
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  listContent: {
    paddingBottom: 30,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingVertical: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  image: {
    width: 50,
    height: 50,
    resizeMode: "contain",
    marginBottom: 10,
  },
  teamName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  emptyText: {
    textAlign: "center",
    color: "#999",
    fontSize: 14,
    marginTop: 30,
  },
});
