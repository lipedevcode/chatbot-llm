import { api } from "./api";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  nome: string;
  username: string;
  email: string;
  password: string;
}

// POST /api/v1/auth/login — backend devolve o JWT cru (texto puro, não JSON).
export const login = async (body: LoginRequest): Promise<string> => {
  const { data } = await api.post<string>("/api/v1/auth/login", body);
  return data;
};

// POST /api/v1/auth/signup — idem, devolve o JWT cru.
export const signup = async (body: SignupRequest): Promise<string> => {
  const { data } = await api.post<string>("/api/v1/auth/signup", body);
  return data;
};
