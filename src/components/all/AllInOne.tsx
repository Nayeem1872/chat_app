import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  TextInput,
  SectionList,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  ArrowLeft,
  Send,
  Smile,
  Paperclip,
  Phone,
  Video,
  MoreVertical,
} from "lucide-react-native";

// Simple color theme
const colors = {
  background: "#f8f9fa",
  cardBackground: "#ffffff",
  primary: "#007AFF",
  secondary: "#34C759",
  textPrimary: "#000000",
  textSecondary: "#666666",
  border: "#e0e0e0",
  white: "#ffffff",
  searchBackground: "#f1f3f4",
};

// Combined dummy data
const allData = {
  users: [
    {
      id: "user1",
      type: "user",
      name: "Alice Johnson",
      email: "alice@example.com",
      status: "online",
    },
    {
      id: "user2",
      type: "user",
      name: "Bob Smith",
      email: "bob@example.com",
      status: "offline",
    },
    {
      id: "user3",
      type: "user",
      name: "Charlie Brown",
      email: "charlie@example.com",
      status: "online",
    },
  ],
  conversations: [
    {
      id: "conv1",
      type: "conversation",
      name: "Diana Prince",
      lastMessage: "Hey, how are you?",
      timestamp: "2 min ago",
      unreadCount: 2,
    },
    {
      id: "conv2",
      type: "conversation",
      name: "Project Team",
      lastMessage: "Meeting at 3 PM",
      timestamp: "10 min ago",
      unreadCount: 0,
    },
    {
      id: "conv3",
      type: "conversation",
      name: "Edward Norton",
      lastMessage: "Thanks for help!",
      timestamp: "1 hour ago",
      unreadCount: 1,
    },
  ],
  calls: [
    {
      id: "call1",
      type: "call",
      name: "Fiona Green",
      callType: "video",
      callStatus: "answered",
      duration: "5:32",
      timestamp: "2 hours ago",
    },
    {
      id: "call2",
      type: "call",
      name: "George Wilson",
      callType: "audio",
      callStatus: "missed",
      duration: "--",
      timestamp: "4 hours ago",
    },
    {
      id: "call3",
      type: "call",
      name: "Helen Davis",
      callType: "video",
      callStatus: "answered",
      duration: "12:45",
      timestamp: "Yesterday",
    },
  ],
};

const AllInOne: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [chatMessage, setChatMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([
    {
      id: 1,
      text: "Hey! How are you doing today?",
      sender: "other",
      timestamp: "10:30 AM",
      avatar: "A",
    },
    {
      id: 2,
      text: "I'm doing great! Just working on some new projects. How about you?",
      sender: "me",
      timestamp: "10:32 AM",
    },
    {
      id: 3,
      text: "That sounds awesome! I'd love to hear more about your projects sometime.",
      sender: "other",
      timestamp: "10:35 AM",
      avatar: "A",
    },
    {
      id: 4,
      text: "Absolutely! Let's catch up soon 😊",
      sender: "me",
      timestamp: "10:37 AM",
    },
  ]);

  const handleItemPress = (item: any) => {
    if (item.type === "user") {
      setSelectedUser(item);
      // You can load specific chat history for this user here
    } else if (item.type === "conversation") {
      // Handle conversation tap - could also open chat
      Alert.alert("Open Chat", `Open conversation with ${item.name}?`, [
        {
          text: "Open",
          onPress: () =>
            Alert.alert("Feature Coming Soon", "Chat will be available soon!"),
        },
        { text: "Cancel", style: "cancel" },
      ]);
    } else if (item.type === "call") {
      Alert.alert("Call Details", `Call ${item.name} back?`, [
        {
          text: "Call",
          onPress: () =>
            Alert.alert(
              "Feature Coming Soon",
              "Calling will be available soon!"
            ),
        },
        { text: "Cancel", style: "cancel" },
      ]);
    }
  };

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: chatMessage,
        sender: "me",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages([...messages, newMessage]);
      setChatMessage("");

      // Simulate a response after 2 seconds
      setTimeout(() => {
        const responseMessage = {
          id: messages.length + 2,
          text: "Thanks for your message! 😊",
          sender: "other",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          avatar: selectedUser?.name?.charAt(0).toUpperCase() || "U",
        };
        setMessages((prev) => [...prev, responseMessage]);
      }, 2000);
    }
  };

  const getFilteredData = () => {
    let combinedData: any[] = [];

    if (activeFilter === "all" || activeFilter === "users") {
      combinedData = [...combinedData, ...allData.users];
    }
    if (activeFilter === "all" || activeFilter === "conversations") {
      combinedData = [...combinedData, ...allData.conversations];
    }
    if (activeFilter === "all" || activeFilter === "calls") {
      combinedData = [...combinedData, ...allData.calls];
    }

    if (searchQuery.trim()) {
      return combinedData.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return combinedData;
  };

  const getSectionData = () => {
    const filteredData = getFilteredData();
    const sections = [];

    if (activeFilter === "all") {
      const users = filteredData.filter((item) => item.type === "user");
      const conversations = filteredData.filter(
        (item) => item.type === "conversation"
      );
      const calls = filteredData.filter((item) => item.type === "call");

      if (users.length > 0) sections.push({ title: "Users", data: users });
      if (conversations.length > 0)
        sections.push({ title: "Recent Chats", data: conversations });
      if (calls.length > 0)
        sections.push({ title: "Recent Calls", data: calls });
    } else {
      sections.push({
        title: getFilterTitle(activeFilter),
        data: filteredData,
      });
    }

    return sections;
  };

  const getFilterTitle = (filter: string) => {
    switch (filter) {
      case "users":
        return "Users";
      case "conversations":
        return "Conversations";
      case "calls":
        return "Calls";
      default:
        return "All";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "#34C759";
      case "away":
        return "#FF9500";
      case "offline":
        return "#8E8E93";
      default:
        return "#8E8E93";
    }
  };

  const getCallStatusColor = (status: string) => {
    switch (status) {
      case "answered":
        return "#34C759";
      case "missed":
        return "#FF3B30";
      case "rejected":
        return "#FF9500";
      default:
        return "#8E8E93";
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => handleItemPress(item)}
    >
      <View style={styles.itemInfo}>
        {/* Avatar */}
        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
          <Text style={styles.avatarText}>
            {item.name.charAt(0).toUpperCase()}
          </Text>
        </View>

        {/* Content */}
        <View style={styles.itemDetails}>
          <View style={styles.itemHeader}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.timestamp}>
              {item.timestamp || (item.type === "user" ? "Online" : "Active")}
            </Text>
          </View>

          {/* Type-specific content */}
          {item.type === "user" && (
            <View style={styles.userInfo}>
              <Text style={styles.itemSubtext}>{item.email}</Text>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: getStatusColor(item.status) },
                ]}
              />
            </View>
          )}

          {item.type === "conversation" && (
            <View style={styles.conversationInfo}>
              <Text style={styles.itemSubtext} numberOfLines={1}>
                {item.lastMessage}
              </Text>
              {item.unreadCount > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadText}>{item.unreadCount}</Text>
                </View>
              )}
            </View>
          )}

          {item.type === "call" && (
            <View style={styles.callInfo}>
              <Text style={styles.itemSubtext}>
                {item.callType === "video" ? "📹" : "📞"} {item.callStatus} •{" "}
                {item.duration}
              </Text>
              <View
                style={[
                  styles.callStatusDot,
                  { backgroundColor: getCallStatusColor(item.callStatus) },
                ]}
              />
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderSectionHeader = ({ section }: { section: any }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
    </View>
  );

  const FilterButton = ({
    filter,
    title,
  }: {
    filter: string;
    title: string;
  }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        activeFilter === filter && styles.activeFilterButton,
      ]}
      onPress={() => setActiveFilter(filter)}
    >
      <Text
        style={[
          styles.filterText,
          activeFilter === filter && styles.activeFilterText,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <Image
        source={require("../../assets/icons/bug.png")}
        style={styles.emptyStateRobot}
        resizeMode="contain"
      />
      <Text style={styles.emptyStateTitle}>
        {searchQuery ? "No Results Found" : getEmptyStateTitle()}
      </Text>
      <Text style={styles.emptyStateSubtitle}>
        {searchQuery
          ? `No matches for "${searchQuery}". Try a different search.`
          : getEmptyStateMessage()}
      </Text>
      {!searchQuery && (
        <TouchableOpacity
          style={styles.emptyStateButton}
          onPress={() =>
            Alert.alert("Coming Soon", "This feature will be available soon!")
          }
        >
          <Text style={styles.emptyStateButtonText}>Start Exploring</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const getEmptyStateTitle = () => {
    switch (activeFilter) {
      case "users":
        return "No Users Found";
      case "conversations":
        return "No Conversations Yet";
      case "calls":
        return "No Call History";
      default:
        return "Ready to Connect!";
    }
  };

  const getEmptyStateMessage = () => {
    switch (activeFilter) {
      case "users":
        return "Add some friends to start chatting and calling.";
      case "conversations":
        return "Start a conversation to see your chats here.";
      case "calls":
        return "Make your first call to see call history.";
      default:
        return "Your AI-powered messaging assistant is ready to help you connect with friends!";
    }
  };

  const renderChatMessage = ({ item }: { item: any }) => {
    const isMe = item.sender === "me";
    return (
      <View
        style={[
          styles.messageContainer,
          isMe ? styles.myMessage : styles.otherMessage,
        ]}
      >
        {!isMe && (
          <View style={styles.messageAvatar}>
            <Text style={styles.messageAvatarText}>
              {item.avatar || selectedUser?.name?.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
        <View
          style={[
            styles.messageBubble,
            isMe ? styles.myMessageBubble : styles.otherMessageBubble,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isMe ? styles.myMessageText : styles.otherMessageText,
            ]}
          >
            {item.text}
          </Text>
          <Text
            style={[
              styles.messageTime,
              isMe ? styles.myMessageTime : styles.otherMessageTime,
            ]}
          >
            {item.timestamp}
          </Text>
        </View>
      </View>
    );
  };

  const renderChatHeader = () => (
    <View style={styles.chatHeader}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => setSelectedUser(null)}
      >
        <ArrowLeft size={24} color={colors.white} />
      </TouchableOpacity>

      <View style={styles.chatHeaderInfo}>
        <View style={styles.chatHeaderAvatar}>
          <Text style={styles.chatHeaderAvatarText}>
            {selectedUser?.name?.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.chatHeaderText}>
          <Text style={styles.chatHeaderName}>{selectedUser?.name}</Text>
          <Text style={styles.chatHeaderStatus}>
            {selectedUser?.status === "online" ? "🟢 Online" : "⚫ Offline"}
          </Text>
        </View>
      </View>

      <View style={styles.chatHeaderActions}>
        <TouchableOpacity style={styles.chatHeaderAction}>
          <Phone size={22} color={colors.white} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.chatHeaderAction}>
          <Video size={22} color={colors.white} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.chatHeaderAction}>
          <MoreVertical size={22} color={colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderChatInput = () => (
    <View style={styles.chatInputContainer}>
      <TouchableOpacity style={styles.attachButton}>
        <Paperclip size={22} color={colors.textSecondary} />
      </TouchableOpacity>

      <View style={styles.messageInputWrapper}>
        <TextInput
          style={styles.messageInput}
          placeholder="Type a message..."
          placeholderTextColor={colors.textSecondary}
          value={chatMessage}
          onChangeText={setChatMessage}
          multiline
          maxLength={500}
        />
        <TouchableOpacity style={styles.emojiButton}>
          <Smile size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[
          styles.sendButton,
          chatMessage.trim() ? styles.sendButtonActive : {},
        ]}
        onPress={handleSendMessage}
        disabled={!chatMessage.trim()}
      >
        <Send
          size={20}
          color={chatMessage.trim() ? colors.white : colors.textSecondary}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {selectedUser ? (
        // Chat Interface
        <KeyboardAvoidingView
          style={styles.chatContainer}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          {renderChatHeader()}

          <FlatList
            data={messages}
            renderItem={renderChatMessage}
            keyExtractor={(item) => item.id.toString()}
            style={styles.messagesList}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
            inverted={false}
          />

          {renderChatInput()}
        </KeyboardAvoidingView>
      ) : (
        // Main List Interface
        <>
          {/* Search Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>All Communications</Text>

            {/* Search Box */}
            <View style={styles.searchContainer}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Search users, chats, or calls..."
                placeholderTextColor={colors.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            {/* Filter Buttons */}
            <View style={styles.filterContainer}>
              <FilterButton filter="all" title="All" />
              <FilterButton filter="users" title="Users" />
              <FilterButton filter="conversations" title="Chats" />
              <FilterButton filter="calls" title="Calls" />
            </View>
          </View>

          {/* Content */}
          {getSectionData().length === 0 ? (
            renderEmptyState()
          ) : (
            <SectionList
              sections={getSectionData()}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              renderSectionHeader={renderSectionHeader}
              style={styles.list}
              showsVerticalScrollIndicator={false}
              stickySectionHeadersEnabled={false}
            />
          )}
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.searchBackground,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
  },
  filterContainer: {
    flexDirection: "row",
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.searchBackground,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activeFilterButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.textSecondary,
  },
  activeFilterText: {
    color: colors.white,
  },
  list: {
    flex: 1,
  },
  sectionHeader: {
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  itemContainer: {
    backgroundColor: colors.white,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  itemInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.white,
  },
  itemDetails: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textPrimary,
    flex: 1,
  },
  timestamp: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  itemSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginLeft: 8,
  },
  conversationInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  unreadBadge: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
    paddingHorizontal: 6,
  },
  unreadText: {
    fontSize: 12,
    fontWeight: "bold",
    color: colors.white,
  },
  callInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  callStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },

  // Empty State Styles
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  emptyStateRobot: {
    width: 120,
    height: 120,
    marginBottom: 32,
    opacity: 0.8,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.textPrimary,
    textAlign: "center",
    marginBottom: 12,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  emptyStateButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  emptyStateButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },

  // Chat Interface Styles
  chatContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  chatHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  chatHeaderInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  chatHeaderAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  chatHeaderAvatarText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.white,
  },
  chatHeaderText: {
    flex: 1,
  },
  chatHeaderName: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.white,
  },
  chatHeaderStatus: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 2,
  },
  chatHeaderActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  chatHeaderAction: {
    padding: 8,
    marginLeft: 8,
  },

  // Messages Styles
  messagesList: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  messagesContent: {
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  messageContainer: {
    flexDirection: "row",
    marginVertical: 4,
    maxWidth: "80%",
  },
  myMessage: {
    alignSelf: "flex-end",
    justifyContent: "flex-end",
  },
  otherMessage: {
    alignSelf: "flex-start",
    justifyContent: "flex-start",
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    marginTop: 4,
  },
  messageAvatarText: {
    fontSize: 12,
    fontWeight: "bold",
    color: colors.white,
  },
  messageBubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    maxWidth: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  myMessageBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  otherMessageBubble: {
    backgroundColor: colors.white,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  myMessageText: {
    color: colors.white,
  },
  otherMessageText: {
    color: colors.textPrimary,
  },
  messageTime: {
    fontSize: 11,
    marginTop: 4,
  },
  myMessageTime: {
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "right",
  },
  otherMessageTime: {
    color: colors.textSecondary,
  },

  // Chat Input Styles
  chatInputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  attachButton: {
    padding: 12,
    marginRight: 8,
  },
  messageInputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: colors.searchBackground,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
  },
  messageInput: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
    maxHeight: 80,
    textAlignVertical: "center",
  },
  emojiButton: {
    padding: 4,
    marginLeft: 8,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.border,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  sendButtonActive: {
    backgroundColor: colors.primary,
  },
});

export default AllInOne;
