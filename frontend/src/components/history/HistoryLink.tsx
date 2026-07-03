import { MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import type { Prompt } from "../../interfaces/database";

interface HistoryLinkProps {
  activeChatId?: string;
  history: Prompt[];
  id: number;
}

const extractTitle = (history: Prompt[]): string => {
  const firstPrompt = history[0].text;
  if (!firstPrompt) return "Nova conversa";
  return firstPrompt.length > 28
    ? firstPrompt.slice(0, 28) + "..."
    : firstPrompt;
};

export const HistoryLink = ({
  activeChatId,
  history,
  id,
}: HistoryLinkProps) => {
  return (
    <div className="flex flex-col gap-0.5">
      <Link
        key={id}
        to={`/chat/${id}`}
        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-foreground-secondary hover:bg-foreground/5 hover:text-foreground transition-colors ${
          Number(activeChatId) === id ? "bg-brown-light/40 text-foreground" : ""
        }`}
      >
        <MessageCircle size={15} className="shrink-0 text-foreground-muted" />
        <span className="truncate">{extractTitle(history)}</span>
      </Link>
    </div>
  );
};
