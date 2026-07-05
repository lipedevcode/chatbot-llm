import { api } from "../../services/api";
import FileChip from "../shared/FileChip";
import type { Attachment } from "../../interfaces/database";

interface UserMessageProps {
  text: string;
  attachments: Attachment[];
}

const UserMessage = ({ text, attachments }: UserMessageProps) => {
  const handleFileOpen = async (id: string) => {
    const response = await api.get(`/api/v1/files/${id}`, {
      responseType: "blob",
    });
    const blob = new Blob([response.data], { type: response.headers["content-type"] ?? "application/pdf" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  return (
    <div className="flex flex-col items-end gap-2">
      {attachments && (
        <div className="flex flex-wrap gap-2 max-h-30 overflow-y-auto">
          {attachments.map((attachment) => (
            <FileChip
              key={attachment.id}
              name={attachment.name}
              extension={attachment.extension}
              onClick={() => handleFileOpen(attachment.id)}
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
