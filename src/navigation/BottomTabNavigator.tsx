import React from "react";
import {
  StyleSheet,
  Platform,
  View,
  TouchableWithoutFeedback,
  Text,
} from "react-native";
import {
  createBottomTabNavigator,
  BottomTabBarButtonProps,
} from "@react-navigation/bottom-tabs";
import { useTheme } from "@cometchat/chat-uikit-react-native";

// Simple color constants to avoid CometChat theme issues
const colors = {
  background: "#ffffff",
  primary: "#007AFF",
  secondary: "#8E8E93",
};
import { SCREEN_CONSTANTS } from "../utils/AppConstants";
import ChatFill from "../assets/icons/Chatfill";
import Chat from "../assets/icons/Chat";
import PersonFill from "../assets/icons/PersonFill";
import Person from "../assets/icons/Person";
import GroupFill from "../assets/icons/GroupFill";
import CallFill from "../assets/icons/CallFill";
import Call from "../assets/icons/Call";
import Group from "../assets/icons/Group";
import Conversations from "../components/conversations/screens/Conversations";
import Calls from "../components/calls/Calls";
import Users from "../components/users/Users";
import Groups from "../components/groups/Groups";
import { BottomTabParamList } from "./paramLists";

// Create the tab navigator.
const Tab = createBottomTabNavigator<BottomTabParamList>();

// Define a type for icon components that accept color, height, and width props.
type IconComponentType = React.ComponentType<{
  color?: string;
  height?: number;
  width?: number;
}>;

// Update the icons mapping to use the imported image components.
const icons: Record<
  string,
  { active: IconComponentType; inactive: IconComponentType }
> = {
  Chats: { active: ChatFill, inactive: Chat },
  Users: { active: PersonFill, inactive: Person },
  Calls: { active: CallFill, inactive: Call },
  Groups: { active: GroupFill, inactive: Group },
};

const CustomTabBarButton = ({ children, onPress }: BottomTabBarButtonProps) => (
  <TouchableWithoutFeedback onPress={onPress}>
    <View style={styles.tabButton}>{children}</View>
  </TouchableWithoutFeedback>
);

const BottomTabNavigator = () => {
  // Using simple colors instead of theme to avoid setTimeout issues
  // const theme = useTheme();

  return (
    <Tab.Navigator
      id={undefined}
      initialRouteName="Users"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        animation: "none",
        tabBarIcon: ({ focused }) => {
          const iconSet = icons[route.name];
          if (!iconSet) return null;

          const IconComponent = focused ? iconSet.active : iconSet.inactive;
          const iconColor = focused ? colors.primary : colors.secondary;

          return (
            <IconComponent color={iconColor as string} height={24} width={24} />
          );
        },
        tabBarShowLabel: true,
        tabBarLabel: ({ focused }) =>
          focused ? (
            <View>
              <Text style={[styles.tabLabel, { color: colors.primary }]}>
                {route.name}
              </Text>
            </View>
          ) : null,
        tabBarButton: (props) => <CustomTabBarButton {...props} />,
        tabBarBackground: () => (
          <View style={{ backgroundColor: colors.background, flex: 1 }} />
        ),
      })}
    >
      <Tab.Screen name={SCREEN_CONSTANTS.CHATS} component={Conversations} />
      <Tab.Screen name={SCREEN_CONSTANTS.CALLS} component={Calls} />
      <Tab.Screen name={SCREEN_CONSTANTS.USERS} component={Users} />
      <Tab.Screen name={SCREEN_CONSTANTS.GROUPS} component={Groups} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    height: Platform.OS === "ios" ? 60 : 70,
    paddingBottom: Platform.OS === "ios" ? 0 : 10,
    paddingTop: 15,
    borderTopWidth: 0,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  tabLabel: {
    fontSize: 12,
    marginBottom: 5,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default BottomTabNavigator;
