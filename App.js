import React, { useState } from "react";
import {
  Text,
  Link,
  HStack,
  Center,
  Heading,
  Switch,
  useColorMode,
  NativeBaseProvider,
  extendTheme,
  VStack,
  Code,
  Button,
  Menu,
  HamburgerIcon,
  Box,
  Pressable,
  ScrollView,
} from "native-base";
import NativeBaseIcon from "./components/NativeBaseIcon";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import useStore from "./store";

const Stack = createNativeStackNavigator();

// Define the config
const config = {
  useSystemColorMode: false,
  initialColorMode: "dark",
};

// extend the theme
export const theme = extendTheme({ config });

function HomeScreen({ navigation }) {
  const smsList = useStore((state) => state.smslist);
  const setSms = useStore((state) => state.setSms);
  return (
    <Center
      _dark={{ bg: "blueGray.900" }}
      _light={{ bg: "blueGray.50" }}
      px={4}
      flex={1}
    >
      <ScrollView
        h="80"
        _contentContainerStyle={{
          px: "20px",
          mb: "4",
          minW: "72",
        }}
        mt="4"
      >
        <VStack space={1} flex="1">
          {smsList.map((sms, index) => {
            return (
              <Button
                py="4"
                bg="gray.500"
                key={sms.id}
                onPress={() => {
                  setSms(sms);
                  navigation.navigate("Message");
                }}
              >
                {sms.body}
              </Button>
            );
          })}
        </VStack>
      </ScrollView>
    </Center>
  );
}
function MessageScreen({ navigation }) {
  const selectedSms = useStore((state) => state.selectedSms);
  return (
    <ScrollView
      h="80"
      _contentContainerStyle={{
        px: "20px",
        mb: "4",
        minW: "72",
      }}
      _dark={{ bg: "blueGray.900" }}
      _light={{ bg: "blueGray.50" }}
    >
      <VStack flex="1">
        <Center py="4" bg="gray.500" mt="4">
          {selectedSms?.body}
        </Center>
      </VStack>
      <VStack space={5} alignItems="center" mt="4">
        <Button onPress={() => navigation.navigate("Home")}>Go to Home</Button>
        <ToggleDarkMode />
      </VStack>
    </ScrollView>
  );
}

function LogoTitle(pp) {
  return (
    <Box display="flex" flexDirection="row" justifyContent="space-between">
      <Heading fontSize="md">Cyan</Heading>
      <Menu
        trigger={(triggerProps) => {
          return (
            <Pressable accessibilityLabel="More options menu" {...triggerProps}>
              <HamburgerIcon />
            </Pressable>
          );
        }}
      >
        <Menu.Item>Spam</Menu.Item>
        <Menu.Item>others</Menu.Item>
      </Menu>
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

// Color Switch Component
function ToggleDarkMode() {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <HStack space={2} alignItems="center">
      <Text>Dark</Text>
      <Switch
        isChecked={colorMode === "light" ? true : false}
        onToggle={toggleColorMode}
        aria-label={
          colorMode === "light" ? "switch to dark mode" : "switch to light mode"
        }
      />
      <Text>Light</Text>
    </HStack>
  );
}
