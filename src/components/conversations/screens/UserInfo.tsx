import React, { useState, useEffect, useRef, FC } from "react";
import { View, Text, TouchableOpacity, BackHandler } from "react-native";
import {
  CometChatAvatar,
  useTheme,
  CometChatUIEventHandler,
  CallUIEvents,
  localize,
  CometChatConversationEvents,
  CometChatConfirmDialog,
  CometChatOutgoingCall,
} from "@cometchat/chat-uikit-react-native";
import { Icon } from "@cometchat/chat-uikit-react-native";
import { CometChat } from "@cometchat/chat-sdk-react-native";
import { permissionUtil } from "@cometchat/chat-uikit-react-native/src/shared/utils/PermissionUtil";
import { CallTypeConstants } from "@cometchat/chat-uikit-react-native/src/shared/constants/UIKitConstants";
import { blockUser, getLastSeenTime, unblock } from "../../../utils/helper";
import { styles } from "./UserInfoStyles";
import ArrowBack from "../../../assets/icons/ArrowBack";
import Block from "../../../assets/icons/Block";
import Delete from "../../../assets/icons/Delete";
import Videocam from "../../../assets/icons/VideoCam";
import Call from "../../../assets/icons/Call";
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";
import { useFocusEffect } from "@react-navigation/native";
import {
  ChatStackParamList,
  UserStackParamList,
} from "../../../navigation/paramLists";

type ScreenProps = StackScreenProps<ChatStackParamList, "UserInfo">;
type NavigationProps = StackNavigationProp<UserStackParamList, "UserInfo">;
type Props = ScreenProps & { navigation: NavigationProps };

const UserInfo: FC<Props> = ({ route, navigation }) => {
  const { user } = route.params;
  const theme = useTheme();
  const [userObj, setUserObj] = useState<CometChat.User>(user);
  /** STATES **/
  const [disableButton, setDisableButton] = useState<boolean>(false);
  const [blocked, setBlocked] = useState<boolean>(false);

  // separate modal states
  const [isBlockModalOpen, setBlockModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  const [userStatus, setUserStatus] = useState(userObj.getStatus());
  const listenerId = useRef<string>("CallListener_" + Date.now());
  const userStatusListenerId = "user_status_" + new Date().getTime();

  const [callObj, setCallObj] = useState<CometChat.Call>();

  const callType = useRef<string | undefined>(undefined);

  useEffect(() => {
    setUserStatus(userObj.getStatus());
    setBlocked(userObj.getBlockedByMe());

    CometChat.addCallListener(
      listenerId.current,
      new CometChat.CallListener({
        onIncomingCallReceived: () => {
          setDisableButton(true);
        },
        onOutgoingCallAccepted: () => {
          console.log("call accepted");
        },
        onOutgoingCallRejected: () => {
          setDisableButton(false);
          setCallObj(undefined);
        },
        onIncomingCallCancelled: () => {
          setDisableButton(false);
        },
      })
    );
    CometChatUIEventHandler.addCallListener(listenerId.current, {
      ccCallRejected: () => {
        setDisableButton(false);
        setCallObj(undefined);
      },
      ccCallEnded: () => {
        setDisableButton(false);
        setCallObj(undefined);
      },
    });

    CometChat.addUserListener(
      userStatusListenerId,
      new CometChat.UserListener({
        onUserOnline: (onlineUser: CometChat.User) => {
          if (onlineUser.getUid() === userObj.getUid()) {
            setUserStatus(onlineUser.getStatus());
          }
        },
        onUserOffline: (offlineUser: CometChat.User) => {
          if (offlineUser.getUid() === userObj.getUid()) {
            setUserStatus(offlineUser.getStatus());
          }
        },
      })
    );

    return () => {
      CometChat.removeCallListener(listenerId.current);
      CometChatUIEventHandler.removeCallListener(listenerId.current);
      CometChat.removeUserListener(userStatusListenerId);
    };
  }, [userObj]);

  const translations = {
    lastSeen: "Last seen",
    minutesAgo: (minutes: number) =>
      `${minutes} minute${minutes === 1 ? "" : "s"} ago`,
    hoursAgo: (hours: number) => `${hours} hour${hours === 1 ? "" : "s"} ago`,
  };

  const makeVoiceCall = async (): Promise<void> => {
    if (disableButton) return;
    if (!(await permissionUtil.startResourceBasedTask(["mic"]))) return;
    callType.current = CallTypeConstants.audio;
    makeCall(CallTypeConstants.audio);
  };

  const makeVideoCall = async (): Promise<void> => {
    if (disableButton) return;
    if (!(await permissionUtil.startResourceBasedTask(["mic", "camera"])))
      return;
    callType.current = CallTypeConstants.video;
    makeCall(CallTypeConstants.video);
  };

  const makeCall = (type: string): void => {
    if (type === CallTypeConstants.audio || type === CallTypeConstants.video) {
      const receiverID = userObj.getUid();
      const callTypeValue = type;
      const receiverType = CometChat.RECEIVER_TYPE.USER;
      if (!receiverID || !receiverType) return;

      const call = new CometChat.Call(
        receiverID,
        callTypeValue,
        receiverType,
        CometChat.CATEGORY_CALL
      );

      CometChat.initiateCall(call).then(
        (initiatedCall) => {
          setCallObj(initiatedCall);
          setDisableButton(true);
          CometChatUIEventHandler.emitCallEvent(CallUIEvents.ccOutgoingCall, {
            call: initiatedCall,
          });
        },
        (error) => {
          console.log("Call initialization failed with exception:", error);
          CometChatUIEventHandler.emitCallEvent(CallUIEvents.ccCallFailed, {
            call,
          });
        }
      );
    }
  };

  /** BLOCK/UNBLOCK LOGIC **/
  const handleBlockUnblockConfirm = () => {
    setBlockModalOpen(false); // close the dialog
    if (blocked) {
      // user is already blocked by me -> now unblocking
      unblock(userObj.getUid(), userObj, setBlocked, setUserObj);
    } else {
      // user is not blocked -> blocking user
      blockUser(userObj.getUid(), userObj, setBlocked);
    }
  };

  /** DELETE CONVERSATION LOGIC **/
  const handleDeleteConversationConfirm = () => {
    setDeleteModalOpen(false); // close the dialog
    if (userObj) {
      CometChat.getConversation(userObj.getUid(), "user")
        .then((conversation) => {
          CometChat.deleteConversation(userObj.getUid(), "user")
            .then((deletedConversation) => {
              console.log(deletedConversation);
              CometChatUIEventHandler.emitConversationEvent(
                CometChatConversationEvents.ccConversationDeleted,
                { conversation: conversation }
              );
              navigation.pop(2);
            })
            .catch((error) => {
              console.log("Error while deleting conversation:", error);
            });
        })
        .catch((error) => {
          console.log("Error while deleting conversation:", error);
        });
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        // Navigate back to message screen (same as your onPress handler)
        navigation.goBack();
        return true; // Prevent default back behavior
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => subscription.remove();
    }, [navigation])
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.color.background1 }}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButtonContainer}
          onPress={() => navigation.goBack()}
        >
          <Icon
            icon={
              <ArrowBack
                color={theme.color.iconPrimary}
                height={24}
                width={24}
              />
            }
          />
        </TouchableOpacity>
        <Text
          style={[
            theme.typography.heading1.bold,
            styles.smallPaddingLeft,
            { color: theme.color.textPrimary },
          ]}
        >
          {localize("USER_INFO")}
        </Text>
      </View>

      {/* User Information Section */}
      <View
        style={[styles.profileCard, { borderColor: theme.color.borderLight }]}
      >
        <View style={styles.profileInfo}>
          <CometChatAvatar
            style={{
              containerStyle: styles.avatarContainer,
              textStyle: styles.avatarText,
              imageStyle: styles.avatarImage,
            }}
            image={
              userObj?.getAvatar() ? { uri: userObj.getAvatar() } : undefined
            }
            name={userObj?.getName() ?? ""}
          />
          <Text
            style={[
              theme.typography.heading3.medium,
              styles.mt10Centered,
              { color: theme.color.textPrimary },
            ]}
          >
            {userObj?.getName()}
          </Text>
          <Text
            style={[
              theme.typography.caption1.medium,
              styles.mt5Centered,
              { color: theme.color.textSecondary },
            ]}
          >
            {userObj &&
              !(userObj.getBlockedByMe() || userObj.getHasBlockedMe()) &&
              (userStatus === "online"
                ? "Online"
                : getLastSeenTime(userObj.getLastActiveAt(), translations))}
          </Text>
        </View>

        {/* Action Boxes */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[
              styles.callActionButton,
              { borderColor: theme.color.borderDefault },
            ]}
            onPress={makeVoiceCall}
          >
            <Icon
              icon={<Call color={theme.color.primary} height={24} width={24} />}
            />
            <Text
              style={[
                theme.typography.caption1.regular,
                styles.mt5Centered,
                { color: theme.color.textSecondary },
              ]}
            >
              {localize("VOICE")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.callActionButton,
              { borderColor: theme.color.borderDefault },
            ]}
            onPress={makeVideoCall}
          >
            <Icon
              icon={
                <Videocam color={theme.color.primary} height={24} width={24} />
              }
            />
            <Text
              style={[
                theme.typography.caption1.regular,
                styles.mt5Centered,
                { color: theme.color.textSecondary },
              ]}
            >
              {localize("MESSAGE_VIDEO")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Block/Unblock and Delete Chat Buttons */}
      <View style={styles.optionsContainer}>
        <View style={styles.optionRow}>
          <TouchableOpacity
            onPress={() => setBlockModalOpen(true)}
            style={styles.backButtonContainer}
          >
            <Icon
              icon={<Block color={theme.color.error} height={24} width={24} />}
            />
            <Text
              style={[
                theme.typography.heading4.regular,
                styles.ml5,
                { color: theme.color.error },
              ]}
            >
              {blocked ? localize("UNBLOCK") : localize("BLOCK")}
            </Text>
          </TouchableOpacity>
        </View>

        {/* DELETE CHAT */}
        <View style={styles.optionRow}>
          <TouchableOpacity
            onPress={() => setDeleteModalOpen(true)}
            style={styles.backButtonContainer}
          >
            <Icon
              icon={<Delete color={theme.color.error} height={24} width={24} />}
            />
            <Text
              style={[
                theme.typography.heading4.regular,
                styles.ml5,
                { color: theme.color.error },
              ]}
            >
              {localize("DELETE_CHAT_TEXT")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* =============== BLOCK/UNBLOCK MODAL =============== */}
      <CometChatConfirmDialog
        isOpen={isBlockModalOpen}
        onCancel={() => setBlockModalOpen(false)}
        onConfirm={handleBlockUnblockConfirm}
        onDismiss={() => console.log("Block/Unblock Modal dismissed")}
        titleText={
          blocked ? localize("UNBLOCK_CONTACT") : localize("BLOCK_USER")
        }
        messageText={
          blocked ? localize("UNBLOCK_SURE") : localize("BLOCK_SURE")
        }
        cancelButtonText={localize("CANCEL")}
        confirmButtonText={blocked ? localize("UNBLOCK") : localize("BLOCK")}
        icon={<Block color={theme.color.error} height={45} width={45} />}
      />

      {/* =============== DELETE CHAT MODAL =============== */}
      <CometChatConfirmDialog
        isOpen={isDeleteModalOpen}
        onCancel={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConversationConfirm}
        onDismiss={() => console.log("Delete Modal dismissed")}
        titleText={localize("DELETE_CHAT")}
        messageText={localize("SURE_TO_DELETE_CHAT")}
        cancelButtonText={localize("CANCEL")}
        confirmButtonText={localize("DELETE")}
        icon={<Delete color={theme.color.error} height={45} width={45} />}
      />

      {callObj && (
        <CometChatOutgoingCall
          call={callObj}
          onEndCallButtonPressed={(call) => {
            CometChat.rejectCall(
              call?.getSessionId(),
              CometChat.CALL_STATUS.CANCELLED
            ).then(
              (rejectedCall) => {
                console.log("🚀 ~ rejectedCall:", rejectedCall);
                CometChatUIEventHandler.emitCallEvent(
                  CallUIEvents.ccCallRejected,
                  {
                    call: rejectedCall,
                  }
                );
                setCallObj(undefined);
              },
              (err) => {
                console.log("🚀 ~ err:", err);
                setCallObj(undefined);
                // onError && onError(err);
              }
            );
          }}
        />
      )}
    </View>
  );
};

export default UserInfo;
