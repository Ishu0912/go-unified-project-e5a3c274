import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Phone, MapPin, X, AlertTriangle, Share2, Navigation, Loader2, MessageSquare, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

const SOSButton = () => {
  const { profile } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isSendingSMS, setIsSendingSMS] = useState(false);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [emergencyContacts, setEmergencyContacts] = useState<string[]>(() => {
    const saved = localStorage.getItem("sos-emergency-contacts");
    return saved ? JSON.parse(saved) : [];
  });
  const [newContact, setNewContact] = useState("");
  const [showAddContact, setShowAddContact] = useState(false);
  
  const predefinedContacts = [
    { name: "Police", number: "100" },
    { name: "Women Helpline", number: "181" },
    { name: "Emergency", number: "112" },
    { name: "Ambulance", number: "108" },
  ];

  // Save contacts to localStorage
  useEffect(() => {
    localStorage.setItem("sos-emergency-contacts", JSON.stringify(emergencyContacts));
  }, [emergencyContacts]);

  // Get current location
  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setIsGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const locationData: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        };
        setLocation(locationData);
        setIsGettingLocation(false);
        toast.success("Location obtained successfully");
      },
      (error) => {
        setIsGettingLocation(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            toast.error("Location permission denied. Please enable location access.");
            break;
          case error.POSITION_UNAVAILABLE:
            toast.error("Location information unavailable.");
            break;
          case error.TIMEOUT:
            toast.error("Location request timed out.");
            break;
          default:
            toast.error("Failed to get location.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  // Get location when SOS modal opens
  useEffect(() => {
    if (isOpen) {
      getCurrentLocation();
    }
  }, [isOpen, getCurrentLocation]);

  // Generate Google Maps link
  const getMapLink = () => {
    if (!location) return "";
    return `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
  };

  // Generate SOS message
  const generateSOSMessage = () => {
    const mapLink = getMapLink();
    const time = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    
    return `🚨 SOS EMERGENCY ALERT 🚨\n\nI need immediate help!\n\n📍 My Location:\n${mapLink}\n\nCoordinates: ${location?.latitude.toFixed(6)}, ${location?.longitude.toFixed(6)}\nAccuracy: ${location?.accuracy.toFixed(0)}m\n\n⏰ Time: ${time}\n\n📞 Emergency Numbers:\n• Police: 100\n• Women Helpline: 181\n• Emergency: 112\n\nSent via GO UNIFIED Safety Feature`;
  };

  // Share location via Web Share API or copy to clipboard
  const shareLocation = async () => {
    if (!location) {
      toast.error("Location not available. Getting your location...");
      getCurrentLocation();
      return;
    }

    const message = generateSOSMessage();

    if (navigator.share) {
      try {
        await navigator.share({
          title: "🚨 SOS Emergency Alert",
          text: message,
        });
        toast.success("Location shared successfully!");
      } catch {
        // User cancelled or share failed, try clipboard
        copyToClipboard(message);
      }
    } else {
      copyToClipboard(message);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("SOS message copied to clipboard! Share it with your emergency contacts.");
    } catch {
      toast.error("Failed to copy. Please manually share your location.");
    }
  };

  // Make emergency call
  const makeCall = (number: string) => {
    window.location.href = `tel:${number}`;
  };

  // Add emergency contact
  const addEmergencyContact = () => {
    if (!newContact.trim()) {
      toast.error("Please enter a phone number");
      return;
    }
    
    // Basic phone validation
    const phoneRegex = /^[\d+\s-]{10,15}$/;
    if (!phoneRegex.test(newContact.replace(/\s/g, ""))) {
      toast.error("Please enter a valid phone number");
      return;
    }

    if (emergencyContacts.includes(newContact)) {
      toast.error("This number is already added");
      return;
    }

    if (emergencyContacts.length >= 5) {
      toast.error("Maximum 5 emergency contacts allowed");
      return;
    }

    setEmergencyContacts([...emergencyContacts, newContact]);
    setNewContact("");
    setShowAddContact(false);
    toast.success("Emergency contact added");
  };

  // Remove emergency contact
  const removeEmergencyContact = (phone: string) => {
    setEmergencyContacts(emergencyContacts.filter((c) => c !== phone));
    toast.success("Contact removed");
  };

  // Send SMS via Edge Function
  const sendSOSSMS = async () => {
    if (!location) {
      toast.error("Location not available. Getting your location...");
      getCurrentLocation();
      return;
    }

    if (emergencyContacts.length === 0) {
      toast.error("Please add at least one emergency contact to send SMS");
      setShowAddContact(true);
      return;
    }

    setIsSendingSMS(true);

    try {
      const { data, error } = await supabase.functions.invoke("send-sos-sms", {
        body: {
          phoneNumbers: emergencyContacts,
          latitude: location.latitude,
          longitude: location.longitude,
          accuracy: location.accuracy,
          userName: profile?.full_name || "GO UNIFIED User",
        },
      });

      if (error) {
        throw error;
      }

      toast.success("📱 SOS SMS Sent!", {
        description: data.message,
        duration: 5000,
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      console.error("Error sending SOS SMS:", error);
      toast.error("Failed to send SMS: " + errorMessage);
    } finally {
      setIsSendingSMS(false);
    }
  };

  // Send SOS Alert (Share + SMS)
  const handleSOS = async () => {
    setIsSending(true);

    // Get fresh location
    if (!location) {
      getCurrentLocation();
    }

    // Try to share location automatically
    const message = generateSOSMessage();
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: "🚨 SOS Emergency Alert",
          text: message,
        });
      } catch {
        // If share fails, copy to clipboard
        copyToClipboard(message);
      }
    } else {
      copyToClipboard(message);
    }

    // Also send SMS if contacts are available
    if (emergencyContacts.length > 0 && location) {
      await sendSOSSMS();
    }

    setIsSending(false);
    
    toast.success("🚨 SOS Alert Activated!", {
      description: "Your location has been shared. Stay safe!",
      duration: 5000,
    });
  };

  // Quick SOS - Long press activation
  const handleQuickSOS = () => {
    getCurrentLocation();
    setIsOpen(true);
  };

  return (
    <>
      {/* SOS Button */}
      <motion.button
        data-sos-button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleQuickSOS}
        className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full bg-destructive text-white shadow-lg shadow-destructive/40 flex items-center justify-center"
        aria-label="Emergency SOS"
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
              className="bg-card rounded-3xl p-6 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center animate-pulse">
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

              {/* Location Status */}
              <div className="mb-4 p-3 rounded-xl bg-muted/50">
                <div className="flex items-center gap-2 mb-2">
                  <Navigation className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Your Location</span>
                </div>
                {isGettingLocation ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Getting your location...
                  </div>
                ) : location ? (
                  <div className="text-sm text-muted-foreground">
                    <p>Lat: {location.latitude.toFixed(6)}</p>
                    <p>Long: {location.longitude.toFixed(6)}</p>
                    <p className="text-xs mt-1">Accuracy: ~{location.accuracy.toFixed(0)}m</p>
                  </div>
                ) : (
                  <Button variant="outline" size="sm" onClick={getCurrentLocation}>
                    Enable Location
                  </Button>
                )}
              </div>

              {/* Quick Call - Predefined Contacts */}
              <div className="space-y-3 mb-4">
                <p className="text-sm font-medium text-muted-foreground">Quick Call</p>
                <div className="grid grid-cols-2 gap-2">
                  {predefinedContacts.map((contact) => (
                    <Button
                      key={contact.number}
                      variant="outline"
                      onClick={() => makeCall(contact.number)}
                      className="justify-start gap-2 py-4"
                    >
                      <Phone className="w-4 h-4 text-destructive" />
                      <div className="text-left">
                        <p className="font-medium text-sm">{contact.name}</p>
                        <p className="text-xs text-muted-foreground">{contact.number}</p>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              {/* SMS Emergency Contacts */}
              <div className="space-y-3 mb-4 p-3 rounded-xl bg-muted/50">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-primary" />
                    SMS Contacts ({emergencyContacts.length}/5)
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAddContact(!showAddContact)}
                    disabled={emergencyContacts.length >= 5}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {showAddContact && (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter phone number"
                      value={newContact}
                      onChange={(e) => setNewContact(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addEmergencyContact()}
                    />
                    <Button size="sm" onClick={addEmergencyContact}>
                      Add
                    </Button>
                  </div>
                )}

                {emergencyContacts.length > 0 ? (
                  <div className="space-y-2">
                    {emergencyContacts.map((phone, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between bg-background rounded-lg px-3 py-2"
                      >
                        <span className="text-sm">{phone}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => removeEmergencyContact(phone)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Add contacts to receive SOS SMS with your location
                  </p>
                )}
              </div>

              {/* Send SMS Button */}
              <Button
                variant="outline"
                onClick={sendSOSSMS}
                disabled={isGettingLocation || isSendingSMS || emergencyContacts.length === 0}
                className="w-full justify-center gap-3 py-6 mb-4"
              >
                {isSendingSMS ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <MessageSquare className="w-5 h-5 text-primary" />
                )}
                <div className="text-left">
                  <p className="font-medium">
                    {isSendingSMS ? "Sending SMS..." : "Send SOS SMS"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {emergencyContacts.length > 0
                      ? `Send to ${emergencyContacts.length} contact(s)`
                      : "Add contacts first"}
                  </p>
                </div>
              </Button>

              {/* Share Location Button */}
              <Button
                variant="outline"
                onClick={shareLocation}
                disabled={isGettingLocation}
                className="w-full justify-center gap-3 py-6 mb-4"
              >
                <Share2 className="w-5 h-5 text-primary" />
                <div className="text-left">
                  <p className="font-medium">Share Live Location</p>
                  <p className="text-xs text-muted-foreground">Via WhatsApp, Messages, etc.</p>
                </div>
              </Button>

              {/* Embedded Map Preview */}
              {location && (
                <div className="mb-4">
                  <div className="rounded-xl overflow-hidden border border-border">
                    <iframe
                      src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${location.latitude},${location.longitude}&zoom=15`}
                      width="100%"
                      height="200"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Your Location"
                    />
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(getMapLink(), '_blank')}
                      className="flex-1 gap-2"
                    >
                      <MapPin className="w-4 h-4" />
                      Open in Maps
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={getCurrentLocation}
                      disabled={isGettingLocation}
                      className="gap-2"
                    >
                      <Navigation className="w-4 h-4" />
                      Refresh
                    </Button>
                  </div>
                </div>
              )}

              {/* Main SOS Button */}
              <Button
                onClick={handleSOS}
                disabled={isSending}
                className="w-full py-6 bg-destructive hover:bg-destructive/90 text-lg font-bold"
              >
                {isSending ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Sending Alert...
                  </>
                ) : (
                  "🚨 SEND SOS ALERT"
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center mt-4">
                Your location will be shared with authorities and emergency contacts.
                <br />
                Stay calm and stay in a safe location.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SOSButton;
