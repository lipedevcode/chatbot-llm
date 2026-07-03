const TypingIndicator = () => {
  return (
    <>
      <div className="flex items-center gap-1.5 py-1" aria-label="Digitando">
        <span className="w-2 h-2 rounded-full bg-foreground-muted animate-bounce [animation-delay:-0.3s]" />
        <span className="w-2 h-2 rounded-full bg-foreground-muted animate-bounce [animation-delay:-0.15s]" />
        <span className="w-2 h-2 rounded-full bg-foreground-muted animate-bounce" />
      </div>
    </>
  );
};

export default TypingIndicator;
