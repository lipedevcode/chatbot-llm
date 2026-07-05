import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { ArrowRight, Eye, EyeOff, X, Camera } from "lucide-react";
import { signup } from "../../services/authService";
import { useAuth } from "../../providers/AuthProvider";
import { getErrorMessage } from "../../utils/errorUtils";

interface RegisterForm {
  fullName: string;
  username: string;
  email: string;
  password: string;
  description: string;
  avatar: File | null;
  avatarPreview: string | null;
  createdAt: string;
}

// Precisa viver fora do RegisterForm: se fosse definido dentro do componente,
// cada re-render (ex.: a cada tecla digitada, via setForm) criaria uma nova
// identidade de componente, fazendo o React desmontar/remontar os inputs
// filhos e perder o foco — só dava pra digitar um caractere por vez.
const Field = ({
  label,
  optional = false,
  children,
}: {
  label: string;
  required?: boolean;
  optional?: boolean;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-1.5">
    <div className="flex items-center gap-1.5">
      <label className="text-xs font-semibold text-foreground-secondary uppercase tracking-wide">
        {label}
      </label>
      {optional && (
        <span className="text-[10px] text-foreground-muted border border-border rounded-full px-1.5 py-0.5 leading-none">
          opcional
        </span>
      )}
    </div>
    {children}
  </div>
);

const RegisterForm = () => {
  const navigate = useNavigate();
  const { setAuthToken } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<RegisterForm>({
    fullName: "",
    username: "",
    email: "",
    password: "",
    description: "",
    avatar: null,
    avatarPreview: null,
    createdAt: new Date().toISOString(), // gerado automaticamente
  });

  const inputClass =
    "w-full px-4 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground placeholder:text-foreground-muted outline-none focus:border-brown-medium transition-colors";

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm({
      ...form,
      avatar: file,
      avatarPreview: URL.createObjectURL(file),
    });
  };

  const handleRemoveAvatar = () => {
    setForm({ ...form, avatar: null, avatarPreview: null });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // O backend só aceita nome/username/email/senha hoje — avatar, descrição e
    // data de criação não são persistidos (não existe suporte a isso na API).
    try {
      const token = await signup({
        nome: form.fullName,
        username: form.username,
        email: form.email,
        password: form.password,
      });
      setAuthToken(token);
      navigate("/");
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Não foi possível criar a conta. Verifique os dados e tente novamente."
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Avatar (opcional) */}
        <Field label="Foto de perfil" optional>
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 shrink-0">
              {form.avatarPreview ? (
                <>
                  <img
                    src={form.avatarPreview}
                    alt="Preview"
                    className="w-16 h-16 rounded-full object-cover border-2 border-border"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-brown-dark text-white flex items-center justify-center cursor-pointer"
                  >
                    <X size={10} strokeWidth={3} />
                  </button>
                </>
              ) : (
                <div
                  className="w-16 h-16 rounded-full bg-background border-2 border-dashed border-border flex items-center justify-center text-foreground-muted cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera size={20} strokeWidth={1.5} />
                </div>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-semibold text-brown-medium hover:text-brown-dark transition-colors text-left cursor-pointer"
              >
                {form.avatarPreview ? "Trocar foto" : "Enviar foto"}
              </button>
              <p className="text-[11px] text-foreground-muted">
                JPG ou PNG, até 5MB
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>
        </Field>

        {/* Nome completo */}
        <Field label="Nome completo" required>
          <input
            type="text"
            required
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            placeholder="Seu nome completo"
            className={inputClass}
          />
        </Field>

        {/* Username */}
        <Field label="Username" required>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-foreground-muted">
              @
            </span>
            <input
              type="text"
              required
              value={form.username}
              onChange={(e) =>
                setForm({
                  ...form,
                  username: e.target.value.toLowerCase().replace(/\s/g, ""),
                })
              }
              placeholder="seuusername"
              className={`${inputClass} pl-8`}
            />
          </div>
        </Field>

        {/* Email */}
        <Field label="E-mail" required>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="voce@email.com"
            className={inputClass}
          />
        </Field>

        {/* Senha */}
        <Field label="Senha" required>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              className={`${inputClass} pr-10`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </Field>

        {/* Descrição (opcional) */}
        <Field label="Descrição" optional>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Fale um pouco sobre você..."
            className={`${inputClass} resize-none leading-relaxed`}
          />
        </Field>

        {/* Data de criação — gerada automaticamente, exibida como info */}
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-background border border-border">
          <span className="text-xs text-foreground-muted">Conta criada em</span>
          <span className="text-xs font-semibold text-foreground-secondary ml-auto">
            {new Date().toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>

        {/* Erro */}
        {error && <p className="text-xs text-red-500 -mt-1">{error}</p>}

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
              Criar conta
              <ArrowRight size={15} strokeWidth={2.5} />
            </>
          )}
        </button>
      </form>
    </>
  );
};

export default RegisterForm;
