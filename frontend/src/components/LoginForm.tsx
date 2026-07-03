import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { EyeOff, Eye, ArrowRight } from "lucide-react";

const LoginForm = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // integrar com o endpoint de login aqui
    setIsLoading(false);
    navigate("/");
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-foreground-secondary uppercase tracking-wide">
            E-mail
          </label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="email@email.com"
            className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground placeholder:text-foreground-muted outline-none focus:border-brown-medium transition-colors"
          />
        </div>

        {/* Senha */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-foreground-secondary uppercase tracking-wide">
              Senha
            </label>
            <button
              type="button"
              className="text-xs text-brown-medium hover:text-brown-dark transition-colors cursor-pointer"
            >
              Esqueceu a senha?
            </button>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 pr-10 rounded-xl bg-background border border-border text-sm text-foreground placeholder:text-foreground-muted outline-none focus:border-brown-medium transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-brown-dark hover:bg-brown-medium text-white font-semibold text-sm transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading ? (
            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              Entrar
              <ArrowRight size={15} strokeWidth={2.5} />
            </>
          )}
        </button>
      </form>
    </>
  );
};

export default LoginForm;
