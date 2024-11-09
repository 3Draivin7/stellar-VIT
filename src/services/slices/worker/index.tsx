import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { URL } from '../../../utils/burger-api';

interface Worker {
    number: number;
    points: number;
    name: string;
    secondName: string;
    history: { points: number; who: string }[];
   }
   
  export interface WorkersState {
    workers: Worker[];
    loading: boolean;
    error: string | null | undefined;
   }

const initialState: WorkersState = {
  workers: [],
  loading: false, 
  error: null,
};

// Асинхронная функция для получения работников
export const fetchWorkers = createAsyncThunk('workers/fetchWorkers', async () => {
  try {
    const response = await fetch(`${URL}worker/get`); 
    if (!response.ok) {
      throw new Error(`Ошибка получения работников: ${response.status}`);   
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return error.message;
  }
});

export const workersSlice = createSlice({
  name: 'workers',
  initialState,
  reducers: {
  },
  extraReducers(builder) {
    builder
      .addCase(fetchWorkers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWorkers.fulfilled, (state, action) => {
        state.loading = false;
        state.workers = action.payload;
      })
      .addCase(fetchWorkers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      });
  },
});

