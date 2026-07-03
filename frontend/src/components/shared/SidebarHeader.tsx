import { Link } from "react-router-dom";
import LogoMark from "../shared/LogoMark";
import { SquarePen, Plus } from "lucide-react";

const SidebarHeader = () => {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <Link
          to="/"
          className="flex flex-row justify-between items-center w-full"
        >
          <LogoMark size={1}></LogoMark>
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
    </div>
  );
};

export default SidebarHeader;
