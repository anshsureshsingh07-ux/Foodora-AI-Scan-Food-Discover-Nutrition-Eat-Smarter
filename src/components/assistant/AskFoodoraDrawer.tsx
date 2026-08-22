import React, { useState, useRef, useEffect } from "react";
import { useFood } from "../../context/FoodContext";
import {
  Sparkles,
  X,
  Send,
  Trash2,
  HelpCircle,
  ShieldCheck,
  Bot,
  User,
  ArrowRight,
} from "lucide-react";

export const AskFoodoraDrawer: React.FC = () => {
  const {
    isAskDrawerOpen,
    setIsAskDrawerOpen,
    chatMessages,
    addChatMessage,
    clearChat,
    isBrainrotMode,
    activeFoodDetail,
  } = useFood();

  const [inputQuery, setInputQuery] = useState("");
  const [isAiResponding, setIsAiResponding] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const corporatePromptSuggestions = [
    "What are the nutritional benefits of ceremonial matcha?",
    "Explain the difference between artisan sourdough and regular white bread",
    "Which foods are best for gut microbiome diversity?",
    "Is daily avocado consumption healthy for cholesterol levels?",
    "What are the cleanest high-protein vegetarian foods?",
  ];

  const brainrotPromptSuggestions = [
    "Roast my late-night instant ramen binge 💀",
    "Is peanut butter god-tier aura or instant fat trap?",
    "How to mew with high-protein jawline nutrition fr?",
    "Rate my high-protein gym bro meal prep no cap",
    "Why does ultra-processed sugar drain my aura points?",
  ];

  const promptSuggestions = isBrainrotMode ? brainrotPromptSuggestions : corporatePromptSuggestions;

  useEffect(() => {
    if (isAskDrawerOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, isAskDrawerOpen]);

  const handleSendMessage = async (queryText?: string) => {
    const text = (queryText || inputQuery).trim();
    if (!text || isAiResponding) return;

    // Add user message
    addChatMessage({
      role: "user",
      content: text,
    });
    setInputQuery("");
    setIsAiResponding(true);

    try {
      const response = await fetch("/api/gemini/ask-foodora", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: text,
          isBrainrotMode,
          activeFoodContext: activeFoodDetail,
          history: chatMessages.slice(-6).map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        addChatMessage({
          role: "assistant",
          content: data.reply || data.answer || "Here is what Nutrimania food intelligence discovered.",
        });
      } else {
        addChatMessage({
          role: "assistant",
          content: isBrainrotMode
            ? "Bro the server is catching its breath 💀 but remember: clean whole foods = +10,000 aura!"
            : "I encountered a temporary connection issue. However, based on nutritional research, focusing on whole, unprocessed foods with diverse plant fiber provides broad metabolic benefits.",
        });
      }
    } catch (err) {
      console.error("Chat error:", err);
      addChatMessage({
        role: "assistant",
        content: isBrainrotMode
          ? "Network glitch fr fr! But don't skip your protein and water intake today!"
          : "Thank you for asking! For optimal food balance, combining whole-food protein sources with prebiotic fiber and healthy monounsaturated fats supports sustained satiety.",
      });
    } finally {
      setIsAiResponding(false);
    }
  };

  if (!isAskDrawerOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in"
      onClick={() => setIsAskDrawerOpen(false)}
    >
      <div
        className="bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800 w-full max-w-lg h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-[2px]">
              <div className="w-full h-full bg-white dark:bg-zinc-950 rounded-[9px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-emerald-500" />
              </div>
            </div>
            <div>
              <h2 className="font-extrabold text-sm text-zinc-900 dark:text-white flex items-center gap-1.5">
                Ask Nutrimania AI
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  Assistant
                </span>
              </h2>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Grounded food science, recipe synthesis &amp; nutritional intelligence
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={clearChat}
              className="p-2 text-zinc-400 hover:text-rose-500 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              title="Clear conversation"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsAskDrawerOpen(false)}
              className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat Messages List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs sm:text-sm">
          {chatMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5 border border-emerald-200 dark:border-emerald-800">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[82%] rounded-2xl p-3.5 leading-relaxed space-y-2 ${
                  msg.role === "user"
                    ? "bg-emerald-600 text-white rounded-tr-xs"
                    : "bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 rounded-tl-xs border border-zinc-200 dark:border-zinc-800"
                }`}
              >
                {/* Food Context Box if attached */}
                {msg.foodContext && (
                  <div className="p-2 rounded-lg bg-black/10 dark:bg-black/40 border border-white/10 text-xs flex items-center gap-2 mb-2">
                    <img
                      src={msg.foodContext.imageUrl}
                      alt={msg.foodContext.name}
                      className="w-8 h-8 rounded-md object-cover"
                    />
                    <div>
                      <span className="font-bold block">{msg.foodContext.name}</span>
                      <span className="text-[10px] opacity-80">
                        {msg.foodContext.calories} kcal • Score {msg.foodContext.healthScore}/100
                      </span>
                    </div>
                  </div>
                )}

                <div className="whitespace-pre-wrap">{msg.content}</div>
              </div>

              {msg.role === "user" && (
                <div className="w-7 h-7 rounded-lg bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isAiResponding && (
            <div className="flex gap-3 justify-start items-center text-xs text-zinc-400">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 border border-emerald-200 dark:border-emerald-800">
                <Sparkles className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-zinc-100 dark:bg-zinc-900 p-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]" />
                <span className="ml-1 text-xs">Nutrimania AI is formulating response...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Chips */}
        <div className="px-4 py-2 border-t border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/40">
          <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">
            Prompt Ideas:
          </span>
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {promptSuggestions.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-emerald-500 hover:text-emerald-600 text-xs whitespace-nowrap transition-colors cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 space-y-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask anything about foods, additives, vitamins, or recipes..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder-zinc-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              disabled={isAiResponding || !inputQuery.trim()}
              className="p-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl shadow-md transition-all active:scale-95 flex-shrink-0 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          <div className="flex items-center justify-between text-[10px] text-zinc-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
              Evidence-based nutritional intelligence
            </span>
            <span>Not a substitute for medical diagnosis</span>
          </div>
        </div>
      </div>
    </div>
  );
};
