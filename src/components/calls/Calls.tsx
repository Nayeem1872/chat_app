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

// Dummy call data
const dummyCalls = [
  {
    id: "call1",
    callerName: "Alice Johnson",
    callType: "audio",
    callStatus: "answered",
    duration: "5:32",
    timestamp: "2 hours ago",
    direction: "incoming",
  },
  {
    id: "call2",
    callerName: "Bob Smith",
    callType: "video",
    callStatus: "missed",
    duration: "--",
    timestamp: "4 hours ago",
    direction: "incoming",
  },
  {
    id: "call3",
    callerName: "Charlie Brown",
    callType: "audio",
    callStatus: "answered",
    duration: "12:45",
    timestamp: "Yesterday",
    direction: "outgoing",
  },
  {
    id: "call4",
    callerName: "Diana Prince",
    callType: "video",
    callStatus: "rejected",
    duration: "--",
    timestamp: "Yesterday",
    direction: "outgoing",
  },
];

const Calls: React.FC = () => {
  const handleCallPress = (call: (typeof dummyCalls)[0]) => {
    Alert.alert(
      "Call Details",
      `Caller: ${call.callerName}\nType: ${call.callType}\nStatus: ${call.callStatus}\nDuration: ${call.duration}`,
      [
        {
          text: "Call Back",
          onPress: () => {
            Alert.alert(
              "Feature Coming Soon",
              "Call functionality will be available soon!"
            );
          },
        },
        { text: "Close", style: "cancel" },
      ]
    );
  };

  const getCallStatusColor = (status: string) => {
    switch (status) {
      case "answered":
        return "#4CAF50";
      case "missed":
        return "#F44336";
      case "rejected":
        return "#FF9800";
      default:
        return "#9E9E9E";
    }
  };

  const getCallTypeIcon = (type: string) => {
    return type === "video" ? "📹" : "📞";
  };

  const getDirectionIcon = (direction: string) => {
    return direction === "incoming" ? "↙️" : "↗️";
  };

  const renderCallItem = ({ item }: { item: (typeof dummyCalls)[0] }) => (
    <TouchableOpacity
      style={styles.callItem}
      onPress={() => handleCallPress(item)}
    >
      <View style={styles.callInfo}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {item.callerName.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.callDetails}>
          <View style={styles.callHeader}>
            <Text style={styles.callerName}>{item.callerName}</Text>
            <Text style={styles.timestamp}>{item.timestamp}</Text>
          </View>
          <View style={styles.callMeta}>
            <View style={styles.callTypeRow}>
              <Text style={styles.callTypeIcon}>
                {getDirectionIcon(item.direction)}
              </Text>
              <Text style={styles.callTypeIcon}>
                {getCallTypeIcon(item.callType)}
              </Text>
              <Text
                style={[
                  styles.callStatus,
                  { color: getCallStatusColor(item.callStatus) },
                ]}
              >
                {item.callStatus.charAt(0).toUpperCase() +
                  item.callStatus.slice(1)}
              </Text>
            </View>
            <Text style={styles.duration}>{item.duration}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Calls</Text>
        <Text style={styles.headerSubtitle}>Recent call history</Text>
      </View>
      <FlatList
        data={dummyCalls}
        keyExtractor={(item) => item.id}
        renderItem={renderCallItem}
        style={styles.callsList}
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
  callsList: {
    flex: 1,
  },
  callItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    backgroundColor: colors.cardBackground,
    borderBottomColor: colors.border,
  },
  callInfo: {
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
  callDetails: {
    flex: 1,
  },
  callHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  callerName: {
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
  callMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  callTypeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  callTypeIcon: {
    fontSize: 14,
  },
  callStatus: {
    fontSize: 14,
    fontWeight: "600",
  },
  duration: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});

export default Calls;
