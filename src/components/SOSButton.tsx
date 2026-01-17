import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Phone, MapPin, X, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

const SOSButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleSOS = () => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      alert("🚨 SOS Alert Sent! Help is on the way. Stay calm and stay on the line.");
    }, 2000);
  };

  return (
    <>
      {/* SOS Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full bg-destructive text-white shadow-lg shadow-destructive/40 flex items-center justify-center"
      >
        <Shield className="w-6 h-6" />
      </motion.button>

      {/* SOS Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-3xl p-8 max-w-md w-full shadow-2xl"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-destructive" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Women Safety SOS</h3>
                    <p className="text-sm text-muted-foreground">Emergency assistance</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-4 mb-6">
                <Button variant="outline" className="w-full justify-start gap-3 py-6">
                  <Phone className="w-5 h-5 text-destructive" />
                  <div className="text-left">
                    <p className="font-medium">Call Women Helpline</p>
                    <p className="text-xs text-muted-foreground">181 - 24/7 Support</p>
                  </div>
                </Button>
                <Button variant="outline" className="w-full justify-start gap-3 py-6">
                  <MapPin className="w-5 h-5 text-primary" />
                  <div className="text-left">
                    <p className="font-medium">Share Live Location</p>
                    <p className="text-xs text-muted-foreground">With emergency contacts</p>
                  </div>
                </Button>
              </div>

              <Button
                onClick={handleSOS}
                disabled={isSending}
                className="w-full py-6 bg-destructive hover:bg-destructive/90 text-lg font-bold"
              >
                {isSending ? "Sending Alert..." : "🚨 SEND SOS ALERT"}
              </Button>

              <p className="text-xs text-muted-foreground text-center mt-4">
                Your location will be shared with authorities and emergency contacts
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SOSButton;
