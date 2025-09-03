import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

export type LoginPayload = {
  email: string;
  password: string;
};

const BE_URL = 'http://localhost:4000/api/v1';

export async function login(payload: LoginPayload) {
  const { data } = await axios.post(`${BE_URL}/auth/login`, payload, {
    withCredentials: true,
  });
  return data;
}

export function useLogin() {
  return useMutation({
    mutationKey: ['login'],
    mutationFn: (payload: LoginPayload) => login(payload),
  });
}