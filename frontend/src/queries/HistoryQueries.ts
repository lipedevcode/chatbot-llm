import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllHistoriesByUser,
  getHistoryById,
  sendMessage,
  type SendChatMessageRequest,
} from "../services/chatService";
import type { ChatHistory } from "../interfaces/database";

// GET /api/v1/history/all/by-user
export const useHistories = () =>
  useQuery({
    queryKey: ["histories"],
    queryFn: async (): Promise<ChatHistory[]> => {
      const data = await getAllHistoriesByUser();
      // Guard: garante que sempre retorna um array independente do backend
      return Array.isArray(data) ? data : [];
    },
  });

// GET /api/v1/history/{id}
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
      // O POST já devolve o histórico atualizado completo: semeamos o cache com ele
      // (resposta autoritativa) em vez de refetch — evita o flash pós-envio.
      if (historyId != null) {
        queryClient.setQueryData(["history", historyId], data.history);
      }
      // A lista da sidebar pode ter um chat novo: invalida para refletir.
      queryClient.invalidateQueries({ queryKey: ["histories"] });
    },
  });
};
