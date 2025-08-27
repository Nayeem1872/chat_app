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

// Dummy conversation data for simplified demonstration
const dummyConversations = [
  {
    id: "conv1",
    name: "Alice Johnson",
    lastMessage: "Hey, how are you doing?",
    timestamp: "2 min ago",
    unreadCount: 2,
    type: "user",
  },
  {
    id: "conv2",
    name: "Project Team",
    lastMessage: "Meeting at 3 PM today",
    timestamp: "10 min ago",
    unreadCount: 0,
    type: "group",
  },
  {
    id: "conv3",
    name: "Bob Smith",
    lastMessage: "Thanks for the help!",
    timestamp: "1 hour ago",
    unreadCount: 1,
    type: "user",
  },
  {
    id: "conv4",
    name: "Design Team",
    lastMessage: "New mockups are ready",
    timestamp: "2 hours ago",
    unreadCount: 3,
    type: "group",
  },
];

const Conversations: React.FC = () => {
  const handleConversationPress = (
    conversation: (typeof dummyConversations)[0]
  ) => {
    Alert.alert("Open Chat", `Open chat with ${conversation.name}?`, [
      {
        text: "Open",
        onPress: () => {
          Alert.alert(
            "Feature Coming Soon",
            "Chat functionality will be available soon!"
          );
        },
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const renderConversationItem = ({
    item,
  }: {
    item: (typeof dummyConversations)[0];
  }) => (
    <TouchableOpacity
      style={styles.conversationItem}
      onPress={() => handleConversationPress(item)}
    >
      <View style={styles.conversationInfo}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {item.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.conversationDetails}>
          <View style={styles.conversationHeader}>
            <Text style={styles.conversationName}>{item.name}</Text>
            <Text style={styles.timestamp}>{item.timestamp}</Text>
          </View>
          <View style={styles.messageRow}>
            <Text style={styles.lastMessage} numberOfLines={1}>
              {item.lastMessage}
            </Text>
            {item.unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>{item.unreadCount}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chats</Text>
        <Text style={styles.headerSubtitle}>Recent conversations</Text>
      </View>
      <FlatList
        data={dummyConversations}
        keyExtractor={(item) => item.id}
        renderItem={renderConversationItem}
        style={styles.conversationsList}
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
  conversationsList: {
    flex: 1,
  },
  conversationItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    backgroundColor: colors.cardBackground,
    borderBottomColor: colors.border,
  },
  conversationInfo: {
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
  conversationDetails: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  conversationName: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
    color: colors.textPrimary,
  },
  timestamp: {
    fontSize: 12,
    marginLeft: 8,
    color: colors.textSecondary,
  },
  messageRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  lastMessage: {
    fontSize: 14,
    flex: 1,
    color: colors.textSecondary,
  },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
    paddingHorizontal: 6,
    backgroundColor: colors.primary,
  },
  unreadText: {
    fontSize: 12,
    fontWeight: "bold",
    color: colors.white,
  },
});

export default Conversations;
