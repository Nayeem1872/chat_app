import React, { useState } from "react";
import { CometChatThemeProvider } from "@cometchat/chat-uikit-react-native";
import RootStackNavigator from "./src/navigation/RootStackNavigator";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const App = (): React.ReactElement => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasValidAppCredentials, setHasValidAppCredentials] = useState(false);

  return (
    <SafeAreaProvider>
      <SafeAreaView edges={["top", "bottom"]} style={{ flex: 1 }}>
        <CometChatThemeProvider>
          <RootStackNavigator
            isLoggedIn={isLoggedIn}
            hasValidAppCredentials={hasValidAppCredentials}
          />
        </CometChatThemeProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default App;
