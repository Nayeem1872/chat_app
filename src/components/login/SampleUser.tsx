import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { SCREEN_CONSTANTS } from "../../utils/AppConstants";
import { navigationRef } from "../../navigation/NavigationService";

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

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // Dummy users for simplified login
  const dummyUsers = [
    { uid: "user1", name: "Alice", email: "alice@example.com" },
    { uid: "user2", name: "Bob", email: "bob@example.com" },
    { uid: "user3", name: "Charlie", email: "charlie@example.com" },
  ];

  const handleDummyUserSelect = (user: {
    uid: string;
    name: string;
    email: string;
  }) => {
    setEmail(user.email);
    setPassword("password123"); // Dummy password
  };

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    // Simple validation and direct navigation
    Alert.alert("Login Successful", `Welcome ${email}!`, [
      {
        text: "Continue",
        onPress: () => {
          // Navigate directly to Users page as specified in project requirements
          navigationRef.reset({
            index: 0,
            routes: [
              {
                name: SCREEN_CONSTANTS.BOTTOM_TAB_NAVIGATOR,
                state: {
                  routes: [
                    { name: SCREEN_CONSTANTS.CHATS },
                    { name: SCREEN_CONSTANTS.CALLS },
                    { name: SCREEN_CONSTANTS.USERS },
                    { name: SCREEN_CONSTANTS.GROUPS },
                  ],
                  index: 2, // Start on Users tab (index 2)
                },
              },
            ],
          });
        },
      },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingContainer}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.logInTitle}>Simple Login</Text>
          <Text style={styles.subtitle}>Quick Select (Dummy Users)</Text>

          <View style={styles.dummyUsersContainer}>
            {dummyUsers.map((user) => (
              <TouchableOpacity
                key={user.uid}
                style={styles.dummyUserButton}
                onPress={() => handleDummyUserSelect(user)}
              >
                <Text style={styles.dummyUserName}>{user.name}</Text>
                <Text style={styles.dummyUserEmail}>{user.email}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>Or Enter Manually</Text>
            <View style={styles.divider} />
          </View>

          <Text style={styles.inputLabel}>Email</Text>
          <TextInput
            placeholder="Enter your email"
            style={styles.textInput}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.inputLabel}>Password</Text>
          <TextInput
            placeholder="Enter your password"
            style={styles.textInput}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </ScrollView>

        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={[
              styles.continueButton,
              { opacity: !email.trim() || !password.trim() ? 0.6 : 1 },
            ]}
            onPress={handleLogin}
            disabled={!email.trim() || !password.trim()}
          >
            <Text style={styles.continueButtonText}>Login</Text>
          </TouchableOpacity>

          <View style={styles.changeCredentialsWrapper}>
            <Text style={styles.changeText}>Change</Text>
            <TouchableOpacity
              style={styles.changeCredentialsContainer}
              onPress={() => {
                navigationRef.navigate(SCREEN_CONSTANTS.APP_CRED);
              }}
            >
              <Text style={styles.changeLink}>App Credentials</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  keyboardAvoidingContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  logInTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    alignSelf: "center",
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 12,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  dummyUsersContainer: {
    marginBottom: 20,
  },
  dummyUserButton: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    backgroundColor: colors.cardBackground,
    borderColor: colors.border,
  },
  dummyUserName: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.textPrimary,
  },
  dummyUserEmail: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    gap: 10,
  },
  divider: {
    flex: 1,
    height: 1,
    borderWidth: 0.5,
    borderColor: colors.border,
  },
  dividerText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    paddingBottom: 5,
    color: colors.textPrimary,
  },
  textInput: {
    fontSize: 16,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderColor: colors.border,
    color: colors.textPrimary,
    backgroundColor: colors.cardBackground,
  },
  bottomContainer: {
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  continueButton: {
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: "600",
    alignSelf: "center",
    color: colors.white,
  },
  changeCredentialsWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    justifyContent: "center",
  },
  changeCredentialsContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  changeText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  changeLink: {
    fontSize: 16,
    color: colors.primary,
  },
});
