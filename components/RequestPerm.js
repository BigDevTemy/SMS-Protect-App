import React, { useEffect } from "react";
import { PermissionsAndroid, View, Text } from "react-native";
const Request = () => {
  const permission = () => {
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_SMS);
  };

  useEffect(() => {
    permission();
  }, []);

  useEffect(() => {
    PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_SMS).then(
      (response) => {
        console.log(response);
        //   getdata();
      }
    );
  }, []);

  return <Text>Permission!</Text>;
};

export default Request;
