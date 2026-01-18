import { useState, useCallback, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

interface VoiceCommand {
  command: string;
  action: () => void;
  keywords: string[];
}

export const useVoiceAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();

  // Voice commands for navigation and booking
  const voiceCommands: VoiceCommand[] = [
    {
      command: "book bus",
      keywords: ["book", "bus", "பேருந்து"],
      action: () => {
        document.querySelector('[data-booking-tab="bus"]')?.dispatchEvent(new Event('click', { bubbles: true }));
        speak("Opening bus booking. Please tell me your destination.");
      },
    },
    {
      command: "book cab",
      keywords: ["book", "cab", "taxi", "கேப்"],
      action: () => {
        document.querySelector('[data-booking-tab="cab"]')?.dispatchEvent(new Event('click', { bubbles: true }));
        speak("Opening cab booking. Where would you like to go?");
      },
    },
    {
      command: "emergency",
      keywords: ["emergency", "sos", "help", "உதவி", "அவசரம்"],
      action: () => {
        document.querySelector('[data-sos-button]')?.dispatchEvent(new Event('click', { bubbles: true }));
        speak("Opening emergency assistance. Your safety is our priority.");
      },
    },
    {
      command: "track bus",
      keywords: ["track", "where", "location", "எங்கே"],
      action: () => {
        document.querySelector('#track')?.scrollIntoView({ behavior: 'smooth' });
        speak("Showing live tracking section.");
      },
    },
    {
      command: "login",
      keywords: ["login", "sign in", "account", "உள்நுழை"],
      action: () => {
        window.location.href = "/auth";
        speak("Redirecting to login page.");
      },
    },
  ];

  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-IN';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  }, []);

  const processCommand = useCallback((text: string) => {
    const lowerText = text.toLowerCase();
    
    for (const cmd of voiceCommands) {
      const hasKeyword = cmd.keywords.some(keyword => 
        lowerText.includes(keyword.toLowerCase())
      );
      
      if (hasKeyword) {
        cmd.action();
        return true;
      }
    }

    // If no command matched, provide helpful response
    speak("I didn't understand that command. You can say: book bus, book cab, track bus, or emergency for help.");
    return false;
  }, [speak, voiceCommands]);

  const startListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setIsSupported(false);
      toast({
        title: "Voice Not Supported",
        description: "Your browser doesn't support voice recognition. Please try Chrome or Edge.",
        variant: "destructive",
      });
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-IN';

    recognition.onstart = () => {
      setIsListening(true);
      speak("I'm listening. How can I help you?");
    };

    recognition.onresult = (event) => {
      let finalTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        }
      }

      if (finalTranscript) {
        setTranscript(finalTranscript);
        processCommand(finalTranscript);
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      
      if (event.error === 'not-allowed') {
        toast({
          title: "Microphone Access Denied",
          description: "Please allow microphone access to use voice commands.",
          variant: "destructive",
        });
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [processCommand, speak, toast]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, []);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  return {
    isListening,
    isSupported,
    transcript,
    startListening,
    stopListening,
    toggleListening,
    speak,
  };
};

// Type declarations for Speech Recognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}
