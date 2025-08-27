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
import { SCREEN_CONSTANTS } from "../utils/AppConstants";
import ChatFill from "../assets/icons/Chatfill";
import Chat from "../assets/icons/Chat";
import GroupFill from "../assets/icons/GroupFill";
import Group from "../assets/icons/Group";
import PersonFill from "../assets/icons/PersonFill";
import Person from "../assets/icons/Person";
import AllInOne from "../components/all/AllInOne";
import Groups from "../components/groups/Groups";
import Profile from "../components/profile/Profile";
import { BottomTabParamList } from "./paramLists";

// Enhanced color theme for prettier UI
const colors = {
  background: "#ffffff",
  primary: "#007AFF",
  secondary: "#8E8E93",
  tabBarBackground: "#ffffff",
  shadow: "#000000",
  accent: "#5AC8FA",
};

// Create the tab navigator.
const Tab = createBottomTabNavigator<BottomTabParamList>();

// Define a type for icon components that accept color, height, and width props.
type IconComponentType = React.ComponentType<{
  color?: string;
  height?: number;
  width?: number;
}>;

// Update the icons mapping for the new tab structure
const icons: Record<
  string,
  { active: IconComponentType; inactive: IconComponentType }
> = {
  All: { active: ChatFill, inactive: Chat },
  Groups: { active: GroupFill, inactive: Group },
  Profile: { active: PersonFill, inactive: Person },
};

const CustomTabBarButton = ({ children, onPress }: BottomTabBarButtonProps) => (
  <TouchableWithoutFeedback onPress={onPress}>
    <View style={styles.tabButton}>{children}</View>
  </TouchableWithoutFeedback>
);

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      id={undefined}
      initialRouteName="All"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        animation: "shift",
        tabBarHideOnKeyboard: true,
        tabBarIcon: ({ focused }) => {
          const iconSet = icons[route.name];
          if (!iconSet) return null;

          const IconComponent = focused ? iconSet.active : iconSet.inactive;
          const iconColor = focused ? colors.primary : colors.secondary;

          return (
            <View
              style={[
                styles.iconContainer,
                focused && styles.focusedIconContainer,
              ]}
            >
              <IconComponent
                color={iconColor as string}
                height={26}
                width={26}
              />
            </View>
          );
        },
        tabBarShowLabel: true,
        tabBarLabel: ({ focused }) => (
          <Text
            style={[
              styles.tabLabel,
              { color: focused ? colors.primary : colors.secondary },
            ]}
          >
            {route.name}
          </Text>
        ),
        tabBarButton: (props) => <CustomTabBarButton {...props} />,
        tabBarBackground: () => <View style={styles.tabBarBackground} />,
      })}
    >
      <Tab.Screen
        name="All"
        component={AllInOne}
        options={{
          tabBarLabel: "All",
        }}
      />
      <Tab.Screen
        name={SCREEN_CONSTANTS.GROUPS}
        component={Groups}
        options={{
          tabBarLabel: "Groups",
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: "Profile",
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    height: Platform.OS === "ios" ? 90 : 80,
    paddingBottom: Platform.OS === "ios" ? 30 : 20,
    paddingTop: 12,
    paddingHorizontal: 16, // Reduced padding for 3 tabs
    borderTopWidth: 0,
    backgroundColor: colors.tabBarBackground,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    position: "absolute",
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: -6,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 15,
  },
  tabBarBackground: {
    backgroundColor: colors.tabBarBackground,
    flex: 1,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  tabLabel: {
    fontSize: 12, // Slightly smaller for 3 tabs
    fontWeight: "600",
    marginTop: 6,
    textAlign: "center",
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 16,
    marginHorizontal: 4, // Reduced margin for 3 tabs
  },
  iconContainer: {
    padding: 8, // Slightly smaller padding
    borderRadius: 16,
    backgroundColor: "transparent",
    marginBottom: 2,
  },
  focusedIconContainer: {
    backgroundColor: colors.accent + "20", // 20% opacity
    transform: [{ scale: 1.1 }],
  },
});

export default BottomTabNavigator;
