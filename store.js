import {create} from "zustand";
import { persist,createJSONStorage,devtools } from 'zustand/middleware';
import MMKVStorage from './mystorage'

// import {create} from 'react-native-mmkv-storage'

// const mmkv = create();
// const getStorage = () => {
//   return {
//     getItem: async (key) => {
//       try {
//         const value = await mmkv.getStringAsync(key);
//         return value !== undefined ? JSON.parse(value) : null;
//       } catch (error) {
//         console.error('Error reading from MMKV:', error);
//         return null;
//       }
//     },
//     setItem: async (key, value) => {
//       try {
//         const serializedValue = JSON.stringify(value);
//         await mmkv.setStringAsync(key, serializedValue);
//       } catch (error) {
//         console.error('Error writing to MMKV:', error);
//       }
//     },
//     removeItem: async (key) => {
//       try {
//         await mmkv.removeItemAsync(key);
//       } catch (error) {
//         console.error('Error removing item from MMKV:', error);
//       }
//     },
//   };
// };





// const useStore = create((set) => ({
//   smslist: [],
//   allContacts: [],
//   selectedSms: null,
//   newupdate: false,
//   listSms: (sms) =>
//     set((state) => {
//       return { smslist: sms };
//     }),
//   setSms: (sms) =>
//     set((state) => {
//       return { selectedSms: sms };
//     }),
//   setNewupdate: () =>
//     set((state) => {
//       return { newupdate: !state.newupdate };
//     }),
//   setAllContacts: (contacts) => set((state) => ({ allContacts: contacts })),
//   phonenumber: '',
//   password: '',
//   username:'User',
//   password: '',
//   setLogin: (phonenumber, password) => set({phonenumber: phonenumber, password:password }),
// }));

// export default useStore;


const devtoolsConfig = {
  name: 'my-storage-name',
  enabled: process.env.NODE_ENV === 'development'
};

const persistConfig = {
  name: 'my-storage-persist-name',
  storage: createJSONStorage(() => MMKVStorage),

  // or if you want, you can use AsyncStorage instead of MMKV
  // storage: createJSONStorage(() => AsyncStorage),

  // ... other persist configs here ...
}


const useStore = create(
 persist((set,get) => ({
  smslist: [],
  allContacts: [],
  selectedSms: null,
  newupdate: false,
  listSms: (sms) =>
    set((state) => {
      return { smslist: sms };
    }),
  setSms: (sms) =>
    set((state) => {
      return { selectedSms: sms };
    }),
  setNewupdate: () =>
    set((state) => {
      return { newupdate: !state.newupdate };
    }),
  setAllContacts: (contacts) => set((state) => ({ allContacts: contacts })),
  phonenumber: '',
  password: '',
  username:'User',
  password: '',
  setLogin: (phonenumber, password) => set({phonenumber: phonenumber, password:password }),
}),persistConfig)
  


);

export default useStore;

