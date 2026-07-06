import { Link } from "react-router-dom";
import LogoMark from "../components/shared/LogoMark";
import RegisterForm from "../components/forms/RegisterForm";

const RegisterPage = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-5 py-10 ">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex flex-row items-center justify-center gap-6 align-center">
          <LogoMark size={1.5}></LogoMark>
          <span className="text-foreground font-bold text-2xl mt-2">
            ChatBot
          </span>
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-2xl px-8 py-8 shadow-sm">
          <h1 className="text-foreground font-bold text-xl mb-1">
            Criar conta
          </h1>
          <p className="text-foreground-muted text-sm mb-6">
            Preencha os dados para começar
          </p>

          <RegisterForm />
        </div>

        {/* Link para login */}
        <p className="text-center text-sm text-foreground-muted mt-5">
          Já tem uma conta?{" "}
          <Link
            to="/login"
            className="text-brown-medium hover:text-brown-dark font-semibold transition-colors cursor-pointer"
          >
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
