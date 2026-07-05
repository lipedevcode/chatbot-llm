import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../providers/AuthProvider";

// Protege as rotas autenticadas (chat, dashboard). O AuthProvider já segura o
// render com uma tela de "Iniciando..." até a validação do token terminar, então
// aqui só resta decidir: autenticado -> renderiza a rota; senão -> vai pro login.
const RequireAuth = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default RequireAuth;
