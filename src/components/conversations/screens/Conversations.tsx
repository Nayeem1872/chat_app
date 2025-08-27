import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { ChatStackParamList } from "../../../navigation/paramLists";
import { CometChat } from "@cometchat/chat-sdk-react-native";

type NavigationProp = StackNavigationProp<ChatStackParamList, "Messages">;

// Enhanced color theme with primary color #667eea
const colors = {
  background: "#f8f9fc",
  cardBackground: "#ffffff",
  primary: "#667eea",
  primaryLight: "rgba(102, 126, 234, 0.1)",
  primaryMedium: "rgba(102, 126, 234, 0.15)",
  textPrimary: "#2d3748",
  textSecondary: "#718096",
  textLight: "#a0aec0",
  border: "#e2e8f0",
  white: "#ffffff",
  shadow: "rgba(102, 126, 234, 0.1)",
  success: "#48bb78",
  online: "#48bb78",
  away: "#ed8936",
  offline: "#a0aec0",
};

// Enhanced dummy conversation data with user objects for navigation
const dummyConversations = [
  {
    id: "conv1",
    name: "Alice Johnson",
    lastMessage: "Hey, how are you doing?",
    timestamp: "2 min ago",
    unreadCount: 2,
    type: "user",
    status: "online",
    user: {
      uid: "alice_johnson",
      name: "Alice Johnson",
      avatar: "",
      status: "online",
    },
  },
  {
    id: "conv2",
    name: "Project Team",
    lastMessage: "Meeting at 3 PM today",
    timestamp: "10 min ago",
    unreadCount: 0,
    type: "group",
    status: "active",
    group: {
      guid: "project_team",
      name: "Project Team",
      type: "public",
      membersCount: 5,
    },
  },
  {
    id: "conv3",
    name: "Bob Smith",
    lastMessage: "Thanks for the help!",
    timestamp: "1 hour ago",
    unreadCount: 1,
    type: "user",
    status: "away",
    user: {
      uid: "bob_smith",
      name: "Bob Smith",
      avatar: "",
      status: "away",
    },
  },
  {
    id: "conv4",
    name: "Design Team",
    lastMessage: "New mockups are ready",
    timestamp: "2 hours ago",
    unreadCount: 3,
    type: "group",
    status: "active",
    group: {
      guid: "design_team",
      name: "Design Team",
      type: "public",
      membersCount: 8,
    },
  },
  {
    id: "conv5",
    name: "Sarah Wilson",
    lastMessage: "See you tomorrow!",
    timestamp: "3 hours ago",
    unreadCount: 0,
    type: "user",
    status: "offline",
    user: {
      uid: "sarah_wilson",
      name: "Sarah Wilson",
      avatar: "",
      status: "offline",
    },
  },
];

const Conversations: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const createCometChatUser = (userData: any): CometChat.User => {
    const user = new CometChat.User(userData.uid);
    user.setName(userData.name);
    user.setAvatar(userData.avatar);
    user.setStatus(userData.status);
    return user;
  };

  const createCometChatGroup = (groupData: any): CometChat.Group => {
    const group = new CometChat.Group(
      groupData.guid,
      groupData.name,
      groupData.type,
      undefined
    );
    group.setMembersCount(groupData.membersCount);
    return group;
  };

  const handleConversationPress = (
    conversation: (typeof dummyConversations)[0]
  ) => {
    try {
      if (conversation.type === "user" && conversation.user) {
        const cometChatUser = createCometChatUser(conversation.user);
        navigation.navigate("Messages", {
          user: cometChatUser,
        });
      } else if (conversation.type === "group" && conversation.group) {
        const cometChatGroup = createCometChatGroup(conversation.group);
        navigation.navigate("Messages", {
          group: cometChatGroup,
        });
      }
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return colors.online;
      case "away":
        return colors.away;
      case "offline":
        return colors.offline;
      default:
        return colors.offline;
    }
  };

  const getStatusIndicator = (item: any) => {
    if (item.type === "user") {
      return (
        <View
          style={[
            styles.statusDot,
            { backgroundColor: getStatusColor(item.status) },
          ]}
        />
      );
    } else {
      return (
        <View style={styles.groupIndicator}>
          <Text style={styles.groupMemberCount}>
            {item.group?.membersCount || 0}
          </Text>
        </View>
      );
    }
  };

  const renderConversationItem = ({
    item,
  }: {
    item: (typeof dummyConversations)[0];
  }) => (
    <TouchableOpacity
      style={styles.conversationItem}
      onPress={() => handleConversationPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.conversationInfo}>
        <View style={styles.avatarContainer}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={styles.avatarText}>
              {item.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          {getStatusIndicator(item)}
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
        <Text style={styles.headerTitle}>Messages</Text>
        <Text style={styles.headerSubtitle}>Recent conversations</Text>

        {/* Enhanced Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputWrapper}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search conversations..."
              placeholderTextColor={colors.textLight}
            />
          </View>
        </View>
      </View>

      <FlatList
        data={dummyConversations}
        keyExtractor={(item) => item.id}
        renderItem={renderConversationItem}
        style={styles.conversationsList}
        contentContainerStyle={styles.conversationsContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
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
    padding: 20,
    paddingBottom: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 4,
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    fontWeight: "500",
    marginBottom: 16,
  },
  searchContainer: {
    marginTop: 8,
  },
  searchInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 12,
    opacity: 0.6,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: "500",
  },
  conversationsList: {
    flex: 1,
  },
  conversationsContent: {
    paddingVertical: 8,
  },
  conversationItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: colors.white,
  },
  conversationInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    position: "relative",
    marginRight: 16,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.white,
    letterSpacing: 0.5,
  },
  statusDot: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: colors.white,
  },
  groupIndicator: {
    position: "absolute",
    bottom: -2,
    right: -2,
    backgroundColor: colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: colors.white,
  },
  groupMemberCount: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.white,
  },
  conversationDetails: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  conversationName: {
    fontSize: 17,
    fontWeight: "600",
    flex: 1,
    color: colors.textPrimary,
    letterSpacing: -0.2,
  },
  timestamp: {
    fontSize: 13,
    marginLeft: 12,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  messageRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  lastMessage: {
    fontSize: 15,
    flex: 1,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  unreadBadge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
    paddingHorizontal: 8,
    backgroundColor: colors.primary,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  unreadText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.white,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 88,
  },
});

export default Conversations;
