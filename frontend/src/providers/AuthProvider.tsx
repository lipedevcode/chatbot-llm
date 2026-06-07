import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { signup } from "../services/chatService";

interface AuthContextType {
  token: string | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  isLoading: true,
});

export const useAuth = () => useContext(AuthContext);

// O signup é automático — o backend gera um subject (token) para o usuário
// sem precisar de formulário de login/senha.
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const stored = localStorage.getItem("token");

      if (stored) {
        setToken(stored);
        setIsLoading(false);
        return;
      }

      // Primeiro acesso: faz signup e salva o token retornado
      try {
        const subject = await signup();
        localStorage.setItem("token", subject);
        setToken(subject);
      } catch (err) {
        console.error("Erro ao gerar usuário:", err);
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background text-foreground-muted text-sm">
        Iniciando...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ token, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};