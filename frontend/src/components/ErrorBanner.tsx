import { AlertCircle, RotateCcw } from "lucide-react";

interface ErrorBannerProps {
  message: string;
  onRetry?: () => void;
}

const ErrorBanner = ({ message, onRetry }: ErrorBannerProps) => {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-red-300/60 bg-red-50 px-4 py-3 text-sm text-red-800">
      <AlertCircle size={18} className="shrink-0 text-red-600" />
      <span className="flex-1">{message}</span>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-medium text-red-700 hover:bg-red-100 transition-colors cursor-pointer"
        >
          <RotateCcw size={14} />
          Tentar novamente
        </button>
      )}
    </div>
  );
};

export default ErrorBanner;
