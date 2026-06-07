import { useParams, useLocation, useNavigate } from "react-router-dom";
import ChatInputBar from "../components/ChatInputBar.tsx";
import WelcomeScreen from "../components/WelcomeScreen.tsx";
import ChatHistory from "../components/ChatHistory.tsx";
import { useHistoryById, useSendMessage } from "../queries/HistoryQueries.ts";

const ChatArea = () => {
  const location = useLocation();
  const isRoot = location.pathname === "/";
  const { chatId } = useParams();
  const navigate = useNavigate();

  const { data: history } = useHistoryById(Number(chatId));
  const { mutate: send, isPending } = useSendMessage();

  const handleSend = (text: string) => {
    send(
      {
        historyId: Number(chatId),
        userMessage: text,
      },
      {
        onSuccess: (data) => {
          // Novo chat: navega para o id retornado pelo backend
          if (!chatId && data.history.id) {
            navigate(`/chat/${data.history.id}`, { replace: true });
          }
        },
      },
    );
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex flex-col flex-1 overflow-y-auto">
        {isRoot ? (
          <WelcomeScreen />
        ) : (
          <ChatHistory prompts={history?.prompts ?? []}></ChatHistory>
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
