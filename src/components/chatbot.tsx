"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useChat } from "ai/react";
import { Send } from 'lucide-react';
import ReactMarkdown from "react-markdown";

interface ChatbotProps {
  responses: any[];
  schema: any;
}

export function Chatbot({ responses, schema }: ChatbotProps) {
  const [context] = useState(() => {
    return `You are an AI assistant analyzing survey responses. Here's the context:
    Survey Title: ${schema.title}
    Number of Responses: ${responses.length}
    Fields: ${schema.fields.map((field: any) => field.label).join(", ")}
    
    Response data:
    ${JSON.stringify(responses, null, 2)}
    
    Please answer questions about this data accurately.`;
  });

  const { messages, input, handleInputChange, handleSubmit, isLoading, error } =
    useChat({
      initialMessages: [
        { id: "system-message", role: "system", content: context },
      ],
      onError: (error) => {
        console.error("Chat error:", error);
      },
    });

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(
          (message) =>
            message.role !== "system" && (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`rounded-lg p-2 max-w-3/4 ${
                    message.role === "user" ? "bg-blue-100" : "bg-gray-100"
                  }`}
                >
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
              </div>
            )
        )}
        {isLoading && <div className="text-center">RYO is thinking...</div>}
        {error && (
          <div className="text-red-500">
            Error: {error.message}
            <br />
            Please check the console for more details.
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex space-x-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask a question about the responses..."
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading}>
            Send <Send className="ml-2" size={16} />
          </Button>
        </div>
      </form>
    </div>
  );
}
