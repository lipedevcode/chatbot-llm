import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  getAllHistoriesByUser,
  getHistoryById,
  sendMessage,
  streamMessage,
  type SendChatMessageRequest,
} from "../services/chatService";
import type { Attachment, ChatHistory } from "../interfaces/database";

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

// POST /api/v1/chat/message/stream (SSE)
export interface UseChatStreamOptions {
  // Chamado quando uma conversa NOVA conclui, com o id retornado pelo backend.
  // A navegação só ocorre aqui (e não no evento meta) porque as rotas "/" e
  // "/chat/:id" remontam a página — navegar no meio do streaming perderia o
  // estado local. Ao concluir, o cache já está semeado com a conversa completa.
  onNewChatComplete: (historyId: number) => void;
}

export interface StartStreamParams {
  historyId: number | null;
  userMessage: string;
  // Arquivos a enviar (PDF). Quando presentes, o streaming vai por multipart.
  files?: globalThis.File[];
  // Metadados dos anexos para exibição otimista dos chips durante o streaming.
  attachments?: Attachment[];
}

export interface UseChatStreamResult {
  // Texto da mensagem do usuário exibido otimisticamente.
  pendingUser: string | null;
  // Anexos exibidos otimisticamente na bolha do usuário durante o streaming.
  pendingAttachments: Attachment[];
  // Resposta parcial da LLM; null antes do primeiro token (mostra "digitando").
  streamingText: string | null;
  isStreaming: boolean;
  error: string | null;
  start: (params: StartStreamParams) => void;
  reset: () => void;
}

export const useChatStream = (
  options: UseChatStreamOptions,
): UseChatStreamResult => {
  const queryClient = useQueryClient();

  // Mantém as opções em um ref para que `start` permaneça estável mesmo quando o
  // chamador passa um objeto de opções recriado a cada render. `start` só é
  // chamado em eventos de usuário (bem depois da montagem), então sincronizar o
  // ref em um efeito é suficiente e evita escrita em ref durante o render.
  const optionsRef = useRef(options);
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  const [pendingUser, setPendingUser] = useState<string | null>(null);
  const [pendingAttachments, setPendingAttachments] = useState<Attachment[]>([]);
  const [streamingText, setStreamingText] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Aborta o stream se o componente desmontar no meio (evita setState órfão).
  const abortRef = useRef<AbortController | null>(null);
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      abortRef.current?.abort();
    };
  }, []);

  const reset = useCallback(() => setError(null), []);

  const start = useCallback(
    (params: StartStreamParams) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setPendingUser(params.userMessage);
      setPendingAttachments(params.attachments ?? []);
      setStreamingText(null);
      setIsStreaming(true);
      setError(null);

      let answer = "";

      const finishError = (message: string) => {
        if (!mountedRef.current) return;
        setPendingUser(null);
        setPendingAttachments([]);
        setStreamingText(null);
        setIsStreaming(false);
        setError(message);
      };

      streamMessage(
        { historyId: params.historyId, userMessage: params.userMessage, files: params.files },
        {
          onToken: (token) => {
            answer += token;
            if (mountedRef.current) setStreamingText(answer);
          },
          onDone: (history) => {
            const id = history.id;
            if (id == null) {
              finishError("Resposta de streaming sem id de conversa.");
              return;
            }

            // O backend devolve o histórico já atualizado (com a interação e os
            // metadados dos anexos): semeamos o cache com ele — resposta
            // autoritativa — evitando um GET e garantindo que os chips dos PDFs
            // apareçam. Um eventual refetch depois é consistente.
            queryClient.setQueryData<ChatHistory>(["history", id], history);
            queryClient.invalidateQueries({ queryKey: ["histories"] });

            const isNewChat = params.historyId == null;
            if (!isNewChat && mountedRef.current) {
              // Conversa existente: limpa o estado local; o cache já tem a interação.
              setPendingUser(null);
              setPendingAttachments([]);
              setStreamingText(null);
              setIsStreaming(false);
            }
            // Conversa nova: navega para a rota da conversa. A página remonta e lê
            // o cache já semeado; não limpamos o estado local (será descartado).
            if (isNewChat) optionsRef.current.onNewChatComplete(id);
          },
          onError: (message) => finishError(message),
        },
        controller.signal,
      ).catch((err: unknown) => {
        if (controller.signal.aborted) return; // desmontou/reenviou: ignora
        finishError(
          err instanceof Error ? err.message : "Falha ao enviar a mensagem.",
        );
      });
    },
    [queryClient],
  );

  return {
    pendingUser,
    pendingAttachments,
    streamingText,
    isStreaming,
    error,
    start,
    reset,
  };
};
