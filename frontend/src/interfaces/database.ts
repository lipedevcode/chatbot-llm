export interface Response {
  text: string;
}

export interface Session {
  messages: string;
}

export interface ChatHistory {
  id?: number | null;
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
  attachments?: Attachment[] | null;
  files: File[];
}
export interface Attachment {
  name: string;
  extension: string;
}

export interface File {
  id: string;
  response: Response;
}
