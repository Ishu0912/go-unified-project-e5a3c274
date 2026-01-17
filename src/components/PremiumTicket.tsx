import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { X, MapPin, Clock, Calendar, User, Bus, Shield, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PremiumTicketProps {
  from: string;
  to: string;
  date: string;
  seats: string[];
  busName: string;
  departure: string;
  onClose: () => void;
}

const PremiumTicket = ({
  from,
  to,
  date,
  seats,
  busName,
  departure,
  onClose,
}: PremiumTicketProps) => {
  const ticketId = `GU${Date.now().toString(36).toUpperCase()}`;
  const qrData = JSON.stringify({
    ticketId,
    from,
    to,
    date,
    seats,
    busName,
    departure,
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative"
    >
      {/* Close Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="absolute -top-2 -right-2 z-10 bg-card rounded-full shadow-lg"
      >
        <X className="w-4 h-4" />
      </Button>

      {/* Ticket Container */}
      <div className="relative overflow-hidden">
        {/* Main Ticket */}
        <div className="bg-gradient-to-br from-ocean-dark via-primary to-ocean-light rounded-3xl p-1">
          <div className="bg-card rounded-[22px] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-ocean-light p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                    <span className="text-xl font-bold">G</span>
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold">GO UNIFIED</h3>
                    <p className="text-white/70 text-sm">Premium Travel Ticket</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white/70 text-xs">Ticket ID</p>
                  <p className="font-mono font-bold">{ticketId}</p>
                </div>
              </div>
            </div>

            {/* Ticket Body */}
            <div className="p-6">
              {/* Route */}
              <div className="flex items-center justify-between mb-8">
                <div className="text-center flex-1">
                  <p className="text-3xl font-display font-bold text-primary">{from}</p>
                  <p className="text-sm text-muted-foreground mt-1">Departure</p>
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                    <div className="w-16 h-0.5 bg-gradient-to-r from-primary to-accent" />
                    <Bus className="w-6 h-6 text-accent" />
                    <div className="w-16 h-0.5 bg-gradient-to-r from-accent to-secondary" />
                    <div className="w-3 h-3 rounded-full bg-secondary" />
                  </div>
                </div>
                <div className="text-center flex-1">
                  <p className="text-3xl font-display font-bold text-secondary">{to}</p>
                  <p className="text-sm text-muted-foreground mt-1">Arrival</p>
                </div>
              </div>

              {/* Dashed Separator */}
              <div className="relative py-4">
                <div className="absolute left-0 top-1/2 w-6 h-6 -translate-y-1/2 -translate-x-1/2 bg-muted rounded-full" />
                <div className="absolute right-0 top-1/2 w-6 h-6 -translate-y-1/2 translate-x-1/2 bg-muted rounded-full" />
                <div className="border-t-2 border-dashed border-border" />
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Calendar className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Date</p>
                    <p className="font-semibold">{date}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-accent/10">
                    <Clock className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Departure</p>
                    <p className="font-semibold">{departure}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-secondary/10">
                    <User className="w-4 h-4 text-secondary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Seats</p>
                    <p className="font-semibold">{seats.join(", ")}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-success/10">
                    <Bus className="w-4 h-4 text-success" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Bus</p>
                    <p className="font-semibold text-sm">{busName}</p>
                  </div>
                </div>
              </div>

              {/* QR Code Section */}
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-border">
                <div className="bg-white p-4 rounded-2xl shadow-md">
                  <QRCodeSVG
                    value={qrData}
                    size={120}
                    level="H"
                    includeMargin
                    imageSettings={{
                      src: "",
                      height: 24,
                      width: 24,
                      excavate: true,
                    }}
                  />
                </div>
                <div className="text-right flex-1 pl-6">
                  <p className="text-sm text-muted-foreground mb-2">
                    Scan QR code at boarding point
                  </p>
                  <div className="flex items-center justify-end gap-2 text-success">
                    <Shield className="w-4 h-4" />
                    <span className="text-sm font-medium">Verified Ticket</span>
                  </div>
                  <p className="text-2xl font-bold text-primary mt-2">
                    ₹{seats.length * 850}
                  </p>
                  <p className="text-xs text-muted-foreground">Total Amount Paid</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-muted/50 p-4 flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                🛡️ Women safety SOS available • Live tracking enabled
              </p>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="w-4 h-4" />
                Download
              </Button>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -top-4 -left-4 w-24 h-24 bg-gold/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-ocean-light/20 rounded-full blur-3xl" />
      </div>

      {/* Success Message */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-6 text-center"
      >
        <p className="text-success font-medium">
          🎉 Booking Confirmed! Your ticket has been generated.
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          You will receive a confirmation SMS and email shortly.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default PremiumTicket;
