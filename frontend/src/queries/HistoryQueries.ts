import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllHistoriesByUser,
  getHistoryById,
  sendMessage,
  signup,
  type SendChatMessageRequest,
} from "../services/chatService";
import type { ChatHistory } from "../interfaces/database";

// GET /api/v1/chat/history/all/by-user
export const useHistories = () =>
  useQuery({
    queryKey: ["histories"],
    queryFn: async (): Promise<ChatHistory[]> => {
      const data = await getAllHistoriesByUser();
      // Guard: garante que sempre retorna um array independente do backend
      return Array.isArray(data) ? data : [];
    },
  });

// GET /api/v1/chat/history/{id}
export const useHistoryById = (id: number | null) =>
  useQuery({
    queryKey: ["history", id],
    queryFn: () => getHistoryById(id!),
    enabled: id !== null,
  });

// POST /api/v1/chat/message
export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: SendChatMessageRequest) => sendMessage(body),
    onSuccess: (data) => {
      const historyId = data.history.id;
      queryClient.invalidateQueries({ queryKey: ["history", historyId] });
      queryClient.invalidateQueries({ queryKey: ["histories"] });
    },
  });
};

// POST /api/v1/chat/signup
export const useSignup = () =>
  useMutation({
    mutationFn: signup,
  });