import create from "zustand";

const useStore = create((set) => ({
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
}));

export default useStore;
