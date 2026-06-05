import { ChevronDown } from "lucide-react";
import type { Usuario } from "../interfaces/database";

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

export default UserFooter;
