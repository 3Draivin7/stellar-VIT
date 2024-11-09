import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { URL } from '../../../utils/burger-api';

interface Gift {
  link: string;
  points: number;
  name: string;
  _id:string
 }
 
export interface GiftsState {
  gifts: Gift[];
  isLoading: boolean;
  error: string | null;
 }


 
 const initialState: GiftsState = {
   gifts: [],
   isLoading: false,
   error: null,
 };

// Асинхронная функция для получения подарков с API
export const fetchGifts = createAsyncThunk('api/gifts', async () => {
  try {
    const response = await fetch(`${URL}gift`); // Замените на ваш API-адрес
    if (!response.ok) {
      throw new Error('Ошибка при получении данных');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
});

export const giftsSlice = createSlice({
  name: 'gifts',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchGifts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGifts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.gifts = action.payload;
      })
      .addCase(fetchGifts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ? action.error.message : null;
      });
  },
});



