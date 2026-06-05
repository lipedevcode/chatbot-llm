import type { Prompt } from "../interfaces/database";

interface MessageBubbleProps {
  prompt: Prompt;
}

const MessageBubble = ({ prompt }: MessageBubbleProps) => (
  <div className="flex flex-col gap-4 w-full">

    {/* Pergunta do usuário */}
    <div className="flex justify-end">
      <p className="max-w-[70%] px-4 py-3 rounded-2xl rounded-br-sm bg-primary text-foreground text-sm leading-relaxed">
        {prompt.text}
      </p>
    </div>

    {/* Resposta do modelo — texto solto, ocupa toda a largura */}
    {prompt.response && (
      <p className="text-foreground text-sm leading-relaxed">
        {prompt.response.text}
      </p>
    )}

  </div>
);

export default MessageBubble;