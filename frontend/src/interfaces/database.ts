export interface Response {
  id: number;
  text: string;
}

export interface Session {
  memoryId: number;
  messages: string;
}

export interface History {
  id: number;
  prompts?: Prompt[] | null;
  session: Session;
}

export interface Usuario {
  id: number;
  history?: History | null;
  prompts?: Prompt[] | null;
}

export interface Prompt {
  id: number;
  text: string;
  response?: Response | null;
  history?: History | null;
  usuario?: Usuario | null;
}