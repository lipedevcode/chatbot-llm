import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import type { ChatHistory } from "../interfaces/database";

interface HistoryListProps {
  histories: ChatHistory[];
  activeChatId?: string;
}

const extractTitle = (history: ChatHistory): string => {
  const firstPrompt = history.prompts?.[0]?.text;
  if (!firstPrompt) return "Nova conversa";
  return firstPrompt.length > 28
    ? firstPrompt.slice(0, 28) + "..."
    : firstPrompt;
};


const HistoryList = ({ histories, activeChatId }: HistoryListProps) => (
  <div className="flex-1 overflow-y-auto min-h-0">
    <p className="text-[10px] font-semibold uppercase tracking-widest text-foreground-muted px-3 mb-2">
      Conversas
    </p>
    <div className="flex flex-col gap-0.5">
      {histories.map((history, i) => (
        <Link
          key={history.id ?? i}
          to={`/chat/${i}`}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-foreground-secondary hover:bg-foreground/5 hover:text-foreground transition-colors ${
            Number(activeChatId) === i
              ? "bg-brown-light/40 text-foreground"
              : ""
          }`}
        >
          <MessageCircle size={15} className="shrink-0 text-foreground-muted" />
          <span className="truncate">{extractTitle(history)}</span>
        </Link>
      ))}
    </div>
  </div>
);

export default HistoryList;