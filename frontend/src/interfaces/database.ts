export interface Response {
  text: string;
}

export interface Session {
  messages: string;
}

export interface ChatHistory {
  id?: number | null;
  // Título gerado pelo backend na primeira mensagem. Pode ser nulo em conversas
  // antigas, criadas antes do mecanismo de título — nesse caso o cliente deriva
  // um título a partir da primeira mensagem.
  title?: string | null;
  prompts?: Prompt[] | null;
  session?: Session;
}

export interface Usuario {
  id: number;
  subject: string; // username como hash de palavra aleatória
}

export interface Prompt {
  text: string;
  // O backend sempre envia `response`. O valor nulo só existe no cliente, para a
  // mensagem otimista do usuário enquanto a resposta da LLM ainda não chegou.
  response?: Response | null;
  // o Atachment eh so pelo cliente
  attachments?: Attachment[] | null;
  files?: File[];
}
export interface Attachment {
  id: string;
  name: string;
  extension: string;
}

export interface File {
  id: string;
  filename: string;
}
