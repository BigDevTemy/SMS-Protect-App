import React, { useEffect } from "react";
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
import { AppRegistry, PermissionsAndroid } from "react-native";
import Contacts from "react-native-contacts";

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
          {storage.getString("contact-name-" + selectedSms?._id.toString()) ||
            selectedSms?.address ||
            "Contact"}
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

const cleanNumber = (number) =>
  number.replace("(", "").replace(")", "").replace(" ", "").replace("-", "");

const requestContactsPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
      {
        title: "Contacts",
        message: "SMS Protect would like access to your contacts.",
        buttonPositive: "OK",
        buttonNegative: "Cancel",
      }
    );

    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      return;
    }

    const contacts = await Contacts.getAll();

    return contacts.flatMap((contact) => {
      return contact.phoneNumbers.flatMap((number) => {
        return {
          name: contact.displayName,
          number: cleanNumber(number.number),
        };
      });
    });
  } catch (err) {
    console.warn(err);
  }
};

export default function App() {
  const setContacts = useStore((state) => state.setAllContacts);

  useEffect(() => {
    const cacheContacts = async () => {
      const contacts = await requestContactsPermission();
      setContacts(contacts ?? []);
    };

    cacheContacts();
  }, []);

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
