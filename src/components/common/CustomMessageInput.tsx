import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import PrettyInput from "./PrettyInput";

// Beautiful color palette focused on primary color
const inputColors = {
  primary: "#667eea",
  primaryLight: "rgba(102, 126, 234, 0.1)",
  primaryMedium: "rgba(102, 126, 234, 0.3)",
  background: "#ffffff",
  border: "#e2e8f0",
  borderActive: "#667eea",
  text: "#2d3748",
  textSecondary: "#718096",
  textLight: "#a0aec0",
  shadow: "rgba(102, 126, 234, 0.15)",
  success: "#48bb78",
  white: "#ffffff",
};

interface CustomMessageInputProps {
  onSendMessage: (message: string) => void;
  placeholder?: string;
  user?: any;
  group?: any;
}

const CustomMessageInput: React.FC<CustomMessageInputProps> = ({
  onSendMessage,
  placeholder = "Type a message...",
  user,
  group,
}) => {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage("");
      setIsTyping(false);
    }
  };

  const handleTyping = (text: string) => {
    setMessage(text);
    setIsTyping(text.length > 0);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.inputContainer}>
        {/* Attachment Button */}
        <TouchableOpacity style={styles.attachButton}>
          <Text style={styles.attachIcon}>📎</Text>
        </TouchableOpacity>

        {/* Message Input */}
        <View style={styles.inputWrapper}>
          <PrettyInput
            label=""
            value={message}
            onChangeText={handleTyping}
            placeholder={placeholder}
            multiline
            maxLength={1000}
            containerStyle={styles.prettyInputContainer}
            style={styles.textInput}
          />
        </View>

        {/* Emoji Button */}
        <TouchableOpacity style={styles.emojiButton}>
          <Text style={styles.emojiIcon}>😊</Text>
        </TouchableOpacity>

        {/* Send Button */}
        <TouchableOpacity
          style={[
            styles.sendButton,
            isTyping ? styles.sendButtonActive : styles.sendButtonInactive,
          ]}
          onPress={handleSend}
          disabled={!isTyping}
        >
          <Text
            style={[
              styles.sendIcon,
              isTyping ? styles.sendIconActive : styles.sendIconInactive,
            ]}
          >
            ➤
          </Text>
        </TouchableOpacity>
      </View>

      {/* Typing Indicator Placeholder */}
      {false && ( // This would be connected to real typing indicators
        <View style={styles.typingContainer}>
          <Text style={styles.typingText}>
            {user?.name || group?.name} is typing...
          </Text>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: inputColors.background,
    borderTopWidth: 1,
    borderTopColor: inputColors.border,
    paddingBottom: Platform.OS === "ios" ? 20 : 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: inputColors.background,
  },
  attachButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: inputColors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    marginBottom: 4,
  },
  attachIcon: {
    fontSize: 18,
    color: inputColors.primary,
  },
  inputWrapper: {
    flex: 1,
    marginRight: 8,
  },
  prettyInputContainer: {
    marginBottom: 0,
  },
  textInput: {
    maxHeight: 100,
    minHeight: 44,
  },
  emojiButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: inputColors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    marginBottom: 4,
  },
  emojiIcon: {
    fontSize: 18,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
    shadowColor: inputColors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  sendButtonActive: {
    backgroundColor: inputColors.primary,
  },
  sendButtonInactive: {
    backgroundColor: inputColors.border,
  },
  sendIcon: {
    fontSize: 20,
    fontWeight: "bold",
  },
  sendIconActive: {
    color: inputColors.white,
  },
  sendIconInactive: {
    color: inputColors.textLight,
  },
  typingContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: inputColors.primaryLight,
  },
  typingText: {
    fontSize: 12,
    color: inputColors.textSecondary,
    fontStyle: "italic",
  },
});

export default CustomMessageInput;
