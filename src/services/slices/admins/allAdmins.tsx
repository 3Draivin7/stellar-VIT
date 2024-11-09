import {
  SerializedError,
  createAsyncThunk,
  createSlice
  , PayloadAction
} from '@reduxjs/toolkit';

interface User {
 email: string;
 name: string;
 secondName: string;
 isActivated: boolean;
 lvl: number;
}

export interface adminsState {
 isAuthChecked: boolean;
 isAuthenticated: boolean;
 loginError?: SerializedError;
 registerError?: SerializedError;
 data: User[];
 isLoading: boolean;
 error: string | undefined | null;
}

const initialState: adminsState = {
 isAuthChecked: false,
 isAuthenticated: false,
 data: [],
 isLoading: false,
 error: null,
};

// Асинхронная функция для получения пользователей
export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
 try {
  const response = await fetch('http://localhost:5000/api/users'); // Замените на ваш endpoint
  if (!response.ok) {
   throw new Error('Ошибка при получении пользователей');
  }
  const data = await response.json();
  return data;
 } catch (error) {
  throw error;
 }
});

export const allAdmins = createSlice({
 name: 'users',
 initialState,
 reducers: {},
 extraReducers: (builder) => {
  builder
   .addCase(fetchUsers.pending, (state) => {
    state.isLoading = true;
    state.error = null;
   })
   .addCase(fetchUsers.fulfilled, (state, action) => {
    state.isLoading = false;
    state.data = action.payload;
   })
   .addCase(fetchUsers.rejected, (state, action) => {
    state.isLoading = false;
    if (action.error.message !== undefined) {
     state.error = action.error.message;
    }
   });
 },
});

//export const selectUsers = (state) => state.users.users;
//export const selectUsersLoading = (state) => state.users.isLoading;
//export const selectUsersError = (state) => state.users.error;


