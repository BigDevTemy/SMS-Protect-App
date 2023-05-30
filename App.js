import React, { useEffect, useState,LogBox } from "react";
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
import { createDrawerNavigator } from "@react-navigation/drawer";
import useStore from "./store";
import { HomeScreen } from "./src/screens/home.js";
import { MessageScreen } from "./src/screens/message.js";
import { CustomDrawer } from "./src/screens/customdrawer.js";
import {StartScreen} from './src/screens/start.js'
import { SignInScreen } from "./src/screens/auth/signin";
import { SignUpInScreen } from "./src/screens/auth/signup";
import { postSMS } from "./src/utils";
import { storage } from "./storage";

import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Linking,
  AppRegistry,
  PermissionsAndroid,
  Platform,
  Modal,
  ActivityIndicator,
} from "react-native";
import { s } from "./src/app.styles.js";

AppRegistry.registerHeadlessTask(
  "ReadSms",
  () => require("./src/tasks/readSms.js").default
);

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator()

const StackNavigation  = ()=>{
        return <Stack.Navigator>
          <Stack.Screen
            name="Start"
            component={StartScreen}
            options={{headerShown:false}}
            
          />
          <Stack.Screen
            name="SignIn"
            component={SignInScreen}
            options={{headerShown:false}}
            
          />
          <Stack.Screen
            name="SignUp"
            component={SignUpInScreen}
            options={{headerShown:false}}
            
          />
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{headerShown:false}}
            
          />
          <Stack.Screen
            name="Message"
            component={MessageScreen}
            options={{ headerTitle: (props) => <LogoTitle {...props} /> }}
          />
        </Stack.Navigator>
}




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

export default function App() {
  const [hasCheckedPermissions, setHasCheckedPermissions] = useState(false);
  const [hasSmsPermission, setHasSmsPermission] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);

  const getPermissions = async () => {
    const hasPermissions = await requestPermissions();
    setHasSmsPermission(hasPermissions);
  };

  

  useEffect(() => {
    const doInit = async () => {
      const hasPermissions = await checkSMSPermissions();
      setHasSmsPermission(hasPermissions);
      setHasCheckedPermissions(true);

      if (!hasPermissions) {
        setShowPermissionsModal(true);
      }
    };

    doInit();
  }, []);

  if (!hasCheckedPermissions) {
    return (
      <View style={[s.flexOne, s.allCenter]}>
        <StatusBar barStyle="dark-content" />
        <ActivityIndicator size="large" color="grey" />
      </View>
    );
  }

  if (!hasSmsPermission) {
    return (
      <View style={s.flexOne}>
        <StatusBar barStyle="dark-content" />

        {!showPermissionsModal && (
          <View style={s.container}>
            <Text>SMS Protect needs permissions to work correctly.</Text>
            <Text>Grant permissions in settings.</Text>
            <TouchableOpacity
              style={s.button}
              onPress={() => Linking.openSettings()}
            >
              <Text>Open Settings</Text>
            </TouchableOpacity>
          </View>
        )}

        <Modal visible={showPermissionsModal} transparent>
          <View style={s.modalContainer}>
            <View style={s.modalView}>
              <Text style={s.modalTitle}>SMS Protect</Text>
              <Text style={s.subTitle}>
                SMS Protect needs these permissions enabled to be able to check
                messages for any fraudulent patterns.
              </Text>
              <Text style={s.subHeader}>
                We need your permission to access:
              </Text>
              <Text style={s.permissionItem}>SMS, Incoming SMS</Text>
              <View style={s.divider} />
              <Text style={s.permissionItem}>Contacts</Text>
              <TouchableOpacity
                style={s.grantButton}
                onPress={() => {
                  getPermissions();
                  setShowPermissionsModal(false);
                }}
              >
                <Text>Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  const CustomDrawerContent = () => {
    return (
      <CustomDrawer/>
    )
      
  };
  console.disableYellowBox = true;

  return (
      
    <NavigationContainer>
       
      <NativeBaseProvider>
        <Drawer.Navigator drawerContent={CustomDrawerContent}  screenOptions={{ headerShown: false,drawerType:"slide" }} >
            <Drawer.Screen name="Homescreen" component={StackNavigation} />
        </Drawer.Navigator>
       
      </NativeBaseProvider>
    </NavigationContainer>
  );
}

const checkSMSPermissions = async () => {
  if (Platform.OS === "android" && Platform.Version < 23) {
    return true;
  }

  const hasReceiveSmsPermission = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.RECEIVE_SMS
  );

  const hasReadSmsPermission = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.READ_SMS
  );

  return hasReceiveSmsPermission && hasReadSmsPermission;
};

const checkContactsPermissions = async () => {
  return await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.READ_CONTACTS
  );
};

const requestPermissions = async () => {
  const hasSmsPermission = await checkSMSPermissions();
  const hasContactsPermission = await checkContactsPermissions();

  const permissionsToRequest = [];

  if (hasSmsPermission) {
    return true;
  } else {
    permissionsToRequest.push(
      PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
      PermissionsAndroid.PERMISSIONS.READ_SMS
    );
  }

  if (!hasContactsPermission) {
    permissionsToRequest.push(PermissionsAndroid.PERMISSIONS.READ_CONTACTS);
  }

  const status = await PermissionsAndroid.requestMultiple(permissionsToRequest);

  return (
    status["android.permission.READ_SMS"] === "granted" &&
    status["android.permission.RECEIVE_SMS"] === "granted"
  );
};
