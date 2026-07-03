import { Plus, ArrowUp } from "lucide-react";
import { useState, useRef } from "react";
import FileChip from "../shared/FileChip.tsx";

export interface AttachedFile {
  file: File;
  name: string;
  extension: string;
}

interface ChatInputBarProps {
  onSend: (text: string, attachment?: AttachedFile[]) => void;
  isPending?: boolean;
}

const ChatInputBar = ({ onSend, isPending = false }: ChatInputBarProps) => {
  const [input, setInput] = useState("");
  const [attachments, setAttachments] = useState<AttachedFile[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileAreaRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    const text = input.trim();
    if ((!text && attachments.length === 0) || isPending) return;
    onSend(text, attachments.length > 0 ? attachments : undefined);
    setInput("");
    setAttachments([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 200) + "px";
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleRemove = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const parsed: AttachedFile[] = files.map((file) => {
      const parts = file.name.split(".");
      const extension = parts.pop() ?? "";
      const name = parts.join(".");
      return { file, name, extension };
    });
    setAttachments((prev) => {
      const existingNames = new Set(prev.map((a) => a.file.name));
      return [
        ...prev,
        ...parsed.filter((a) => !existingNames.has(a.file.name)),
      ];
    });
    e.target.value = "";
  };

  const canSend = (!!input.trim() || !!attachments) && !isPending;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 pb-6">
      <div className="bg-input rounded-2xl shadow-sm border border-border overflow-hidden">
        {/* Preview do anexo — aparece acima do textarea quando há arquivo */}
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-3 px-4 py-2 max-h-50 overflow-y-auto">
            {attachments.map((file, i) => {
              return (
                <FileChip
                  key={file.name}
                  name={file.name}
                  extension={file.extension}
                  onRemove={() => {
                    handleRemove(i);
                  }}
                />
              );
            })}
          </div>
        )}
        <textarea
          rows={1}
          ref={textareaRef}
          value={input}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          disabled={isPending}
          placeholder="Mensagem ChatBot..."
          className="w-full resize-none px-5 pt-4 pb-2 text-sm text-foreground placeholder:text-foreground-muted bg-transparent outline-none leading-relaxed"
          style={{ minHeight: "52px", maxHeight: "200px" }}
          onInput={(e) => {
            const el = e.currentTarget;
            el.style.height = "auto";
            el.style.height = Math.min(el.scrollHeight, 200) + "px";
          }}
        />

        <div className="flex items-center justify-between px-4 pb-3 pt-1">
          <div className="flex items-center gap-2">
            <button
              aria-label="Anexar arquivo"
              onClick={() => fileAreaRef.current?.click()}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                attachments.length > 0
                  ? "bg-brown-light/20 text-brown-medium"
                  : "text-foreground-muted hover:bg-sidebar hover:text-foreground"
              }`}
            >
              <Plus size={17} strokeWidth={2} />
            </button>
            <input
              type="file"
              ref={fileAreaRef}
              onChange={handleFileChange}
              hidden
            />
          </div>

          <button
            aria-label="Enviar mensagem"
            className="w-9 h-9 rounded-xl flex items-center justify-center bg-brown-light hover:bg-brown-medium active:bg-brown-dark text-white transition-colors shadow-sm cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            onClick={handleSend}
            disabled={!canSend}
          >
            {isPending ? (
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <ArrowUp size={17} strokeWidth={2.5} />
            )}
          </button>
        </div>
      </div>

      <p className="text-center text-[11px] text-foreground-muted/70 mt-3">
        O ChatBot pode cometer erros. Considere verificar informações
        importantes.
      </p>
    </div>
  );
};

export default ChatInputBar;
