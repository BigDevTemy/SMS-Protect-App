import create from "zustand";

const useStore = create((set) => ({
  smslist: [
    // {
    //   _id: 1,
    //   thread_id: 2,
    //   address: "6505551212",
    //   date: 1653149269528,
    //   date_sent: 1653149263000,
    //   protocol: 0,
    //   read: 0,
    //   status: -1,
    //   type: 1,
    //   reply_path_present: 0,
    //   body: "Android is always a sweet treat!",
    //   locked: 0,
    //   sub_id: 1,
    //   error_code: 0,
    //   creator: "com.google.android.apps.messaging",
    //   seen: 1,
    // },
  ],
  selectedSms: null,
  bears: 0,
  listSms: (sms) =>
    set((state) => {
      return { smslist: sms };
    }),
  setSms: (sms) =>
    set((state) => {
      return { selectedSms: sms };
    }),
}));

export default useStore;
