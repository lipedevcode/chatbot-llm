import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../providers/AuthProvider";

// Usado em /login e /register: se já existe uma sessão válida, não faz sentido
// mostrar essas telas de novo — manda direto pro chat.
const RedirectIfAuth = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default RedirectIfAuth;
