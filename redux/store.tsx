import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import { persistStore, persistReducer } from "redux-persist";
import { thunk } from "redux-thunk";
import autoMergeLevel2 from "redux-persist/es/stateReconciler/autoMergeLevel2";
import AsyncStorage from "@react-native-async-storage/async-storage";

const userPersistConfig = {
  key: "user",
  storage: AsyncStorage,
  whitelist: ["profile", "authenticated"],
};



const userPersistedReducer = persistReducer(userPersistConfig, userReducer);

const store = configureStore({
  reducer: {
    user: userPersistedReducer,
  },
  middleware: () => [thunk],
});

const persistor = persistStore(store);

export { persistor, store };
