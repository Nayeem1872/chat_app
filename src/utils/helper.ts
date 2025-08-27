import { CometChat } from "@cometchat/chat-sdk-react-native";
import Ironman from "../assets/icons/ironman.png";
import Captainamerica from "../assets/icons/captainamerica.png";
import Wolverine from "../assets/icons/wolverine.png";
import Spiderman from "../assets/icons/spiderman.png";
import Cyclops from "../assets/icons/cyclops.png";
import {
  CometChatUIEventHandler,
  CometChatUIEvents,
  CometChatUIKit,
} from "@cometchat/chat-uikit-react-native";

interface Translations {
  lastSeen: string;
  minutesAgo: (minutes: number) => string;
  hoursAgo: (hours: number) => string;
}

/**
 * getLastSeenTime UserInfoSection.
 */
export function getLastSeenTime(
  timestamp: number | null,
  translations: Translations
): string {
  if (timestamp === null) {
    return `${translations.lastSeen} Unknown`;
  }

  // If timestamp is in seconds (length = 10), convert to milliseconds.
  if (String(timestamp).length === 10) {
    timestamp *= 1000;
  }

  const now = new Date();
  const lastSeen = new Date(timestamp);

  // Calculate the time differences
  const diffInMillis = now.getTime() - lastSeen.getTime();
  const diffInMinutes = Math.floor(diffInMillis / (1000 * 60));
  const diffInHours = Math.floor(diffInMillis / (1000 * 60 * 60));

  // Check if within last hour
  if (diffInMinutes === 0) {
    return `${translations.lastSeen} ${translations.minutesAgo(1)}`;
  } else if (diffInMinutes < 60) {
    return `${translations.lastSeen} ${translations.minutesAgo(diffInMinutes)}`;
  }

  // Check if within the last 24 hours
  if (diffInHours < 24) {
    return `${translations.lastSeen} ${translations.hoursAgo(diffInHours)}`;
  }

  // Determine if timestamp is within the current year
  const isSameYear = lastSeen.getFullYear() === now.getFullYear();

  // Options for date formatting
  const dateOptions: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    ...(isSameYear ? {} : { year: "numeric" }),
  };

  // Options for time formatting
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  const formattedDate = lastSeen.toLocaleDateString(undefined, dateOptions);
  const formattedTime = lastSeen.toLocaleTimeString(undefined, timeOptions);
  if (formattedDate === "Invalid Date" || formattedTime === "Invalid Date") {
    return `Offline`;
  }

  return `${translations.lastSeen} ${formattedDate} at ${formattedTime}`;
}

/**
 * UNBLOCK
 */
export const unblock = async (
  uid: string,
  user: CometChat.User,
  setBlocked: React.Dispatch<React.SetStateAction<boolean>>,
  setUserObj: React.Dispatch<React.SetStateAction<CometChat.User>>
): Promise<void> => {
  try {
    const response = await CometChat.unblockUsers([uid]);
    const unBlockedUser = await CometChat.getUser(uid);
    if (response) {
      CometChatUIEventHandler.emitUserEvent(CometChatUIEvents.ccUserUnBlocked, {
        user: unBlockedUser,
      });
      setBlocked(false);
      setUserObj(unBlockedUser);
    } else {
      console.log(
        `Failed to unblock user with UID ${uid}. Response:`,
        response
      );
    }
  } catch (error) {
    console.error("Error unblocking user:", error);
  }
};

/**
 * BLOCK
 */
export const blockUser = async (
  uid: string,
  user: CometChat.User,
  setBlocked: React.Dispatch<React.SetStateAction<boolean>>
): Promise<void> => {
  try {
    const response = await CometChat.blockUsers([uid]);
    if (response) {
      user.setBlockedByMe(true);
      setBlocked(true);
      CometChatUIEventHandler.emitUserEvent(CometChatUIEvents.ccUserBlocked, {
        user,
      });
    } else {
      console.log(`Failed to block user with UID ${uid}. Response:`, response);
    }
  } catch (error) {
    console.error("Error blocking user:", error);
  }
};

/**
 * LEAVE GROUP
 */
export const leaveGroup = (
  group: CometChat.Group,
  navigation: any,
  pop: number
) => {
  if (group) {
    const groupID = group.getGuid();
    CometChat.leaveGroup(groupID).then(
      () => {
        let actionMessage: CometChat.Action = new CometChat.Action(
          groupID,
          CometChat.MESSAGE_TYPE.TEXT,
          CometChat.RECEIVER_TYPE.GROUP,
          CometChat.CATEGORY_ACTION as CometChat.MessageCategory
        );
        actionMessage.setMessage(
          `${CometChatUIKit.loggedInUser!.getName()} has left`
        );
        CometChatUIEventHandler.emitGroupEvent(CometChatUIEvents.ccGroupLeft, {
          message: actionMessage, //Note: Add Action message after discussion
          leftUser: CometChatUIKit.loggedInUser,
          leftGroup: group,
        });
        navigation.pop(pop);
      },
      (error) => {
        console.log("Group leaving failed:", error);
      }
    );
  } else {
    console.log("Group is not defined");
  }
};

/**
 * Sample Users Data
 */
export const sampleData = {
  users: [
    { uid: "superhero1", name: "Iron Man", avatar: Ironman },
    { uid: "superhero2", name: "Captain America", avatar: Captainamerica },
    { uid: "superhero3", name: "Spiderman", avatar: Spiderman },
    { uid: "superhero4", name: "Wolverine", avatar: Wolverine },
    { uid: "superhero5", name: "Cyclops", avatar: Cyclops },
  ],
};
