import create from "zustand";

const useStore = create((set) => ({
  smslist: [],
  selectedSms: null,
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
