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
} from "react-native";

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

  const handleItemPress = (item: any) => {
    if (item.type === "user") {
      Alert.alert("User Selected", `Start chat with ${item.name}?`, [
        {
          text: "Start Chat",
          onPress: () =>
            Alert.alert("Feature Coming Soon", "Chat will be available soon!"),
        },
        { text: "Cancel", style: "cancel" },
      ]);
    } else if (item.type === "conversation") {
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

  return (
    <SafeAreaView style={styles.container}>
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
      <SectionList
        sections={getSectionData()}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        style={styles.list}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
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
});

export default AllInOne;
