import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import ChatInputBar from "../components/input/ChatInputBar.tsx";
import WelcomeScreen from "../components/shared/WelcomeScreen.tsx";
import ChatHistory from "../components/history/ChatHistory.tsx";
import ErrorBanner from "../components/shared/ErrorBanner.tsx";
import { useHistoryById, useSendMessage } from "../queries/HistoryQueries.ts";
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
  const { mutate: send, isPending, isError: isSendError } = useSendMessage();

  // Mensagem do usuário exibida otimisticamente, antes da resposta da LLM chegar.
  const [pending, setPending] = useState<string | null>(null);
  // Último texto enviado, mantido para permitir reenvio em caso de falha.
  const [lastSent, setLastSent] = useState<string | null>(null);

  const prompts = history?.prompts ?? [];

  // Limpa a mensagem otimista assim que o backend devolve o prompt já respondido.
  useEffect(() => {
    if (pending && prompts.some((p) => p.text === pending && p.response)) {
      setPending(null);
    }
  }, [prompts, pending]);

  const displayedPrompts: Prompt[] = pending
    ? [...prompts, { text: pending, response: null }]
    : prompts;

  const submit = (text: string) => {
    setPending(text);
    setLastSent(text);
    send(
      {
        historyId: hasChatId ? numericChatId : null,
        userMessage: text,
      },
      {
        onSuccess: (data) => {
          // Novo chat: navega para o id retornado pelo backend
          if (!hasChatId && data.history.id) {
            navigate(`/chat/${data.history.id}`, { replace: true });
          }
        },
        onError: () => {
          // Remove a bolha otimista; o texto fica em lastSent para reenvio.
          setPending(null);
        },
      },
    );
  };

  const showWelcome =
    isRoot && !pending && !isSendError && prompts.length === 0;

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
    if (isHistoryLoading && !pending) return null;
    return (
      <ChatHistory prompts={displayedPrompts} isAwaitingResponse={isPending} />
    );
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex flex-col flex-1 overflow-y-auto">{renderContent()}</div>

      {isSendError && lastSent && (
        <div className="w-full max-w-2xl mx-auto px-4 pb-2">
          <ErrorBanner
            message="Falha ao enviar a mensagem."
            onRetry={() => submit(lastSent)}
          />
        </div>
      )}

      <ChatInputBar onSend={submit} isPending={isPending} />
    </div>
  );
};

const ChatPage = () => {
  return <ChatArea />;
};

export default ChatPage;
