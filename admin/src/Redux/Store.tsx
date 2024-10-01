import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from './Auth'
import UserReducer from './User'
import LevelReducer from './Levels'
import TaskReducer from './Tasks'

const store = configureStore({
  reducer: {
    auth: AuthReducer,
    user: UserReducer,
    level: LevelReducer,
    task: TaskReducer
  },
});
export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;