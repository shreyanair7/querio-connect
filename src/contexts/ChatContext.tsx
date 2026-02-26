import React, { createContext, useContext, useState, ReactNode } from "react";

export interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "bot";
  detectedLang?: string;
  timestamp: Date;
}

export interface ChatThread {
  id: string;
  messages: ChatMessage[];
  title: string;
  createdAt: Date;
}

interface ChatContextType {
  threads: ChatThread[];
  activeThreadId: string | null;
  createThread: () => string;
  setActiveThread: (id: string | null) => void;
  addMessage: (threadId: string, message: Omit<ChatMessage, "id" | "timestamp">) => void;
  getActiveThread: () => ChatThread | undefined;
}

const ChatContext = createContext<ChatContextType>({
  threads: [],
  activeThreadId: null,
  createThread: () => "",
  setActiveThread: () => {},
  addMessage: () => {},
  getActiveThread: () => undefined,
});

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);

  const createThread = () => {
    const id = Date.now().toString();
    const newThread: ChatThread = {
      id,
      messages: [],
      title: `Conversation ${threads.length + 1}`,
      createdAt: new Date(),
    };
    setThreads((prev) => [newThread, ...prev]);
    setActiveThreadId(id);
    return id;
  };

  const setActiveThread = (id: string | null) => setActiveThreadId(id);

  const addMessage = (threadId: string, message: Omit<ChatMessage, "id" | "timestamp">) => {
    const msg: ChatMessage = {
      ...message,
      id: Date.now().toString() + Math.random(),
      timestamp: new Date(),
    };
    setThreads((prev) =>
      prev.map((t) => {
        if (t.id === threadId) {
          const updated = { ...t, messages: [...t.messages, msg] };
          if (message.sender === "user" && t.messages.length === 0) {
            updated.title = message.text.slice(0, 40) + (message.text.length > 40 ? "..." : "");
          }
          return updated;
        }
        return t;
      })
    );
  };

  const getActiveThread = () => threads.find((t) => t.id === activeThreadId);

  return (
    <ChatContext.Provider
      value={{ threads, activeThreadId, createThread, setActiveThread, addMessage, getActiveThread }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
