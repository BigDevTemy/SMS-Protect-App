import React, { useState, useEffect } from "react";
import {
  Text,
  Link,
  Badge,
  Flex,
  Icon,
  Input,
  Center,
  Heading,
  Box,
  ScrollView,
} from "native-base";
import useStore from "../../store";
import { MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";
import { returnShade } from "../utils";
import { storage } from "../../storage";

const dayjs = require("dayjs");

export function MessageScreen({ navigation }) {
  const initialSms = useStore((state) => state.selectedSms);
  const setNewupdate = useStore((state) => state.setNewupdate);
  const [selectedSms, setSelectedSms] = useState(initialSms);

  useEffect(() => {
    setSelectedSms(initialSms);
    setNewupdate();
  }, [initialSms]);

  return (
    <ScrollView h="100%" w="full" display="flex" flexDirection="column-reverse">
      <Link width="60%" onPress={() => {}} m="0" p="0">
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

              <Box w="30%" ml="2" mt="1">
                <Text>{dayjs(selectedSms?.date).format("DD-MMM")}</Text>
                {storage.getBoolean(selectedSms._id.toString()) && (
                  <Badge mt="1" colorScheme="danger">
                    SPAM
                  </Badge>
                )}
              </Box>
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
