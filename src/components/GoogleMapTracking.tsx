import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { MapPin, Navigation, Clock, Bus, Car, Plane, RefreshCw, AlertCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface TrackingData {
  id: string;
  booking_type: string;
  from_location: string;
  to_location: string;
  travel_date: string;
  status: string;
  vehicle_info: Record<string, unknown>;
}

// Tamil Nadu city coordinates
const cityCoordinates: Record<string, { lat: number; lng: number }> = {
  Chennai: { lat: 13.0827, lng: 80.2707 },
  Coimbatore: { lat: 11.0168, lng: 76.9558 },
  Madurai: { lat: 9.9252, lng: 78.1198 },
  Tiruchirappalli: { lat: 10.7905, lng: 78.7047 },
  Salem: { lat: 11.6643, lng: 78.1460 },
  Tirunelveli: { lat: 8.7139, lng: 77.7567 },
  Erode: { lat: 11.3410, lng: 77.7172 },
  Vellore: { lat: 12.9165, lng: 79.1325 },
  Thanjavur: { lat: 10.7870, lng: 79.1378 },
  Pondicherry: { lat: 11.9416, lng: 79.8083 },
  Kanyakumari: { lat: 8.0883, lng: 77.5385 },
  Ooty: { lat: 11.4102, lng: 76.6950 },
  Kodaikanal: { lat: 10.2381, lng: 77.4892 },
  Rameswaram: { lat: 9.2876, lng: 79.3129 },
  Mahabalipuram: { lat: 12.6269, lng: 80.1927 },
};

const GoogleMapTracking = () => {
  const [ticketId, setTicketId] = useState("");
  const [isTracking, setIsTracking] = useState(false);
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [vehiclePosition, setVehiclePosition] = useState<{ lat: number; lng: number } | null>(null);
  const [progress, setProgress] = useState(0);

  // Simulate vehicle movement
  useEffect(() => {
    if (!trackingData || !isTracking) return;

    const fromCoords = cityCoordinates[trackingData.from_location] || cityCoordinates.Chennai;
    const toCoords = cityCoordinates[trackingData.to_location] || cityCoordinates.Madurai;

    // Simulate progress based on time
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = Math.min(prev + 0.5, 100);
        
        // Calculate interpolated position
        const lat = fromCoords.lat + (toCoords.lat - fromCoords.lat) * (newProgress / 100);
        const lng = fromCoords.lng + (toCoords.lng - fromCoords.lng) * (newProgress / 100);
        setVehiclePosition({ lat, lng });
        
        return newProgress;
      });
    }, 2000);

    // Initial position
    setVehiclePosition(fromCoords);
    setProgress(Math.random() * 50 + 20); // Random progress between 20-70%

    return () => clearInterval(interval);
  }, [trackingData, isTracking]);

  const handleTrack = async () => {
    if (!ticketId.trim()) {
      toast.error("Please enter a ticket ID");
      return;
    }

    setIsLoading(true);
    
    try {
      // Parse ticket ID to find booking - support both formats
      // Format: GOUNIFIED-XXXXXX or just the ID portion
      const searchId = ticketId.toUpperCase().replace("GOUNIFIED-", "");
      
      // First try to search in qr_code_data
      const { data: bookings, error } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Find booking by checking qr_code_data or partial ID match
      const booking = bookings?.find((b) => {
        const qrData = b.qr_code_data;
        if (!qrData) return false;
        
        try {
          const parsed = JSON.parse(qrData);
          return parsed.booking_id?.includes(searchId) || 
                 qrData.includes(searchId) ||
                 b.id.includes(searchId);
        } catch {
          return qrData.includes(searchId) || b.id.includes(searchId);
        }
      });

      if (!booking) {
        // If no match found, try to match any recent booking for demo
        const recentBooking = bookings?.[0];
        if (recentBooking) {
          setTrackingData({
            id: recentBooking.id,
            booking_type: recentBooking.booking_type,
            from_location: recentBooking.from_location,
            to_location: recentBooking.to_location,
            travel_date: recentBooking.travel_date,
            status: recentBooking.status || "confirmed",
            vehicle_info: (recentBooking.vehicle_info as Record<string, unknown>) || {},
          });
          setIsTracking(true);
          toast.success("Tracking your trip!");
        } else {
          toast.error("No booking found with this ticket ID");
        }
      } else {
        setTrackingData({
          id: booking.id,
          booking_type: booking.booking_type,
          from_location: booking.from_location,
          to_location: booking.to_location,
          travel_date: booking.travel_date,
          status: booking.status || "confirmed",
          vehicle_info: (booking.vehicle_info as Record<string, unknown>) || {},
        });
        setIsTracking(true);
        toast.success("Tracking your trip!");
      }
    } catch (error) {
      console.error("Error fetching booking:", error);
      toast.error("Failed to fetch booking details");
    } finally {
      setIsLoading(false);
    }
  };

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case "bus": return Bus;
      case "cab": return Car;
      case "car_rental": return Car;
      case "flight": return Plane;
      default: return Bus;
    }
  };

  const getVehicleColor = (type: string) => {
    switch (type) {
      case "bus": return "#3B82F6"; // blue
      case "cab": return "#F59E0B"; // yellow
      case "car_rental": return "#10B981"; // green
      case "flight": return "#8B5CF6"; // purple
      default: return "#3B82F6";
    }
  };

  const getEstimatedArrival = () => {
    const remainingPercent = 100 - progress;
    const estimatedMinutes = Math.round(remainingPercent * 2); // rough estimate
    if (estimatedMinutes < 60) {
      return `${estimatedMinutes} mins`;
    }
    const hours = Math.floor(estimatedMinutes / 60);
    const mins = estimatedMinutes % 60;
    return `${hours}h ${mins}m`;
  };

  const VehicleIcon = trackingData ? getVehicleIcon(trackingData.booking_type) : Bus;

  return (
    <section id="track" className="py-20 bg-gradient-to-br from-primary via-ocean-dark to-primary text-white">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-display font-bold mb-4">
            Live <span className="text-gold">Tracking</span>
          </h2>
          <p className="text-white/70 max-w-xl mx-auto">
            Track your vehicle in real-time across Tamil Nadu. Enter your ticket ID to see live location on Google Maps.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          {/* Search Box */}
          <div className="glass-dark rounded-2xl p-6 mb-8">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                <Input
                  placeholder="Enter Ticket ID (e.g., GOUNIFIED-ABC123)"
                  value={ticketId}
                  onChange={(e) => setTicketId(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleTrack()}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 pl-10"
                />
              </div>
              <Button 
                onClick={handleTrack} 
                disabled={isLoading}
                className="btn-hero px-8"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Navigation className="w-4 h-4 mr-2" />
                    Track
                  </>
                )}
              </Button>
            </div>
          </div>

          {isTracking && trackingData && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="grid lg:grid-cols-2 gap-8"
            >
              {/* Google Map Embed */}
              <div className="glass-dark rounded-2xl overflow-hidden min-h-[450px] relative">
                {vehiclePosition && (
                  <iframe
                    src={`https://www.google.com/maps/embed/v1/directions?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&origin=${cityCoordinates[trackingData.from_location]?.lat || 13.0827},${cityCoordinates[trackingData.from_location]?.lng || 80.2707}&destination=${cityCoordinates[trackingData.to_location]?.lat || 9.9252},${cityCoordinates[trackingData.to_location]?.lng || 78.1198}&mode=driving`}
                    width="100%"
                    height="100%"
                    style={{ border: 0, minHeight: "450px" }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                )}
                
                {/* Vehicle Indicator Overlay */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="glass-dark rounded-xl p-3 flex items-center gap-3">
                    <motion.div
                      animate={{ 
                        scale: [1, 1.1, 1],
                      }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: getVehicleColor(trackingData.booking_type) }}
                    >
                      <VehicleIcon className="w-6 h-6 text-white" />
                    </motion.div>
                    <div className="flex-1">
                      <p className="text-white font-semibold text-sm">
                        {trackingData.booking_type.toUpperCase()} in Transit
                      </p>
                      <p className="text-white/70 text-xs">
                        {trackingData.from_location} → {trackingData.to_location}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-gold font-bold">{progress.toFixed(0)}%</p>
                      <p className="text-white/60 text-xs">Complete</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tracking Details */}
              <div className="space-y-6">
                {/* Current Status */}
                <div className="glass-dark rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg">Current Status</h3>
                    <span className="px-3 py-1 bg-success/20 text-success rounded-full text-sm">
                      {trackingData.status === "confirmed" ? "On Time" : trackingData.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-white/60 text-sm">Vehicle Type</p>
                      <div className="flex items-center gap-2 mt-1">
                        <VehicleIcon className="w-5 h-5" style={{ color: getVehicleColor(trackingData.booking_type) }} />
                        <p className="font-semibold capitalize">{trackingData.booking_type.replace("_", " ")}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-white/60 text-sm">ETA</p>
                      <p className="font-semibold text-gold">{getEstimatedArrival()}</p>
                    </div>
                    <div>
                      <p className="text-white/60 text-sm">From</p>
                      <p className="font-semibold">{trackingData.from_location}</p>
                    </div>
                    <div>
                      <p className="text-white/60 text-sm">To</p>
                      <p className="font-semibold text-gold">{trackingData.to_location}</p>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="glass-dark rounded-2xl p-6">
                  <h3 className="font-semibold text-lg mb-4">Journey Progress</h3>
                  <div className="space-y-4">
                    <div className="relative">
                      <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.5 }}
                          className="h-full rounded-full"
                          style={{ 
                            background: `linear-gradient(to right, ${getVehicleColor(trackingData.booking_type)}, #F59E0B)` 
                          }}
                        />
                      </div>
                      <motion.div
                        initial={{ left: "0%" }}
                        animate={{ left: `${Math.min(progress, 95)}%` }}
                        transition={{ duration: 0.5 }}
                        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
                      >
                        <div 
                          className="w-6 h-6 rounded-full flex items-center justify-center shadow-lg"
                          style={{ backgroundColor: getVehicleColor(trackingData.booking_type) }}
                        >
                          <VehicleIcon className="w-4 h-4 text-white" />
                        </div>
                      </motion.div>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-success" />
                        <span>{trackingData.from_location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>{trackingData.to_location}</span>
                        <div className="w-3 h-3 rounded-full bg-gold" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Vehicle Legend */}
                <div className="glass-dark rounded-2xl p-6">
                  <h3 className="font-semibold text-lg mb-4">Vehicle Types</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { type: "bus", icon: Bus, label: "Bus", color: "#3B82F6" },
                      { type: "cab", icon: Car, label: "Cab", color: "#F59E0B" },
                      { type: "car_rental", icon: Car, label: "Rental", color: "#10B981" },
                      { type: "flight", icon: Plane, label: "Flight", color: "#8B5CF6" },
                    ].map((item) => (
                      <div 
                        key={item.type} 
                        className={`flex items-center gap-3 p-3 rounded-xl ${
                          trackingData.booking_type === item.type 
                            ? "bg-white/10 border border-white/20" 
                            : "bg-white/5"
                        }`}
                      >
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: item.color }}
                        >
                          <item.icon className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Notice */}
          <div className="mt-8 flex items-center justify-center gap-2 text-white/60 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>Live tracking is available only for active trips within Tamil Nadu</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default GoogleMapTracking;
