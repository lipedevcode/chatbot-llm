import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { getPerfil } from "../services/userService";

interface AuthContextType {
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  // Usado por LoginForm/RegisterForm após um login/registro bem-sucedido, para
  // atualizar o contexto imediatamente (sem precisar de reload).
  setAuthToken: (token: string) => void;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  isLoading: true,
  isAuthenticated: false,
  setAuthToken: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const stored = localStorage.getItem("token");

      if (!stored) {
        setIsLoading(false);
        return;
      }

      // Valida o token existente contra um endpoint autenticado. Se o backend
      // recusar (expirado, assinatura inválida, ou usuário que não existe mais),
      // tratamos como sessão inválida: descarta o token e manda pro login.
      try {
        await getPerfil();
        setToken(stored);
        setIsAuthenticated(true);
      } catch {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  const setAuthToken = (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setIsAuthenticated(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background text-foreground-muted text-sm">
        Iniciando...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ token, isLoading, isAuthenticated, setAuthToken }}>
      {children}
    </AuthContext.Provider>
  );
};
