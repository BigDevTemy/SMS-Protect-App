import React, { useState, useEffect } from "react";
import {
  Text,
  Link,
  Badge,
  Flex,
  Icon,
  Center,
  Heading,
  Box,
} from "native-base";
import useStore from "../../store";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { storage } from "../../storage";
import { returnShade } from "../utils";
import { useNavigation } from "@react-navigation/native";
import Contacts from "react-native-contacts";
import { parsePhoneNumberFromString } from "libphonenumber-js/min";

const CONTACT_NAME_PREFIX = "contact-name-";

const dayjs = require("dayjs");
var relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

export const ListItem = ({ sms }) => {
  const { navigate } = useNavigation();
  const setSms = useStore((state) => state.setSms);
  const [name, setName] = useState(sms.address);

  const getContactByPhone = async () => {
    const contactName = storage.getString(
      CONTACT_NAME_PREFIX + sms._id.toString()
    );

    if (contactName) {
      setName(contactName);
      return;
    }

    const parsedNumber = parsePhoneNumberFromString(sms.address, "NG");

    if (!parsedNumber.isValid()) {
      setName(sms.address);
      return;
    }

    const address = parsedNumber.nationalNumber;
    const contacts = await Contacts.getContactsByPhoneNumber(address);

    if (contacts && contacts.length) {
      const contact = contacts[0];
      storage.set(
        CONTACT_NAME_PREFIX + sms._id.toString(),
        contact.displayName
      );

      setName(contact.displayName);
    }
  };

  useEffect(() => {
    getContactByPhone();
  }, [sms._id]);

  return (
    <Link
      key={sms._id}
      onPress={() => {
        setSms(sms);
        navigate("Message");
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
        <Center h="10" w="10" mr="2" rounded="full" bg={returnShade(sms?._id)}>
          <Icon
            as={<MaterialCommunityIcons name="account" />}
            color="white"
            size={6}
          />
        </Center>
        <Box w="100%">
          <Flex direction="row" justify="space-between">
            <Heading w="60%" size="md">
              {name}
            </Heading>
            <Text w="30%">{dayjs(sms.date).format("DD-MMM")}</Text>
          </Flex>
          <Flex direction="row" justify="space-between">
            <Text isTruncated w="60%">
              {sms.body}
            </Text>
            {storage.getBoolean("IS_SPAM_" + sms._id.toString()) && (
              <Text w="30%">
                <Badge colorScheme="danger">SPAM</Badge>
              </Text>
            )}
          </Flex>
        </Box>
      </Box>
    </Link>
  );
};
