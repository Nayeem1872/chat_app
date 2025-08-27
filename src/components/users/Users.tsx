import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";

// Simple color theme without CometChat dependencies
const colors = {
  background: "#f5f5f5",
  cardBackground: "#ffffff",
  primary: "#007AFF",
  textPrimary: "#000000",
  textSecondary: "#666666",
  border: "#e0e0e0",
  white: "#ffffff",
};

// Dummy user data for simplified demonstration
const dummyUsers = [
  {
    uid: "user1",
    name: "Alice Johnson",
    email: "alice@example.com",
    status: "online",
  },
  {
    uid: "user2",
    name: "Bob Smith",
    email: "bob@example.com",
    status: "offline",
  },
  {
    uid: "user3",
    name: "Charlie Brown",
    email: "charlie@example.com",
    status: "online",
  },
  {
    uid: "user4",
    name: "Diana Prince",
    email: "diana@example.com",
    status: "away",
  },
  {
    uid: "user5",
    name: "Edward Norton",
    email: "edward@example.com",
    status: "online",
  },
  {
    uid: "user6",
    name: "Fiona Green",
    email: "fiona@example.com",
    status: "offline",
  },
];

const Users: React.FC = () => {
  const handleUserPress = (user: (typeof dummyUsers)[0]) => {
    Alert.alert(
      "User Selected",
      `You selected ${user.name}\nStatus: ${user.status}`,
      [
        {
          text: "Start Chat",
          onPress: () => {
            Alert.alert(
              "Feature Coming Soon",
              "Chat functionality will be available soon!"
            );
          },
        },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "#4CAF50";
      case "away":
        return "#FF9800";
      case "offline":
      default:
        return "#9E9E9E";
    }
  };

  const renderUserItem = ({ item }: { item: (typeof dummyUsers)[0] }) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() => handleUserPress(item)}
    >
      <View style={styles.userInfo}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {item.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.userDetails}>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.userEmail}>{item.email}</Text>
        </View>
        <View
          style={[
            styles.statusIndicator,
            { backgroundColor: getStatusColor(item.status) },
          ]}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Users</Text>
        <Text style={styles.headerSubtitle}>
          Select a user to start chatting
        </Text>
      </View>
      <FlatList
        data={dummyUsers}
        keyExtractor={(item) => item.uid}
        renderItem={renderUserItem}
        style={styles.usersList}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  usersList: {
    flex: 1,
  },
  userItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    backgroundColor: colors.cardBackground,
    borderBottomColor: colors.border,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    backgroundColor: colors.primary,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.white,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
    color: colors.textPrimary,
  },
  userEmail: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: 8,
  },
});

export default Users;
