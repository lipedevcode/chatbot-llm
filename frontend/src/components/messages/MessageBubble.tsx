import type { Prompt, Attachment } from "../../interfaces/database";
import ModelResponse from "../messages/ModelResponse";
import UserMessage from "../messages/UserMessage";
import TypingIndicator from "../shared/TypingIndicator";
import { extractUserText, hasEmbeddedFile } from "../../utils/promptutils.ts";

interface MessageBubbleProps {
  prompt: Prompt;
  isLoading?: boolean;
  isOptimistic?: boolean;
}

const MessageBubble = ({
  prompt,
  isLoading = false,
  isOptimistic = false,
}: MessageBubbleProps) => {
  const userText = extractUserText(prompt.text);

  const attachments: Attachment[] = isOptimistic
    ? (prompt.attachments ?? [])
    : hasEmbeddedFile(prompt.text)
      ? (prompt.files ?? []).map((f) => {
          const parts = f.filename.split(".");
          const extension = parts.length > 1 ? parts.pop()! : "";
          return { name: parts.join("."), extension };
        })
      : [];

  return (
    <div className="flex flex-col gap-10 w-full">
      <UserMessage text={userText} attachments={attachments} />
      {prompt.response ? (
        <ModelResponse response={prompt.response.text} />
      ) : (
        isLoading && <TypingIndicator />
      )}
    </div>
  );
};

export default MessageBubble;
