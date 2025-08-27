import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
  Image,
} from "react-native";
import { navigationRef } from "../../navigation/NavigationService";
import { SCREEN_CONSTANTS } from "../../utils/AppConstants";

// Enhanced color theme for chat app profile
const colors = {
  background: "#f8f9fa",
  cardBackground: "#ffffff",
  primary: "#007AFF",
  secondary: "#34C759",
  danger: "#FF3B30",
  warning: "#FF9500",
  textPrimary: "#000000",
  textSecondary: "#666666",
  textTertiary: "#8E8E93",
  border: "#e0e0e0",
  white: "#ffffff",
  lightBlue: "#E3F2FD",
  lightGreen: "#E8F5E8",
  lightRed: "#FFEBEE",
};

// Profile data
const profileData = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  status: "Available",
  avatar: null, // We'll use initials
  joinedDate: "January 2024",
  lastSeen: "Online",
};

// Settings data
const settingsData = [
  {
    section: "Account",
    items: [
      {
        icon: "👤",
        title: "Edit Profile",
        subtitle: "Change your name, email, and phone",
        action: "edit_profile",
      },
      {
        icon: "🔒",
        title: "Privacy",
        subtitle: "Control who can see your info",
        action: "privacy",
      },
      {
        icon: "🔐",
        title: "Security",
        subtitle: "Password and two-factor auth",
        action: "security",
      },
    ],
  },
  {
    section: "Chat Settings",
    items: [
      {
        icon: "🔔",
        title: "Notifications",
        subtitle: "Message and call alerts",
        action: "notifications",
        toggle: true,
        value: true,
      },
      {
        icon: "🌙",
        title: "Dark Mode",
        subtitle: "Switch to dark theme",
        action: "dark_mode",
        toggle: true,
        value: false,
      },
      {
        icon: "💬",
        title: "Chat Backup",
        subtitle: "Backup your conversations",
        action: "backup",
      },
      {
        icon: "🎵",
        title: "Message Sounds",
        subtitle: "Notification and message tones",
        action: "sounds",
        toggle: true,
        value: true,
      },
    ],
  },
  {
    section: "Support",
    items: [
      {
        icon: "❓",
        title: "Help Center",
        subtitle: "Get help and support",
        action: "help",
      },
      {
        icon: "💬",
        title: "Contact Us",
        subtitle: "Send feedback or report issues",
        action: "contact",
      },
      {
        icon: "⭐",
        title: "Rate App",
        subtitle: "Rate us on the app store",
        action: "rate",
      },
    ],
  },
];

const Profile: React.FC = () => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [messageSounds, setMessageSounds] = useState(true);

  const handleSettingPress = (action: string) => {
    switch (action) {
      case "edit_profile":
        Alert.alert("Edit Profile", "Profile editing feature coming soon!");
        break;
      case "privacy":
        Alert.alert("Privacy Settings", "Privacy controls coming soon!");
        break;
      case "security":
        Alert.alert("Security Settings", "Security features coming soon!");
        break;
      case "backup":
        Alert.alert("Chat Backup", "Backup feature coming soon!");
        break;
      case "help":
        Alert.alert("Help Center", "Help documentation coming soon!");
        break;
      case "contact":
        Alert.alert("Contact Us", "Support contact coming soon!");
        break;
      case "rate":
        Alert.alert("Rate App", "Thank you for considering rating our app!");
        break;
      case "logout":
        Alert.alert("Logout", "Are you sure you want to logout?", [
          { text: "Cancel", style: "cancel" },
          {
            text: "Logout",
            style: "destructive",
            onPress: () => {
              // Navigate back to login page
              navigationRef.reset({
                index: 0,
                routes: [{ name: SCREEN_CONSTANTS.SAMPLER_USER }],
              });
            },
          },
        ]);
        break;
      default:
        Alert.alert("Feature", "This feature is coming soon!");
    }
  };

  const handleToggleChange = (action: string, value: boolean) => {
    switch (action) {
      case "notifications":
        setNotifications(value);
        break;
      case "dark_mode":
        setDarkMode(value);
        Alert.alert(
          "Dark Mode",
          value ? "Dark mode enabled!" : "Dark mode disabled!"
        );
        break;
      case "sounds":
        setMessageSounds(value);
        break;
    }
  };

  const getToggleValue = (action: string) => {
    switch (action) {
      case "notifications":
        return notifications;
      case "dark_mode":
        return darkMode;
      case "sounds":
        return messageSounds;
      default:
        return false;
    }
  };

  const ProfileHeader = () => (
    <View style={styles.profileHeader}>
      <View style={styles.profileCard}>
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Image
              source={require("../../assets/icons/dark.png")}
              style={styles.robotProfileAvatar}
              resizeMode="contain"
            />
          </View>
          <TouchableOpacity
            style={styles.editAvatarButton}
            onPress={() => handleSettingPress("edit_profile")}
          >
            <Text style={styles.editAvatarText}>📷</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Info */}
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{profileData.name}</Text>
          <Text style={styles.profileEmail}>{profileData.email}</Text>
          <View style={styles.statusContainer}>
            <View
              style={[styles.statusDot, { backgroundColor: colors.secondary }]}
            />
            <Text style={styles.statusText}>{profileData.status}</Text>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>127</Text>
            <Text style={styles.statLabel}>Chats</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>43</Text>
            <Text style={styles.statLabel}>Groups</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>89</Text>
            <Text style={styles.statLabel}>Calls</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const SettingItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={() => !item.toggle && handleSettingPress(item.action)}
    >
      <View style={styles.settingLeft}>
        <View style={styles.settingIcon}>
          <Text style={styles.settingIconText}>{item.icon}</Text>
        </View>
        <View style={styles.settingContent}>
          <Text style={styles.settingTitle}>{item.title}</Text>
          <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
        </View>
      </View>
      <View style={styles.settingRight}>
        {item.toggle ? (
          <Switch
            value={getToggleValue(item.action)}
            onValueChange={(value) => handleToggleChange(item.action, value)}
            trackColor={{ false: colors.border, true: colors.primary + "40" }}
            thumbColor={
              getToggleValue(item.action)
                ? colors.primary
                : colors.textSecondary
            }
          />
        ) : (
          <Text style={styles.settingArrow}>›</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const SettingSection = ({ section }: { section: any }) => (
    <View style={styles.settingSection}>
      <Text style={styles.sectionTitle}>{section.section}</Text>
      <View style={styles.sectionCard}>
        {section.items.map((item: any, index: number) => (
          <View key={index}>
            <SettingItem item={item} />
            {index < section.items.length - 1 && (
              <View style={styles.settingDivider} />
            )}
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => handleSettingPress("edit_profile")}
          >
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Header */}
        <ProfileHeader />

        {/* Settings Sections */}
        {settingsData.map((section, index) => (
          <SettingSection key={index} section={section} />
        ))}

        {/* Logout Button */}
        <View style={styles.logoutSection}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => handleSettingPress("logout")}
          >
            <Text style={styles.logoutText}>🚪 Logout</Text>
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <View style={styles.versionSection}>
          <Text style={styles.versionText}>MessageMate v2.1.0 🤖</Text>
          <Text style={styles.versionSubtext}>
            Powered by AI • Made with ❤️ for amazing conversations
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.textPrimary,
  },
  editButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "600",
  },
  profileHeader: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  profileCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: colors.white,
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: "bold",
    color: colors.white,
  },
  robotProfileAvatar: {
    width: 80,
    height: 80,
    tintColor: colors.white,
  },
  editAvatarButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.border,
  },
  editAvatarText: {
    fontSize: 16,
  },
  profileInfo: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    color: colors.secondary,
    fontWeight: "500",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    width: "100%",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.border,
    marginHorizontal: 16,
  },
  settingSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: 12,
  },
  sectionCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  settingIconText: {
    fontSize: 18,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.textPrimary,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  settingRight: {
    marginLeft: 12,
  },
  settingArrow: {
    fontSize: 20,
    color: colors.textTertiary,
    fontWeight: "300",
  },
  settingDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 68,
  },
  logoutSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  logoutButton: {
    backgroundColor: colors.lightRed,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.danger + "20",
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.danger,
  },
  versionSection: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  versionText: {
    fontSize: 14,
    color: colors.textTertiary,
    fontWeight: "500",
    marginBottom: 4,
  },
  versionSubtext: {
    fontSize: 12,
    color: colors.textTertiary,
    textAlign: "center",
  },
});

export default Profile;
