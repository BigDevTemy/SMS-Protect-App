import React, { useState, useEffect } from "react";
import {
  Text,
  Link,
  Badge,
  Flex,
  Icon,
  Input,
  Divider,
  Center,
  Heading,
  VStack,
  Spinner,
  Box,
  ScrollView,
} from "native-base";
import SmsAndroid from "react-native-get-sms-android";
import useStore from "../../store";
import Request from "../../components/RequestPerm";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import * as ReadSms from "react-native-read-sms/ReadSms";
import { storage } from "../../storage";
import { postSMS, returnShade } from "../utils";
import { AppState } from "react-native";

const dayjs = require("dayjs");
var relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

export function HomeScreen({ navigation }) {
  const [value, setValue] = React.useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [newupdate, setNew] = useState(false);
  const smsList = useStore((state) => state.smslist);
  const setSms = useStore((state) => state.setSms);
  const listSms = useStore((state) => state.listSms);
  const newupdateg = useStore((state) => state.newupdate);

  const handleChange = (text) => setValue(text);

  const loadAllSms = () => {
    setIsLoading(true);
    SmsAndroid.list(
      JSON.stringify({
        bodyRegex: `(.*)${value.toString()}(.*)`,
        box: "inbox", // 'inbox' (default), 'sent', 'draft', 'outbox', 'failed', 'queued', and '' for all
        /** the next 2 filters can be used for pagination **/
        // indexFrom: 0, // start from index 0
        maxCount: 20, // count of SMS to return each time
      }),
      (fail) => {
        console.log("Failed with this error: " + fail);
      },
      async (_count, smsList) => {
        const allSms = JSON.parse(smsList);
        if (
          Boolean(allSms.length) &&
          !storage.getBoolean(allSms[0]._id.toString())
        ) {
          const sms = await postSMS(allSms);

          if (sms?.error) {
            setIsError(true);
            setIsLoading(false);
            return;
          } else {
            const foundIndex = allSms.findIndex((x) => x._id == sms._id);
            allSms[foundIndex] = sms;

            if (sms?.spam) {
              storage.set(sms._id.toString(), true);
            }
          }
        }
        listSms(allSms);
        setIsLoading(false);
      }
    );
  };

  useEffect(() => {
    loadAllSms();
  }, [newupdate, newupdateg, value]);

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

  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === "active") {
        // App resumes from background
        loadAllSms();
      }
    };
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );
    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <ScrollView w="100%">
      <Input
        placeholder="Search Messages"
        value={value}
        onChangeText={handleChange}
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
            <Heading size="lg">
              {isError ? "Check your internet connection" : "No Messages"}
            </Heading>
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
                    </Flex>
                  </Box>
                </Box>
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
