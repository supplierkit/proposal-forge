"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  X,
  Send,
  Loader2,
  Sparkles,
} from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTED = [
  "What's our pipeline value this month?",
  "Which proposals need follow-up?",
  "How are win rates trending?",
];

export function AskWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  async function handleSend(text?: string) {
    const msg = text ?? input.trim();
    if (!msg || loading) return;

    const userMsg: Message = { role: "user", content: msg };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/v1/agents/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: msg,
          context: "dashboard",
        }),
      });
      const data = await res.json();
      const reply = data.data?.response ?? "Sorry, I couldn't process that request.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Something went wrong. Please try again." },
      ]);
    }
    setLoading(false);
  }

  return (
    <>
      {/* Floating trigger button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg hover:bg-primary/90 transition-all hover:scale-105 cursor-pointer"
          aria-label="Ask SupplierKit"
        >
          <MessageSquare className="h-6 w-6" />
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 flex w-[380px] flex-col rounded-xl border border-[#e5e5e5] bg-white shadow-2xl" style={{ height: "520px" }}>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#eee] px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-[#111]">AskSupplierKit</p>
                <p className="text-[11px] text-[#888]">AI assistant</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-[#888] hover:text-[#444] cursor-pointer">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-auto px-4 py-3 space-y-3">
            {messages.length === 0 && (
              <div className="space-y-3 pt-4">
                <p className="text-[13px] text-[#666] text-center">Ask anything about your pipeline, proposals, or performance.</p>
                <div className="space-y-2">
                  {SUGGESTED.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(q)}
                      className="w-full text-left rounded-lg border border-[#e5e5e5] px-3 py-2 text-[12px] text-[#555] hover:bg-[#FAFAFA] hover:border-primary/30 transition-colors cursor-pointer"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-lg px-3 py-2 text-[13px] ${
                    msg.role === "user"
                      ? "bg-primary text-white"
                      : "bg-[#F6F7F8] text-[#333]"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-lg bg-[#F6F7F8] px-3 py-2">
                  <Loader2 className="h-4 w-4 animate-spin text-[#888]" />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-[#eee] px-3 py-3">
            <form
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
                className="flex-1 rounded-md border border-[#e5e5e5] px-3 py-2 text-[13px] outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                disabled={loading}
              />
              <Button type="submit" size="sm" disabled={loading || !input.trim()} className="h-9 w-9 p-0">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
