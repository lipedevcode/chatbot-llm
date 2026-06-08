import { Plus, ArrowUp } from "lucide-react";
import { useState, useRef } from "react";

interface ChatInputBarProps {
  onSend: (text: string) => void;
  isPending?: boolean;
}

const ChatInputBar = ({ onSend, isPending = false }: ChatInputBarProps) => {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const text = input.trim();
    if (!text || isPending) return;

    onSend(text);
    setInput("");

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

  return (
    <div className="w-full max-w-2xl mx-auto px-4 pb-6">
      <div className="bg-input rounded-2xl shadow-sm border border-border overflow-hidden">
        {/* Textarea */}
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

        {/* Toolbar row */}
        <div className="flex items-center justify-between px-4 pb-3 pt-1">
          <div className="flex items-center gap-2">
            <button
              aria-label="Anexar arquivo"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-foreground-muted hover:bg-sidebar hover:text-foreground transition-colors cursor-pointer"
            >
              <Plus size={17} strokeWidth={2} />
            </button>
          </div>

          {/* Send button */}
          <button
            aria-label="Enviar mensagem"
            className="w-9 h-9 rounded-xl flex items-center justify-center bg-brown-light hover:bg-brown-medium active:bg-brown-dark text-white transition-colors shadow-sm cursor-pointer"
            onClick={handleSend}
            disabled={!input.trim() || isPending}
          >
            {isPending ? (
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <ArrowUp size={17} strokeWidth={2.5} />
            )}
          </button>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-center text-[11px] text-foreground-muted/70 mt-3">
        O ChatBot pode cometer erros. Considere verificar informações
        importantes.
      </p>
    </div>
  );
};
export default ChatInputBar;
