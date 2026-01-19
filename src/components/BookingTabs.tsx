import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bus, Car, CarFront, Plane, MapPin, Calendar, Users, Clock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useBooking } from "@/hooks/useBooking";
import BusSeatSelector from "./BusSeatSelector";
import EnhancedTicket from "./EnhancedTicket";

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

const cabTypes = [
  { id: "mini", name: "Mini", price: 12, capacity: 4 },
  { id: "sedan", name: "Sedan", price: 15, capacity: 4 },
  { id: "suv", name: "SUV", price: 20, capacity: 6 },
  { id: "premium", name: "Premium", price: 25, capacity: 4 },
];

const rentalOptions = [
  { id: "hatchback", name: "Hatchback", pricePerDay: 1500, capacity: 4 },
  { id: "sedan", name: "Sedan", pricePerDay: 2500, capacity: 4 },
  { id: "suv", name: "SUV", pricePerDay: 3500, capacity: 7 },
  { id: "luxury", name: "Luxury", pricePerDay: 5000, capacity: 4 },
];

const flightOptions = [
  { id: "economy", name: "Economy", multiplier: 1 },
  { id: "business", name: "Business", multiplier: 2.5 },
  { id: "first", name: "First Class", multiplier: 4 },
];

// Estimated distances between cities (in km)
const cityDistances: Record<string, Record<string, number>> = {
  Chennai: { Coimbatore: 500, Madurai: 460, Tiruchirappalli: 320, Salem: 340, Tirunelveli: 630, Erode: 400, Vellore: 140, Thanjavur: 350, Pondicherry: 150 },
  Coimbatore: { Chennai: 500, Madurai: 210, Tiruchirappalli: 210, Salem: 160, Tirunelveli: 310, Erode: 100, Vellore: 420, Thanjavur: 250, Pondicherry: 530 },
  Madurai: { Chennai: 460, Coimbatore: 210, Tiruchirappalli: 140, Salem: 210, Tirunelveli: 160, Erode: 220, Vellore: 400, Thanjavur: 160, Pondicherry: 420 },
  Tiruchirappalli: { Chennai: 320, Coimbatore: 210, Madurai: 140, Salem: 140, Tirunelveli: 300, Erode: 180, Vellore: 290, Thanjavur: 60, Pondicherry: 210 },
  Salem: { Chennai: 340, Coimbatore: 160, Madurai: 210, Tiruchirappalli: 140, Tirunelveli: 370, Erode: 60, Vellore: 210, Thanjavur: 180, Pondicherry: 280 },
  Tirunelveli: { Chennai: 630, Coimbatore: 310, Madurai: 160, Tiruchirappalli: 300, Salem: 370, Erode: 380, Vellore: 560, Thanjavur: 340, Pondicherry: 580 },
  Erode: { Chennai: 400, Coimbatore: 100, Madurai: 220, Tiruchirappalli: 180, Salem: 60, Tirunelveli: 380, Vellore: 320, Thanjavur: 220, Pondicherry: 380 },
  Vellore: { Chennai: 140, Coimbatore: 420, Madurai: 400, Tiruchirappalli: 290, Salem: 210, Tirunelveli: 560, Erode: 320, Thanjavur: 310, Pondicherry: 150 },
  Thanjavur: { Chennai: 350, Coimbatore: 250, Madurai: 160, Tiruchirappalli: 60, Salem: 180, Tirunelveli: 340, Erode: 220, Vellore: 310, Pondicherry: 230 },
  Pondicherry: { Chennai: 150, Coimbatore: 530, Madurai: 420, Tiruchirappalli: 210, Salem: 280, Tirunelveli: 580, Erode: 380, Vellore: 150, Thanjavur: 230 },
};

const BookingTabs = () => {
  const { user } = useAuth();
  const { createBooking, calculateDiscount, loading } = useBooking();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("bus");
  const [showSeatSelector, setShowSeatSelector] = useState(false);
  const [showTicket, setShowTicket] = useState(false);
  const [bookingResult, setBookingResult] = useState<{
    finalPrice: number;
    discountPercentage: number;
    isStudentDiscount: boolean;
    isEarlyUserDiscount: boolean;
    qrData: string;
    bookingType: string;
  } | null>(null);

  const [bookingDetails, setBookingDetails] = useState({
    from: "",
    to: "",
    date: "",
    passengers: 1,
    cabType: "sedan",
    rentalType: "sedan",
    flightClass: "economy",
    pickupTime: "",
    returnDate: "",
    rentalDays: 1,
  });

  const getDistance = () => {
    if (!bookingDetails.from || !bookingDetails.to || bookingDetails.from === bookingDetails.to) return 0;
    return cityDistances[bookingDetails.from]?.[bookingDetails.to] || 300;
  };

  const calculatePrice = () => {
    const distance = getDistance();
    
    switch (activeTab) {
      case "cab": {
        const cabType = cabTypes.find(c => c.id === bookingDetails.cabType);
        return distance * (cabType?.price || 15);
      }
      case "rental": {
        const rentalType = rentalOptions.find(r => r.id === bookingDetails.rentalType);
        const days = bookingDetails.returnDate && bookingDetails.date 
          ? Math.max(1, Math.ceil((new Date(bookingDetails.returnDate).getTime() - new Date(bookingDetails.date).getTime()) / (1000 * 60 * 60 * 24)))
          : 1;
        return (rentalType?.pricePerDay || 2500) * days;
      }
      case "flight": {
        const flightClass = flightOptions.find(f => f.id === bookingDetails.flightClass);
        const baseFlightPrice = distance * 8; // Base price per km
        return baseFlightPrice * (flightClass?.multiplier || 1) * bookingDetails.passengers;
      }
      default:
        return 0;
    }
  };

  const handleSearch = () => {
    if (!bookingDetails.from || !bookingDetails.to) {
      toast.error("Please select origin and destination");
      return;
    }
    if (bookingDetails.from === bookingDetails.to) {
      toast.error("Origin and destination cannot be the same");
      return;
    }
    if (!bookingDetails.date) {
      toast.error("Please select a travel date");
      return;
    }

    if (activeTab === "bus") {
      setShowSeatSelector(true);
    }
  };

  const handleDirectBooking = async () => {
    if (!user) {
      toast.error("Please login to book", {
        action: {
          label: "Login",
          onClick: () => navigate("/auth"),
        },
      });
      return;
    }

    if (!bookingDetails.from || !bookingDetails.to || !bookingDetails.date) {
      toast.error("Please fill all required fields");
      return;
    }

    if (bookingDetails.from === bookingDetails.to) {
      toast.error("Origin and destination cannot be the same");
      return;
    }

    const basePrice = calculatePrice();
    
    let vehicleInfo: Record<string, unknown> = {};
    let bookingType: "cab" | "car_rental" | "flight" = "cab";

    switch (activeTab) {
      case "cab":
        bookingType = "cab";
        vehicleInfo = {
          cab_type: bookingDetails.cabType,
          distance: getDistance(),
          passengers: bookingDetails.passengers,
        };
        break;
      case "rental":
        bookingType = "car_rental";
        vehicleInfo = {
          rental_type: bookingDetails.rentalType,
          pickup_time: bookingDetails.pickupTime,
          return_date: bookingDetails.returnDate,
        };
        break;
      case "flight":
        bookingType = "flight";
        vehicleInfo = {
          flight_class: bookingDetails.flightClass,
          passengers: bookingDetails.passengers,
        };
        break;
    }

    const { result, error } = await createBooking({
      booking_type: bookingType,
      from_location: bookingDetails.from,
      to_location: bookingDetails.to,
      travel_date: bookingDetails.date,
      vehicle_info: vehicleInfo,
      base_price: basePrice,
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    if (result) {
      setBookingResult({
        finalPrice: result.final_price,
        discountPercentage: result.discount_percentage,
        isStudentDiscount: result.is_student_discount,
        isEarlyUserDiscount: result.is_early_user_discount,
        qrData: result.qr_code_data,
        bookingType: activeTab,
      });
      setShowTicket(true);
      toast.success("Booking confirmed! 🎉");
    }
  };

  const getBookingLabel = () => {
    switch (activeTab) {
      case "cab": return "Book Cab";
      case "rental": return "Book Rental";
      case "flight": return "Book Flight";
      default: return "Search";
    }
  };

  if (showTicket && bookingResult) {
    const vehicleInfo: Record<string, unknown> = {};
    if (bookingResult.bookingType === "cab") {
      vehicleInfo.cab_type = bookingDetails.cabType;
      vehicleInfo.distance = getDistance();
      vehicleInfo.passengers = bookingDetails.passengers;
    } else if (bookingResult.bookingType === "rental") {
      vehicleInfo.rental_type = bookingDetails.rentalType;
      vehicleInfo.pickup_time = bookingDetails.pickupTime;
      vehicleInfo.return_date = bookingDetails.returnDate;
    } else if (bookingResult.bookingType === "flight") {
      vehicleInfo.flight_class = bookingDetails.flightClass;
      vehicleInfo.passengers = bookingDetails.passengers;
    }

    return (
      <section id="booking" className="py-20 bg-muted/30">
        <div className="container mx-auto px-6 max-w-2xl">
          <EnhancedTicket
            from={bookingDetails.from}
            to={bookingDetails.to}
            date={bookingDetails.date}
            seats={[]}
            busName={
              bookingResult.bookingType === "cab" 
                ? `${cabTypes.find(c => c.id === bookingDetails.cabType)?.name} Cab`
                : bookingResult.bookingType === "rental"
                ? `${rentalOptions.find(r => r.id === bookingDetails.rentalType)?.name} Rental`
                : `${flightOptions.find(f => f.id === bookingDetails.flightClass)?.name} Flight`
            }
            departure={bookingDetails.pickupTime || "As scheduled"}
            basePrice={calculatePrice()}
            finalPrice={bookingResult.finalPrice}
            discountPercentage={bookingResult.discountPercentage}
            isStudentDiscount={bookingResult.isStudentDiscount}
            isEarlyUserDiscount={bookingResult.isEarlyUserDiscount}
            qrData={bookingResult.qrData}
            bookingType={bookingResult.bookingType}
            vehicleInfo={vehicleInfo}
            onClose={() => {
              setShowTicket(false);
              setBookingResult(null);
              setBookingDetails({
                from: "",
                to: "",
                date: "",
                passengers: 1,
                cabType: "sedan",
                rentalType: "sedan",
                flightClass: "economy",
                pickupTime: "",
                returnDate: "",
                rentalDays: 1,
              });
            }}
          />
        </div>
      </section>
    );
  }

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
          <Tabs value={activeTab} onValueChange={(val) => { setActiveTab(val); setShowSeatSelector(false); }} className="w-full">
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
                          min={new Date().toISOString().split('T')[0]}
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

                      {/* Cab Type Selection */}
                      {activeTab === "cab" && (
                        <div className="md:col-span-2 lg:col-span-4 space-y-2">
                          <label className="text-sm font-medium text-muted-foreground">Cab Type</label>
                          <div className="grid grid-cols-4 gap-4">
                            {cabTypes.map((cab) => (
                              <button
                                key={cab.id}
                                onClick={() => setBookingDetails({ ...bookingDetails, cabType: cab.id })}
                                className={`p-4 rounded-xl border-2 transition-all ${
                                  bookingDetails.cabType === cab.id 
                                    ? 'border-primary bg-primary/5' 
                                    : 'border-border hover:border-primary/50'
                                }`}
                              >
                                <p className="font-semibold">{cab.name}</p>
                                <p className="text-sm text-muted-foreground">₹{cab.price}/km</p>
                                <p className="text-xs text-muted-foreground">{cab.capacity} seats</p>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Flight Class Selection */}
                      {activeTab === "flight" && (
                        <div className="md:col-span-2 lg:col-span-4 space-y-2">
                          <label className="text-sm font-medium text-muted-foreground">Class</label>
                          <div className="grid grid-cols-3 gap-4">
                            {flightOptions.map((flight) => (
                              <button
                                key={flight.id}
                                onClick={() => setBookingDetails({ ...bookingDetails, flightClass: flight.id })}
                                className={`p-4 rounded-xl border-2 transition-all ${
                                  bookingDetails.flightClass === flight.id 
                                    ? 'border-primary bg-primary/5' 
                                    : 'border-border hover:border-primary/50'
                                }`}
                              >
                                <p className="font-semibold">{flight.name}</p>
                                <p className="text-sm text-muted-foreground">{flight.multiplier}x base</p>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Additional Options for Car Rental */}
                      {activeTab === "rental" && (
                        <>
                          <div className="md:col-span-2 lg:col-span-4 space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Vehicle Type</label>
                            <div className="grid grid-cols-4 gap-4">
                              {rentalOptions.map((rental) => (
                                <button
                                  key={rental.id}
                                  onClick={() => setBookingDetails({ ...bookingDetails, rentalType: rental.id })}
                                  className={`p-4 rounded-xl border-2 transition-all ${
                                    bookingDetails.rentalType === rental.id 
                                      ? 'border-primary bg-primary/5' 
                                      : 'border-border hover:border-primary/50'
                                  }`}
                                >
                                  <p className="font-semibold">{rental.name}</p>
                                  <p className="text-sm text-muted-foreground">₹{rental.pricePerDay}/day</p>
                                  <p className="text-xs text-muted-foreground">{rental.capacity} seats</p>
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className="md:col-span-2 lg:col-span-4 grid md:grid-cols-2 gap-6 pt-4 border-t border-border mt-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                Pickup Time
                              </label>
                              <input 
                                type="time" 
                                value={bookingDetails.pickupTime}
                                onChange={(e) => setBookingDetails({ ...bookingDetails, pickupTime: e.target.value })}
                                className="w-full input-premium" 
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Return Date
                              </label>
                              <input 
                                type="date" 
                                value={bookingDetails.returnDate}
                                min={bookingDetails.date || new Date().toISOString().split('T')[0]}
                                onChange={(e) => setBookingDetails({ ...bookingDetails, returnDate: e.target.value })}
                                className="w-full input-premium" 
                              />
                            </div>
                          </div>
                        </>
                      )}

                      {/* Price Preview for non-bus bookings */}
                      {activeTab !== "bus" && bookingDetails.from && bookingDetails.to && bookingDetails.from !== bookingDetails.to && (
                        <div className="md:col-span-2 lg:col-span-4 p-4 rounded-xl bg-primary/5 border border-primary/20">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-muted-foreground">Estimated Price</p>
                              <p className="text-2xl font-bold text-primary">₹{calculatePrice().toLocaleString()}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-muted-foreground">Distance: ~{getDistance()} km</p>
                              {!user && (
                                <p className="text-xs text-gold">Login for special discounts!</p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Search/Book Button */}
                      <div className="md:col-span-2 lg:col-span-4 mt-4">
                        {activeTab === "bus" ? (
                          <Button onClick={handleSearch} className="w-full btn-hero py-6 text-lg">
                            Search Bus Options
                          </Button>
                        ) : (
                          <Button 
                            onClick={handleDirectBooking} 
                            disabled={loading}
                            className="w-full btn-hero py-6 text-lg"
                          >
                            {loading ? (
                              <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                Booking...
                              </>
                            ) : (
                              getBookingLabel()
                            )}
                          </Button>
                        )}
                      </div>
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
