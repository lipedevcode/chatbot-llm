import FileChip from "../shared/FileChip";
import type { Attachment } from "../../interfaces/database";

interface UserMessageProps {
  text: string;
  attachments: Attachment[];
}

const UserMessage = ({ text, attachments }: UserMessageProps) => {
  return (
    <div className="flex flex-col items-end gap-2">
      {/* Anexo acima da bolha, se houver */}
      {attachments && (
        <div className="flex flex-wrap gap-2 max-h-30 overflow-y-auto">
          {attachments.map((attachment) => (
            <FileChip
              key={attachment.name}
              name={attachment.name}
              extension={attachment.extension}
            />
          ))}
        </div>
      )}
      {text && (
        <p className="max-w-[70%] px-4 py-3 rounded-2xl rounded-br-sm bg-primary text-foreground text-sm leading-relaxed">
          {text}
        </p>
      )}
    </div>
  );
};

export default UserMessage;
