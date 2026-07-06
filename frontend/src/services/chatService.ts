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

export interface StreamMessageRequest {
  historyId?: number | null;
  userMessage: string;
  files?: globalThis.File[];
}

export interface StreamMeta {
  historyId: number;
  title: string | null;
}

export interface StreamCallbacks {
  // Metadados iniciais: id da conversa (útil para conversas novas) e título.
  onMeta?: (meta: StreamMeta) => void;
  // Cada fragmento de texto da resposta da LLM.
  onToken?: (text: string) => void;
  // Conclusão bem-sucedida: o backend devolve o histórico já atualizado (com a
  // interação e os metadados dos anexos), para semear o cache sem um novo GET.
  onDone?: (history: ChatHistory) => void;
  // Erro reportado pelo backend durante a geração.
  onError?: (message: string) => void;
}

/**
 * Envia uma mensagem e consome a resposta da LLM em streaming (SSE) via fetch +
 * ReadableStream. Usamos fetch em vez de EventSource porque o EventSource nativo
 * só faz GET e não permite enviar o header Authorization nem anexos.
 *
 * Sem anexos envia JSON; com anexos (PDF) envia multipart/form-data. O backend
 * emite eventos nomeados (meta, token, done, error) com dados em JSON.
 */
export const streamMessage = async (
  body: StreamMessageRequest,
  callbacks: StreamCallbacks,
  signal?: AbortSignal,
): Promise<void> => {
  const token = localStorage.getItem("token");
  const authHeader: Record<string, string> = token
    ? { Authorization: `Bearer ${token}` }
    : {};
  const hasFiles = body.files && body.files.length > 0;

  let requestBody: BodyInit;
  let headers: Record<string, string>;
  if (hasFiles) {
    const formData = new FormData();
    formData.append("message", body.userMessage);
    if (body.historyId != null) {
      formData.append("historyId", String(body.historyId));
    }
    body.files!.forEach((file) => formData.append("files", file));
    requestBody = formData;
    // Sem Content-Type: o browser define o boundary do multipart automaticamente.
    headers = { Accept: "text/event-stream", ...authHeader };
  } else {
    requestBody = JSON.stringify({
      historyId: body.historyId ?? null,
      userMessage: body.userMessage,
    });
    headers = {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
      ...authHeader,
    };
  }

  const response = await fetch("/api/v1/chat/message/stream", {
    method: "POST",
    headers,
    body: requestBody,
    signal,
  });

  // Espelha o interceptor do axios: token inválido/expirado → limpa e vai pro login.
  if (response.status === 401) {
    localStorage.removeItem("token");
    globalThis.location.href = "/login";
    return;
  }

  if (!response.ok || !response.body) {
    throw new Error(`Falha ao iniciar o streaming (HTTP ${response.status})`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      // Eventos SSE são separados por uma linha em branco (\n\n ou \r\n\r\n).
      let boundary = findEventBoundary(buffer);
      while (boundary !== -1) {
        const rawEvent = buffer.slice(0, boundary.index);
        buffer = buffer.slice(boundary.index + boundary.length);
        dispatchSseEvent(rawEvent, callbacks);
        boundary = findEventBoundary(buffer);
      }
    }
  } finally {
    reader.releaseLock();
  }
};

// Localiza o fim de um evento SSE (linha em branco), tolerando \n e \r\n.
const findEventBoundary = (
  buffer: string,
): { index: number; length: number } | -1 => {
  const lf = buffer.indexOf("\n\n");
  const crlf = buffer.indexOf("\r\n\r\n");
  if (lf === -1 && crlf === -1) return -1;
  if (crlf === -1 || (lf !== -1 && lf < crlf)) return { index: lf, length: 2 };
  return { index: crlf, length: 4 };
};

const dispatchSseEvent = (raw: string, callbacks: StreamCallbacks): void => {
  let eventName = "message";
  const dataLines: string[] = [];

  for (const line of raw.split(/\r?\n/)) {
    if (line.startsWith(":")) continue; // comentário/keep-alive
    if (line.startsWith("event:")) {
      eventName = line.slice("event:".length).trim();
    } else if (line.startsWith("data:")) {
      // O primeiro espaço após "data:" é opcional e deve ser removido.
      dataLines.push(line.slice("data:".length).replace(/^ /, ""));
    }
  }

  if (dataLines.length === 0) return;

  let payload: unknown;
  try {
    payload = JSON.parse(dataLines.join("\n"));
  } catch {
    return; // dado malformado: ignora em vez de derrubar o stream
  }

  switch (eventName) {
    case "meta":
      callbacks.onMeta?.(payload as StreamMeta);
      break;
    case "token":
      callbacks.onToken?.((payload as { text?: string }).text ?? "");
      break;
    case "done":
      callbacks.onDone?.((payload as { history: ChatHistory }).history);
      break;
    case "error":
      callbacks.onError?.(
        (payload as { message?: string }).message ?? "Erro no streaming.",
      );
      break;
  }
};

export const signup = async (): Promise<string> => {
  // Temporário, integrar form de register e login com api
  const random =
    globalThis.crypto?.randomUUID?.().replace(/-/g, "") ??
    Math.random().toString(36).slice(2) + Date.now().toString(36);
  const handle = `anon_${random.slice(0, 20)}`;
  const payload = {
    nome: "Usuário Anônimo",
    username: handle,
    email: `${handle}@chatbot.local`,
    password: random,
  };
  const { data } = await api.post<string>("/api/v1/auth/signup", payload);
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