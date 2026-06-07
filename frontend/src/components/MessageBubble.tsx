import type { Prompt } from "../interfaces/database";
import ModelResponse from "./ModelResponse";
import UserMessage from "./UserMessage";

interface MessageBubbleProps {
  prompt: Prompt;
  isLoading?: boolean;
}

const TypingIndicator = () => (
  <div className="flex items-center gap-1.5 py-1" aria-label="Digitando">
    <span className="w-2 h-2 rounded-full bg-foreground-muted animate-bounce [animation-delay:-0.3s]" />
    <span className="w-2 h-2 rounded-full bg-foreground-muted animate-bounce [animation-delay:-0.15s]" />
    <span className="w-2 h-2 rounded-full bg-foreground-muted animate-bounce" />
  </div>
);

const MessageBubble = ({ prompt, isLoading = false }: MessageBubbleProps) => (
  <div className="flex flex-col gap-10 w-full">
    <UserMessage text={prompt.text} />

    {/* Resposta do modelo — texto solto, ocupa toda a largura */}
    {prompt.response ? (
      <ModelResponse response={prompt.response.text}></ModelResponse>
    ) : (
      isLoading && <TypingIndicator />
    )}
  </div>
);

export default MessageBubble;
