import { compose, createStore, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import { createLogger } from "redux-logger";
import createSecureStore from "redux-persist-expo-securestore";
import { persistStore, persistReducer } from "redux-persist";
import reducer from "./reducers";

const persistConfig = {
  key: "root",
  storage: createSecureStore()
};
const loggerMiddleware = createLogger({
  predicate: (getState, action) => __DEV__
});
const persistedReducer = persistReducer(persistConfig, reducer);
const store = createStore(
  persistedReducer,
  {},
  compose(applyMiddleware(thunkMiddleware, loggerMiddleware))
);

const persistor = persistStore(store);
// persistor.purge();

export { store, persistor };
