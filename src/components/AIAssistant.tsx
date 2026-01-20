import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "வணக்கம்! Welcome to GO UNIFIED! I'm your AI travel assistant. How can I help you today? I can assist with booking buses, cabs, car rentals, and flights across Tamil Nadu." }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (messageToSend?: string) => {
    const userMessage = (messageToSend || input).trim();
    if (!userMessage || isLoading) return;

    setInput("");
    
    // Only add user message if it's a new message (not a retry)
    if (!messageToSend) {
      setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    }
    
    setIsLoading(true);

    try {
      // Prepare conversation history for context
      const conversationHistory = messages.slice(-10).map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      const response = await supabase.functions.invoke("ai-assistant", {
        body: { 
          messages: [...conversationHistory, { role: "user", content: userMessage }] 
        }
      });

      if (response.error) {
        throw new Error(response.error.message || "Failed to get response");
      }

      if (response.data?.content) {
        setMessages(prev => [...prev, { role: "assistant", content: response.data.content }]);
        setRetryCount(0);
      } else if (response.data?.error) {
        throw new Error(response.data.error);
      } else {
        throw new Error("Empty response from AI");
      }
    } catch (error) {
      console.error("AI Assistant error:", error);
      
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      
      if (retryCount < 2) {
        setRetryCount(prev => prev + 1);
        toast.error("Connection issue. Retrying...");
        // Retry after a short delay
        setTimeout(() => sendMessage(userMessage), 1000);
        return;
      }
      
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "I apologize, I'm having trouble connecting right now. Please check your internet connection and try again. You can also use voice commands or navigate the app directly." 
      }]);
      setRetryCount(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      { role: "assistant", content: "வணக்கம்! Welcome to GO UNIFIED! I'm your AI travel assistant. How can I help you today?" }
    ]);
  };

  const quickActions = [
    { label: "Book Bus", message: "I want to book a bus ticket" },
    { label: "Track", message: "How can I track my bus?" },
    { label: "Help", message: "What can you help me with?" },
  ];

  return (
    <>
      {/* Chat Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-r from-primary to-ocean-light text-white shadow-lg shadow-primary/30 flex items-center justify-center"
        aria-label="Open AI Assistant"
      >
        <MessageCircle className="w-7 h-7" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] bg-card rounded-3xl shadow-2xl border border-border overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-ocean-light p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">GO UNIFIED AI</h3>
                  <p className="text-white/70 text-xs">Travel Assistant • Online</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={clearChat} 
                  className="text-white hover:bg-white/20"
                  title="Clear chat"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setIsOpen(false)} 
                  className="text-white hover:bg-white/20"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-2 border-b border-border flex gap-2 overflow-x-auto">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => {
                    setMessages(prev => [...prev, { role: "user", content: action.message }]);
                    sendMessage(action.message);
                  }}
                  className="flex-shrink-0 px-3 py-1.5 text-xs font-medium bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors"
                >
                  {action.label}
                </button>
              ))}
            </div>

            {/* Messages */}
            <div className="h-80 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2 ${msg.role === "user" ? "justify-end" : ""}`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                  )}
                  <div className={`max-w-[80%] p-3 rounded-2xl ${
                    msg.role === "user" 
                      ? "bg-primary text-white rounded-br-md" 
                      : "bg-muted rounded-bl-md"
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                  {msg.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-accent" />
                    </div>
                  )}
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Loader2 className="w-4 h-4 text-primary animate-spin" />
                  </div>
                  <div className="bg-muted p-3 rounded-2xl rounded-bl-md">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask me anything about travel..."
                  className="flex-1 input-premium text-sm"
                  disabled={isLoading}
                />
                <Button 
                  onClick={() => sendMessage()} 
                  disabled={isLoading || !input.trim()} 
                  className="bg-primary hover:bg-primary/90"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground text-center mt-2">
                Powered by GO UNIFIED AI
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIAssistant;
