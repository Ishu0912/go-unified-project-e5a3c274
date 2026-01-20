import { useState, useCallback, useRef, useEffect } from "react";
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
  const [interimTranscript, setInterimTranscript] = useState("");
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();

  // Check support on mount
  useEffect(() => {
    const supported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    setIsSupported(supported);
  }, []);

  // Voice commands for navigation and booking - supports natural language
  const voiceCommands: VoiceCommand[] = [
    {
      command: "book bus",
      keywords: [
        // Direct commands
        "book bus", "bus booking", "book a bus", "bus ticket",
        // Natural language variations
        "i want to book a bus", "i want bus", "want to book bus", "need a bus",
        "i need to book a bus", "book me a bus", "get me a bus ticket",
        "i would like to book a bus", "can you book a bus", "help me book a bus",
        "bus please", "show bus booking", "open bus booking",
        // Tamil
        "பேருந்து புக்", "பேருந்து வேண்டும்"
      ],
      action: () => {
        // Scroll to booking section and click bus tab
        document.querySelector('#booking')?.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
          const busTab = document.querySelector('[value="bus"]') as HTMLElement;
          if (busTab) busTab.click();
        }, 300);
        speak("Opening bus booking. Please select your origin and destination.");
      },
    },
    {
      command: "book cab",
      keywords: [
        "book cab", "cab booking", "book a cab", "taxi", "book taxi",
        "i want to book a cab", "i want cab", "want to book cab", "need a cab",
        "i need to book a cab", "book me a cab", "get me a taxi",
        "i would like to book a cab", "can you book a cab", "help me book a cab",
        "cab please", "show cab booking", "open cab booking",
        "கேப் புக்", "டாக்சி வேண்டும்"
      ],
      action: () => {
        document.querySelector('#booking')?.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
          const cabTab = document.querySelector('[value="cab"]') as HTMLElement;
          if (cabTab) cabTab.click();
        }, 300);
        speak("Opening cab booking. Where would you like to go?");
      },
    },
    {
      command: "book flight",
      keywords: [
        "book flight", "flight booking", "fly", "airplane", "flight ticket",
        "i want to book a flight", "i want flight", "want to book flight", "need a flight",
        "i need to book a flight", "book me a flight", "get me a flight ticket",
        "i would like to fly", "can you book a flight", "help me book a flight",
        "flight please", "show flight booking", "open flight booking",
        "விமானம்", "விமான டிக்கெட்"
      ],
      action: () => {
        document.querySelector('#booking')?.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
          const flightTab = document.querySelector('[value="flight"]') as HTMLElement;
          if (flightTab) flightTab.click();
        }, 300);
        speak("Opening flight booking.");
      },
    },
    {
      command: "rent car",
      keywords: [
        "rent car", "car rental", "rent a car", "rental",
        "i want to rent a car", "need a rental car", "book a rental",
        "i need to rent a car", "help me rent a car", "car rental please",
        "கார் வாடகை"
      ],
      action: () => {
        document.querySelector('#booking')?.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
          const rentalTab = document.querySelector('[value="rental"]') as HTMLElement;
          if (rentalTab) rentalTab.click();
        }, 300);
        speak("Opening car rental section.");
      },
    },
    {
      command: "emergency",
      keywords: [
        "emergency", "sos", "help me", "urgent help", "danger", "i need help",
        "i am in danger", "please help", "call police", "women helpline",
        "உதவி", "அவசரம்", "ஆபத்து"
      ],
      action: () => {
        const sosButton = document.querySelector('[data-sos-button]') as HTMLElement;
        if (sosButton) sosButton.click();
        speak("Opening emergency assistance. Your safety is our priority.");
      },
    },
    {
      command: "track bus",
      keywords: [
        "track bus", "where is my bus", "bus location", "tracking", "track my trip",
        "where is my cab", "track my booking", "show tracking",
        "எங்கே", "எங்கே இருக்கிறது"
      ],
      action: () => {
        document.querySelector('#track')?.scrollIntoView({ behavior: 'smooth' });
        speak("Showing live tracking section.");
      },
    },
    {
      command: "my bookings",
      keywords: [
        "my bookings", "show bookings", "booking history", "my trips", "view bookings",
        "show my bookings", "past bookings", "previous bookings",
        "என் புக்கிங்ஸ்"
      ],
      action: () => {
        window.location.href = "/bookings";
        speak("Opening your bookings page.");
      },
    },
    {
      command: "login",
      keywords: [
        "login", "sign in", "log in", "signin", "account",
        "i want to login", "open login", "go to login",
        "உள்நுழை"
      ],
      action: () => {
        window.location.href = "/auth";
        speak("Redirecting to login page.");
      },
    },
    {
      command: "profile",
      keywords: [
        "profile", "my profile", "settings", "account settings",
        "open profile", "go to profile", "edit profile",
        "சுயவிவரம்"
      ],
      action: () => {
        window.location.href = "/profile";
        speak("Opening your profile settings.");
      },
    },
    {
      command: "go to booking",
      keywords: [
        "booking section", "go to booking", "book now", "show booking",
        "i want to book", "book something", "make a booking",
        "புக்கிங்"
      ],
      action: () => {
        document.querySelector('#booking')?.scrollIntoView({ behavior: 'smooth' });
        speak("Scrolling to booking section.");
      },
    },
    {
      command: "go home",
      keywords: [
        "go home", "home page", "main page", "back to home",
        "முகப்பு பக்கம்"
      ],
      action: () => {
        window.location.href = "/";
        speak("Going to home page.");
      },
    },
  ];

  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-IN';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      // Try to use an Indian English voice
      const voices = speechSynthesis.getVoices();
      const indianVoice = voices.find(v => v.lang === 'en-IN') || voices.find(v => v.lang.startsWith('en'));
      if (indianVoice) {
        utterance.voice = indianVoice;
      }
      
      speechSynthesis.speak(utterance);
    }
  }, []);

  const processCommand = useCallback((text: string) => {
    const lowerText = text.toLowerCase().trim();
    
    // Find the best matching command
    let bestMatch: VoiceCommand | null = null;
    let bestScore = 0;
    
    for (const cmd of voiceCommands) {
      for (const keyword of cmd.keywords) {
        const keywordLower = keyword.toLowerCase();
        
        // Exact match
        if (lowerText === keywordLower) {
          bestMatch = cmd;
          bestScore = 100;
          break;
        }
        
        // Contains keyword
        if (lowerText.includes(keywordLower)) {
          const score = keywordLower.length / lowerText.length * 80;
          if (score > bestScore) {
            bestScore = score;
            bestMatch = cmd;
          }
        }
        
        // Keyword contains input (for partial matches)
        if (keywordLower.includes(lowerText) && lowerText.length > 3) {
          const score = lowerText.length / keywordLower.length * 60;
          if (score > bestScore) {
            bestScore = score;
            bestMatch = cmd;
          }
        }
      }
      
      if (bestScore === 100) break;
    }
    
    if (bestMatch && bestScore > 30) {
      toast({
        title: "Command Recognized",
        description: `Executing: ${bestMatch.command}`,
      });
      bestMatch.action();
      return true;
    }

    // If no command matched, provide helpful response
    toast({
      title: "Command Not Recognized",
      description: `You said: "${text}"`,
      variant: "default",
    });
    speak("I didn't understand that command. Try saying: book bus, book cab, track bus, or emergency for help.");
    return false;
  }, [speak, toast, voiceCommands]);

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

    // Stop any existing recognition
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognitionAPI();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-IN';
    recognition.maxAlternatives = 3;

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript("");
      setInterimTranscript("");
      speak("I'm listening. How can I help you?");
    };

    recognition.onresult = (event: any) => {
      let finalText = '';
      let interimText = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcriptText = result[0].transcript;
        
        if (result.isFinal) {
          finalText += transcriptText;
        } else {
          interimText += transcriptText;
        }
      }

      if (interimText) {
        setInterimTranscript(interimText);
      }

      if (finalText) {
        setTranscript(finalText);
        setInterimTranscript("");
        processCommand(finalText);
        
        // Stop after processing a command
        setTimeout(() => {
          recognition.stop();
        }, 500);
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      
      if (event.error === 'not-allowed') {
        toast({
          title: "Microphone Access Denied",
          description: "Please allow microphone access to use voice commands.",
          variant: "destructive",
        });
      } else if (event.error === 'no-speech') {
        toast({
          title: "No Speech Detected",
          description: "Please speak clearly into your microphone.",
        });
      } else if (event.error !== 'aborted') {
        toast({
          title: "Voice Recognition Error",
          description: "Please try again.",
          variant: "destructive",
        });
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimTranscript("");
    };

    recognitionRef.current = recognition;
    
    try {
      recognition.start();
    } catch (error) {
      console.error('Failed to start recognition:', error);
      toast({
        title: "Failed to Start",
        description: "Voice recognition failed to start. Please try again.",
        variant: "destructive",
      });
    }
  }, [processCommand, speak, toast]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      setInterimTranscript("");
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
    interimTranscript,
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
