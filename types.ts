export type AssistantProvider = 'gemini' | 'openai';

export interface BaseAssistant {
  id: string;
  name: string;
  instructions: string;
  createdAt: number;
}

export interface GeminiAssistant extends BaseAssistant {
  provider: 'gemini';
  model: 'gemini-2.5-flash';
}

export interface OpenAI_Assistant extends BaseAssistant {
  provider: 'openai';
  model: string; // e.g., 'gpt-4-turbo'
  openAiAssistantId: string;
  vectorStoreId?: string;
}

export type Assistant = GeminiAssistant | OpenAI_Assistant;

export interface Thread {
  id: string;
  title: string;
  createdAt: number;
  openAiThreadId?: string; // Only for OpenAI threads
}

export interface Message {
  id:string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: number;
}

export interface VectorStoreFile {
    id: string;
    name: string;
    status: 'in_progress' | 'completed' | 'failed' | 'cancelled';
    createdAt: number;
}

export interface SandboxFile {
    id: string;
    name: string;
    bytes: number;
    createdAt: number;
}

export interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType: string;
  kind: 'drive#folder' | 'drive#file';
}

export interface GoogleUserProfile {
    email: string;
    name: string;
    picture: string;
}
