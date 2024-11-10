import {
  SerializedError,
  createAsyncThunk,
  createSlice,
  PayloadAction
} from '@reduxjs/toolkit';
import {
  TRegisterData,
  registerUserApi,
  TLoginData,
  loginUserApi,
  logoutApi
} from '../../../utils/burger-api';
import { TUser } from '../../../utils/types';
import { URL } from '../../../utils/burger-api';

export function getCookie(name: string): string | undefined {
  const matches = document.cookie.match(
    new RegExp(
      '(?:^|; )' +
        // eslint-disable-next-line no-useless-escape
        name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') +
        '=([^;]*)'
    )
  );
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

export function setCookie(
  name: string,
  value: string,
  props: { [key: string]: string | number | Date | boolean } = {}
) {
  props = {
    path: '/',
    ...props
  };

  let exp = props.expires;
  if (exp && typeof exp === 'number') {
    const d = new Date();
    d.setTime(d.getTime() + exp * 1000);
    exp = props.expires = d;
  }

  if (exp && exp instanceof Date) {
    props.expires = exp.toUTCString();
  }
  value = encodeURIComponent(value);
  let updatedCookie = name + '=' + value;
  for (const propName in props) {
    updatedCookie += '; ' + propName;
    const propValue = props[propName];
    if (propValue !== true) {
      updatedCookie += '=' + propValue;
    }
  }
  document.cookie = updatedCookie;
}

export function deleteCookie(name: string) {
  setCookie(name, '', { expires: -1 });
}

export type TUserState = {
  isAuthChecked: boolean;
  isAuthenticated: boolean;
  loginError?: SerializedError;
  registerError?: SerializedError;
  data: TUser | null;
  allData: TUser[] | null;
  isLoading: boolean; // Добавлено isLoading
  error?: string;
};

export const initialState: TUserState = {
  isAuthChecked: false,
  isAuthenticated: false,
  registerError: undefined,
  data: { email: 0, name: '', secondName: '', isActivated: false, lvl: 0 },
  allData: [],
  isLoading: false, // Добавлено начальное состояние isLoading
  error: ''
};

const storeTokens = (refreshToken: string, accessToken: string) => {
  setCookie('accessToken', String(accessToken));
  localStorage.setItem('refreshToken', String(refreshToken));
};

export const register = createAsyncThunk<TUser, TRegisterData>(
  'user/register',
  async (data, { rejectWithValue }) => {
    const response = await registerUserApi(data);
    if (!response?.success) return rejectWithValue(response);

    const { user, refreshToken, accessToken } = response;
    storeTokens(refreshToken, accessToken);

    return user;
  }
);

export const login = createAsyncThunk<TUser, TLoginData>(
  'user/login',
  async (data, { rejectWithValue }) => {
    try {
      const response = await loginUserApi(data);
      const { user, refreshToken, accessToken } = response;
      storeTokens(refreshToken, accessToken);
      return response.user;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const clearTokens = () => {
  localStorage.removeItem('refreshToken');
  deleteCookie('accessToken');
};

export const logout = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    const response = await logoutApi();
    if (!response?.success) return rejectWithValue(response);
    clearTokens();
  }
);

type checkAuthThink = {
  accesToken: string;
  refreshToken: string;
  user: TUser | null;
};

export const checkAuth = createAsyncThunk<checkAuthThink | null, void>(
  'auth/checkAuth',
  async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        return null;
      }

      const response = await fetch(`${URL}refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refreshToken })
      });

      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }
      const data = await response.json();
      storeTokens(data.refreshToken, data.accessToken);
      return data;
    } catch (error) {
      //return (error);
      return null;
    }
  }
);

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  try {
    const response = await fetch(`${URL}users`);
    if (!response.ok) {
      throw new Error('Ошибка при получении пользователей');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
    //return null
  }
});
interface LoginError {
  message: string;
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<TUser>) {
      state.isAuthenticated = true;
      state.data = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.registerError = undefined;
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.registerError = undefined;
        state.isAuthenticated = true;
        state.data = action.payload;
        state.isLoading = false;
      })
      .addCase(register.rejected, (state, action) => {
        if (action.payload) {
          state.registerError = action.payload;
        } else {
          state.registerError = action.error;
        }
        state.isLoading = false;
      })
      .addCase(login.pending, (state) => {
        state.loginError = undefined;
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loginError = undefined;
        state.isAuthenticated = true;
        state.data = action.payload;
        state.isLoading = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.loginError = action.meta.rejectedWithValue
          ? (action.payload as SerializedError)
          : action.error;
        state.isLoading = false;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        if (action.payload) {
          state.isAuthenticated = true;
          state.data = action.payload.user;
        } else {
          state.isAuthenticated = false;
          state.data = null;
        }
      })
      .addCase(checkAuth.rejected, (state, action) => {
        if (action.error?.message) {
          console.error(
            'Ошибка проверки аутентификации:',
            action.error.message
          );
        } else {
          console.error('Ошибка проверки аутентификации:', action.error);
        }
        state.isAuthenticated = false;
        state.data = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.data = {
          email: 0,
          name: '',
          secondName: '',
          lvl: 0,
          isActivated: false
        };
        state.isLoading = false;
      })
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = '';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allData = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  }
});
