import type { Prompt } from "../../interfaces/database";
import ModelResponse from "../messages/ModelResponse";
import UserMessage from "../messages/UserMessage";
import TypingIndicator from "../shared/TypingIndicator";

interface MessageBubbleProps {
  prompt: Prompt;
  isLoading?: boolean;
}

const MessageBubble = ({ prompt, isLoading = false }: MessageBubbleProps) => (
  <div className="flex flex-col gap-10 w-full">
    <UserMessage text={prompt.text} attachments={prompt.attachments ?? []} />

    {/* Resposta do modelo — texto solto, ocupa toda a largura */}
    {prompt.response ? (
      <ModelResponse response={prompt.response.text}></ModelResponse>
    ) : (
      isLoading && <TypingIndicator />
    )}
  </div>
);

export default MessageBubble;
