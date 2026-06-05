import type { Prompt } from "../interfaces/database";
import MessageBubble from "./MessageBubble";

interface ChatHistoryProps {
  prompts: Prompt[] ;
}
const ChatHistory = ({ prompts }: ChatHistoryProps) => {
  // onde prompt eh o conjunto de mensagens resposta

  return (
    <div className="flex flex-col gap-6 px-4 py-6 max-w-2xl mx-auto w-full">
        <MessageBubble prompt={prompts[0]} />
    </div>
  );
};

export default ChatHistory;
