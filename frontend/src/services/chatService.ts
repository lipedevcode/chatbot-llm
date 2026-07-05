import { api } from "./api";
import type { ChatHistory } from "../interfaces/database";

export interface SendChatMessageRequest {
  historyId?: number | null;
  userMessage: string;
  files?: globalThis.File[];
}

export interface SendChatMessageResponse {
  history: ChatHistory;
  aiMessage: string;
}

export const sendMessage = async (
  body: SendChatMessageRequest
): Promise<SendChatMessageResponse> => {
  const hasFiles = body.files && body.files.length > 0;

  if (hasFiles) {
    const formData = new FormData();
    formData.append("message", body.userMessage);
    if (body.historyId != null) {
      formData.append("historyId", String(body.historyId));
    }
    body.files!.forEach((file) => formData.append("files", file));

    const { data } = await api.post<SendChatMessageResponse>(
      "/api/v1/chat/message",
      formData,
      { headers: { "Content-Type": undefined } }
    );
    return data;
  }

  // Sem arquivos — envia JSON puro
  const { data } = await api.post<SendChatMessageResponse>(
    "/api/v1/chat/message",
    { historyId: body.historyId, userMessage: body.userMessage }
  );
  return data;
};

export const signup = async (): Promise<string> => {
  const { data } = await api.post<string>("/api/v1/auth/signup");
  return data;
};

export const getHistoryById = async (id: number): Promise<ChatHistory> => {
  const { data } = await api.get<ChatHistory>(`/api/v1/history/${id}`);
  return data;
};

export const getAllHistoriesByUser = async (): Promise<ChatHistory[]> => {
  const { data } = await api.get<ChatHistory[]>("/api/v1/history/all/by-user");
  return data;
};