import React from "react";
import {
  Flex,
  Heading,
  NativeBaseProvider,
  extendTheme,
  Menu,
  useToast,
  ThreeDotsIcon,
  Box,
  Pressable,
} from "native-base";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import useStore from "./store";

import { HomeScreen } from "./src/screens/home.js";
import { MessageScreen } from "./src/screens/message.js";
import { postSMS } from "./src/utils";
import { storage } from "./storage";
import { AppRegistry } from "react-native";

AppRegistry.registerHeadlessTask(
  "ReadSms",
  () => require("./src/tasks/readSms.js").default
);

const dayjs = require("dayjs");
var relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

const Stack = createNativeStackNavigator();

// Define the config
const config = {
  useSystemColorMode: false,
  initialColorMode: "dark",
};

// extend the theme
export const theme = extendTheme({ config });

function LogoTitle(pp) {
  const selectedSms = useStore((state) => state.selectedSms);
  const setSms = useStore((state) => state.setSms);
  const toast = useToast();
  return (
    <Box
      w="full"
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
    >
      <Flex direction="row" justify="space-between">
        <Heading ml="0" w="70%" fontSize="md">
          {selectedSms?.address || "Contact"}
        </Heading>
        <Menu
          trigger={(triggerProps) => {
            return (
              <Pressable
                accessibilityLabel="More options menu"
                {...triggerProps}
                style={{
                  transform: [{ rotate: "90deg" }],
                }}
              >
                <ThreeDotsIcon />
              </Pressable>
            );
          }}
        >
          <Menu.Item
            onPress={async () => {
              const sms = await postSMS([selectedSms]);
              if (!sms?.error) {
                setSms(sms);
              }
              if (sms?.spam) {
                storage.set(sms._id.toString(), true);
                toast.show({
                  placement: "top",
                  render: () => {
                    return (
                      <Box bg="red.500" mt="4" p="4" rounded="lg" mb={5}>
                        This sms is a spam message.
                      </Box>
                    );
                  },
                });
              } else {
                toast.show({
                  placement: "top",
                  render: () => {
                    return (
                      <Box bg="emerald.500" mt="4" p="4" rounded="lg" mb={5}>
                        This sms is not a spam message.
                      </Box>
                    );
                  },
                });
              }
            }}
          >
            Check for Spam
          </Menu.Item>
        </Menu>
      </Flex>
    </Box>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <NativeBaseProvider>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: "Messages" }}
          />
          <Stack.Screen
            name="Message"
            component={MessageScreen}
            options={{ headerTitle: (props) => <LogoTitle {...props} /> }}
          />
        </Stack.Navigator>
      </NativeBaseProvider>
    </NavigationContainer>
  );
}
