import { Link } from "react-router-dom";
import LogoMark from "../components/shared/LogoMark.tsx";
import LoginForm from "../components/forms/LoginForm.tsx";

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-row items-center justify-center gap-6 align-center">
          <LogoMark size={1.5}></LogoMark>
          <p className="text-foreground font-bold text-2xl mt-2"> ChatBot</p>
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-2xl px-8 py-8 shadow-sm">
          <h1 className="text-foreground font-bold text-xl mb-1">
            Bem-vindo de volta
          </h1>
          <p className="text-foreground-muted text-sm mb-6">
            Entre na sua conta para continuar
          </p>

          <LoginForm />
        </div>

        {/* Link para registro */}
        <p className="text-center text-sm text-foreground-muted mt-5">
          Não tem uma conta?{" "}
          <Link
            to="/register"
            className="text-brown-medium hover:text-brown-dark font-semibold transition-colors"
          >
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
