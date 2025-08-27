import React, {
  JSX,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  View,
  TouchableOpacity,
  Text,
  TextStyle,
  ViewStyle,
} from "react-native";
import { CometChat } from "@cometchat/chat-sdk-react-native";
import {
  CometChatListItem,
  localize,
  useTheme,
} from "@cometchat/chat-uikit-react-native";
import { CallHistory } from "./CallHistory";
import { CallLogDetailHeader } from "./CallLogDetailHeader";
import { Icon } from "@cometchat/chat-uikit-react-native";
import { CallParticipants } from "./CallParticipants";
import { CallDetailHelper, CallStatus } from "./CallDetailHelper";
import { CallRecordings } from "./CallRecordings";
import { StackScreenProps } from "@react-navigation/stack";
import { ICONS } from "@cometchat/chat-uikit-react-native/src/shared/icons/icon-mapping";
import { CallStackParamList } from "../../navigation/paramLists";

const listenerId = "userListener_" + new Date().getTime();
const TABS = {
  DETAILS: "Details",
  PARTICIPANTS: "Participants",
  RECORDINGS: "Recordings",
  HISTORY: "History",
};

type Props = StackScreenProps<CallStackParamList, "CallDetails">;

export const CallDetails: React.FC<Props> = ({ route, navigation }) => {
  const { call } = route.params;

  const theme = useTheme();
  const [group, setGroup] = useState<CometChat.Group | null>(null);
  const [user, setUser] = useState<CometChat.User | null>(null);
  const loggedInUser = useRef<CometChat.User | any>(null);
  const [selectedTab, setSelectedTab] = useState(TABS.PARTICIPANTS);
  const [tabStyle, setTableStyle] = useState<{
    containerStyle: ViewStyle;
    itemStyle: ViewStyle;
    selectedItemStyle: ViewStyle;
    itemEmojiStyle: TextStyle;
    selectedItemEmojiStyle: TextStyle;
    itemTextStyle: TextStyle;
    selectedItemTextStyle: TextStyle;
  }>();
  const BackIcon = ICONS["arrow-back"];

  useEffect(() => {
    console.log("CALL RECEIVER: ", call);
    CometChat.getLoggedinUser().then((loggedUser: CometChat.User | any) => {
      loggedInUser.current = loggedUser;
      let user =
        call?.getReceiverType() == "user"
          ? loggedInUser.current?.getUid() === call?.getInitiator()?.getUid()
            ? call.getReceiver()
            : call?.getInitiator()
          : undefined;
      let group =
        call?.getReceiverType() == "group"
          ? loggedInUser.current?.getUid() === call?.getInitiator()?.getUid()
            ? call.getReceiver()
            : call?.getInitiator()
          : undefined;
      if (user) {
        CometChat.getUser(user.getUid()).then((userObject: CometChat.User) => {
          setUser(userObject);
        });
        return;
      }

      CometChat.getGroup(group.getGuid()).then(
        (groupObject: CometChat.Group) => {
          setGroup(groupObject);
        }
      );
    });
  }, [call]);

  useEffect(() => {
    CometChat.addUserListener(
      listenerId,
      new CometChat.UserListener({
        onUserOnline: (userDetails: any) => {
          if (user?.getUid() === userDetails?.getUid()) {
            setUser(userDetails);
          }
        },
        onUserOffline: (userDetails: any) => {
          if (user?.getUid() === userDetails?.getUid()) {
            setUser(userDetails);
          }
        },
      })
    );
    return () => {
      CometChat.removeUserListener(listenerId);
    };
  }, [user]);

  useEffect(() => {
    setTableStyle({
      containerStyle: {
        backgroundColor: theme.color.background1,
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        borderBottomWidth: 1,
        borderColor: theme.color.borderDefault,
        justifyContent: "space-evenly",
      },
      itemStyle: {
        paddingVertical: theme.spacing.padding.p2,
        flexDirection: "row",
        borderBottomWidth: theme.spacing.spacing.s0_5,
        borderBottomColor: "transparent",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
      },
      selectedItemStyle: {
        paddingVertical: theme.spacing.padding.p2,
        flexDirection: "row",
        borderBottomWidth: theme.spacing.spacing.s0_5,
        borderBottomColor: theme.color.primary,
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
      },
      itemEmojiStyle: {
        color: theme.color.textSecondary,
        borderColor: "transparent",
        ...theme.typography.body.medium,
      },
      selectedItemEmojiStyle: {
        color: theme.color.textSecondary,
        borderColor: "transparent",
        ...theme.typography.body.medium,
      },
      itemTextStyle: {
        color: theme.color.textSecondary,
        marginLeft: theme.spacing.margin.m1,
        ...theme.typography.body.medium,
      },
      selectedItemTextStyle: {
        color: theme.color.primary,
        marginLeft: theme.spacing.margin.m1,
        ...theme.typography.body.medium,
      },
    });
  }, [theme]);

  const getUserToFetchHistory = useCallback(() => {
    if (call?.getInitiator().getUid() === loggedInUser.current.getUid()) {
      return call?.getReceiver();
    }
    call?.getInitiator();
  }, [call]);

  const convertMinutesToTime = useCallback((decimalMinutes: number) => {
    const totalSeconds = Math.round(decimalMinutes * 60); // Convert to seconds
    const minutes = Math.floor(totalSeconds / 60); // Get whole minutes
    const seconds = totalSeconds % 60; // Get remaining seconds

    return `${minutes} min  ${seconds} sec`;
  }, []);

  const callTypeAndStatus = useMemo(
    (): {
      type: "incoming" | "outgoing";
      callStatus: CallStatus;
    } => CallDetailHelper.getCallType(call),
    [call]
  );

  const _style = useMemo(() => {
    return {
      headerContainerStyle: {
        alignItems: "flex-start",
        justifyContent: "center",
        width: "100%",
        borderRadius: 0,
        paddingHorizontal: 0,
      },
      titleSeparatorStyle: {
        borderBottomWidth: 1,
        borderBottomColor: theme.color.borderLight,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
      },
      containerStyle: {
        backgroundColor: theme.color.background2,
        flex: 1,
      },
      itemStyle: {
        containerStyle: {
          flexDirection: "row" as const,
          paddingRight: theme.spacing.padding.p4,
          paddingLeft: theme.spacing.padding.p2,
          paddingVertical: theme.spacing.padding.p2,
          gap: theme.spacing.spacing.s3,
          flex: 1,
        },
        titleStyle: {
          color: theme.color.textPrimary,
          ...theme.typography.heading4.bold,
        },
        subtitleStyle: {
          color: theme.color.textSecondary,
          ...theme.typography.caption1.regular,
        },
        tailViewTextStyle: {
          color: theme.color.textPrimary,
          ...theme.typography.caption1.bold,
        },
        avatarStyle: {
          containerStyle: {},
          textStyle: {},
          imageStyle: {
            height: 48,
            width: 48,
          },
        },
      },
    };
  }, [theme]);

  const getFormattedInitiatedAt = useCallback(() => {
    return CallDetailHelper.getFormattedInitiatedAt(call);
  }, []);

  const callStatusDisplayString = useMemo(() => {
    return CallDetailHelper.getCallStatusDisplayText(
      callTypeAndStatus.callStatus
    );
  }, [callTypeAndStatus]);

  const CallStatusIcon = useMemo<JSX.Element | undefined>(
    () =>
      CallDetailHelper.getCallStatusDisplayIcon(
        callTypeAndStatus.callStatus,
        theme
      ),
    [callTypeAndStatus, theme]
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.color.background1 }}>
      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            gap: theme.spacing.padding.p2,
            paddingVertical: theme.spacing.padding.p2,
            paddingHorizontal: theme.spacing.padding.p5,
            minHeight: 64,
          }}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon
              imageStyle={{
                height: 24,
                width: 24,
                tintColor: theme.color.iconPrimary,
              }}
              icon={
                <BackIcon
                  height={24}
                  width={24}
                  color={theme.color.iconPrimary}
                ></BackIcon>
              }
            />
          </TouchableOpacity>
          <Text
            style={{
              color: theme.color.textPrimary,
              ...theme.typography.heading1.bold,
            }}
          >
            {localize("CALL_DETAILS")}
          </Text>
        </View>

        {(user || group) && (
          <View style={{ flexDirection: "column" }}>
            <CallLogDetailHeader
              {...(user && { user })}
              {...(group && { group })}
            ></CallLogDetailHeader>
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                alignItems: "center",
                backgroundColor: theme.color.background2,
              }}
            >
              <Icon
                icon={CallStatusIcon}
                containerStyle={{ marginLeft: theme.spacing.margin.m4 }}
              ></Icon>
              <CometChatListItem
                id={call.sessionId}
                avatarStyle={_style.itemStyle.avatarStyle}
                containerStyle={_style.itemStyle.containerStyle}
                headViewContainerStyle={{ flexDirection: "row" }}
                titleStyle={_style.itemStyle.titleStyle}
                title={callStatusDisplayString}
                trailingViewContainerStyle={{
                  alignSelf: "center",
                }}
                SubtitleView={
                  <Text style={_style.itemStyle.subtitleStyle}>
                    {getFormattedInitiatedAt()}
                  </Text>
                }
                TrailingView={
                  <Text style={_style.itemStyle.tailViewTextStyle}>
                    {convertMinutesToTime(call.getTotalDurationInMinutes())}
                  </Text>
                }
              />
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                width: "100%",
                borderBottomWidth: 1,
                borderColor: theme.color.borderDefault,
                justifyContent: "space-evenly",
                paddingHorizontal: 0,
              }}
            >
              {["Participants", "Recordings", "History"].map(
                (tabTitle, index) => (
                  <TouchableOpacity
                    key={index}
                    style={
                      selectedTab === tabTitle
                        ? tabStyle!.selectedItemStyle
                        : tabStyle!.itemStyle
                    }
                    onPress={() => setSelectedTab(tabTitle)}
                  >
                    <Text
                      style={
                        selectedTab === tabTitle
                          ? tabStyle!.selectedItemTextStyle
                          : tabStyle!.itemTextStyle
                      }
                    >
                      {tabTitle}
                    </Text>
                  </TouchableOpacity>
                )
              )}
            </View>
            {selectedTab === TABS.PARTICIPANTS && (
              <CallParticipants
                call={call}
                data={call?.getParticipants()}
              ></CallParticipants>
            )}
            {selectedTab === TABS.HISTORY && (
              <CallHistory user={getUserToFetchHistory()}></CallHistory>
            )}
            {selectedTab === TABS.RECORDINGS &&
              call.getRecordings()?.length && (
                <CallRecordings call={call}></CallRecordings>
              )}
          </View>
        )}
      </View>
    </View>
  );
};
