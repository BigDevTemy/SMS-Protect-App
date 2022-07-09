import create from "zustand";

const useStore = create((set) => ({
  smslist: [],
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
}));

export default useStore;
