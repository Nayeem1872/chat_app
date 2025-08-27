import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Easing,
  StatusBar,
  Dimensions,
  Image,
} from "react-native";
import { Brain, Zap, Shield } from "lucide-react-native";
import { navigate } from "../../navigation/NavigationService";
import { SCREEN_CONSTANTS } from "../../utils/AppConstants";

const { width, height } = Dimensions.get("window");

const WelcomeScreen: React.FC = () => {
  const [isInitialized, setIsInitialized] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const swipeIndicatorAnim = useRef(new Animated.Value(0)).current;

  // Start animations when component mounts
  useEffect(() => {
    if (!isInitialized) {
      // Start entrance animations
      Animated.stagger(200, [
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
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 1000,
          easing: Easing.out(Easing.back(1.2)),
          useNativeDriver: true,
        }),
      ]).start();

      // Start swipe indicator animation
      startSwipeAnimation();
      setIsInitialized(true);
    }
  }, [isInitialized]);

  const startSwipeAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(swipeIndicatorAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(swipeIndicatorAnim, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const handleContinue = () => {
    // Navigate to login screen
    navigate(SCREEN_CONSTANTS.SAMPLER_USER);
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />
      <SafeAreaView style={styles.container}>
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
            },
          ]}
        >
          {/* Logo Section */}
          <Animated.View
            style={[styles.logoSection, { transform: [{ scale: logoScale }] }]}
          >
            <View style={styles.logoContainer}>
              <Image
                source={require("../../../assets/p1.png")}
                style={styles.robotImage}
                resizeMode="contain"
              />
            </View>
          </Animated.View>

          {/* Welcome Content */}
          <View style={styles.welcomeContent}>
            <Text style={styles.welcomeTitle}>Welcome to</Text>
            <Text style={styles.appTitle}>MessageMate</Text>
            <Text style={styles.description}>
              Connect with friends instantly and share memorable moments
            </Text>

            <View style={styles.features}>
              <View style={styles.feature}>
                <View style={styles.iconContainer}>
                  <Brain
                    size={28}
                    color="rgba(255, 255, 255, 0.95)"
                    strokeWidth={2.5}
                  />
                </View>
                <Text style={styles.featureText}>AI Powered</Text>
              </View>
              <View style={styles.feature}>
                <View style={styles.iconContainer}>
                  <Zap
                    size={28}
                    color="rgba(255, 255, 255, 0.95)"
                    strokeWidth={2.5}
                  />
                </View>
                <Text style={styles.featureText}>Super Fast</Text>
              </View>
              <View style={styles.feature}>
                <View style={styles.iconContainer}>
                  <Shield
                    size={28}
                    color="rgba(255, 255, 255, 0.95)"
                    strokeWidth={2.5}
                  />
                </View>
                <Text style={styles.featureText}>Secure Chat</Text>
              </View>
            </View>
          </View>

          {/* Continue Button */}
          <View style={styles.bottomSection}>
            <TouchableOpacity
              style={styles.continueButton}
              onPress={handleContinue}
              activeOpacity={0.8}
            >
              <Text style={styles.continueButtonText}>Get Started</Text>
              <Text style={styles.continueButtonIcon}>✨</Text>
            </TouchableOpacity>

            {/* Swipe Indicator */}
            <Animated.View
              style={[
                styles.swipeIndicator,
                {
                  opacity: swipeIndicatorAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.3, 1],
                  }),
                  transform: [
                    {
                      translateX: swipeIndicatorAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 10],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Text style={styles.swipeText}>Swipe to continue →</Text>
            </Animated.View>
          </View>
        </Animated.View>
      </SafeAreaView>
    </>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#667eea",
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: "space-between",
    paddingTop: 60,
    paddingBottom: 40,
  },

  // Logo Section
  logoSection: {
    alignItems: "center",
    marginTop: 40,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    // backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    // shadowColor: "rgba(0, 0, 0, 0.3)",
    // shadowOffset: { width: 0, height: 8 },
    // shadowOpacity: 0.3,
    // shadowRadius: 16,
    // elevation: 8,
  },
  logoEmoji: {
    fontSize: 56,
  },
  robotImage: {
    width: 170,
    height: 170,
    // tintColor: 'rgba(255, 255, 255, 0.9)',
  },

  // Welcome Content
  welcomeContent: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  welcomeTitle: {
    fontSize: 24,
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "400",
    marginBottom: 8,
  },
  appTitle: {
    fontSize: 48,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 24,
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
    letterSpacing: 1,
  },
  description: {
    fontSize: 18,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    lineHeight: 28,
    marginBottom: 48,
    paddingHorizontal: 16,
    fontWeight: "400",
  },

  // Features
  features: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 32,
  },
  feature: {
    alignItems: "center",
    flex: 1,
    paddingVertical: 8,
  },
  featureEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  featureIcon: {
    width: 32,
    height: 32,
    marginBottom: 12,
    tintColor: "rgba(255, 255, 255, 0.9)",
  },
  featureText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "500",
    textAlign: "center",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "rgba(0, 0, 0, 0.2)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },

  // Bottom Section
  bottomSection: {
    alignItems: "center",
  },
  continueButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
    shadowColor: "rgba(0, 0, 0, 0.3)",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    minWidth: 200,
  },
  continueButtonText: {
    color: "#667eea",
    fontSize: 18,
    fontWeight: "700",
    marginRight: 8,
  },
  continueButtonIcon: {
    fontSize: 18,
  },

  // Swipe Indicator
  swipeIndicator: {
    alignItems: "center",
  },
  swipeText: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.7)",
    fontWeight: "500",
  },
});
