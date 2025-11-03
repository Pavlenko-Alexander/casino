import { configureStore } from "@reduxjs/toolkit";
import lobbyReducer from "./slices/lobbySlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      lobby: lobbyReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
