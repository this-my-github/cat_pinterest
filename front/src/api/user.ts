import { BASE_URL } from "../constanst/url";

interface User {
  login: string;
  password: string;
}

export interface UserResponseWithToken {
  user: User;
  token: string;
}

export interface UserResponseError {
  message: string;
}

type UserResponse = UserResponseWithToken | UserResponseError;

export const createUser = async ({ login, password }: User): Promise<UserResponse> => {
  const response = await fetch(`${BASE_URL}/user`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ login, password }),
  });

  if (!response.ok) {
    const errorData: UserResponseError = await response.json();
    throw new Error(errorData.message || 'Failed to create user');
  }

  const loadedData: UserResponseWithToken = await response.json();
  return loadedData;
};

export const loginUser = async ({ login, password }: User): Promise<UserResponse> => {
  const response = await fetch(`${BASE_URL}/user/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ login, password }),
  });

  if (!response.ok) {
    const errorData: UserResponseError = await response.json();
    throw new Error(errorData.message || 'Failed to login user');
  }

  const loadedData: UserResponseWithToken = await response.json();
  return loadedData;
};