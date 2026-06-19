import Toast from "react-native-toast-message";

export const handleSuccess = (message) => {
  Toast.show({
    type: "success",
    text1: "Success",
    text2: message,
    position: "top",
  });
};

export const handleError = (message) => {
  Toast.show({
    type: "error",
    text1: "Error",
    text2: message,
    position: "top",
  });
};
