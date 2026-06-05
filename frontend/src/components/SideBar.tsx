import { useState } from "react";
import {
  MessageCircle,
  BookOpen,
  Settings2,
  Briefcase,
  Star,
  Settings,
  HelpCircle,
  Plus,
  ChevronDown,
  SquarePen,
} from "lucide-react";
import { useParams, Link } from "react-router-dom";

import type { History, Usuario } from "../interfaces/database";
import { mockHistoryList } from "../mocks/historyMock";

const extractTitle = (history: History): string => {
  const firstPrompt = history.prompts?.[0]?.text;
  if (!firstPrompt) return "Nova conversa";
  return firstPrompt.length > 28 ? firstPrompt.slice(0, 28) + "..." : firstPrompt;
};

const Logo = () => (
  <div className="flex items-center gap-2.5">
    <div className="flex items-end gap-0.5">
      <div className="w-2.5 h-6 rounded-full bg-brown-light" />
      <div className="w-2.5 h-8 rounded-full bg-brown-dark" />
      <div className="w-2.5 h-5 rounded-full bg-brown-medium" />
    </div>
    <span className="text-foreground font-bold text-lg tracking-tight leading-none">
      ChatBot <span className="text-brown-medium">AI</span>
    </span>
  </div>
);

const navItems = [
  { icon: MessageCircle, label: "Funcionalidade" },
  { icon: BookOpen,      label: "Funcionalidade" },
  { icon: Settings2,     label: "Funcionalidade" },
  { icon: Briefcase,     label: "Funcionalidade" },
  { icon: Star,          label: "Funcionalidade" },
  { icon: Settings,      label: "Funcionalidade" },
  { icon: HelpCircle,    label: "Funcionalidade" },
];

interface ConversationListProps {
  histories: History[];
  activeChatId?: string;
}

const ConversationList = ({ histories, activeChatId }: ConversationListProps) => (
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
            Number(activeChatId) === i ? "bg-brown-light/40 text-foreground" : ""
          }`}
        >
          <MessageCircle size={15} className="shrink-0 text-foreground-muted" />
          <span className="truncate">{extractTitle(history)}</span>
        </Link>
      ))}
    </div>
  </div>
);

interface UserFooterProps {
  usuario?: Usuario;
}

const UserFooter = ({ usuario }: UserFooterProps) => {
  const initial = usuario?.subject?.charAt(0).toUpperCase() ?? "U";

  return (
    <div className="mt-4 pt-4 border-t border-border">
      <button className="cursor-pointer flex items-center gap-3 w-full px-3 py-2 rounded-xl hover:bg-foreground/5 transition-colors">
        <div className="w-8 h-8 rounded-full bg-brown-dark text-white text-xs font-bold flex items-center justify-center shrink-0">
          {initial}
        </div>
        <div className="flex-1 text-left leading-tight">
          <p className="text-sm font-semibold text-foreground">
            {usuario?.subject ?? "Usuário"}
          </p>
        </div>
        <ChevronDown size={14} className="text-foreground-muted shrink-0" />
      </button>
    </div>
  );
};

interface SideBarProps {
  // Será substituído pelo retorno real do endpoint quando integrado
  histories?: History[];
  usuario?: Usuario;
}

const SideBar = ({ histories = mockHistoryList, usuario }: SideBarProps) => {
  const [activeNav, setActiveNav] = useState<number | null>(null);
  const { chatId } = useParams<{ chatId: string }>();

  return (
    <aside className="flex flex-col h-screen w-64 bg-sidebar border-r border-border px-4 py-5 select-none">

      <div className="flex items-center justify-between mb-6">
        <Link to="/" className="flex flex-row justify-between items-center w-full">
          <Logo />
          <button
            aria-label="Nova conversa"
            className="cursor-pointer text-foreground hover:text-brown-medium transition-colors"
          >
            <SquarePen size={20} strokeWidth={2.5} />
          </button>
        </Link>
      </div>

      <Link
        to="/"
        className="flex items-center gap-2 w-full px-4 py-2.5 mb-5 rounded-xl bg-primary hover:bg-primary-hover text-foreground font-semibold text-sm transition-colors shadow-sm"
      >
        <Plus size={16} strokeWidth={2.5} />
        Nova Conversa
      </Link>

      <nav className="flex flex-col gap-0.5 mb-6">
        {navItems.map(({ icon: Icon, label }, i) => (
          <button
            key={i}
            onClick={() => setActiveNav(i)}
            className={`cursor-pointer flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
              activeNav === i
                ? "bg-brown-light/20 text-foreground"
                : "text-foreground-secondary hover:bg-foreground/5 hover:text-foreground"
            }`}
          >
            <Icon size={17} className="shrink-0 text-foreground" />
            {label}
          </button>
        ))}
      </nav>

      <ConversationList histories={histories} activeChatId={chatId} />

      <UserFooter usuario={usuario} />
    </aside>
  );
};

export default SideBar;