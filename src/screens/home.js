import React, { useState, useEffect } from "react";
import {StatusBar} from 'react-native'
import {
  Icon,
  Input,
  Divider,
  Center,
  Heading,
  VStack,
  Spinner,
  ScrollView,
  View,
  Text,
   Pressable
} from "native-base";
import SmsAndroid from "react-native-get-sms-android";
import useStore from "../../store";
import Request from "../../components/RequestPerm";
import { MaterialIcons } from "@expo/vector-icons";
import * as ReadSms from "react-native-read-sms/ReadSms";
import { storage } from "../../storage";
import { postSMS } from "../utils";
import { AppState } from "react-native";
import { ListItem } from "./listItem";
import { s } from "../app.styles"
export function HomeScreen({navigation}) {
  const [value, setValue] = React.useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [newupdate, setNew] = useState(false);

  const smsList = useStore((state) => state.smslist);
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
              storage.set("IS_SPAM_" + sms._id.toString(), true);
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

  const handleOpenDrawer=()=>{
          console.log('Drawer')
          navigation.openDrawer()
  }

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
      <StatusBar barStyle = "dark-content" hidden = {false} backgroundColor = "transparent" translucent = {true}/>
      <View style={{display:'flex',flexDirection:'row',width:'100%',height:50,justifyContent:'flex-start',alignItems:'center',paddingLeft:5,backgroundColor:'#fff',marginTop: StatusBar.currentHeight || 0}}>
          <Pressable onPress={()=>{handleOpenDrawer()}}>
            <Icon
              m="2"
              size="6"
              color="gray.400"
                as={<MaterialIcons name="menu" />}
           />
          </Pressable>

          <Text style={{fontSize:20,fontWeight:'bold'}}>Messages</Text>
      </View>
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
            return <ListItem key={index} sms={sms} />;
          })}
      </VStack>
      {isLoading && (
        <Spinner size="lg" color="gray.400" accessibilityLabel="Loading..." />
      )}
      <Request />
    </ScrollView>

  );
}
