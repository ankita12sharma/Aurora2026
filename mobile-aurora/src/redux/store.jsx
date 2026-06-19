import { configureStore } from "@reduxjs/toolkit";
import { userSlice } from "./userSlice";
import { hydrationSlice } from "./hydrationSlice";
import { sleepSlice } from "./sleepSlice";
import { habitSlice } from "./habitSlice";
import { nutritionSlice } from "./nutritionSlice";
import { profileSlice } from "./profileSlice";
import { aiSlice } from "./aiSlice";

const store = configureStore({
  reducer: {
    [userSlice.reducerPath]: userSlice.reducer,
    [hydrationSlice.reducerPath]: hydrationSlice.reducer,
    [sleepSlice.reducerPath]: sleepSlice.reducer,
    [habitSlice.reducerPath]: habitSlice.reducer,
    [nutritionSlice.reducerPath]: nutritionSlice.reducer,
    [profileSlice.reducerPath]: profileSlice.reducer,
    [aiSlice.reducerPath]: aiSlice.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(userSlice.middleware)
      .concat(hydrationSlice.middleware)
      .concat(sleepSlice.middleware)
      .concat(habitSlice.middleware)
      .concat(nutritionSlice.middleware)
      .concat(profileSlice.middleware)
      .concat(aiSlice.middleware),
});
export default store;
