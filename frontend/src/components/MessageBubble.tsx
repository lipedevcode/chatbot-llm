import type { Prompt } from "../interfaces/database";
import ModelResponse from "./ModelResponse";
import UserMessage from "./UserMessage";

interface MessageBubbleProps {
  prompt: Prompt;
}

const MessageBubble = ({ prompt }: MessageBubbleProps) => (
  <div className="flex flex-col gap-10 w-full">
    <UserMessage text={prompt.text} />

    {/* Resposta do modelo — texto solto, ocupa toda a largura */}
    {prompt.response && (
      <ModelResponse response={prompt.response.text}></ModelResponse>
    )}
  </div>
);

export default MessageBubble;
