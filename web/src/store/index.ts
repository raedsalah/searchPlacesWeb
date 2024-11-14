import { configureStore } from "@reduxjs/toolkit";
import searchesReducer from "./slice/searchesSlice";

const store = configureStore({
  reducer: {
    searches: searchesReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
