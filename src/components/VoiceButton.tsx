import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Volume2 } from "lucide-react";
import { useVoiceAssistant } from "@/hooks/useVoiceAssistant";
import { cn } from "@/lib/utils";

interface VoiceButtonProps {
  variant?: "header" | "floating";
  className?: string;
}

const VoiceButton = ({ variant = "header", className }: VoiceButtonProps) => {
  const { isListening, isSupported, transcript, toggleListening } = useVoiceAssistant();

  if (!isSupported) return null;

  if (variant === "floating") {
    return (
      <>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleListening}
          className={cn(
            "fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300",
            isListening 
              ? "bg-gradient-to-r from-secondary to-gold text-white animate-pulse-glow" 
              : "bg-card border border-border text-primary hover:bg-primary hover:text-white",
            className
          )}
          aria-label={isListening ? "Stop voice command" : "Start voice command"}
        >
          {isListening ? (
            <Volume2 className="w-6 h-6 animate-pulse" />
          ) : (
            <Mic className="w-6 h-6" />
          )}
        </motion.button>

        {/* Voice Feedback */}
        <AnimatePresence>
          {isListening && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="fixed bottom-6 left-24 z-50 glass-card rounded-2xl p-4 max-w-xs"
            >
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        height: [8, 16, 8],
                      }}
                      transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        delay: i * 0.1,
                      }}
                      className="w-1 bg-secondary rounded-full"
                    />
                  ))}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Listening...</p>
                  {transcript && (
                    <p className="text-xs text-muted-foreground mt-1 truncate max-w-[180px]">
                      "{transcript}"
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  return (
    <button
      onClick={toggleListening}
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300",
        isListening 
          ? "bg-secondary text-white" 
          : "text-muted-foreground hover:text-primary hover:bg-primary/10",
        className
      )}
      aria-label={isListening ? "Stop voice command" : "Start voice command"}
    >
      {isListening ? (
        <MicOff className="w-4 h-4" />
      ) : (
        <Mic className="w-4 h-4" />
      )}
      <span className="text-sm font-medium hidden sm:inline">
        {isListening ? "Stop" : "Voice"}
      </span>
    </button>
  );
};

export default VoiceButton;
