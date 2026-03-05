"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  Send,
  Loader2,
  Sparkles,
  ArrowRight,
  BarChart3,
  FileText,
  Target,
  Building2,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: { type: string; id: string; label: string }[];
  suggested_actions?: { label: string; action: string }[];
  timestamp: string;
}

const SUGGESTED_QUESTIONS = [
  { icon: BarChart3, label: "Pipeline overview", question: "What's the current state of our sales pipeline? How many leads are in each stage?" },
  { icon: FileText, label: "Proposal performance", question: "What's our proposal win rate? Which proposals are still awaiting response?" },
  { icon: Target, label: "At-risk deals", question: "Are there any deals at risk of being lost? What should I prioritize this week?" },
  { icon: Building2, label: "Revenue forecast", question: "What's our estimated revenue from the current pipeline? Break it down by status." },
];

export default function AskPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => crypto.randomUUID());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(question?: string) {
    const q = question ?? input.trim();
    if (!q || isLoading) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: q,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/v1/agents/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, session_id: sessionId }),
      });
      const data = await res.json();

      const assistantMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.data?.answer ?? "I'm sorry, I couldn't process that question. Please try again.",
        sources: data.data?.sources ?? [],
        suggested_actions: data.data?.suggested_actions ?? [],
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Something went wrong. Please try again.",
          timestamp: new Date().toISOString(),
        },
      ]);
    }

    setIsLoading(false);
    inputRef.current?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50">
            <MessageSquare className="h-4 w-4 text-violet-600" />
          </div>
          <div>
            <h1 className="text-[18px] font-bold tracking-tight text-[#111]">
              AskSupplierKit
            </h1>
            <p className="text-[12px] text-[#666]">
              Your AI proposal intelligence assistant
            </p>
          </div>
        </div>
        <Badge variant="secondary" className="gap-1">
          <Sparkles className="h-3 w-3" />
          Conversational AI
        </Badge>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-auto rounded-lg border border-[#eee] bg-white p-4">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-50 mb-4">
              <MessageSquare className="h-8 w-8 text-violet-500" />
            </div>
            <h2 className="text-[16px] font-semibold text-[#111] mb-1">
              Ask me anything about your proposals
            </h2>
            <p className="text-[13px] text-[#666] mb-6 max-w-md">
              I can analyze your pipeline, review proposal performance, identify at-risk deals, and help draft responses.
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 max-w-lg">
              {SUGGESTED_QUESTIONS.map((sq) => (
                <button
                  key={sq.label}
                  onClick={() => handleSend(sq.question)}
                  className="flex items-center gap-2 rounded-lg border border-[#eee] px-3 py-2 text-left text-[13px] text-[#444] hover:border-primary/30 hover:bg-[#FAFAFA] transition-colors cursor-pointer"
                >
                  <sq.icon className="h-4 w-4 text-[#888] flex-shrink-0" />
                  <span>{sq.label}</span>
                  <ArrowRight className="h-3 w-3 text-[#ccc] ml-auto" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-3 ${
                    msg.role === "user"
                      ? "bg-primary text-white"
                      : "bg-[#F6F7F8] text-[#111]"
                  }`}
                >
                  <p className="text-[13px] whitespace-pre-wrap">{msg.content}</p>
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {msg.sources.map((s, i) => (
                        <Badge key={i} variant="secondary" className="text-[10px]">
                          {s.label}
                        </Badge>
                      ))}
                    </div>
                  )}
                  {msg.suggested_actions && msg.suggested_actions.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {msg.suggested_actions.map((a, i) => (
                        <Button key={i} variant="outline" size="sm" className="text-[11px] h-6">
                          {a.label}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-lg bg-[#F6F7F8] px-4 py-3">
                  <Loader2 className="h-4 w-4 animate-spin text-violet-500" />
                  <span className="text-[13px] text-[#666]">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="mt-3 flex gap-2">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about your proposals, pipeline, pricing..."
          rows={1}
          className="flex-1 resize-none rounded-lg border border-[#eee] bg-white px-4 py-3 text-[13px] placeholder:text-[#999] focus:border-primary/30 focus:outline-none focus:ring-1 focus:ring-primary/20"
        />
        <Button
          onClick={() => handleSend()}
          disabled={!input.trim() || isLoading}
          className="self-end"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
