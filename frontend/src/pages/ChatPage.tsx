import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import ChatInputBar from "../components/ChatInputBar.tsx";
import WelcomeScreen from "../components/WelcomeScreen.tsx";
import ChatHistory from "../components/ChatHistory.tsx";
import { useHistoryById, useSendMessage } from "../queries/HistoryQueries.ts";
import type { Prompt } from "../interfaces/database";

const ChatArea = () => {
  const location = useLocation();
  const isRoot = location.pathname === "/";
  const { chatId } = useParams();
  const navigate = useNavigate();

  const numericChatId = Number(chatId);
  const hasChatId = Number.isFinite(numericChatId);

  const { data: history } = useHistoryById(hasChatId ? numericChatId : null);
  const { mutate: send, isPending } = useSendMessage();

  // Mensagem do usuário exibida otimisticamente, antes da resposta da LLM chegar.
  const [pending, setPending] = useState<string | null>(null);

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

  const handleSend = (text: string) => {
    setPending(text);
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
          setPending(null);
        },
      },
    );
  };

  const showWelcome = isRoot && !pending && prompts.length === 0;

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex flex-col flex-1 overflow-y-auto">
        {showWelcome ? (
          <WelcomeScreen />
        ) : (
          <ChatHistory prompts={displayedPrompts} isAwaitingResponse={isPending} />
        )}
      </div>
      <ChatInputBar onSend={handleSend} isPending={isPending} />
    </div>
  );
};

const ChatPage = () => {
  return <ChatArea />;
};

export default ChatPage;
