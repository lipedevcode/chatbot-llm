import type { Prompt } from "../interfaces/database";
import MessageBubble from "./MessageBubble";

interface ChatHistoryProps {
  prompts: Prompt[];
  isAwaitingResponse?: boolean;
}
const ChatHistory = ({ prompts, isAwaitingResponse = false }: ChatHistoryProps) => {
  // onde prompt eh o conjunto de mensagens resposta

  return (
    <div className="flex flex-col gap-6 px-4 py-6 max-w-2xl mx-auto w-full">
      {prompts.map((prompt, i) => (
        <MessageBubble
          key={i}
          prompt={prompt}
          isLoading={isAwaitingResponse && i === prompts.length - 1 && !prompt.response}
        />
      ))}
    </div>
  );
};

export default ChatHistory;
