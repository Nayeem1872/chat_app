import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  CometChatUIKit,
  UIKitSettings,
} from "@cometchat/chat-uikit-react-native";
import { navigate, navigationRef } from "../../navigation/NavigationService";
import { SCREEN_CONSTANTS } from "../../utils/AppConstants";
import { CometChat } from "@cometchat/chat-sdk-react-native";

const AppCredentials: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  // Start animations when component mounts
  React.useLayoutEffect(() => {
    if (!isInitialized) {
      loadStoredCredentials();
      // Start animations immediately without setTimeout
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.back(1.1)),
          useNativeDriver: true,
        }),
      ]).start();
      setIsInitialized(true);
    }
  }, [isInitialized]);

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const loadStoredCredentials = async () => {
    try {
      const stored = await AsyncStorage.getItem("userCredentials");
      if (stored) {
        const creds = JSON.parse(stored);
        if (creds.email) setEmail(creds.email);
        // Don't auto-fill password for security
      }
    } catch (err) {
      // Silently handle loading errors
    }
  };

  const handleLogin = async () => {
    // Prevent multiple simultaneous attempts
    if (loading) return;

    // Animate button press
    animateButton();

    // Simple validation
    const trimmedEmail = (email || "").trim();
    const trimmedPassword = (password || "").trim();

    if (!trimmedEmail) {
      Alert.alert("💡 Missing Info", "Please enter your email to continue");
      return;
    }
    if (!trimmedPassword) {
      Alert.alert("💡 Missing Info", "Please enter your password to continue");
      return;
    }

    setLoading(true);

    // Process login immediately without setTimeout
    try {
      const credentials = {
        email: trimmedEmail,
        password: trimmedPassword,
      };

      // Save email (not password for security)
      try {
        await AsyncStorage.setItem(
          "userCredentials",
          JSON.stringify({ email: credentials.email })
        );
      } catch (storageError) {
        console.log("Storage error:", storageError);
      }

      // For demo purposes - simulate login success
      // In real app, you would authenticate with your backend here

      // Navigate directly to next page
      navigate("BottomTabNavigator");
      navigationRef.reset({
        index: 0,
        routes: [{ name: SCREEN_CONSTANTS.SAMPLER_USER }],
      });
    } catch (error) {
      console.error("Login failed:", error);
      Alert.alert("❌ Login Failed", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#6366F1" />
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <Animated.View
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
              },
            ]}
          >
            {/* Header with gradient effect */}
            <View style={styles.header}>
              <View style={styles.titleContainer}>
                <Text style={styles.welcomeText}>Welcome Back! 👋</Text>
                <Text style={styles.title}>MessageMate</Text>
                <Text style={styles.subtitle}>
                  Connect with friends instantly
                </Text>
              </View>
            </View>

            {/* Form */}
            <View style={styles.form}>
              {/* Email Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>📧 Email</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={(text) => setEmail(text || "")}
                    placeholder="Enter your email"
                    placeholderTextColor="#A0AEC0"
                    autoCapitalize="none"
                    autoCorrect={false}
                    spellCheck={false}
                    keyboardType="email-address"
                    returnKeyType="next"
                  />
                </View>
              </View>

              {/* Password Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>🔒 Password</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={(text) => setPassword(text || "")}
                    placeholder="Enter your password"
                    placeholderTextColor="#A0AEC0"
                    autoCapitalize="none"
                    autoCorrect={false}
                    spellCheck={false}
                    secureTextEntry
                    keyboardType="default"
                    returnKeyType="done"
                    onSubmitEditing={handleLogin}
                  />
                </View>
              </View>

              {/* Login Button */}
              <Animated.View
                style={{
                  transform: [{ scale: buttonScale }],
                }}
              >
                <TouchableOpacity
                  style={[
                    styles.loginButton,
                    loading && styles.loginButtonDisabled,
                  ]}
                  onPress={handleLogin}
                  disabled={loading || !email.trim() || !password.trim()}
                  activeOpacity={0.8}
                >
                  <Text style={styles.loginButtonText}>
                    {loading ? "🚀 Connecting..." : "✨ Let's Chat!"}
                  </Text>
                </TouchableOpacity>
              </Animated.View>

              {/* Footer */}
              <View style={styles.footer}>
                <Text style={styles.footerText}>
                  Ready to connect with the world? 🌍
                </Text>
              </View>
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};

export default AppCredentials;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#6366F1",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 48,
  },
  titleContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  welcomeText: {
    fontSize: 18,
    color: "#E0E7FF",
    marginBottom: 8,
    fontWeight: "500",
  },
  title: {
    fontSize: 38,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 12,
    textShadowColor: "rgba(0,0,0,0.1)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#C7D2FE",
    textAlign: "center",
    fontWeight: "400",
  },
  form: {
    width: "100%",
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  inputWrapper: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 0,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 18,
    fontSize: 16,
    color: "#2D3748",
    fontWeight: "500",
  },
  loginButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  loginButtonDisabled: {
    backgroundColor: "#A0AEC0",
    shadowOpacity: 0.05,
  },
  loginButtonText: {
    color: "#6366F1",
    fontSize: 18,
    fontWeight: "700",
  },
  footer: {
    alignItems: "center",
    marginTop: 32,
  },
  footerText: {
    fontSize: 14,
    color: "#E0E7FF",
    textAlign: "center",
    fontWeight: "400",
  },
});
