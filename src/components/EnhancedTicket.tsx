import { motion } from "framer-motion";
import { X, Download, Shield, MapPin, Phone, User, GraduationCap, Star, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface EnhancedTicketProps {
  from: string;
  to: string;
  date: string;
  seats: string[];
  busName: string;
  departure: string;
  basePrice: number;
  finalPrice: number;
  discountPercentage: number;
  isStudentDiscount: boolean;
  isEarlyUserDiscount: boolean;
  qrData: string;
  onClose: () => void;
}

const EnhancedTicket = ({
  from,
  to,
  date,
  seats,
  busName,
  departure,
  basePrice,
  finalPrice,
  discountPercentage,
  isStudentDiscount,
  isEarlyUserDiscount,
  qrData,
  onClose,
}: EnhancedTicketProps) => {
  const { profile } = useAuth();
  const ticketId = `GOUNIFIED-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  const initials = profile?.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "U";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 z-10 w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center shadow-lg"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Ticket */}
        <div className="bg-gradient-to-br from-ocean-dark via-primary to-ocean-light rounded-3xl overflow-hidden shadow-2xl">
          {/* Header with User Photo */}
          <div className="p-6 pb-4 bg-white/5 backdrop-blur">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <span className="text-white font-bold">G</span>
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-white">GO UNIFIED</h3>
                  <p className="text-white/60 text-xs">Premium E-Ticket</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white/60 text-xs">Ticket ID</p>
                <p className="text-white font-mono text-sm">{ticketId}</p>
              </div>
            </div>

            {/* Passenger Info with Photo */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/10 backdrop-blur">
              <Avatar className="w-16 h-16 border-2 border-gold">
                <AvatarImage src={profile?.photo_url || undefined} />
                <AvatarFallback className="bg-gold text-ocean-dark text-xl font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gold" />
                  <span className="text-white font-semibold">
                    {profile?.full_name || "Passenger"}
                  </span>
                </div>
                {profile?.phone && (
                  <div className="flex items-center gap-2 mt-1">
                    <Phone className="w-4 h-4 text-white/60" />
                    <span className="text-white/80 text-sm">{profile.phone}</span>
                  </div>
                )}
                {profile?.is_student && (
                  <div className="flex items-center gap-1 mt-2">
                    <GraduationCap className="w-4 h-4 text-secondary" />
                    <span className="text-secondary text-xs font-medium">Verified Student</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Dashed separator */}
          <div className="relative h-8">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-8 bg-background rounded-r-full" />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-8 bg-background rounded-l-full" />
            <div className="absolute inset-x-6 top-1/2 border-t-2 border-dashed border-white/20" />
          </div>

          {/* Route Info */}
          <div className="px-6 pb-4">
            <div className="flex items-center justify-between">
              <div className="text-center">
                <p className="text-white/60 text-xs">FROM</p>
                <p className="text-white font-bold text-lg">{from}</p>
              </div>
              <div className="flex-1 px-4">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gold" />
                  <div className="flex-1 border-t-2 border-dashed border-gold/50" />
                  <MapPin className="w-5 h-5 text-gold" />
                  <div className="flex-1 border-t-2 border-dashed border-gold/50" />
                  <div className="w-2 h-2 rounded-full bg-gold" />
                </div>
              </div>
              <div className="text-center">
                <p className="text-white/60 text-xs">TO</p>
                <p className="text-white font-bold text-lg">{to}</p>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="px-6 pb-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-white/10">
                <p className="text-white/60 text-xs">Date</p>
                <p className="text-white font-medium">{date}</p>
              </div>
              <div className="p-3 rounded-xl bg-white/10">
                <p className="text-white/60 text-xs">Departure</p>
                <p className="text-white font-medium">{departure}</p>
              </div>
              <div className="p-3 rounded-xl bg-white/10">
                <p className="text-white/60 text-xs">Seats</p>
                <p className="text-white font-medium">{seats.join(", ")}</p>
              </div>
              <div className="p-3 rounded-xl bg-white/10">
                <p className="text-white/60 text-xs">Bus</p>
                <p className="text-white font-medium text-sm">{busName}</p>
              </div>
            </div>
          </div>

          {/* Discounts Applied */}
          {discountPercentage > 0 && (
            <div className="px-6 pb-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-gold/20 to-secondary/20 border border-gold/30">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-4 h-4 text-gold" />
                  <span className="text-gold font-semibold text-sm">Discounts Applied!</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {isEarlyUserDiscount && (
                    <span className="px-2 py-1 rounded-full bg-gold/20 text-gold text-xs font-medium">
                      🎉 Early User -15%
                    </span>
                  )}
                  {isStudentDiscount && (
                    <span className="px-2 py-1 rounded-full bg-secondary/20 text-secondary text-xs font-medium">
                      🎓 Student -10%
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* QR Code & Price */}
          <div className="px-6 pb-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-white">
              <div className="bg-white p-2 rounded-xl">
                <QRCodeSVG value={qrData} size={80} />
              </div>
              <div className="text-right">
                {discountPercentage > 0 && (
                  <p className="text-muted-foreground text-sm line-through">₹{basePrice}</p>
                )}
                <p className="text-3xl font-bold text-primary">₹{finalPrice.toFixed(0)}</p>
                <div className="flex items-center gap-1 text-green-600 mt-1">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-xs font-medium">Confirmed</span>
                </div>
              </div>
            </div>
          </div>

          {/* SOS Info */}
          <div className="px-6 pb-4">
            <div className="flex items-center gap-2 p-3 rounded-xl bg-destructive/20 border border-destructive/30">
              <Shield className="w-5 h-5 text-destructive" />
              <div>
                <p className="text-white font-medium text-sm">Women Safety SOS</p>
                <p className="text-white/60 text-xs">Emergency: 112 | Women Helpline: 181</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 bg-white/5 flex justify-center">
            <Button className="btn-premium gap-2">
              <Download className="w-4 h-4" />
              Download Ticket
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EnhancedTicket;
