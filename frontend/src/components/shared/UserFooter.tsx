import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useProfile } from "../../queries/UserQueries";

const UserFooter = () => {
  const { data: perfil } = useProfile();
  const nomeExibido = perfil?.nome || perfil?.username || "Usuário";
  const initial = nomeExibido.charAt(0).toUpperCase();

  return (
    <div className="mt-4 pt-4 border-t border-border">
      <Link
        to="/dashboard"
        className="cursor-pointer flex items-center gap-3 w-full px-3 py-2 rounded-xl hover:bg-foreground/5 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-brown-dark text-white text-xs font-bold flex items-center justify-center shrink-0">
          {initial}
        </div>
        <div className="flex-1 text-left leading-tight">
          <p className="text-sm font-semibold text-foreground truncate">
            {nomeExibido}
          </p>
        </div>
        <ChevronDown size={14} className="text-foreground-muted shrink-0" />
      </Link>
    </div>
  );
};

export default UserFooter;
