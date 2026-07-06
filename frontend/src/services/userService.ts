import { api } from "./api";
import type { PerfilUsuario } from "../interfaces/database";

export interface AtualizarPerfilRequest {
  nome?: string;
  email?: string;
}

export const getPerfil = async (): Promise<PerfilUsuario> => {
  const { data } = await api.get<PerfilUsuario>("/api/v1/users/me");
  return data;
};

export const atualizarPerfil = async (
  body: AtualizarPerfilRequest
): Promise<PerfilUsuario> => {
  const { data } = await api.put<PerfilUsuario>("/api/v1/users/me", body);
  return data;
};
