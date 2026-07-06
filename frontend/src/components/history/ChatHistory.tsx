import type { Prompt } from "../../interfaces/database";
import MessageBubble from "../messages/MessageBubble";

interface ChatHistoryProps {
  prompts: Prompt[];
  isAwaitingResponse?: boolean;
  // Quando true, o último prompt é a bolha otimista em andamento (streaming): ele
  // renderiza os anexos a partir de prompt.attachments (metadados locais), já que
  // ainda não tem os arquivos persistidos pelo backend.
  lastIsOptimistic?: boolean;
}
const ChatHistory = ({
  prompts,
  isAwaitingResponse = false,
  lastIsOptimistic = false,
}: ChatHistoryProps) => {
  // onde prompt eh o conjunto de mensagens resposta

  return (
    <div className="flex flex-col gap-6 px-4 py-6 max-w-2xl mx-auto w-full">
      {prompts.map((prompt, i) => {
        const isLast = i === prompts.length - 1;
        return (
          <MessageBubble
            key={i}
            prompt={prompt}
            isLoading={isAwaitingResponse && isLast && !prompt.response}
            isOptimistic={lastIsOptimistic && isLast}
          />
        );
      })}
    </div>
  );
};

export default ChatHistory;
