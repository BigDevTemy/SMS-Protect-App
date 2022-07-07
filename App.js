import React, { useState, useEffect } from "react";
import {
  Text,
  Link,
  Container,
  HStack,
  Badge,
  Flex,
  Icon,
  Input,
  Spacer,
  Divider,
  Center,
  Heading,
  Switch,
  useColorMode,
  NativeBaseProvider,
  extendTheme,
  VStack,
  Code,
  Button,
  Spinner,
  Menu,
  useToast,
  ThreeDotsIcon,
  Box,
  Pressable,
  ScrollView,
} from "native-base";
import NativeBaseIcon from "./components/NativeBaseIcon";
// import * as Notifications from "expo-notifications";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SmsAndroid from "react-native-get-sms-android";
import useStore from "./store";
import Request from "./components/RequestPerm";
import Config from "./config";
import CryptoES from "crypto-es";
const RSAKey = require("react-native-rsa");
const crypto = require("./crypto");
import {
  MaterialCommunityIcons,
  MaterialIcons,
  FontAwesome,
} from "@expo/vector-icons";
const dayjs = require("dayjs");
var relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);
//import dayjs from 'dayjs' // ES 2015

import * as ReadSms from "react-native-read-sms/ReadSms";
import axios from "axios";
const forge = require("node-forge");

import { MMKV } from "react-native-mmkv";

export const storage = new MMKV();

// if (Platform.OS === 'web') { //TODO: render web version

// }
// import { check, PERMISSIONS, RESULTS } from "react-native-permissions";

const Stack = createNativeStackNavigator();

// Define the config
const config = {
  useSystemColorMode: false,
  initialColorMode: "dark",
};

const returnShade = (id = 0) => {
  if (id % 4 === 0) return "info.400";
  if (id % 4 === 1) return "tertiary.400";
  if (id % 4 === 2) return "secondary.400";
  if (id % 4 === 3) return "purple.400";
};

const postSMS = async (load) => {
  // console.log("load", load);
  const sms = load[0];
  console.log("sms", sms);
  const payload = sms.body;
  // const encrypted = CryptoES.AES.encrypt(payload);
  // const payload = "who let the dogs out";

  const ENC_KEY = "bf3c199c2470cb477d907b1e0917c17b"; // set random encryption key
  const IV = "5183666c72eec9e4"; // set random initialisation vector
  // ENC_KEY and IV can be generated as crypto.randomBytes(32).toString('hex');

  // console.log("try hex rand", forge.random.getBytesSync(32).toString("hex"));

  var encrypt = (val) => {
    let cipher = crypto.createCipheriv("aes-256-cbc", ENC_KEY, IV);
    let encrypted = cipher.update(val, "utf8", "base64");
    encrypted += cipher.final("base64");
    return encrypted;
  };

  var decrypt = (encrypted) => {
    let decipher = crypto.createDecipheriv("aes-256-cbc", ENC_KEY, IV);
    let decrypted = decipher.update(encrypted, "base64", "utf8");
    return decrypted + decipher.final("utf8");
  };

  const encrypted_key = encrypt(payload);
  console.log(decrypt(encrypted_key));

  const pub2 = forge.pki.publicKeyFromPem(`-----BEGIN PUBLIC KEY-----
  MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAsf/kBdGVPGsDY8/PEo8w
  K/CIlp/vqPUqdao+1RDMlLUOeLJklMP+tWhh1MkrkEVZUwaU1TaPiv5g9xp4NJ4V
  va6fteN7LbDP53+G/yh2NDZltRXrqJXz/dTORPoZLqQ+uUtHkNwwdTVA7UKpnTuH
  4DzByqBpGLE6v9AEGg3dA9D9H6eUxPtzlLX2E0E6pDn6nGlRfG4+pU41O9V/XNLQ
  5oCiny1KxVq8blxAUR/KGjuuMSPL9hos3Oy1DATgY7KMAW/Zw8xE99CQptFe3RA+
  XS4R2Yr8AepUW1bi+wSOCTzzFUFaGVh7PEktqSAJTHTmeCi5+knIBm/v+Dh0wxqd
  Gzqn9/uVKsJxSoeMDxvk53he67p0dlrlwP1GztPhW8dkTF5ZVeC4nuj3zBeeaull
  1DIv+Bmo+dFBctnjTmd/JUgHiUfDT3jDU7nVW2vb5FV25Z4kvCgSuCok5rnQlwTX
  ZtGzBiWEXiDpnUdMswZ8PQ8kP7DbMDmHjIfcnQAPfz8DKxdcJ2lgHEWOFfVgR1s7
  kopNfJwGFRQQeRuEFRrhkPsOkZjHzq0gLWB4KTYyRALZaCJo6TeebZOoerAfPo1+
  hKrxLd7OZkzOQsc7fWRM2IRLsv0tV+OR9U+pmFQ3BMuiI5Q2Sel/fSXvbn5O660/
  ZONyC6f1hbrez6WPZjZwxksCAwEAAQ==
  -----END PUBLIC KEY-----
  `);

  const reqData = {
    key: forge.util.encode64(pub2.encrypt(ENC_KEY, "RSA-OAEP")),
    iv: forge.util.encode64(pub2.encrypt(IV, "RSA-OAEP")),
    message: encrypted_key,
  };

  const responsed = await axios
    .post(`https://sms-backend-ng.herokuapp.com/classify`, reqData)
    .catch((err) => {
      console.log("resd2 err", err);
    });

  console.log(responsed.data);
  if (Boolean(+responsed.data.classification)) {
    console.log("this is a spam message", responsed.data);
    // return true;
    return { ...sms, spam: true };
  }
  // console.log(responsed);
  return sms;
};

// extend the theme
export const theme = extendTheme({ config });

function HomeScreen({ navigation }) {
  const [arr, setArr] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newupdate, setNew] = useState(false);
  const smsList = useStore((state) => state.smslist);
  const setSms = useStore((state) => state.setSms);
  const listSms = useStore((state) => state.listSms);

  useEffect(() => {
    SmsAndroid.list(
      JSON.stringify({
        box: "",
        maxCount: 10,
      }),
      (fail) => {
        console.log("Failed with this error: " + fail);
      },
      async (count, smsList) => {
        // const allSms = [];
        const allSms = JSON.parse(smsList);
        if (
          Boolean(allSms.length) &&
          !storage.getBoolean(allSms[0]._id.toString())
        ) {
          const sms = await postSMS(allSms);
          console.log("sms: ", sms);
          console.log("Count: ", count);

          const foundIndex = allSms.findIndex((x) => x._id == sms._id);
          allSms[foundIndex] = sms;

          if (sms?.spam) {
            storage.set(sms._id.toString(), true);
          }
        }
        listSms(allSms);
        setIsLoading(false);
      }
    );
  }, [newupdate]);

  const startReadSMS = async () => {
    const hasPermission = await ReadSms.requestReadSMSPermission();
    console.log("hasPermission: ", hasPermission);
    if (hasPermission) {
      try {
        ReadSms.startReadSMS((status, sms, error) => {
          if (status == "success") {
            console.log("Great!! you have received new sms:", sms);
          }
          setNew((prev) => !prev);
        });
      } catch (error) {
        console.log("error: ", error);
      }
    }
  };

  useEffect(() => {
    startReadSMS();
  }, []);

  return (
    <ScrollView w="100%">
      <Input
        placeholder="Search Messages"
        width="100%"
        borderRadius="4"
        py="3"
        px="1"
        fontSize="14"
        InputLeftElement={
          <Icon
            m="2"
            ml="3"
            size="6"
            color="gray.400"
            as={<MaterialIcons name="search" />}
          />
        }
        InputRightElement={
          <Icon
            m="2"
            ml="3"
            size="6"
            color="gray.400"
            as={<MaterialIcons name="more-vert" />}
          />
        }
      />
      <VStack w="100%" divider={<Divider />}>
        {!Boolean(smsList.length) && !isLoading && (
          <Center h="12" rounded="full">
            <Heading size="lg">No Messages</Heading>
          </Center>
        )}
        {smsList &&
          smsList.map((sms, index) => {
            return (
              <Link
                key={sms._id}
                onPress={() => {
                  setSms(sms);
                  navigation.navigate("Message");
                }}
                m="0"
                p="0"
              >
                {/* <SmsCard
                  key={index}
                  sms={sms}
                  new={new}
                  setNew={setNew}
                /> */}
                {/* <Flex direction="row" bg="white" p="4" w="full"> */}
                <Box
                  w="full"
                  display="flex"
                  bg="white"
                  p="4"
                  flexDirection="row"
                  justifyContent="space-between"
                >
                  <Center
                    h="10"
                    w="10"
                    mr="2"
                    rounded="full"
                    bg={returnShade(sms?._id)}
                  >
                    <Icon
                      as={<MaterialCommunityIcons name="account" />}
                      color="white"
                      size={6}
                    />
                  </Center>
                  <Box w="100%">
                    <Flex direction="row" justify="space-between">
                      <Heading w="60%" size="md">
                        {sms.address}
                      </Heading>
                      <Text w="30%">{dayjs(sms.date).format("DD-MMM")}</Text>
                    </Flex>
                    <Flex direction="row" justify="space-between">
                      <Text isTruncated w="60%">
                        {sms.body}
                      </Text>
                      {storage.getBoolean(sms._id.toString()) && (
                        <Text w="30%">
                          <Badge colorScheme="danger">SPAM</Badge>
                        </Text>
                      )}
                      {/* <Text w="30%">
                        <Badge colorScheme="success">SAFE</Badge>
                      </Text> */}
                    </Flex>
                  </Box>
                </Box>
                {/* </Flex> */}
              </Link>
            );
          })}
      </VStack>
      {isLoading && (
        <Spinner size="lg" color="gray.400" accessibilityLabel="Loading..." />
      )}
      <Request />
    </ScrollView>
  );
}
function MessageScreen({ navigation }) {
  const selectedSms = useStore((state) => state.selectedSms);

  // console.log("selectedSms: ", selectedSms);

  const postSMS = async (payload) => {
    const encrypted = CryptoES.AES.encrypt(
      payload || "Message",
      "Secret Passphrase"
    );
    console.log(encrypted.key.toString()); // 74eb593087a982e2a6f5dded54ecd96d1fd0f3d44a58728cdcd40c55227522223
    console.log(encrypted.iv.toString()); // 7781157e2629b094f0e3dd48c4d786115
    console.log(encrypted.toString()); // 73e54154a15d1beeb509d9e12f1e462a0

    const hashed = CryptoES.HmacSHA256(encrypted.toString(), Config.PUBLIC_KEY);
    console.log(hashed.toString());

    // RSA.encrypt("my_secret_message", Config.PUBLIC_KEY).then(
    //   (encodedMessage) => {
    //     console.log(`the encoded message is ${encodedMessage}`);
    //     // RSA.decrypt(encodedMessage, keys.private).then((decryptedMessage) => {
    //     //   console.log(`The original message was ${decryptedMessage}`);
    //     // });
    //   }
    // );

    // const response = await axios
    //   .post(`https://sms-backend-ng.herokuapp.com/classify`, {
    //     key: encrypted.key.toString(CryptoES.enc.Base64),
    //     iv: encrypted.iv.toString(CryptoES.enc.Base64),
    //     message: hashed.toString(CryptoES.enc.Base64),
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });

    const encryptedData = crypto
      .publicEncrypt(
        {
          key: "-----BEGIN RSA PUBLIC KEY-----\nMIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAsf/kBdGVPGsDY8/PEo8wK/CIlp/vqPUqdao+1RDMlLUOeLJklMP+tWhh1MkrkEVZUwaU1TaPiv5g9xp4NJ4Vva6fteN7LbDP53+G/yh2NDZltRXrqJXz/dTORPoZLqQ+uUtHkNwwdTVA7UKpnTuH4DzByqBpGLE6v9AEGg3dA9D9H6eUxPtzlLX2E0E6pDn6nGlRfG4+pU41O9V/XNLQ5oCiny1KxVq8blxAUR/KGjuuMSPL9hos3Oy1DATgY7KMAW/Zw8xE99CQptFe3RA+XS4R2Yr8AepUW1bi+wSOCTzzFUFaGVh7PEktqSAJTHTmeCi5+knIBm/v+Dh0wxqdGzqn9/uVKsJxSoeMDxvk53he67p0dlrlwP1GztPhW8dkTF5ZVeC4nuj3zBeeaull1DIv+Bmo+dFBctnjTmd/JUgHiUfDT3jDU7nVW2vb5FV25Z4kvCgSuCok5rnQlwTXZtGzBiWEXiDpnUdMswZ8PQ8kP7DbMDmHjIfcnQAPfz8DKxdcJ2lgHEWOFfVgR1s7kopNfJwGFRQQeRuEFRrhkPsOkZjHzq0gLWB4KTYyRALZaCJo6TeebZOoerAfPo1+hKrxLd7OZkzOQsc7fWRM2IRLsv0tV+OR9U+pmFQ3BMuiI5Q2Sel/fSXvbn5O660/ZONyC6f1hbrez6WPZjZwxksCAwEAAQ==\n-----END RSA PUBLIC KEY-----\n",
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
          oaepHash: "sha256",
        }
        // We convert the data string to a buffer using `Buffer.from`
        // Buffer.from(data)
      )
      .catch((err) => {
        console.log(err);
      });
    console.log("the enc" + encryptedData);

    const response = await axios
      .post(`https://sms-backend-ng.herokuapp.com/classify`, {
        key: "gKBW2okM8nh7YJvaeJel2236SigokTjgfkWu1/WkgqeF9359pZMPRMA3OINrEx0L48OKrZ2QBy9HROckl4eZgYEJMTK4PjOwCr/LX3DmB5ZbrvsFd1E7Wxk5rrxhtsLybPzEnF+2dCIVabH/ckAMMG44Xd1D7hdWL8xODHCpzQA+MX16vNxpgCpNiuqHzqlFCTqXPmvaxrt1cmPRs4ZrvsWgv/DYBpE7Ai0g7gLpDO4yS//fdMMXbbERedGAPxKPiCTRiAqxf+TYy1WlyOUC2FRaiUuLVWulUv1R6191bIv8uR5p7X87OaX101v0CxjVOprHK3PYOLnT0MtM5Aa1VKcFl/331Guaxz7uGbrFOqnUWEb4yZTSrdgAvS4yI2o/a2GroL4NEjb7yYQUeHh5BVVOTmkWrG4ZX0QAn58eCXsZltSE1cjcBOfbHhK4dPce5ycemwnCr84QhGy0fK08/zWj+m1t7r1rwmeLYTzScrRuGRBuYNsTHexyyfFUIT+A7JrnC1JxtniwnelPzvSJgHR5PUk75AsmljxH/uguBpWoSl0MINd8ZkLW/NAMIOkPMvSzHUC3iA+EZkJymgmaq0tGmDI/X5O9NK79jvsrHAHkwDVDjGAngA68Sxro6+flPs1cviLP0V0oQBXjnUDJtu1FIKPasbGb3IIIqtCmrzE=",
        iv: "oyE9N786v2dlaYewDbNzRe7tCSUNesROkOQs6a1lGkk5aKHhuFpJbQMQ9NGnfMH3RLlt4lOFWwj3sCpaZ4nUNgOBx2hMcX1wsp6+uQVy6WKMqhrWIaEjuw9dEs9Gk27hpm4VcXSreo2LlXvKM0GVl/Zs9w3r4Aplx8sHo8z+gm/Tks+VWUZ/4XOU73X6plu9j76mJKC2JD5QXU0ILJp4/T1k2woxtsul2GG7Kgw35s0GYZxN9e+/pznMAIxDc1wmjMy+nRtZtUumFkjATBtMsyZZPocGGsutJtlSCCfh2JzEOBOr3DY3wLEUFElBRNvwcXTAnvPYlEsxDVLMtKyur6gIaLEj5W4g366Gd8MvIVCoXTlVUHamRMwD3P0qvG5Pk9M4s06etP2h8obchG4NXpQO1A9HP8htn7sAwsudxIAwnzfx8H878bexEWBMaflUNCLuVTkfnbr9log5ynP+cmHzm2ZSoENGE/iiPotC2SRHdli+gi4szczfENS9WKcxZPjAnFkr4zS5GHy6GL3Aus3qAcjf9NK8YjKSLw3oi9wUazsA0KWTpxkznW3qN2/8l0R0D1W/HvarEe+Y4T0zap1IrGwYa1k2qsYRaQxVXw/UMLI8fN0ZsWX3bRVbbWxt/4FQ4nzJZXNZg/8HZZXLChY4Ny3Oe7GQqVfQSmXKh5E=",
        message:
          "jl3A64sEbA3sMnv+wHt1szQPnYFdC8Aqs8XUCV8QhrkiRdoDtRdYk7cP384gK/xElOk5xS89DDrJkddaXYoYRq16IB8GUT5v72Jw0gfOs3D1rMMazXYlySiImzWmx33c+WSlQjN6OfaWeOrVbGAhk/eUNTgsNZSc88D0kSjhC2VGloTRaArVyu33fl3MVJYisPW2DODjHMBzBSlhrpFwSGp3wWuGAiZS52H71PaIRESADBpCsbc654zbKhLb8EBM",
      })
      .catch((err) => {
        console.log(err);
      });
    console.log(response?.data);
    return response;
  };
  return (
    <ScrollView h="100%" w="full" display="flex" flexDirection="column-reverse">
      <Link width="60%" onPress={() => {}} m="0" p="0">
        {/* <SmsCard
                  key={index}
                  sms={sms}
                  new={new}
                  setNew={setNew}
                /> */}
        <Box
          w="full"
          display="flex"
          p="4"
          flexDirection="row"
          justifyContent="space-between"
        >
          <Center
            h="10"
            w="10"
            mr="2"
            rounded="full"
            bg={returnShade(selectedSms?._id)}
          >
            <Icon
              as={<MaterialCommunityIcons name="account" />}
              color="white"
              size={6}
            />
          </Center>
          <Box w="100%">
            <Flex direction="row" justify="space-between">
              <Heading
                p="2"
                bg="white"
                fontWeight="medium"
                rounded="md"
                size="md"
              >
                {selectedSms?.body}
              </Heading>
              <Text w="30%" ml="2" mt="1">
                {dayjs(selectedSms?.date).format("DD-MMM")}
              </Text>
            </Flex>
          </Box>
        </Box>
      </Link>
      <Input
        placeholder="Write your message!"
        width="100%"
        borderRadius="4"
        p="2"
        h="75px"
        bg="white"
        fontSize="18"
        InputRightElement={
          <Center h="12" w="12" rounded="full" mr="2" bg="info.400">
            <Icon
              as={<FontAwesome name="location-arrow" />}
              color="white"
              size={8}
            />
          </Center>
        }
      />
    </ScrollView>
  );
}

function LogoTitle(pp) {
  const selectedSms = useStore((state) => state.selectedSms);
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
            onPress={() => {
              // alert(selectedSms?.body);
              postSMS();
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
            }}
          >
            Check for Spam
          </Menu.Item>
          <Menu.Item
            onPress={() => {
              alert(selectedSms?.body);
            }}
          >
            Wrong Prediction
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
