import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Download, 
  Ticket, 
  MapPin, 
  Calendar, 
  Clock, 
  Bus, 
  Car, 
  CarFront, 
  Plane,
  Eye,
  Navigation
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useBooking } from "@/hooks/useBooking";
import { downloadTicket, TicketData } from "@/utils/ticketDownload";
import { toast } from "sonner";
import Header from "@/components/Header";

interface Booking {
  id: string;
  booking_type: string;
  from_location: string;
  to_location: string;
  travel_date: string;
  seat_numbers: string[] | null;
  vehicle_info: Record<string, unknown> | null;
  base_price: number;
  final_price: number;
  discount_percentage: number | null;
  is_student_discount: boolean | null;
  is_early_user_discount: boolean | null;
  qr_code_data: string | null;
  status: string | null;
  created_at: string;
}

const MyBookings = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const { getBookings } = useBooking();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
      return;
    }

    if (user) {
      loadBookings();
    }
  }, [user, authLoading, navigate]);

  const loadBookings = async () => {
    setLoading(true);
    const { bookings: data, error } = await getBookings();
    if (!error) {
      setBookings(data as Booking[]);
    }
    setLoading(false);
  };

  const getBookingIcon = (type: string) => {
    switch (type) {
      case "bus": return Bus;
      case "cab": return Car;
      case "car_rental": return CarFront;
      case "flight": return Plane;
      default: return Bus;
    }
  };

  const getBookingColor = (type: string) => {
    switch (type) {
      case "bus": return "from-blue-500 to-cyan-500";
      case "cab": return "from-yellow-500 to-orange-500";
      case "car_rental": return "from-green-500 to-emerald-500";
      case "flight": return "from-purple-500 to-pink-500";
      default: return "from-blue-500 to-cyan-500";
    }
  };

  const isActiveTrip = (booking: Booking) => {
    const today = new Date();
    const travelDate = new Date(booking.travel_date);
    return travelDate >= today && booking.status === "confirmed";
  };

  const isPastTrip = (booking: Booking) => {
    const today = new Date();
    const travelDate = new Date(booking.travel_date);
    return travelDate < today;
  };

  const filteredBookings = bookings.filter((booking) => {
    switch (activeTab) {
      case "active":
        return isActiveTrip(booking);
      case "past":
        return isPastTrip(booking);
      default:
        return true;
    }
  });

  const handleDownloadTicket = (booking: Booking) => {
    const ticketData: TicketData = {
      ticketId: `GOUNIFIED-${booking.id.substring(0, 6).toUpperCase()}`,
      passengerName: profile?.full_name || "Passenger",
      phone: profile?.phone || undefined,
      photoUrl: profile?.photo_url || undefined,
      from: booking.from_location,
      to: booking.to_location,
      date: booking.travel_date,
      departure: (booking.vehicle_info?.pickup_time as string) || "As scheduled",
      seats: booking.seat_numbers || [],
      vehicleName: getVehicleName(booking),
      bookingType: booking.booking_type,
      basePrice: booking.base_price,
      finalPrice: booking.final_price,
      discountPercentage: booking.discount_percentage || 0,
      isStudentDiscount: booking.is_student_discount || false,
      isEarlyUserDiscount: booking.is_early_user_discount || false,
      qrData: booking.qr_code_data || JSON.stringify({ id: booking.id }),
      vehicleInfo: booking.vehicle_info || undefined,
    };
    downloadTicket(ticketData);
    toast.success("Ticket downloaded successfully!");
  };

  const getVehicleName = (booking: Booking) => {
    const info = booking.vehicle_info;
    if (!info) return "Vehicle";
    
    switch (booking.booking_type) {
      case "bus":
        return (info.bus_name as string) || "Express Bus";
      case "cab":
        return `${(info.cab_type as string)?.charAt(0).toUpperCase()}${(info.cab_type as string)?.slice(1) || ""} Cab`;
      case "car_rental":
        return `${(info.rental_type as string)?.charAt(0).toUpperCase()}${(info.rental_type as string)?.slice(1) || ""} Rental`;
      case "flight":
        return `${(info.flight_class as string)?.charAt(0).toUpperCase()}${(info.flight_class as string)?.slice(1) || ""} Flight`;
      default:
        return "Vehicle";
    }
  };

  const handleTrackTrip = (booking: Booking) => {
    // Navigate to tracking section with booking info
    navigate("/#track");
    toast.info(`Tracking ${booking.booking_type} from ${booking.from_location} to ${booking.to_location}`);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        {/* Back Button & Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate("/")}
            className="rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">My Bookings</h1>
            <p className="text-muted-foreground">View and manage your travel history</p>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <div className="bg-card rounded-2xl p-6 border border-border">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Ticket className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Total Bookings</p>
                <p className="text-2xl font-bold text-foreground">{bookings.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-2xl p-6 border border-border">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                <Navigation className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Active Trips</p>
                <p className="text-2xl font-bold text-foreground">
                  {bookings.filter(isActiveTrip).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-2xl p-6 border border-border">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Completed</p>
                <p className="text-2xl font-bold text-foreground">
                  {bookings.filter(isPastTrip).length}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 w-full max-w-md mb-6">
            <TabsTrigger value="all">All ({bookings.length})</TabsTrigger>
            <TabsTrigger value="active">
              Active ({bookings.filter(isActiveTrip).length})
            </TabsTrigger>
            <TabsTrigger value="past">
              Past ({bookings.filter(isPastTrip).length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            {filteredBookings.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Ticket className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No bookings found
                </h3>
                <p className="text-muted-foreground mb-6">
                  {activeTab === "active" 
                    ? "You don't have any upcoming trips"
                    : activeTab === "past"
                    ? "You haven't completed any trips yet"
                    : "Start your journey by booking a trip"}
                </p>
                <Button onClick={() => navigate("/")} className="btn-premium">
                  Book a Trip
                </Button>
              </motion.div>
            ) : (
              <div className="grid gap-4">
                <AnimatePresence>
                  {filteredBookings.map((booking, index) => {
                    const Icon = getBookingIcon(booking.booking_type);
                    const isActive = isActiveTrip(booking);
                    
                    return (
                      <motion.div
                        key={booking.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.05 }}
                        className={`
                          bg-card rounded-2xl border border-border overflow-hidden
                          ${isActive ? "ring-2 ring-primary/30" : ""}
                        `}
                      >
                        <div className="flex flex-col md:flex-row">
                          {/* Left Section - Icon & Type */}
                          <div className={`p-6 bg-gradient-to-br ${getBookingColor(booking.booking_type)} flex flex-col items-center justify-center min-w-[120px]`}>
                            <Icon className="w-8 h-8 text-white mb-2" />
                            <span className="text-white font-semibold capitalize text-sm">
                              {booking.booking_type.replace("_", " ")}
                            </span>
                            {isActive && (
                              <span className="mt-2 px-2 py-1 rounded-full bg-white/20 text-white text-xs">
                                Active
                              </span>
                            )}
                          </div>

                          {/* Main Content */}
                          <div className="flex-1 p-6">
                            {/* Route */}
                            <div className="flex items-center gap-3 mb-4">
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-primary" />
                                <span className="font-semibold">{booking.from_location}</span>
                              </div>
                              <div className="flex-1 border-t-2 border-dashed border-muted-foreground/30" />
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-accent" />
                                <span className="font-semibold">{booking.to_location}</span>
                              </div>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                              <div>
                                <p className="text-muted-foreground text-xs">Date</p>
                                <p className="font-medium flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {new Date(booking.travel_date).toLocaleDateString()}
                                </p>
                              </div>
                              <div>
                                <p className="text-muted-foreground text-xs">
                                  {booking.seat_numbers?.length ? "Seats" : "Passengers"}
                                </p>
                                <p className="font-medium">
                                  {booking.seat_numbers?.join(", ") || 
                                   (booking.vehicle_info?.passengers as number) || 1}
                                </p>
                              </div>
                              <div>
                                <p className="text-muted-foreground text-xs">Vehicle</p>
                                <p className="font-medium text-sm truncate">
                                  {getVehicleName(booking)}
                                </p>
                              </div>
                              <div>
                                <p className="text-muted-foreground text-xs">Amount</p>
                                <p className="font-bold text-primary">₹{booking.final_price}</p>
                                {booking.discount_percentage && booking.discount_percentage > 0 && (
                                  <span className="text-xs text-green-600">
                                    -{booking.discount_percentage}% off
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-wrap gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDownloadTicket(booking)}
                                className="gap-2"
                              >
                                <Download className="w-4 h-4" />
                                Download Ticket
                              </Button>
                              {isActive && (
                                <Button
                                  size="sm"
                                  onClick={() => handleTrackTrip(booking)}
                                  className="gap-2 bg-green-600 hover:bg-green-700"
                                >
                                  <Navigation className="w-4 h-4" />
                                  Track Trip
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setSelectedBooking(booking)}
                                className="gap-2"
                              >
                                <Eye className="w-4 h-4" />
                                View Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Booking Details Modal */}
      <AnimatePresence>
        {selectedBooking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedBooking(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-3xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto"
            >
              <h2 className="text-2xl font-bold mb-6">Booking Details</h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getBookingColor(selectedBooking.booking_type)} flex items-center justify-center`}>
                    {(() => {
                      const Icon = getBookingIcon(selectedBooking.booking_type);
                      return <Icon className="w-6 h-6 text-white" />;
                    })()}
                  </div>
                  <div>
                    <p className="font-semibold capitalize">
                      {selectedBooking.booking_type.replace("_", " ")} Booking
                    </p>
                    <p className="text-sm text-muted-foreground">
                      ID: {selectedBooking.id.substring(0, 8).toUpperCase()}
                    </p>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-muted-foreground text-sm">From</p>
                      <p className="font-semibold">{selectedBooking.from_location}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm">To</p>
                      <p className="font-semibold">{selectedBooking.to_location}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm">Travel Date</p>
                      <p className="font-semibold">
                        {new Date(selectedBooking.travel_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm">Status</p>
                      <p className="font-semibold capitalize text-green-600">
                        {selectedBooking.status}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm">Base Price</p>
                      <p className="font-semibold">₹{selectedBooking.base_price}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm">Final Price</p>
                      <p className="font-bold text-primary text-lg">
                        ₹{selectedBooking.final_price}
                      </p>
                    </div>
                  </div>

                  {selectedBooking.discount_percentage && selectedBooking.discount_percentage > 0 && (
                    <div className="mt-4 p-3 rounded-xl bg-green-500/10 border border-green-500/30">
                      <p className="text-green-600 font-medium text-sm">
                        You saved ₹{(selectedBooking.base_price - selectedBooking.final_price).toFixed(0)} 
                        ({selectedBooking.discount_percentage}% discount)
                      </p>
                      <div className="flex gap-2 mt-2">
                        {selectedBooking.is_early_user_discount && (
                          <span className="px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-600 text-xs">
                            🎉 Early User
                          </span>
                        )}
                        {selectedBooking.is_student_discount && (
                          <span className="px-2 py-1 rounded-full bg-cyan-500/20 text-cyan-600 text-xs">
                            🎓 Student
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 mt-6">
                  <Button
                    className="flex-1 btn-premium gap-2"
                    onClick={() => {
                      handleDownloadTicket(selectedBooking);
                      setSelectedBooking(null);
                    }}
                  >
                    <Download className="w-4 h-4" />
                    Download Ticket
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedBooking(null)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyBookings;
