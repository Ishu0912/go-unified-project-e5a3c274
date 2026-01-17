import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bus, Car, CarFront, Plane, MapPin, Calendar, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BusSeatSelector from "./BusSeatSelector";

const transportTypes = [
  { id: "bus", label: "Bus", icon: Bus, color: "from-blue-500 to-cyan-500" },
  { id: "cab", label: "Cab", icon: Car, color: "from-yellow-500 to-orange-500" },
  { id: "rental", label: "Car Rental", icon: CarFront, color: "from-green-500 to-emerald-500" },
  { id: "flight", label: "Flights", icon: Plane, color: "from-purple-500 to-pink-500" },
];

const tamilNaduCities = [
  "Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", 
  "Tirunelveli", "Erode", "Vellore", "Thanjavur", "Pondicherry"
];

const BookingTabs = () => {
  const [activeTab, setActiveTab] = useState("bus");
  const [showSeatSelector, setShowSeatSelector] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({
    from: "",
    to: "",
    date: "",
    passengers: 1,
  });

  const handleSearch = () => {
    if (activeTab === "bus") {
      setShowSeatSelector(true);
    }
  };

  return (
    <section id="booking" className="py-20 bg-muted/30">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-display font-bold text-foreground mb-4">
            Book Your <span className="text-primary">Journey</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Choose your preferred mode of transport and explore Tamil Nadu with ease
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Transport Type Tabs */}
            <TabsList className="grid grid-cols-4 gap-4 bg-transparent h-auto p-0 mb-8">
              {transportTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <TabsTrigger
                    key={type.id}
                    value={type.id}
                    className={`
                      relative flex flex-col items-center gap-2 p-6 rounded-2xl border-2 transition-all duration-300
                      data-[state=active]:border-primary data-[state=active]:bg-primary/5 data-[state=active]:shadow-lg
                      data-[state=inactive]:border-border data-[state=inactive]:bg-card hover:border-primary/50
                    `}
                  >
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${type.color}`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="font-medium">{type.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {/* Booking Form */}
            <div className="bg-card rounded-3xl shadow-lg p-8 border border-border">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {!showSeatSelector ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {/* From */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-primary" />
                          From
                        </label>
                        <select
                          value={bookingDetails.from}
                          onChange={(e) => setBookingDetails({ ...bookingDetails, from: e.target.value })}
                          className="w-full input-premium"
                        >
                          <option value="">Select City</option>
                          {tamilNaduCities.map((city) => (
                            <option key={city} value={city}>{city}</option>
                          ))}
                        </select>
                      </div>

                      {/* To */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-accent" />
                          To
                        </label>
                        <select
                          value={bookingDetails.to}
                          onChange={(e) => setBookingDetails({ ...bookingDetails, to: e.target.value })}
                          className="w-full input-premium"
                        >
                          <option value="">Select City</option>
                          {tamilNaduCities.map((city) => (
                            <option key={city} value={city}>{city}</option>
                          ))}
                        </select>
                      </div>

                      {/* Date */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-secondary" />
                          Date
                        </label>
                        <input
                          type="date"
                          value={bookingDetails.date}
                          onChange={(e) => setBookingDetails({ ...bookingDetails, date: e.target.value })}
                          className="w-full input-premium"
                        />
                      </div>

                      {/* Passengers */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                          <Users className="w-4 h-4 text-success" />
                          Passengers
                        </label>
                        <select
                          value={bookingDetails.passengers}
                          onChange={(e) => setBookingDetails({ ...bookingDetails, passengers: Number(e.target.value) })}
                          className="w-full input-premium"
                        >
                          {[1, 2, 3, 4, 5, 6].map((num) => (
                            <option key={num} value={num}>{num} {num === 1 ? 'Passenger' : 'Passengers'}</option>
                          ))}
                        </select>
                      </div>

                      {/* Search Button */}
                      <div className="md:col-span-2 lg:col-span-4 mt-4">
                        <Button onClick={handleSearch} className="w-full btn-hero py-6 text-lg">
                          Search {transportTypes.find(t => t.id === activeTab)?.label} Options
                        </Button>
                      </div>

                      {/* Additional Options for Specific Transport */}
                      {activeTab === "rental" && (
                        <div className="md:col-span-2 lg:col-span-4 grid md:grid-cols-2 gap-6 pt-4 border-t border-border mt-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              Pickup Time
                            </label>
                            <input type="time" className="w-full input-premium" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              Return Date
                            </label>
                            <input type="date" className="w-full input-premium" />
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <BusSeatSelector
                      from={bookingDetails.from || "Chennai"}
                      to={bookingDetails.to || "Madurai"}
                      date={bookingDetails.date || new Date().toISOString().split('T')[0]}
                      onBack={() => setShowSeatSelector(false)}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </Tabs>
        </motion.div>
      </div>
    </section>
  );
};

export default BookingTabs;
