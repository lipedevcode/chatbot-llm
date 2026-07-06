import { File, FileCode, FileImage, FileText, X } from "lucide-react";

export interface FileChipProps {
  name: string;
  extension: string;
  onRemove?: () => void;
  onClick?: () => void;
}

const getFileStyle = (ext: string) => {
  const e = ext.toLowerCase();
  if (e === "pdf")
    return {
      icon: <FileText size={13} />,
      color: "text-red-500",
      bg: "bg-red-50",
    };
  if (["png", "jpg", "jpeg", "gif", "webp"].includes(e))
    return {
      icon: <FileImage size={13} />,
      color: "text-purple-500",
      bg: "bg-purple-50",
    };
  if (["js", "ts", "tsx", "jsx", "py", "java", "json"].includes(e))
    return {
      icon: <FileCode size={13} />,
      color: "text-blue-500",
      bg: "bg-blue-50",
    };
  return {
    icon: <File size={13} />,
    color: "text-foreground-muted",
    bg: "bg-background",
  };
};

const FileChip = ({ name, extension, onRemove, onClick }: FileChipProps) => {
  const { icon, color, bg } = getFileStyle(extension);
  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-card max-w-60 ${onClick ? "cursor-pointer hover:bg-foreground/5 transition-colors" : ""}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === "Enter" || e.key === " ") onClick(); } : undefined}
    >
      <div
        className={`shrink-0 w-7 h-7 rounded-lg ${bg} ${color} flex items-center justify-center border border-border`}
      >
        {icon}
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-xs font-semibold text-foreground truncate leading-tight">
          {name}
        </span>
        <span className="text-[10px] text-foreground-muted uppercase tracking-wide">
          .{extension}
        </span>
      </div>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="shrink-0 ml-1 w-4 h-4 rounded-full hover:bg-foreground/10 flex items-center justify-center text-foreground-muted hover:text-foreground transition-colors cursor-pointer"
        >
          <X size={9} strokeWidth={3} />
        </button>
      )}
    </div>
  );
};

export default FileChip;
