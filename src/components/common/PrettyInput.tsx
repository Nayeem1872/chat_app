import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Animated,
  TouchableOpacity,
  TextInputProps,
} from "react-native";

// Beautiful color palette focused on primary color
const inputColors = {
  primary: "#667eea",
  primaryLight: "rgba(102, 126, 234, 0.1)",
  primaryMedium: "rgba(102, 126, 234, 0.3)",
  background: "#ffffff",
  border: "#e2e8f0",
  borderActive: "#667eea",
  borderError: "#e53e3e",
  text: "#2d3748",
  textSecondary: "#718096",
  textLight: "#a0aec0",
  shadow: "rgba(102, 126, 234, 0.15)",
  error: "#e53e3e",
  success: "#48bb78",
};

interface PrettyInputProps extends TextInputProps {
  label: string;
  icon?: string;
  error?: string;
  isValid?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  containerStyle?: any;
  showValidation?: boolean;
}

const PrettyInput: React.FC<PrettyInputProps> = ({
  label,
  icon,
  error,
  isValid = true,
  onFocus,
  onBlur,
  containerStyle,
  showValidation = false,
  value,
  ...textInputProps
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  // Animation values
  const labelAnimation = useRef(new Animated.Value(value ? 1 : 0)).current;
  const borderAnimation = useRef(new Animated.Value(0)).current;
  const shadowAnimation = useRef(new Animated.Value(0)).current;
  const scaleAnimation = useRef(new Animated.Value(1)).current;
  const errorAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setHasValue(!!value && value.length > 0);
  }, [value]);

  useEffect(() => {
    // Animate error message appearance/disappearance
    Animated.timing(errorAnimation, {
      toValue: error ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [error]);

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();

    // Animate label up and border color
    Animated.parallel([
      Animated.timing(labelAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(borderAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(shadowAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.spring(scaleAnimation, {
        toValue: 1.02,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();

    // Animate label down if no value, and reset border
    Animated.parallel([
      Animated.timing(labelAnimation, {
        toValue: hasValue ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(borderAnimation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(shadowAnimation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.spring(scaleAnimation, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const labelStyle = {
    position: "absolute" as const,
    left: icon ? 44 : 16,
    top: labelAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [20, -8],
    }),
    fontSize: labelAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
    color: labelAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [
        inputColors.textLight,
        isFocused ? inputColors.primary : inputColors.textSecondary,
      ],
    }),
    backgroundColor: inputColors.background,
    paddingHorizontal: 4,
    zIndex: 1,
  };

  const containerAnimatedStyle = {
    borderColor: borderAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [
        error ? inputColors.borderError : inputColors.border,
        error ? inputColors.borderError : inputColors.borderActive,
      ],
    }),
    shadowColor: inputColors.shadow,
    shadowOpacity: shadowAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 0.2],
    }),
    elevation: shadowAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 4],
    }),
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <Animated.View
        style={[
          styles.inputContainer,
          containerAnimatedStyle,
          { transform: [{ scale: scaleAnimation }] },
        ]}
      >
        <Animated.Text style={[styles.label, labelStyle]}>
          {label}
        </Animated.Text>

        <View style={styles.inputWrapper}>
          {icon && (
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>{icon}</Text>
            </View>
          )}

          <TextInput
            {...textInputProps}
            value={value}
            style={[
              styles.textInput,
              icon && styles.textInputWithIcon,
              showValidation && isValid && hasValue && styles.textInputValid,
              error && styles.textInputError,
            ]}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder=""
            placeholderTextColor={inputColors.textLight}
          />

          {showValidation && hasValue && (
            <View style={styles.validationContainer}>
              <Text
                style={[
                  styles.validationIcon,
                  isValid ? styles.validIcon : styles.invalidIcon,
                ]}
              >
                {isValid ? "✓" : "✕"}
              </Text>
            </View>
          )}
        </View>
      </Animated.View>

      {error && (
        <Animated.View
          style={[
            styles.errorContainer,
            {
              opacity: errorAnimation,
              transform: [
                {
                  translateY: errorAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-10, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorText}>{error}</Text>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  inputContainer: {
    position: "relative",
    backgroundColor: inputColors.background,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: inputColors.border,
    shadowColor: inputColors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0,
    shadowRadius: 8,
    elevation: 1,
  },
  label: {
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 56,
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
  icon: {
    fontSize: 20,
    color: inputColors.primary,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: inputColors.text,
    paddingHorizontal: 16,
    paddingVertical: 16,
    minHeight: 56,
  },
  textInputWithIcon: {
    paddingLeft: 8,
  },
  textInputValid: {
    color: inputColors.success,
  },
  textInputError: {
    color: inputColors.error,
  },
  validationContainer: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  validationIcon: {
    fontSize: 18,
    fontWeight: "bold",
  },
  validIcon: {
    color: inputColors.success,
  },
  invalidIcon: {
    color: inputColors.error,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginLeft: 4,
  },
  errorIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  errorText: {
    fontSize: 13,
    color: inputColors.error,
    fontWeight: "500",
    flex: 1,
  },
});

export default PrettyInput;
