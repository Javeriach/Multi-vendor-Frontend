import { apiFetch } from '@/lib/api/client';
import { User } from '@/types/auth';

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export const authApi = {
  me: () => apiFetch<{ user: User }>('/auth/me'),
  login: (input: LoginInput) => apiFetch<{ user: User }>('/auth/login', { method: 'POST', body: input }),
  register: (input: RegisterInput) =>
    apiFetch<{ user: User }>('/auth/register', { method: 'POST', body: input }),
  logout: () => apiFetch<{ message: string }>('/auth/logout', { method: 'POST' }),
};
