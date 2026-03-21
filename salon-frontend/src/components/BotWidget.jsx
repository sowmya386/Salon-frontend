import { useState, useRef, useEffect } from "react";
import api from "../api/axios";
import { MessageSquare, X, Send, Loader2, Bot, User, Sparkles } from "lucide-react";
import { cn } from "../lib/utils";

const BotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", content: "Hi there! I'm your Hyve AI Assistant. Ask me about your business health, bookings, or our premium feature plans!" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userQuery = input;
    setMessages(prev => [...prev, { role: "user", content: userQuery }]);
    setInput("");
    setLoading(true);

    try {
      // Local fallback logic for SaaS feature plans if requested
      const lowerQuery = userQuery.toLowerCase();
      if (lowerQuery.includes("plan") || lowerQuery.includes("feature") || lowerQuery.includes("pricing") || lowerQuery.includes("pro")) {
        setTimeout(() => {
          setMessages(prev => [...prev, { 
            role: "bot", 
            content: "We offer two main plans: \n\n**1. Essential Plan (Free)** - Core booking management.\n**2. Pro Plan (₹1999/mo)** - Unlocks custom POS, marketing automation, AI insights, and staff commission tracking. Let me know if you want to upgrade!" 
          }]);
          setLoading(false);
        }, 1200);
        return;
      }

      // Endpoint: POST /api/bot/chat
      const res = await api.post("/bot/chat", { message: userQuery });
      const botReply = res.data?.reply || "I processed your request successfully!";
      setMessages((prev) => [...prev, { role: "bot", content: botReply }]);
    } catch (err) {
      console.error(err);
      setTimeout(() => {
         setMessages(prev => [...prev, { role: "bot", content: "I'm having a little trouble thinking deeply right now. But if you have questions about upgrading to Pro, I can still help!" }]);
         setLoading(false);
      }, 1000);
      return; 
    }
    
    setLoading(false);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-8 right-8 w-14 h-14 premium-gradient text-white rounded-full flex items-center justify-center shadow-[0_8px_30px_rgb(200,155,75,0.4)] hover:scale-110 transition-all duration-300 z-50",
          isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"
        )}
      >
        <Sparkles className="w-6 h-6 animate-pulse text-white" />
      </button>

      {/* Chat Window */}
      <div 
        className={cn(
          "fixed bottom-8 right-8 w-[400px] h-[580px] bg-white/95 backdrop-blur-xl rounded-3xl shadow-[0_20px_60px_rgb(0,0,0,0.12)] border border-white/50 z-50 flex flex-col transition-all duration-500 origin-bottom-right overflow-hidden",
          isOpen ? "scale-100 opacity-100 pointer-events-auto" : "scale-50 opacity-0 pointer-events-none"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100/50 bg-gradient-to-r from-[#111] to-[#222] text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full premium-gradient flex items-center justify-center border border-white/20 shadow-md">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base tracking-wide">Hyve Intelligence</h3>
              <p className="text-xs text-[#d4af37] font-bold flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-pulse"></span> Analyzing Data
              </p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-gradient-to-b from-gray-50/50 to-white">
          {messages.map((msg, idx) => (
            <div key={idx} className={cn("flex gap-3 max-w-[88%]", msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto")}>
               <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-md", msg.role === "user" ? "bg-gray-900 text-white" : "premium-gradient text-white")}>
                 {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
               </div>
               <div className={cn("p-3.5 text-sm shadow-sm whitespace-pre-wrap leading-relaxed", msg.role === "user" ? "bg-gray-900 text-white rounded-2xl rounded-tr-md font-medium" : "bg-white border border-gray-100/80 text-gray-700 rounded-2xl rounded-tl-md font-medium shadow-[0_4px_20px_rgb(0,0,0,0.03)]")}>
                 {msg.content}
               </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-3 max-w-[85%] mr-auto">
               <div className="w-8 h-8 rounded-full bg-white border border-gray-200 text-primary-600 flex items-center justify-center shrink-0 shadow-sm">
                 <Bot className="w-4 h-4" />
               </div>
               <div className="p-4 bg-white border border-gray-100 rounded-2xl rounded-tl-sm shadow-sm flex items-center justify-center">
                 <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Shortcuts / Suggestions */}
        {messages.length < 3 && !loading && (
          <div className="px-5 py-3 flex gap-2 overflow-x-auto no-scrollbar border-t border-gray-100 bg-white/80 backdrop-blur-md">
            <button onClick={() => setInput("What services do you offer?")} className="whitespace-nowrap px-4 py-2 bg-gradient-to-r from-primary-50 to-primary-100/50 hover:from-primary-100 hover:to-primary-200 text-primary-800 rounded-full text-xs font-bold transition-all border border-primary-200 shadow-sm hover:shadow-md">
              View Services ✂️
            </button>
            <button onClick={() => setInput("Show me products")} className="whitespace-nowrap px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-full text-xs font-bold transition-all border border-gray-200 shadow-sm">
              Retail Products 🛍️
            </button>
            <button onClick={() => setInput("My booking status")} className="whitespace-nowrap px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-full text-xs font-bold transition-all border border-gray-200 shadow-sm">
              My Bookings 📅
            </button>
          </div>
        )}

        {/* Input Area */}
        <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100">
          <div className="relative flex items-center">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Hyve Intelligence..."
              className="w-full pl-5 pr-14 py-3.5 bg-gray-50/80 border border-gray-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all text-gray-900 placeholder:text-gray-400"
            />
            <button 
              type="submit" 
              disabled={!input.trim() || loading}
              className="absolute right-2 p-2 premium-gradient text-white rounded-xl disabled:opacity-50 hover:scale-105 transition-all shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default BotWidget;
