import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Phone, MapPin, X, AlertTriangle, Share2, Navigation, Loader2, MessageSquare, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useEmergencyContacts } from "@/hooks/useEmergencyContacts";
import SOSNotification from "./SOSNotification";
import EmergencyContactsManager from "./EmergencyContactsManager";

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

const SOSButton = () => {
  const { user, profile } = useAuth();
  const { contacts, fetchContacts } = useEmergencyContacts();
  const [isOpen, setIsOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isSendingSMS, setIsSendingSMS] = useState(false);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [showManageContacts, setShowManageContacts] = useState(false);
  const [showPushNotification, setShowPushNotification] = useState(false);
  const [pushNotificationData, setPushNotificationData] = useState<{
    senderName: string;
    latitude: number;
    longitude: number;
    timestamp: string;
  } | null>(null);

  const predefinedContacts = [
    { name: "Police", number: "100" },
    { name: "Women Helpline", number: "181" },
    { name: "Emergency", number: "112" },
    { name: "Ambulance", number: "108" },
  ];

  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }
    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        });
        setIsGettingLocation(false);
        toast.success("Location obtained successfully");
      },
      (error) => {
        setIsGettingLocation(false);
        toast.error(error.code === error.PERMISSION_DENIED ? "Location permission denied." : "Failed to get location.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  useEffect(() => {
    if (isOpen) {
      getCurrentLocation();
      fetchContacts();
    }
  }, [isOpen, getCurrentLocation, fetchContacts]);

  const getMapLink = () => {
    if (!location) return "";
    return `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
  };

  const generateSOSMessage = () => {
    const mapLink = getMapLink();
    const time = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    return `🚨 SOS EMERGENCY ALERT 🚨\n\nI need immediate help!\n\n📍 My Location:\n${mapLink}\n\nCoordinates: ${location?.latitude.toFixed(6)}, ${location?.longitude.toFixed(6)}\nAccuracy: ${location?.accuracy.toFixed(0)}m\n\n⏰ Time: ${time}\n\nSent via GO UNIFIED Safety Feature`;
  };

  const shareLocation = async () => {
    if (!location) { getCurrentLocation(); return; }
    const message = generateSOSMessage();
    if (navigator.share) {
      try { await navigator.share({ title: "🚨 SOS Emergency Alert", text: message }); toast.success("Location shared!"); } catch { copyToClipboard(message); }
    } else { copyToClipboard(message); }
  };

  const copyToClipboard = async (text: string) => {
    try { await navigator.clipboard.writeText(text); toast.success("SOS message copied to clipboard!"); } catch { toast.error("Failed to copy."); }
  };

  const makeCall = (number: string) => { window.location.href = `tel:${number}`; };

  const sendSOSSMS = async () => {
    if (!location) { getCurrentLocation(); return; }
    if (contacts.length === 0) {
      toast.error("Please add emergency contacts first");
      setShowManageContacts(true);
      return;
    }
    setIsSendingSMS(true);
    try {
      const phoneNumbers = contacts.map((c) => c.phone);
      
      // Try Twilio edge function first
      const { data, error } = await supabase.functions.invoke("send-sos-sms", {
        body: { phoneNumbers, latitude: location.latitude, longitude: location.longitude, accuracy: location.accuracy, userName: profile?.full_name || "GO UNIFIED User" },
      });
      
      if (error || (data && data.results?.every((r: any) => !r.success))) {
        // Fallback: open native SMS app with pre-filled message
        const message = generateSOSMessage();
        const allNumbers = phoneNumbers.join(",");
        const smsUrl = `sms:${allNumbers}?body=${encodeURIComponent(message)}`;
        window.open(smsUrl, "_self");
        toast.info("📱 Opening SMS app to send alert...", { duration: 4000 });
      } else {
        toast.success("📱 SOS SMS Sent!", { description: data?.message, duration: 5000 });
      }
    } catch {
      // Fallback: open native SMS app
      const message = generateSOSMessage();
      const allNumbers = contacts.map((c) => c.phone).join(",");
      window.open(`sms:${allNumbers}?body=${encodeURIComponent(message)}`, "_self");
      toast.info("📱 Opening SMS app to send alert...", { duration: 4000 });
    } finally { setIsSendingSMS(false); }
  };

  const sendViaWhatsApp = () => {
    if (!location || contacts.length === 0) return;
    const message = generateSOSMessage();
    // Open WhatsApp with first contact
    const phone = contacts[0].phone.replace(/\s/g, "").replace(/^0/, "91");
    const formattedPhone = phone.startsWith("+") ? phone.substring(1) : (phone.startsWith("91") ? phone : "91" + phone);
    window.open(`https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`, "_blank");
    toast.success("Opening WhatsApp...");
  };

  const handleSOS = async () => {
    if (!user) {
      toast.error("Please login to use SOS feature");
      return;
    }
    if (contacts.length === 0) {
      toast.error("Please add emergency contacts first");
      setShowManageContacts(true);
      return;
    }
    setIsSending(true);
    if (!location) getCurrentLocation();

    // 1. Share via native share or clipboard
    const message = generateSOSMessage();
    if (navigator.share) {
      try { await navigator.share({ title: "🚨 SOS Emergency Alert", text: message }); } catch { copyToClipboard(message); }
    } else { copyToClipboard(message); }

    // 2. Send SMS (Twilio or native fallback)
    if (contacts.length > 0 && location) await sendSOSSMS();

    // 3. Push notification
    if (location) {
      setPushNotificationData({
        senderName: profile?.full_name || "GO UNIFIED User",
        latitude: location.latitude, longitude: location.longitude,
        timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      });
      setShowPushNotification(true);

      if ("Notification" in window) {
        try {
          const permission = await Notification.requestPermission();
          if (permission === "granted") {
            new Notification("🚨 SOS EMERGENCY ALERT", {
              body: `${profile?.full_name || "User"} needs immediate help!\nLocation: ${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`,
              icon: "/favicon.ico", requireInteraction: true,
            });
          }
        } catch { /* not supported */ }
      }
    }

    setIsSending(false);
    toast.success("🚨 SOS Alert Activated!", {
      description: `Alert sent to ${contacts.length} family member(s). Stay safe!`,
      duration: 5000,
    });
  };

  return (
    <>
      {pushNotificationData && (
        <SOSNotification
          isOpen={showPushNotification}
          onClose={() => setShowPushNotification(false)}
          senderName={pushNotificationData.senderName}
          latitude={pushNotificationData.latitude}
          longitude={pushNotificationData.longitude}
          timestamp={pushNotificationData.timestamp}
        />
      )}

      {/* SOS Button */}
      <motion.button
        data-sos-button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 left-6 z-50 w-14 h-14 rounded-full bg-destructive text-white shadow-lg shadow-destructive/40 flex items-center justify-center"
        aria-label="Emergency SOS"
      >
        <Shield className="w-6 h-6" />
      </motion.button>

      {/* SOS Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
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

              {/* Manage Contacts Toggle */}
              {showManageContacts ? (
                <div className="mb-4">
                  <EmergencyContactsManager compact onDone={() => setShowManageContacts(false)} />
                </div>
              ) : (
                <>
                  {/* Family Contacts Summary */}
                  <div className="mb-4 p-3 rounded-xl bg-muted/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium flex items-center gap-2">
                        <Bell className="w-4 h-4 text-primary" />
                        Family Contacts ({contacts.length}/5)
                      </span>
                      <Button variant="ghost" size="sm" onClick={() => setShowManageContacts(true)}>
                        {contacts.length === 0 ? "Add" : "Manage"}
                      </Button>
                    </div>
                    {contacts.length > 0 ? (
                      <div className="space-y-2">
                        {contacts.map((c) => (
                          <div key={c.id} className="flex items-center gap-2">
                            {c.photo_url ? (
                              <img src={c.photo_url} alt={c.name} className="w-8 h-8 rounded-full object-cover" />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                                {c.name.charAt(0)}
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{c.name}</p>
                              <p className="text-xs text-muted-foreground">{c.phone} {c.relationship ? `• ${c.relationship}` : ""}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-destructive font-medium">⚠️ Add family members to receive SOS alerts</p>
                    )}
                  </div>

                  {/* Location Status */}
                  <div className="mb-4 p-3 rounded-xl bg-muted/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Navigation className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">Your Location</span>
                    </div>
                    {isGettingLocation ? (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="w-4 h-4 animate-spin" /> Getting your location...
                      </div>
                    ) : location ? (
                      <div className="text-sm text-muted-foreground">
                        <p>Lat: {location.latitude.toFixed(6)}, Long: {location.longitude.toFixed(6)}</p>
                        <p className="text-xs mt-1">Accuracy: ~{location.accuracy.toFixed(0)}m</p>
                      </div>
                    ) : (
                      <Button variant="outline" size="sm" onClick={getCurrentLocation}>Enable Location</Button>
                    )}
                  </div>

                  {/* Quick Call */}
                  <div className="space-y-3 mb-4">
                    <p className="text-sm font-medium text-muted-foreground">Quick Call</p>
                    <div className="grid grid-cols-2 gap-2">
                      {predefinedContacts.map((contact) => (
                        <Button key={contact.number} variant="outline" onClick={() => makeCall(contact.number)} className="justify-start gap-2 py-4">
                          <Phone className="w-4 h-4 text-destructive" />
                          <div className="text-left">
                            <p className="font-medium text-sm">{contact.name}</p>
                            <p className="text-xs text-muted-foreground">{contact.number}</p>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Send SMS Button */}
                  <Button variant="outline" onClick={sendSOSSMS} disabled={isGettingLocation || isSendingSMS || contacts.length === 0} className="w-full justify-center gap-3 py-6 mb-4">
                    {isSendingSMS ? <Loader2 className="w-5 h-5 animate-spin" /> : <MessageSquare className="w-5 h-5 text-primary" />}
                    <div className="text-left">
                      <p className="font-medium">{isSendingSMS ? "Sending SMS..." : "Send SOS SMS"}</p>
                      <p className="text-xs text-muted-foreground">{contacts.length > 0 ? `Send to ${contacts.length} family member(s)` : "Add contacts first"}</p>
                    </div>
                  </Button>

                  {/* WhatsApp Alert */}
                  <Button variant="outline" onClick={sendViaWhatsApp} disabled={isGettingLocation || !location || contacts.length === 0} className="w-full justify-center gap-3 py-6 mb-4">
                    <MessageSquare className="w-5 h-5 text-green-600" />
                    <div className="text-left">
                      <p className="font-medium">Send via WhatsApp</p>
                      <p className="text-xs text-muted-foreground">Alert family on WhatsApp</p>
                    </div>
                  </Button>

                  {/* Share Location */}
                  <Button variant="outline" onClick={shareLocation} disabled={isGettingLocation} className="w-full justify-center gap-3 py-6 mb-4">
                    <Share2 className="w-5 h-5 text-primary" />
                    <div className="text-left">
                      <p className="font-medium">Share Live Location</p>
                      <p className="text-xs text-muted-foreground">Via WhatsApp, Messages, etc.</p>
                    </div>
                  </Button>

                  {/* Map Preview */}
                  {location && (
                    <div className="mb-4">
                      <div className="rounded-xl overflow-hidden border border-border">
                        <iframe
                          src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${location.latitude},${location.longitude}&zoom=15`}
                          width="100%" height="200" style={{ border: 0 }} allowFullScreen loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade" title="Your Location"
                        />
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Button variant="outline" size="sm" onClick={() => window.open(getMapLink(), '_blank')} className="flex-1 gap-2">
                          <MapPin className="w-4 h-4" /> Open in Maps
                        </Button>
                        <Button variant="outline" size="sm" onClick={getCurrentLocation} disabled={isGettingLocation} className="gap-2">
                          <Navigation className="w-4 h-4" /> Refresh
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Main SOS Button */}
                  <Button onClick={handleSOS} disabled={isSending || contacts.length === 0} className="w-full py-6 bg-destructive hover:bg-destructive/90 text-lg font-bold">
                    {isSending ? (
                      <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Sending Alert...</>
                    ) : (
                      "🚨 SEND SOS ALERT"
                    )}
                  </Button>

                  {contacts.length === 0 && (
                    <p className="text-xs text-destructive text-center mt-2 font-medium">
                      Please add family contacts to activate SOS
                    </p>
                  )}

                  <p className="text-xs text-muted-foreground text-center mt-4">
                    Your location will be shared with family members and authorities.
                  </p>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SOSButton;
