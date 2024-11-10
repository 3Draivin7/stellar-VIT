import { combineReducers, Reducer } from 'redux';
import { UnknownAction, configureStore } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import { userSlice } from './slices/user';
import { TUserState } from './slices/user';
import { allAdmins, adminsState } from './slices/admins/allAdmins';
import { WorkersState, workersSlice } from './slices/worker';
import { giftsSlice, GiftsState } from './slices/gifts/gifts';

// Удалите закомментированный тип RootState

export type RootState = {
  user: TUserState;
  allAdmins: adminsState;
  worker: WorkersState;
  gifts: GiftsState;
};

export const rootReducer: Reducer<
  RootState,
  UnknownAction,
  Partial<RootState>
> = combineReducers({
  user: userSlice.reducer,
  allAdmins: allAdmins.reducer,
  worker: workersSlice.reducer,
  gifts: giftsSlice.reducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

// Правильное определение RootState
//export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
