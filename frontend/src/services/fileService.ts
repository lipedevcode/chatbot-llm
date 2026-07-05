import { api } from "./api";
import type { FileMeta } from "../interfaces/database";

export const getFiles = async (): Promise<FileMeta[]> => {
  const { data } = await api.get<FileMeta[]>("/api/v1/files");
  return data;
};

// O PDF exige o header Authorization, então não dá para abrir a URL direto
// numa <iframe>/nova aba. Buscamos como blob (o axios injeta o token) e
// devolvemos um object URL. Quem chamar deve revogar com URL.revokeObjectURL.
export const getFileBlobUrl = async (id: string): Promise<string> => {
  const { data } = await api.get(`/api/v1/files/${id}`, {
    responseType: "blob",
  });
  return URL.createObjectURL(data);
};
