import { useLocation } from "react-router-dom";
import ChatInputBar from "../components/ChatInputBar.tsx";
import WelcomeScreen from "../components/WelcomeScreen.tsx";
import ChatHistory from "../components/ChatHistory.tsx";

const ChatArea = () => {
  const location = useLocation();
  const isRoot = location.pathname === "/";

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex flex-col flex-1 overflow-y-auto">
        {isRoot ? <WelcomeScreen /> : <ChatHistory />}
      </div>
      <ChatInputBar />
    </div>
  );
};

const ChatPage = () => {
  return <ChatArea />;
};

export default ChatPage;
