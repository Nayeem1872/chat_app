import React, { useState, useEffect, useCallback, useRef } from "react";
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
  Dimensions,
  Animated,
  StatusBar,
} from "react-native";
import { SCREEN_CONSTANTS } from "../../utils/AppConstants";
import { navigationRef } from "../../navigation/NavigationService";

const { width, height } = Dimensions.get("window");

// Beautiful color palette for premium login experience
const colors = {
  background: "#667eea",
  cardBackground: "rgba(255, 255, 255, 0.95)",
  cardShadow: "rgba(0, 0, 0, 0.1)",
  primary: "#667eea",
  primaryHover: "#5a67d8",
  secondary: "#f7fafc",
  textPrimary: "#2d3748",
  textSecondary: "#718096",
  textLight: "#a0aec0",
  border: "#e2e8f0",
  borderFocus: "#667eea",
  white: "#ffffff",
  accent: "#38b2ac",
  success: "#48bb78",
  overlay: "rgba(0, 0, 0, 0.3)",
};

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [emailFocused, setEmailFocused] = useState<boolean>(false);
  const [passwordFocused, setPasswordFocused] = useState<boolean>(false);
  const [isValidEmail, setIsValidEmail] = useState<boolean>(true);

  // Animation values - using useRef to prevent recreation
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim, scaleAnim]);

  // Email validation function
  const validateEmail = useCallback((emailText: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailText.trim());
  }, []);

  // Handle email input with validation
  const handleEmailChange = useCallback(
    (text: string) => {
      setEmail(text);
      // Only validate if user has typed something
      if (text.trim().length > 0) {
        setIsValidEmail(validateEmail(text));
      } else {
        setIsValidEmail(true); // Don't show error on empty field
      }
    },
    [validateEmail]
  );

  // Handle password input
  const handlePasswordChange = useCallback((text: string) => {
    setPassword(text);
  }, []);

  // Handle focus events with proper callback
  const handleEmailFocus = useCallback(() => {
    setEmailFocused(true);
  }, []);

  const handleEmailBlur = useCallback(() => {
    setEmailFocused(false);
    // Validate on blur
    if (email.trim().length > 0) {
      setIsValidEmail(validateEmail(email));
    }
  }, [email, validateEmail]);

  const handlePasswordFocus = useCallback(() => {
    setPasswordFocused(true);
  }, []);

  const handlePasswordBlur = useCallback(() => {
    setPasswordFocused(false);
  }, []);

  const handleLogin = useCallback(() => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    // Validation checks
    if (!trimmedEmail) {
      Alert.alert("Error", "Please enter your email address");
      return;
    }

    if (!isValidEmail) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    if (!trimmedPassword) {
      Alert.alert("Error", "Please enter your password");
      return;
    }

    if (trimmedPassword.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long");
      return;
    }

    // Simple validation and direct navigation
    Alert.alert("Login Successful", `Welcome ${trimmedEmail}!`, [
      {
        text: "Continue",
        onPress: () => {
          // Navigate directly to All tab
          navigationRef.reset({
            index: 0,
            routes: [
              {
                name: SCREEN_CONSTANTS.BOTTOM_TAB_NAVIGATOR,
                state: {
                  routes: [
                    { name: "All" },
                    { name: SCREEN_CONSTANTS.GROUPS },
                    { name: "Profile" },
                  ],
                  index: 0, // Start on All tab
                },
              },
            ],
          });
        },
      },
    ]);
  }, [email, password, isValidEmail]);

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <View style={styles.backgroundContainer}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingContainer}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
          <SafeAreaView style={styles.container}>
            <Animated.View
              style={[
                styles.contentContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
                },
              ]}
            >
              <ScrollView
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
              >
                {/* Header Section */}
                <View style={styles.headerContainer}>
                  <View style={styles.logoContainer}>
                    <Text style={styles.logoEmoji}>🔑</Text>
                  </View>
                  <Text style={styles.logInTitle}>Sign In</Text>
                  <Text style={styles.subtitle}>
                    Welcome back! Please sign in to continue
                  </Text>
                </View>

                {/* Login Form */}
                <View style={styles.formContainer}>
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Email Address</Text>
                    <View
                      style={[
                        styles.inputWrapper,
                        emailFocused && styles.inputWrapperFocused,
                        !isValidEmail &&
                          email.trim().length > 0 &&
                          styles.inputWrapperError,
                      ]}
                    >
                      <Text style={styles.inputIcon}>📧</Text>
                      <TextInput
                        placeholder="Enter your email"
                        placeholderTextColor={colors.textLight}
                        style={styles.textInput}
                        value={email}
                        onChangeText={handleEmailChange}
                        onFocus={handleEmailFocus}
                        onBlur={handleEmailBlur}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        autoComplete="email"
                        textContentType="emailAddress"
                        returnKeyType="next"
                        blurOnSubmit={false}
                      />
                    </View>
                    {!isValidEmail && email.trim().length > 0 && (
                      <Text style={styles.errorText}>
                        Please enter a valid email address
                      </Text>
                    )}
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Password</Text>
                    <View
                      style={[
                        styles.inputWrapper,
                        passwordFocused && styles.inputWrapperFocused,
                      ]}
                    >
                      <Text style={styles.inputIcon}>🔒</Text>
                      <TextInput
                        placeholder="Enter your password"
                        placeholderTextColor={colors.textLight}
                        style={styles.textInput}
                        value={password}
                        onChangeText={handlePasswordChange}
                        onFocus={handlePasswordFocus}
                        onBlur={handlePasswordBlur}
                        secureTextEntry
                        autoCorrect={false}
                        autoComplete="password"
                        textContentType="password"
                        returnKeyType="done"
                        onSubmitEditing={handleLogin}
                      />
                    </View>
                  </View>
                </View>
              </ScrollView>

              {/* Bottom Section */}
              <View style={styles.bottomContainer}>
                <TouchableOpacity
                  style={[
                    styles.continueButton,
                    {
                      opacity:
                        !email.trim() || !password.trim() || !isValidEmail
                          ? 0.6
                          : 1,
                    },
                  ]}
                  onPress={handleLogin}
                  disabled={!email.trim() || !password.trim() || !isValidEmail}
                  activeOpacity={0.8}
                >
                  <View style={styles.buttonContainer}>
                    <Text style={styles.continueButtonText}>Sign In</Text>
                    <Text style={styles.buttonIcon}>✨</Text>
                  </View>
                </TouchableOpacity>

                <View style={styles.appInfoContainer}>
                  <Text style={styles.appInfoText}>MessageMate v2.1.0</Text>
                  <Text style={styles.appInfoSubtext}>
                    Beautiful • Secure • Fast
                  </Text>
                </View>
              </View>
            </Animated.View>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </View>
    </>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    margin: 20,
    borderRadius: 24,
    backgroundColor: colors.cardBackground,
    shadowColor: colors.cardShadow,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
    overflow: "hidden",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 20,
  },

  // Header Styles
  headerContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  logoEmoji: {
    fontSize: 36,
  },
  logInTitle: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 8,
    color: colors.textPrimary,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    fontWeight: "500",
  },

  // Quick Login Section - REMOVED
  formContainer: {
    marginBottom: 24,
  },

  // Input Styles
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 4,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputWrapperFocused: {
    borderColor: colors.borderFocus,
    shadowColor: colors.primary,
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  inputWrapperError: {
    borderColor: "#e53e3e",
    shadowColor: "#e53e3e",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  inputIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
    paddingVertical: 12,
    fontWeight: "500",
    minHeight: 44, // Ensure consistent height
  },
  errorText: {
    fontSize: 12,
    color: "#e53e3e",
    marginTop: 4,
    marginLeft: 4,
    fontWeight: "500",
  },

  // Bottom Section
  bottomContainer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 16,
  },
  continueButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.white,
    letterSpacing: 0.5,
    marginRight: 8,
  },
  buttonIcon: {
    fontSize: 16,
  },

  // App Info
  appInfoContainer: {
    alignItems: "center",
    marginTop: 8,
  },
  appInfoText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  appInfoSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: "500",
  },
});
