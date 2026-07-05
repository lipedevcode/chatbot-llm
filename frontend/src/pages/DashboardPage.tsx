import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  Eye,
  FileText,
  Inbox,
  Loader2,
  MessageSquarePlus,
  Save,
  Upload,
  User,
  X,
} from "lucide-react";
import ErrorBanner from "../components/shared/ErrorBanner";
import { HistoryLink } from "../components/history/HistoryLink";
import { useProfile, useUpdateProfile } from "../queries/UserQueries";
import { useFiles } from "../queries/FileQueries";
import { useHistories } from "../queries/HistoryQueries";
import { getFileBlobUrl } from "../services/fileService";
import { getErrorMessage } from "../utils/errorUtils";
import type { FileMeta } from "../interfaces/database";

const formatDate = (iso: string) => {
  const date = new Date(iso);
  return Number.isNaN(date.getTime())
    ? "-"
    : date.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
};

// Card de acesso rápido para as ações mais comuns pós-login.
const QuickAccessCard = ({
  to,
  icon,
  title,
  description,
}: {
  to: string;
  icon: ReactNode;
  title: string;
  description: string;
}) => {
  const content = (
    <>
      <div className="shrink-0 w-10 h-10 rounded-xl bg-primary/60 text-brown-dark flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="text-xs text-foreground-muted mt-0.5">{description}</p>
      </div>
    </>
  );
  const className =
    "flex items-start gap-3 rounded-2xl border border-border bg-card px-5 py-4 shadow-sm hover:border-brown-light transition-colors";

  // Âncoras (#id) usam <a> nativa para aproveitar o scroll-to-fragment do
  // navegador; rotas de verdade usam o <Link> do React Router.
  if (to.startsWith("#")) {
    return (
      <a href={to} className={className}>
        {content}
      </a>
    );
  }
  return (
    <Link to={to} className={className}>
      {content}
    </Link>
  );
};

// Formulário de edição de perfil. `username` e `createdAt` são somente leitura:
// o username é o subject do JWT (mudá-lo invalidaria o token atual).
const PerfilCard = () => {
  const { data: perfil, isLoading, isError, refetch } = useProfile();
  const {
    mutate: salvar,
    isPending,
    isSuccess,
    isError: isSaveError,
    error: saveError,
  } = useUpdateProfile();

  const [form, setForm] = useState({ nome: "", email: "" });

  // Preenche o form assim que o perfil chega (e novamente após salvar, já que
  // a mutation semeia o cache com o perfil atualizado).
  useEffect(() => {
    if (perfil) {
      setForm({ nome: perfil.nome ?? "", email: perfil.email ?? "" });
    }
  }, [perfil]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    salvar({ nome: form.nome, email: form.email });
  };

  return (
    <section className="rounded-2xl border border-border bg-card px-6 py-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <User size={16} className="text-brown-medium" />
        <h2 className="text-sm font-bold text-foreground uppercase tracking-wide">
          Meu perfil
        </h2>
      </div>

      {isLoading && (
        <p className="text-sm text-foreground-muted">Carregando perfil...</p>
      )}

      {isError && (
        <ErrorBanner
          message="Não foi possível carregar seu perfil."
          onRetry={() => refetch()}
        />
      )}

      {perfil && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground-secondary uppercase tracking-wide">
                Nome
              </label>
              <input
                type="text"
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                placeholder="Seu nome"
                className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground placeholder:text-foreground-muted outline-none focus:border-brown-medium transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground-secondary uppercase tracking-wide">
                E-mail
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="email@email.com"
                className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground placeholder:text-foreground-muted outline-none focus:border-brown-medium transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground-secondary uppercase tracking-wide">
                Usuário
              </label>
              <input
                type="text"
                value={perfil.username}
                disabled
                className="w-full px-4 py-2.5 rounded-xl bg-background-secondary border border-border text-sm text-foreground-muted cursor-not-allowed"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground-secondary uppercase tracking-wide">
                Conta criada em
              </label>
              <input
                type="text"
                value={formatDate(perfil.createdAt)}
                disabled
                className="w-full px-4 py-2.5 rounded-xl bg-background-secondary border border-border text-sm text-foreground-muted cursor-not-allowed"
              />
            </div>
          </div>

          {isSaveError && (
            <ErrorBanner
              message={getErrorMessage(
                saveError,
                "Não foi possível salvar as alterações."
              )}
            />
          )}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brown-dark hover:bg-brown-medium text-white font-semibold text-sm transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isPending ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Save size={15} />
              )}
              Salvar alterações
            </button>
            {isSuccess && !isPending && (
              <span className="text-xs text-brown-medium font-medium">
                Perfil atualizado.
              </span>
            )}
          </div>
        </form>
      )}
    </section>
  );
};

// Modal simples para visualizar o PDF autenticado (via blob), sem depender de
// abrir a URL bruta do endpoint (que exige o header Authorization).
const DocumentoModal = ({
  filename,
  url,
  onClose,
}: {
  filename: string;
  url: string;
  onClose: () => void;
}) => (
  <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-6">
    <div className="bg-card rounded-2xl shadow-xl w-full max-w-3xl h-[85vh] flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-border">
        <p className="text-sm font-semibold text-foreground truncate">
          {filename}
        </p>
        <button
          onClick={onClose}
          className="text-foreground-muted hover:text-foreground transition-colors cursor-pointer"
          aria-label="Fechar"
        >
          <X size={18} />
        </button>
      </div>
      <iframe title={filename} src={url} className="flex-1 w-full" />
    </div>
  </div>
);

// Modal simples para visualizar o resumo completo do documento (texto puro).
const ResumoModal = ({
  filename,
  resumo,
  onClose,
}: {
  filename: string;
  resumo: string | null;
  onClose: () => void;
}) => (
  <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-6">
    <div className="bg-card rounded-2xl shadow-xl w-full max-w-3xl max-h-[70vh] flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-border">
        <p className="text-sm font-semibold text-foreground truncate">
          {filename}
        </p>
        <button
          onClick={onClose}
          className="text-foreground-muted hover:text-foreground transition-colors cursor-pointer"
          aria-label="Fechar"
        >
          <X size={18} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-4">
        <p className="text-sm text-foreground-secondary whitespace-pre-wrap">
          {resumo ?? "Sem resumo disponível para este documento."}
        </p>
      </div>
    </div>
  </div>
);

const DocumentoCard = ({
  file,
  onVisualizar,
  onVisualizarResumo,
  isLoadingPreview,
}: {
  file: FileMeta;
  onVisualizar: (file: FileMeta) => void;
  onVisualizarResumo: (file: FileMeta) => void;
  isLoadingPreview: boolean;
}) => (
  <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card px-4 py-4 shadow-sm">
    <div className="flex items-start gap-3">
      <div className="shrink-0 w-9 h-9 rounded-lg bg-red-50 text-red-500 flex items-center justify-center border border-border">
        <FileText size={16} />
      </div>
      <p className="text-sm font-semibold text-foreground truncate">
        {file.filename}
      </p>
    </div>

    <p className="text-xs text-foreground-secondary line-clamp-3 flex-1">
      {file.resumo ?? "Sem resumo disponível para este documento."}
    </p>

    <div className="flex flex-wrap items-center gap-4">
      <button
        onClick={() => onVisualizar(file)}
        disabled={isLoadingPreview}
        className="flex items-center gap-1.5 text-xs font-semibold text-brown-medium hover:text-brown-dark transition-colors cursor-pointer disabled:opacity-50"
      >
        {isLoadingPreview ? (
          <Loader2 size={13} className="animate-spin" />
        ) : (
          <Eye size={13} />
        )}
        Visualizar PDF
      </button>

      <button
        onClick={() => onVisualizarResumo(file)}
        className="flex items-center gap-1.5 text-xs font-semibold text-brown-medium hover:text-brown-dark transition-colors cursor-pointer"
      >
        <FileText size={13} />
        Visualizar Resumo
      </button>
    </div>
  </div>
);

const DocumentosSection = () => {
  const { data: files = [], isLoading, isError, refetch } = useFiles();
  const [preview, setPreview] = useState<{ filename: string; url: string } | null>(
    null
  );
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [resumoPreview, setResumoPreview] = useState<{
    filename: string;
    resumo: string | null;
  } | null>(null);

  const abrirDocumento = async (file: FileMeta) => {
    setLoadingId(file.id);
    setPreviewError(null);
    try {
      const url = await getFileBlobUrl(file.id);
      setPreview({ filename: file.filename, url });
    } catch (err) {
      setPreviewError(
        getErrorMessage(err, "Não foi possível abrir este documento.")
      );
    } finally {
      setLoadingId(null);
    }
  };

  const fecharDocumento = () => {
    if (preview) URL.revokeObjectURL(preview.url);
    setPreview(null);
  };

  const abrirResumo = (file: FileMeta) => {
    setResumoPreview({ filename: file.filename, resumo: file.resumo });
  };

  const fecharResumo = () => {
    setResumoPreview(null);
  };

  return (
    <section id="documentos" className="flex flex-col gap-4">
      <h2 className="text-sm font-bold text-foreground uppercase tracking-wide">
        Meus documentos
      </h2>

      {isLoading && (
        <p className="text-sm text-foreground-muted">Carregando documentos...</p>
      )}

      {isError && (
        <ErrorBanner
          message="Não foi possível carregar seus documentos."
          onRetry={() => refetch()}
        />
      )}

      {previewError && <ErrorBanner message={previewError} />}

      {!isLoading && !isError && files.length === 0 && (
        <div className="flex items-center gap-3 rounded-2xl border border-dashed border-border px-5 py-4 text-sm text-foreground-muted">
          <Inbox size={18} />
          Nenhum documento enviado ainda. Envie um PDF em uma conversa para vê-lo aqui.
        </div>
      )}

      {files.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {files.map((file) => (
            <DocumentoCard
              key={file.id}
              file={file}
              onVisualizar={abrirDocumento}
              onVisualizarResumo={abrirResumo}
              isLoadingPreview={loadingId === file.id}
            />
          ))}
        </div>
      )}

      {preview && (
        <DocumentoModal
          filename={preview.filename}
          url={preview.url}
          onClose={fecharDocumento}
        />
      )}

      {resumoPreview && (
        <ResumoModal
          filename={resumoPreview.filename}
          resumo={resumoPreview.resumo}
          onClose={fecharResumo}
        />
      )}
    </section>
  );
};

const ConversasRecentesSection = () => {
  const { data: histories = [], isLoading, isError, refetch } = useHistories();
  const recentes = histories.slice(0, 6);

  return (
    <section id="conversas" className="flex flex-col gap-4">
      <h2 className="text-sm font-bold text-foreground uppercase tracking-wide">
        Conversas recentes
      </h2>

      {isLoading && (
        <p className="text-sm text-foreground-muted">Carregando conversas...</p>
      )}

      {isError && (
        <ErrorBanner
          message="Não foi possível carregar suas conversas."
          onRetry={() => refetch()}
        />
      )}

      {!isLoading && !isError && recentes.length === 0 && (
        <div className="flex items-center gap-3 rounded-2xl border border-dashed border-border px-5 py-4 text-sm text-foreground-muted">
          <Inbox size={18} />
          Você ainda não iniciou nenhuma conversa.
        </div>
      )}

      {recentes.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-2 shadow-sm">
          {recentes.map((history, i) => (
            <HistoryLink
              key={history.id ?? i}
              title={history.title}
              history={history.prompts ?? []}
              id={history.id ?? i}
            />
          ))}
        </div>
      )}
    </section>
  );
};

const DashboardPage = () => {
  const { data: perfil } = useProfile();

  return (
    <div className="h-full overflow-y-auto bg-background">
      <div className="max-w-5xl mx-auto w-full px-6 py-8 flex flex-col gap-8">
        <header>
          <h1 className="text-2xl font-bold text-foreground">
            Olá{perfil?.nome ? `, ${perfil.nome}` : ""}!
          </h1>
          <p className="text-sm text-foreground-muted mt-1">
            Este é o seu painel. Acompanhe suas conversas, documentos e dados de perfil.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <QuickAccessCard
            to="/"
            icon={<MessageSquarePlus size={18} />}
            title="Nova conversa"
            description="Comece um novo chat com o assistente."
          />
          <QuickAccessCard
            to="/"
            icon={<Upload size={18} />}
            title="Enviar documento"
            description="Anexe um PDF em uma conversa para analisá-lo."
          />
          <QuickAccessCard
            to="#documentos"
            icon={<FileText size={18} />}
            title="Meus documentos"
            description="Veja e reveja os arquivos que você já enviou."
          />
        </div>

        <PerfilCard />
        <DocumentosSection />
        <ConversasRecentesSection />
      </div>
    </div>
  );
};

export default DashboardPage;
