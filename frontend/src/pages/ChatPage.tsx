import { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import ChatInputBar, {
  type AttachedFile,
} from "../components/input/ChatInputBar.tsx";
import WelcomeScreen from "../components/shared/WelcomeScreen.tsx";
import ChatHistory from "../components/history/ChatHistory.tsx";
import ErrorBanner from "../components/shared/ErrorBanner.tsx";
import {
  useChatStream,
  useHistoryById,
  useSendMessage,
} from "../queries/HistoryQueries.ts";
import type { Prompt } from "../interfaces/database";

const ChatArea = () => {
  const location = useLocation();
  const isRoot = location.pathname === "/";
  const { chatId } = useParams();
  const navigate = useNavigate();

  const numericChatId = Number(chatId);
  const hasChatId = Number.isFinite(numericChatId);

  const {
    data: history,
    isError: isHistoryError,
    isLoading: isHistoryLoading,
  } = useHistoryById(hasChatId ? numericChatId : null);

  // Fluxo de streaming (SSE) — usado para mensagens de texto.
  const stream = useChatStream({
    onNewChatComplete: (id) => navigate(`/chat/${id}`, { replace: true }),
  });

  // Fluxo não-streaming — usado apenas quando há anexos, que continuam pelo
  // endpoint multipart. O endpoint de streaming atende só mensagens de texto.
  const {
    mutate: send,
    isPending: isSending,
    isError: isSendError,
  } = useSendMessage();

  // Mensagem otimista do caminho com anexos (o de streaming usa stream.pendingUser).
  const [pendingFile, setPendingFile] = useState<string | null>(null);
  // Último envio, mantido para permitir reenvio em caso de falha.
  const [lastSent, setLastSent] = useState<{
    text: string;
    attachments?: AttachedFile[];
  } | null>(null);

  const prompts = history?.prompts ?? [];

  const isBusy = stream.isStreaming || isSending;
  const hasError = isSendError || stream.error != null;

  // Bolha otimista da mensagem em andamento (streaming OU anexo). No streaming, a
  // resposta parcial cresce token a token; antes do primeiro token, response é
  // null e a bolha exibe o indicador de "digitando".
  const optimistic: Prompt | null =
    stream.pendingUser != null
      ? {
          text: stream.pendingUser,
          response:
            stream.streamingText != null
              ? { text: stream.streamingText }
              : null,
          files: [],
        }
      : pendingFile != null
        ? { text: pendingFile, response: null, files: [] }
        : null;

  const displayedPrompts: Prompt[] = optimistic
    ? [...prompts, optimistic]
    : prompts;

  const submit = (text: string, attachedFiles?: AttachedFile[]) => {
    setLastSent({ text, attachments: attachedFiles });
    stream.reset();

    if (attachedFiles && attachedFiles.length > 0) {
      // Caminho com anexos: fluxo não-streaming (multipart).
      setPendingFile(text);
      send(
        {
          historyId: hasChatId ? numericChatId : null,
          userMessage: text,
          files: attachedFiles.map((a) => a.file),
        },
        {
          onSuccess: (data) => {
            // O cache já foi semeado com o histórico atualizado (useSendMessage);
            // limpar a bolha otimista aqui evita duplicar o prompt.
            setPendingFile(null);
            if (!hasChatId && data.history.id) {
              navigate(`/chat/${data.history.id}`, { replace: true });
            }
          },
          onError: () => {
            // Remove a bolha otimista; o texto fica em lastSent para reenvio.
            setPendingFile(null);
          },
        },
      );
      return;
    }

    // Caminho só de texto: streaming SSE.
    stream.start({
      historyId: hasChatId ? numericChatId : null,
      userMessage: text,
    });
  };

  const showWelcome =
    isRoot && !optimistic && !hasError && prompts.length === 0;

  const renderContent = () => {
    if (isHistoryError) {
      return (
        <div className="max-w-2xl mx-auto w-full px-4 py-6">
          <ErrorBanner message="Não foi possível carregar esta conversa." />
        </div>
      );
    }
    if (showWelcome) return <WelcomeScreen />;
    // Carregando um chat existente: evita piscar a tela de boas-vindas.
    if (isHistoryLoading && !optimistic) return null;
    return (
      <ChatHistory prompts={displayedPrompts} isAwaitingResponse={isBusy} />
    );
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex flex-col flex-1 overflow-y-auto">
        {renderContent()}
      </div>

      {hasError && lastSent && (
        <div className="w-full max-w-2xl mx-auto px-4 pb-2">
          <ErrorBanner
            message="Falha ao enviar a mensagem."
            onRetry={() => submit(lastSent.text, lastSent.attachments)}
          />
        </div>
      )}

      <ChatInputBar onSend={submit} isPending={isBusy} />
    </div>
  );
};

const ChatPage = () => {
  // As rotas "/" e "/chat/:chatId" renderizam este mesmo componente, então o React
  // reconcilia o ChatArea como a mesma instância ao navegar entre elas — sem uma
  // key, o estado (streaming, bolha otimista) vazaria de uma conversa para outra e
  // não seria descartado ao concluir o 1º envio. A key por conversa força a
  // remontagem a cada troca de rota, garantindo estado isolado por conversa.
  const { chatId } = useParams();
  return <ChatArea key={chatId ?? "new"} />;
};

export default ChatPage;
