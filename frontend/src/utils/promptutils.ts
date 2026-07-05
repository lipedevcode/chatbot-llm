export const extractUserText = (text: string): string => {
  // Precisa bater com o marcador que o backend realmente persiste
  // (ChatService.java: "## Prompt do usuário: "). Um mismatch aqui faz o texto
  // inteiro extraído do PDF vazar na bolha de mensagem em vez de só a
  // mensagem digitada pelo usuário.
  const marker = "## Prompt do usuário:";
  const idx = text.indexOf(marker);
  if (idx !== -1) {
    return text.slice(idx + marker.length).trim();
  }
  return text.trim();
};

export const hasEmbeddedFile = (text: string): boolean =>
  text.includes("Título do documento anexado:");
