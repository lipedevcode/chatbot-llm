export const extractUserText = (text: string): string => {
  const marker = "## Prompt do usuário:";
  const idx = text.indexOf(marker);
  if (idx !== -1) {
    return text.slice(idx + marker.length).trim();
  }
  return text.trim();
};

export const hasEmbeddedFile = (text: string): boolean =>
  text.includes("Título do documento anexado:");
