import React, { useState, useEffect } from "react";
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
  ThreeDotsIcon,
  Box,
  Pressable,
  ScrollView,
} from "native-base";
import NativeBaseIcon from "./components/NativeBaseIcon";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SmsAndroid from "react-native-get-sms-android";
import useStore from "./store";
import Request from "./components/RequestPerm";
import Config from "./config";
import CryptoES from "crypto-es";
import { RSA } from "react-native-rsa-native";
const crypto = require("./crypto");

import * as ReadSms from "react-native-read-sms/ReadSms";
import axios from "axios";

// if (Platform.OS === 'web') { //TODO: render web version

// }
// import { check, PERMISSIONS, RESULTS } from "react-native-permissions";

const Stack = createNativeStackNavigator();

// Define the config
const config = {
  useSystemColorMode: false,
  initialColorMode: "dark",
};

// extend the theme
export const theme = extendTheme({ config });

function HomeScreen({ navigation }) {
  const [arr, setArr] = useState(null);
  const [newupdate, setNew] = useState(false);
  const smsList = useStore((state) => state.smslist);
  const setSms = useStore((state) => state.setSms);
  const listSms = useStore((state) => state.listSms);

  useEffect(() => {
    // fs.readFileSync("./PUBLIC_KEY.pem", "utf8");
    // const reader = RNFS.readDir("./PUBLIC_KEY.pem");
    // console.log(reader);
    SmsAndroid.list(
      JSON.stringify({
        box: "",
      }),
      (fail) => {
        console.log("Failed with this error: " + fail);
      },
      (count, smsList) => {
        console.log("Count: ", count);
        console.log("List: ", smsList);
        setArr(JSON.parse(smsList));

        listSms(JSON.parse(smsList));
        var arr = JSON.parse(smsList);

        arr.forEach(function (object) {
          console.log("Object: " + object);
          console.log("-->" + object.date);
          console.log("-->" + object.body);
        });
      }
    );
  }, [newupdate]);

  // This is the data we want to encrypt
  // const data = "my secret data";

  // const encryptedData = crypto.publicEncrypt(
  //   {
  //     key: Config.publicKey,
  //     padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
  //     oaepHash: "sha256",
  //   },
  //   // We convert the data string to a buffer using `Buffer.from`
  //   Buffer.from(data)
  // );

  // // The encrypted data is in the form of bytes, so we print it in base64 format
  // // so that it's displayed in a more readable form
  // console.log("encypted data: ", encryptedData.toString("base64"));

  // const decryptedData = crypto.privateDecrypt(
  //   {
  //     key: privateKey,
  //     // In order to decrypt the data, we need to specify the
  //     // same hashing function and padding scheme that we used to
  //     // encrypt the data in the previous step
  //     padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
  //     oaepHash: "sha256",
  //   },
  //   encryptedData
  // );

  // The decrypted data is of the Buffer type, which we can convert to a
  // string to reveal the original data
  // console.log("decrypted data: ", decryptedData.toString());

  // Create some sample data that we want to sign
  // const verifiableData = "this need to be verified";

  // // The signature method takes the data we want to sign, the
  // // hashing algorithm, and the padding scheme, and generates
  // // a signature in the form of bytes
  // const signature = crypto.sign("sha256", Buffer.from(verifiableData), {
  //   key: privateKey,
  //   padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
  // });

  // console.log(signature.toString("base64"));

  // To verify the data, we provide the same hashing algorithm and
  // padding scheme we provided to generate the signature, along
  // with the signature itself, the data that we want to
  // verify against the signature, and the public key
  // const isVerified = crypto.verify(
  //   "sha256",
  //   Buffer.from(verifiableData),
  //   {
  //     key: publicKey,
  //     padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
  //   },
  //   signature
  // );

  // isVerified should be `true` if the signature is valid
  // console.log("signature verified: ", isVerified);

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

    const encryptedData = crypto.publicEncrypt(
      {
        key: "-----BEGIN RSA PUBLIC KEY-----MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAsf/kBdGVPGsDY8/PEo8wK/CIlp/vqPUqdao+1RDMlLUOeLJklMP+tWhh1MkrkEVZUwaU1TaPiv5g9xp4NJ4Vva6fteN7LbDP53+G/yh2NDZltRXrqJXz/dTORPoZLqQ+uUtHkNwwdTVA7UKpnTuH4DzByqBpGLE6v9AEGg3dA9D9H6eUxPtzlLX2E0E6pDn6nGlRfG4+pU41O9V/XNLQ5oCiny1KxVq8blxAUR/KGjuuMSPL9hos3Oy1DATgY7KMAW/Zw8xE99CQptFe3RA+XS4R2Yr8AepUW1bi+wSOCTzzFUFaGVh7PEktqSAJTHTmeCi5+knIBm/v+Dh0wxqdGzqn9/uVKsJxSoeMDxvk53he67p0dlrlwP1GztPhW8dkTF5ZVeC4nuj3zBeeaull1DIv+Bmo+dFBctnjTmd/JUgHiUfDT3jDU7nVW2vb5FV25Z4kvCgSuCok5rnQlwTXZtGzBiWEXiDpnUdMswZ8PQ8kP7DbMDmHjIfcnQAPfz8DKxdcJ2lgHEWOFfVgR1s7kopNfJwGFRQQeRuEFRrhkPsOkZjHzq0gLWB4KTYyRALZaCJo6TeebZOoerAfPo1+hKrxLd7OZkzOQsc7fWRM2IRLsv0tV+OR9U+pmFQ3BMuiI5Q2Sel/fSXvbn5O660/ZONyC6f1hbrez6WPZjZwxksCAwEAAQ==\n-----END RSA PUBLIC KEY-----\n",
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: "sha256",
      }
      // We convert the data string to a buffer using `Buffer.from`
      // Buffer.from(data)
    );
    console.log(encryptedData);

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

  const startReadSMS = async () => {
    const hasPermission = await ReadSms.requestReadSMSPermission();
    console.log("hasPermission: ", hasPermission);
    if (hasPermission) {
      try {
        ReadSms.startReadSMS((status, sms, error) => {
          if (status == "success") {
            console.log("Great!! you have received new sms:", sms);
          }
          postSMS();
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
        }}
        mt="4"
      >
        <VStack space={1} flex="1">
          {smsList &&
            smsList.map((sms, index) => {
              return (
                <Button
                  py="8"
                  width="100%"
                  bg="gray.500"
                  key={sms._id}
                  onPress={() => {
                    setSms(sms);
                    navigation.navigate("Message");
                  }}
                >
                  {sms.address}
                  {sms.body}
                  <Request />
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
          {selectedSms?.id}
        </Center>
        <Button
          py="8"
          width="100%"
          onPress={() => {
            alert(selectedSms?.body);

            postSMS(selectedSms?.body);
          }}
        >
          {selectedSms?.body}
        </Button>
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
