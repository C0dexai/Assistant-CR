import { GoogleGenAI, Chat, Content } from "@google/genai";
import { Message } from '../types';

// This is a placeholder for the API key. In a real environment, this would be securely managed.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("API_KEY environment variable not set for Gemini. Using a placeholder. App will not function correctly.");
}
const ai = new GoogleGenAI({ apiKey: API_KEY! });

const transformMessagesToHistory = (messages: Message[]): Content[] => {
    return messages.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
    }));
};

export const createChat = (assistantInstructions: string, history: Message[]): Chat => {
    return ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: assistantInstructions,
        },
        history: transformMessagesToHistory(history)
    });
};

export async function* streamAssistantResponse(
  chat: Chat,
  newMessage: string,
): AsyncGenerator<string, void, unknown> {
  try {
    const result = await chat.sendMessageStream({ message: newMessage });

    for await (const chunk of result) {
      if(chunk.text) {
        yield chunk.text;
      }
    }
  } catch (error) {
    console.error("Error streaming response from Gemini:", error);
    yield `An error occurred while getting a response. Details: ${error instanceof Error ? error.message : String(error)}`;
  }
}
