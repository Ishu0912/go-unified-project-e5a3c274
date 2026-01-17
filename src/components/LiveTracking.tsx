import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Navigation, Clock, Bus, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const LiveTracking = () => {
  const [ticketId, setTicketId] = useState("");
  const [isTracking, setIsTracking] = useState(false);

  const mockTrackingData = {
    busNumber: "TN 01 AB 1234",
    currentLocation: "Villupuram",
    nextStop: "Tindivanam",
    eta: "15 mins",
    progress: 65,
    route: [
      { name: "Chennai", time: "06:00 AM", status: "completed" },
      { name: "Chengalpattu", time: "07:15 AM", status: "completed" },
      { name: "Tindivanam", time: "08:30 AM", status: "current" },
      { name: "Villupuram", time: "09:15 AM", status: "upcoming" },
      { name: "Madurai", time: "12:30 PM", status: "upcoming" },
    ],
  };

  const handleTrack = () => {
    if (ticketId) {
      setIsTracking(true);
    }
  };

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
            Track your bus in real-time across Tamil Nadu. Enter your ticket ID to see live location.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          {/* Search Box */}
          <div className="glass-dark rounded-2xl p-6 mb-8">
            <div className="flex gap-4">
              <Input
                placeholder="Enter Ticket ID (e.g., GUABC123)"
                value={ticketId}
                onChange={(e) => setTicketId(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 flex-1"
              />
              <Button onClick={handleTrack} className="btn-hero px-8">
                <Navigation className="w-4 h-4 mr-2" />
                Track
              </Button>
            </div>
          </div>

          {isTracking && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="grid lg:grid-cols-2 gap-8"
            >
              {/* Map Placeholder */}
              <div className="glass-dark rounded-2xl p-6 min-h-[400px] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-ocean-light/20 to-transparent" />
                
                {/* Simulated Map with Route */}
                <div className="relative h-full flex flex-col justify-center items-center">
                  <div className="absolute inset-4 border-2 border-white/10 rounded-xl" />
                  
                  {/* Route Line */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path
                      d="M10,80 Q30,70 50,50 T90,20"
                      fill="none"
                      stroke="url(#routeGradient)"
                      strokeWidth="2"
                      strokeDasharray="4,2"
                    />
                    <defs>
                      <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#22c55e" />
                        <stop offset="100%" stopColor="#f59e0b" />
                      </linearGradient>
                    </defs>
                  </svg>

                  {/* Bus Icon */}
                  <motion.div
                    animate={{ 
                      x: [0, 10, 0],
                      y: [0, -5, 0]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="relative z-10"
                  >
                    <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center shadow-lg shadow-accent/50">
                      <Bus className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 bg-accent rounded-full animate-ping" />
                  </motion.div>

                  <p className="text-white/60 text-sm mt-8">
                    Live tracking within Tamil Nadu
                  </p>
                </div>
              </div>

              {/* Tracking Details */}
              <div className="space-y-6">
                {/* Current Status */}
                <div className="glass-dark rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg">Current Status</h3>
                    <span className="px-3 py-1 bg-success/20 text-success rounded-full text-sm">
                      On Time
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-white/60 text-sm">Bus Number</p>
                      <p className="font-semibold">{mockTrackingData.busNumber}</p>
                    </div>
                    <div>
                      <p className="text-white/60 text-sm">Current Location</p>
                      <p className="font-semibold text-gold">{mockTrackingData.currentLocation}</p>
                    </div>
                    <div>
                      <p className="text-white/60 text-sm">Next Stop</p>
                      <p className="font-semibold">{mockTrackingData.nextStop}</p>
                    </div>
                    <div>
                      <p className="text-white/60 text-sm">ETA to Next Stop</p>
                      <p className="font-semibold text-accent">{mockTrackingData.eta}</p>
                    </div>
                  </div>
                </div>

                {/* Route Progress */}
                <div className="glass-dark rounded-2xl p-6">
                  <h3 className="font-semibold text-lg mb-4">Route Progress</h3>
                  <div className="space-y-4">
                    {mockTrackingData.route.map((stop, index) => (
                      <div key={stop.name} className="flex items-center gap-4">
                        <div className="relative">
                          <div
                            className={`w-4 h-4 rounded-full ${
                              stop.status === "completed"
                                ? "bg-success"
                                : stop.status === "current"
                                ? "bg-accent animate-pulse"
                                : "bg-white/30"
                            }`}
                          />
                          {index < mockTrackingData.route.length - 1 && (
                            <div
                              className={`absolute top-4 left-1/2 -translate-x-1/2 w-0.5 h-8 ${
                                stop.status === "completed" ? "bg-success" : "bg-white/20"
                              }`}
                            />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className={`font-medium ${stop.status === "current" ? "text-gold" : ""}`}>
                            {stop.name}
                          </p>
                          <p className="text-white/50 text-sm">{stop.time}</p>
                        </div>
                        {stop.status === "current" && (
                          <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded">
                            Now
                          </span>
                        )}
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
            <span>Live tracking is available only within Tamil Nadu</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LiveTracking;
