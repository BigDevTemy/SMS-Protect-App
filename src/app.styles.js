import { StyleSheet } from "react-native";

export const s = StyleSheet.create({
  flexOne: {
    flex: 1,
  },
  allCenter: {
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  button: {
    borderWidth: 1,
    borderColor: "grey",
    padding: 6,
    borderRadius: 10,
    marginTop: 12,
  },
  modalContainer: {
    backgroundColor: "rgba(0,0,0,0.5)",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    marginHorizontal: 24,
    backgroundColor: "white",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
  },
  subTitle: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 12,
  },
  subHeader: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  permissionItem: {
    fontSize: 12,
    fontWeight: "bold",
    paddingVertical: 8,
  },
  divider: {
    borderWidth: 0.4,
  },
  grantButton: {
    borderWidth: 1,
    borderColor: "grey",
    padding: 6,
    borderRadius: 10,
    marginTop: 12,
    alignSelf: "center",
    marginBottom: 12,
  },
});
