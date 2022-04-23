import create from "zustand";

const useStore = create((set) => ({
  smslist: [
    {
      title: "SMS 1",
      body: "This is a test message",
      date: "2020-01-01",
      id: 1,
    },
    {
      title: "SMS 2",
      body: "This is a test message",
      date: "2020-01-01",
      id: 2,
    },
    {
      title: "SMS 3",
      body: "This is a test message",
      date: "2020-01-01",
      id: 3,
    },
    {
      title: "SMS 4",
      body: "This is a test message",
      date: "2020-01-01",
      id: 4,
    },
    {
      title: "SMS 5",
      body: "This is a test message",
      date: "2020-01-01",
      id: 5,
    },
    {
      title: "SMS 6",
      body: "This is a test message",
      date: "2020-01-01",
      id: 6,
    },
    {
      title: "SMS 7",
      body: "This is a test message",
      date: "2020-01-01",
      id: 7,
    },
  ],
  selectedSms: null,
  bears: 0,
  setSms: (sms) => set((state) => ({ selectedSms: state.smslist[sms.id] })),
}));

export default useStore;
