import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, MapPin, X, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SOSNotificationProps {
  isOpen: boolean;
  onClose: () => void;
  senderName: string;
  latitude: number;
  longitude: number;
  timestamp: string;
}

const SOSNotification = ({
  isOpen,
  onClose,
  senderName,
  latitude,
  longitude,
  timestamp,
}: SOSNotificationProps) => {
  // Play alert sound when notification opens
  useEffect(() => {
    if (isOpen) {
      // Try to play an alert sound (browser will need permission)
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = "sine";
        gainNode.gain.value = 0.3;
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.5);
        
        // Second beep
        setTimeout(() => {
          const osc2 = audioContext.createOscillator();
          osc2.connect(gainNode);
          osc2.frequency.value = 1000;
          osc2.type = "sine";
          osc2.start();
          osc2.stop(audioContext.currentTime + 0.5);
        }, 600);
      } catch (e) {
        console.log("Audio not supported");
      }
    }
  }, [isOpen]);

  const mapLink = `https://www.google.com/maps?q=${latitude},${longitude}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md px-4"
        >
          <div className="bg-destructive text-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Animated warning bar */}
            <div className="h-1 bg-white/30 relative overflow-hidden">
              <motion.div
                animate={{ x: ["-100%", "100%"] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                className="absolute inset-0 bg-white"
              />
            </div>
            
            <div className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0"
                  >
                    <AlertTriangle className="w-6 h-6" />
                  </motion.div>
                  
                  <div>
                    <h3 className="font-bold text-lg">🚨 SOS ALERT</h3>
                    <p className="text-sm text-white/90">
                      {senderName} needs immediate help!
                    </p>
                    <p className="text-xs text-white/70 mt-1">{timestamp}</p>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-white hover:bg-white/20 flex-shrink-0"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              
              <div className="mt-4 p-3 bg-white/10 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm font-medium">Location</span>
                </div>
                <p className="text-xs text-white/80 mb-2">
                  {latitude.toFixed(6)}, {longitude.toFixed(6)}
                </p>
                
                <Button
                  onClick={() => window.open(mapLink, "_blank")}
                  className="w-full bg-white text-destructive hover:bg-white/90 gap-2"
                  size="sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open in Google Maps
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SOSNotification;
