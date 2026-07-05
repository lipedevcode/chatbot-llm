import { isAxiosError } from "axios";

// O backend agora devolve um corpo estruturado { message } pra erros de domínio
// (GlobalExceptionHandler.java). Lê essa mensagem quando disponível; cai no
// fallback pra erro de rede/timeout (sem response) ou qualquer coisa inesperada.
export const getErrorMessage = (error: unknown, fallback: string): string => {
  if (isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (typeof message === "string" && message.trim().length > 0) {
      return message;
    }
  }
  return fallback;
};
