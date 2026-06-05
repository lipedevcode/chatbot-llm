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
  response?: Response | null;
}
