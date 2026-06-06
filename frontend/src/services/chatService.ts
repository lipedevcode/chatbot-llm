import { api } from "./api";
import type { ChatHistory } from "../interfaces/database";


export interface SendChatMessageRequest {
  historyId?: number | null;
  userMessage: string;
}

export interface SendChatMessageResponse {
  history: ChatHistory;
  aiMessage: string;
}


// POST /api/v1/chat/message
// Envia uma mensagem. Se historyId for null, o backend cria um novo histórico.
// Retorna o histórico atualizado e a resposta da IA.
export const sendMessage = async (
  body: SendChatMessageRequest
): Promise<SendChatMessageResponse> => {
  const { data } = await api.post<SendChatMessageResponse>(
    "/api/v1/chat/message",
    body
  );
  return data;
};

// POST /api/v1/chat/signup
// Registra um novo usuário e retorna o subject (username hash) como string.
export const signup = async (): Promise<string> => {
  const { data } = await api.post<string>("/api/v1/auth/signup");
  return data;
};

// GET /api/v1/chat/history/{id}
// Retorna um histórico específico com todos os seus prompts.
export const getHistoryById = async (id: number): Promise<ChatHistory> => {
  const { data } = await api.get<ChatHistory>(`/api/v1/history/${id}`);
  return data;
};

// GET /api/v1/chat/history/all/by-user
// Retorna todos os históricos do usuário autenticado (via token no header).
export const getAllHistoriesByUser = async (): Promise<ChatHistory[]> => {
  const { data } = await api.get<ChatHistory[]>(
    "/api/v1/history/all/by-user"
  );
  return data;
};