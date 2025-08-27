import React, { useEffect, useRef, useState } from "react";
import {
  TouchableOpacity,
  View,
  StyleSheet,
  Text,
  BackHandler,
  Platform,
  StatusBar,
} from "react-native";
import {
  CometChatUIKit,
  CometChatMessageHeader,
  CometChatMessageList,
  CometChatMessageComposer,
  useTheme,
  CometChatUIEventHandler,
  CometChatUIEvents,
  localize,
} from "@cometchat/chat-uikit-react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { Icon } from "@cometchat/chat-uikit-react-native";
import { CometChat } from "@cometchat/chat-sdk-react-native";
import InfoIcon from "../../../assets/icons/InfoIcon";
import { CommonUtils } from "../../../utils/CommonUtils";
import Info from "../../../assets/icons/Info";
import { ChatStackParamList } from "../../../navigation/paramLists";

// Enhanced color theme with primary color #667eea
const customColors = {
  primary: "#667eea",
  primaryLight: "rgba(102, 126, 234, 0.1)",
  background: "#f8f9fc",
  white: "#ffffff",
  textPrimary: "#2d3748",
  textSecondary: "#718096",
  border: "#e2e8f0",
  shadow: "rgba(102, 126, 234, 0.15)",
};

type Props = StackScreenProps<ChatStackParamList, "Messages">;

const Messages: React.FC<Props> = ({ route, navigation }) => {
  const { user, group } = route.params;
  const loggedInUser = useRef<CometChat.User>(
    CometChatUIKit.loggedInUser!
  ).current;
  const theme = useTheme();
  const userListenerId = "app_messages" + new Date().getTime();
  const openmessageListenerId = "message_" + new Date().getTime();
  const [localUser, setLocalUser] = useState<CometChat.User | undefined>(user);

  useEffect(() => {
    const backAction = () => {
      navigation.popToTop();
      return true;
    };
    // Add event listener for hardware back press
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, [navigation]);

  useEffect(() => {
    CometChatUIEventHandler.addUserListener(userListenerId, {
      ccUserBlocked: (item: { user: CometChat.User }) =>
        handleccUserBlocked(item),
      ccUserUnBlocked: (item: { user: CometChat.User }) =>
        handleccUserUnBlocked(item),
    });

    CometChatUIEventHandler.addUIListener(openmessageListenerId, {
      openChat: ({ user }) => {
        if (user != undefined) {
          navigation.push("Messages", {
            user,
          });
        }
      },
    });

    return () => {
      CometChatUIEventHandler.removeUserListener(userListenerId);
      CometChatUIEventHandler.removeUIListener(openmessageListenerId);
    };
  }, [localUser]);

  const handleccUserBlocked = ({ user }: { user: CometChat.User }) => {
    setLocalUser(CommonUtils.clone(user));
  };

  const handleccUserUnBlocked = ({ user }: { user: CometChat.User }) => {
    setLocalUser(CommonUtils.clone(user));
  };

  const unblock = async (userToUnblock: CometChat.User) => {
    let uid = userToUnblock.getUid();
    try {
      const response = await CometChat.unblockUsers([uid]);
      const unBlockedUser = await CometChat.getUser(uid);
      if (response) {
        setLocalUser(unBlockedUser);

        // Optionally emit an event or let the server call do the job
        CometChatUIEventHandler.emitUserEvent(
          CometChatUIEvents.ccUserUnBlocked,
          {
            user: unBlockedUser,
          }
        );
      }
    } catch (error) {
      console.error("Error unblocking user:", error);
    }
  };

  // Define app bar options
  const getTrailingView = ({
    user,
    group,
  }: {
    user?: CometChat.User;
    group?: CometChat.Group;
  }) => {
    if (group) {
      if (!loggedInUser) {
        return <></>;
      }
      return (
        <View style={styles.appBarContainer}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("GroupInfo", {
                group: group,
              });
            }}
          >
            <Icon
              icon={
                <Info color={theme.color.iconPrimary} height={24} width={24} />
              }
            />
          </TouchableOpacity>
        </View>
      );
    }

    if (user && !user.getBlockedByMe()) {
      return (
        <View style={styles.appBarContainer}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("UserInfo", {
                user: user,
              });
            }}
          >
            <Icon
              icon={
                <InfoIcon
                  color={theme.color.iconPrimary}
                  height={24}
                  width={24}
                />
              }
            />
          </TouchableOpacity>
        </View>
      );
    } else {
      return <></>;
    }
  };

  return (
    <View
      style={[styles.flexOne, { backgroundColor: customColors.background }]}
    >
      <StatusBar
        backgroundColor={customColors.primary}
        barStyle="light-content"
        translucent={false}
      />

      <CometChatMessageHeader
        user={localUser}
        group={group}
        onBack={() => {
          navigation.popToTop();
        }}
        TrailingView={getTrailingView}
        showBackButton={true}
      />

      <View
        style={[styles.flexOne, { backgroundColor: customColors.background }]}
      >
        <CometChatMessageList
          user={user}
          group={group}
          onThreadRepliesPress={(msg: CometChat.BaseMessage, view: any) => {
            navigation.navigate("ThreadView", {
              message: msg,
              user: user,
              group: group,
            });
          }}
        />
      </View>

      {localUser?.getBlockedByMe() ? (
        <View
          style={[
            styles.blockedContainer,
            {
              backgroundColor: customColors.white,
              borderTopWidth: 1,
              borderTopColor: customColors.border,
            },
          ]}
        >
          <Text
            style={[
              theme.typography.button.regular,
              {
                color: customColors.textSecondary,
                textAlign: "center",
                paddingBottom: 10,
                fontSize: 14,
              },
            ]}
          >
            {localize("BLOCKED_USER_DESC")}
          </Text>
          <TouchableOpacity
            onPress={() => unblock(localUser)}
            style={[
              styles.button,
              {
                borderColor: customColors.primary,
                backgroundColor: customColors.primaryLight,
              },
            ]}
          >
            <Text
              style={[
                theme.typography.button.medium,
                styles.buttontext,
                {
                  color: customColors.primary,
                  fontWeight: "600",
                },
              ]}
            >
              {localize("UNBLOCK")}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View
          style={{
            backgroundColor: customColors.white,
            borderTopWidth: 1,
            borderTopColor: customColors.border,
            paddingBottom: Platform.OS === "ios" ? 20 : 0,
          }}
        >
          <CometChatMessageComposer
            user={localUser}
            group={group}
            keyboardAvoidingViewProps={{
              ...(Platform.OS === "android"
                ? {}
                : {
                    behavior: "padding",
                  }),
            }}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  flexOne: {
    flex: 1,
  },
  blockedContainer: {
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 16,
    shadowColor: customColors.shadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    justifyContent: "center",
    borderWidth: 2,
    width: "90%",
    borderRadius: 12,
    paddingVertical: 12,
    shadowColor: customColors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  buttontext: {
    paddingVertical: 5,
    textAlign: "center",
    alignContent: "center",
    fontSize: 16,
  },
  appBarContainer: {
    flexDirection: "row",
    marginLeft: 16,
  },
});

export default Messages;
