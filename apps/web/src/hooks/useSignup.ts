import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

export type SignupPayload = {
  name: string;
  email: string;
  password: string;
};

const BE_URL = 'http://localhost:4000/api/v1';

export async function signup(payload: SignupPayload) {
  const { data } = await axios.post(`${BE_URL}/auth/signup`, payload, {
    withCredentials: true,
  });
  return data;
}

export function useSignup() {
  return useMutation({
    mutationKey: ['signup'],
    mutationFn: (payload: SignupPayload) => signup(payload),
  });
}