import React from "react";
import AppNavigator from "./src/components/navigation/AppNavigator";
import { Provider } from "react-redux";
import Toast from "react-native-toast-message";
import store from "./src/redux/store";
function App() {
  return (
    <Provider store={store}>
      <AppNavigator />
      <Toast />
    </Provider>
  );
}

export default App;
