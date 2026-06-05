import { useParams,useLocation } from "react-router-dom";
import ChatInputBar from "../components/ChatInputBar.tsx";
import WelcomeScreen from "../components/WelcomeScreen.tsx";
import ChatHistory from "../components/ChatHistory.tsx";

import { mockHistoryList } from "../mocks/historyMock.ts";

const ChatArea = () => {
  const location = useLocation();
  const isRoot = location.pathname === "/";
  const {chatId} = useParams()
  
  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex flex-col flex-1 overflow-y-auto">
        {isRoot ? (
          <WelcomeScreen />
        ) : (
          <ChatHistory prompts={mockHistoryList[0].prompts ?? []}></ChatHistory>
        )}
      </div>
      <ChatInputBar />
    </div>
  );
};

const ChatPage = () => {
  return <ChatArea />;
};

export default ChatPage;
