import { useState } from "react";
import {
  MessageCircle,
  BookOpen,
  Settings2,
  Briefcase,
  Star,
  Settings,
  HelpCircle,
} from "lucide-react";

const navItems = [
  { icon: MessageCircle, label: "Funcionalidade" },
  { icon: BookOpen, label: "Funcionalidade" },
  { icon: Settings2, label: "Funcionalidade" },
  { icon: Briefcase, label: "Funcionalidade" },
  { icon: Star, label: "Funcionalidade" },
  { icon: Settings, label: "Funcionalidade" },
  { icon: HelpCircle, label: "Funcionalidade" },
];

const FuncionalitiesLIst = () => {
  const [activeNav, setActiveNav] = useState<number | null>(null);
  return (
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
  );
};

export default FuncionalitiesLIst;
