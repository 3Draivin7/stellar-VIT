import { setCookie, getCookie } from './cookie';
import { TIngredient, TOrder, TOrdersData, TUser } from './types';

export const URL = process.env.BURGER_API_URL;

export const checkResponse = <T>(res: Response): Promise<T> =>
  res.ok ? res.json() : res.json().then((err) => Promise.reject(err));

type TServerResponse<T> = {
  success: boolean;
} & T;

export type TRegisterData = {
  email: number;
  name: string;
  password: string;
  secondName: string;
};

type TAuthResponse = TServerResponse<{
  refreshToken: string;
  accessToken: string;
  user: TUser;
}>;

export const registerUserApi = async (
  data: TRegisterData
): Promise<TAuthResponse> => {
  try {
    const response = await fetch(`${URL}registration`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.message || 'Произошла ошибка');
    }

    const responseData = await response.json();

    return Promise.reject(responseData);
  } catch (error) {
    throw error; // Передаем ошибку дальше
  }
};

export type TLoginData = {
  email: number;
  password: string;
};

export const loginUserApi = (data: TLoginData): Promise<TAuthResponse> =>
  new Promise((resolve, reject) => {
    fetch(`${URL}login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(data)
    })
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          response
            .json()
            .then((responseData) => {
              resolve(responseData);
            })
            .catch(() => {
              reject(
                new Error('Произошла ошибка при получении данных от сервера')
              );
            });
        } else {
          response
            .json()
            .then((errorData) => {
              reject(new Error(errorData?.message || 'Произошла ошибка'));
            })
            .catch(() => {
              reject(
                new Error('Произошла ошибка при получении данных от сервера')
              );
            });
        }
      })
      .catch((error) => {
        reject(error);
      });
  });

export const logoutApi = () =>
  fetch(`${URL}logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({
      token: localStorage.getItem('refreshToken')
    })
  }).then((res) => checkResponse<TServerResponse<{}>>(res));
