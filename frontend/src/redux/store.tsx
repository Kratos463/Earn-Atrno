
import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import authReducer from './authSlice'
import dailyTaskReducer from './dailyTaskSlice'
import levelReducer from './levelSlice'
import officialTaskReducer from './officialTaskSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dailyTask : dailyTaskReducer,
    level: levelReducer,
    officialTask: officialTaskReducer
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
