import { MMKV } from "react-native-mmkv";

const storage = new MMKV();

export default {
    setItem: (name, value) => storage.set(name, value),
    getItem: (name) => storage.getString(name) ?? null,
    removeItem: (name) => storage.delete(name)
  };
