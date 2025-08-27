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

// Dummy group data
const dummyGroups = [
  {
    guid: "group1",
    name: "Project Team",
    description: "Team collaboration group",
    membersCount: 12,
    type: "public",
    hasJoined: true,
  },
  {
    guid: "group2",
    name: "Design Team",
    description: "UI/UX design discussions",
    membersCount: 8,
    type: "public",
    hasJoined: false,
  },
  {
    guid: "group3",
    name: "Development Team",
    description: "Code review and discussions",
    membersCount: 15,
    type: "private",
    hasJoined: true,
  },
  {
    guid: "group4",
    name: "Marketing Team",
    description: "Marketing strategies and campaigns",
    membersCount: 6,
    type: "public",
    hasJoined: false,
  },
];

interface GroupsProps {
  hideHeader?: boolean;
}

const Groups: React.FC<GroupsProps> = ({ hideHeader = false }) => {
  const handleGroupPress = (group: (typeof dummyGroups)[0]) => {
    if (group.hasJoined) {
      Alert.alert("Open Group Chat", `Open chat for ${group.name}?`, [
        {
          text: "Open",
          onPress: () => {
            Alert.alert(
              "Feature Coming Soon",
              "Group chat functionality will be available soon!"
            );
          },
        },
        { text: "Cancel", style: "cancel" },
      ]);
    } else {
      Alert.alert("Join Group", `Join ${group.name}?\n\n${group.description}`, [
        {
          text: "Join",
          onPress: () => {
            Alert.alert(
              "Feature Coming Soon",
              "Group joining functionality will be available soon!"
            );
          },
        },
        { text: "Cancel", style: "cancel" },
      ]);
    }
  };

  const getGroupTypeColor = (type: string) => {
    switch (type) {
      case "public":
        return "#4CAF50";
      case "private":
        return "#FF9800";
      default:
        return "#9E9E9E";
    }
  };

  const renderGroupItem = ({ item }: { item: (typeof dummyGroups)[0] }) => (
    <TouchableOpacity
      style={styles.groupItem}
      onPress={() => handleGroupPress(item)}
    >
      <View style={styles.groupInfo}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {item.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.groupDetails}>
          <View style={styles.groupHeader}>
            <Text style={styles.groupName}>{item.name}</Text>
            <View style={styles.groupMeta}>
              <View
                style={[
                  styles.typeIndicator,
                  { backgroundColor: getGroupTypeColor(item.type) },
                ]}
              />
              <Text style={styles.memberCount}>
                {item.membersCount} members
              </Text>
            </View>
          </View>
          <Text style={styles.groupDescription} numberOfLines={1}>
            {item.description}
          </Text>
          <View style={styles.statusRow}>
            <Text
              style={[
                styles.groupType,
                { color: getGroupTypeColor(item.type) },
              ]}
            >
              {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
            </Text>
            {item.hasJoined && <Text style={styles.joinedLabel}>Joined</Text>}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {!hideHeader && (
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Groups</Text>
          <Text style={styles.headerSubtitle}>Join groups to collaborate</Text>
        </View>
      )}
      <FlatList
        data={dummyGroups}
        keyExtractor={(item) => item.guid}
        renderItem={renderGroupItem}
        style={styles.groupsList}
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
  groupsList: {
    flex: 1,
  },
  groupItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    backgroundColor: colors.cardBackground,
    borderBottomColor: colors.border,
  },
  groupInfo: {
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
  groupDetails: {
    flex: 1,
  },
  groupHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  groupName: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
    color: colors.textPrimary,
  },
  groupMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  typeIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  memberCount: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  groupDescription: {
    fontSize: 14,
    marginBottom: 6,
    color: colors.textSecondary,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  groupType: {
    fontSize: 12,
    fontWeight: "600",
  },
  joinedLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.primary,
  },
});

export default Groups;
