import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Clock, Wifi, Wind, Tv } from "lucide-react";
import { Button } from "@/components/ui/button";
import PremiumTicket from "./PremiumTicket";

interface BusSeatSelectorProps {
  from: string;
  to: string;
  date: string;
  onBack: () => void;
}

type SeatStatus = "available" | "booked" | "selected" | "women";

interface Seat {
  id: string;
  status: SeatStatus;
  price: number;
}

const busOptions = [
  {
    id: "1",
    name: "GO UNIFIED Premium AC",
    departure: "06:00 AM",
    arrival: "12:30 PM",
    duration: "6h 30m",
    price: 850,
    rating: 4.8,
    amenities: ["wifi", "ac", "entertainment"],
    type: "Sleeper AC",
  },
  {
    id: "2",
    name: "GO UNIFIED Express",
    departure: "08:30 AM",
    arrival: "02:00 PM",
    duration: "5h 30m",
    price: 650,
    rating: 4.5,
    amenities: ["ac"],
    type: "Semi-Sleeper AC",
  },
  {
    id: "3",
    name: "GO UNIFIED Night Rider",
    departure: "10:00 PM",
    arrival: "05:30 AM",
    duration: "7h 30m",
    price: 950,
    rating: 4.9,
    amenities: ["wifi", "ac", "entertainment"],
    type: "Sleeper AC",
  },
];

// Generate seats layout
const generateSeats = (): Seat[][] => {
  const rows: Seat[][] = [];
  for (let i = 0; i < 10; i++) {
    const row: Seat[] = [];
    for (let j = 0; j < 4; j++) {
      const seatNum = `${String.fromCharCode(65 + j)}${i + 1}`;
      const random = Math.random();
      let status: SeatStatus = "available";
      if (random < 0.3) status = "booked";
      else if (random < 0.4 && j < 2) status = "women";
      row.push({ id: seatNum, status, price: 850 });
    }
    rows.push(row);
  }
  return rows;
};

const BusSeatSelector = ({ from, to, date, onBack }: BusSeatSelectorProps) => {
  const [selectedBus, setSelectedBus] = useState<string | null>(null);
  const [seats, setSeats] = useState<Seat[][]>(generateSeats());
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [showTicket, setShowTicket] = useState(false);

  const handleSeatClick = (rowIndex: number, seatIndex: number) => {
    const seat = seats[rowIndex][seatIndex];
    if (seat.status === "booked") return;

    const newSeats = [...seats];
    if (seat.status === "selected") {
      newSeats[rowIndex][seatIndex] = { ...seat, status: seat.id.startsWith("A") || seat.id.startsWith("B") ? "women" : "available" };
      setSelectedSeats(selectedSeats.filter((s) => s !== seat.id));
    } else {
      newSeats[rowIndex][seatIndex] = { ...seat, status: "selected" };
      setSelectedSeats([...selectedSeats, seat.id]);
    }
    setSeats(newSeats);
  };

  const getSeatColor = (status: SeatStatus) => {
    switch (status) {
      case "available":
        return "bg-success/20 border-success hover:bg-success/40 cursor-pointer";
      case "booked":
        return "bg-muted border-muted-foreground/30 cursor-not-allowed opacity-50";
      case "selected":
        return "bg-primary border-primary cursor-pointer";
      case "women":
        return "bg-pink-100 border-pink-400 hover:bg-pink-200 cursor-pointer";
    }
  };

  const totalPrice = selectedSeats.length * 850;

  if (showTicket) {
    return (
      <PremiumTicket
        from={from}
        to={to}
        date={date}
        seats={selectedSeats}
        busName={busOptions.find((b) => b.id === selectedBus)?.name || "GO UNIFIED Premium AC"}
        departure={busOptions.find((b) => b.id === selectedBus)?.departure || "06:00 AM"}
        onClose={() => setShowTicket(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Search
      </Button>

      {/* Route Info */}
      <div className="flex items-center justify-between bg-primary/5 rounded-2xl p-4">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-lg font-bold text-primary">{from}</p>
            <p className="text-xs text-muted-foreground">From</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <div className="w-20 h-0.5 bg-primary/30" />
            <MapPin className="w-4 h-4 text-accent" />
            <div className="w-20 h-0.5 bg-primary/30" />
            <div className="w-2 h-2 rounded-full bg-accent" />
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-accent">{to}</p>
            <p className="text-xs text-muted-foreground">To</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{date}</p>
      </div>

      {!selectedBus ? (
        /* Bus Selection */
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Available Buses</h3>
          {busOptions.map((bus) => (
            <motion.div
              key={bus.id}
              whileHover={{ scale: 1.01 }}
              onClick={() => setSelectedBus(bus.id)}
              className="bg-card border border-border rounded-2xl p-6 cursor-pointer hover:border-primary/50 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-foreground">{bus.name}</h4>
                  <p className="text-sm text-muted-foreground">{bus.type}</p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="font-bold">{bus.departure}</p>
                    <p className="text-xs text-muted-foreground">Departure</p>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{bus.duration}</span>
                  </div>
                  <div className="text-center">
                    <p className="font-bold">{bus.arrival}</p>
                    <p className="text-xs text-muted-foreground">Arrival</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">₹{bus.price}</p>
                    <p className="text-xs text-muted-foreground">per seat</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
                <div className="flex items-center gap-2">
                  {bus.amenities.includes("wifi") && <Wifi className="w-4 h-4 text-muted-foreground" />}
                  {bus.amenities.includes("ac") && <Wind className="w-4 h-4 text-muted-foreground" />}
                  {bus.amenities.includes("entertainment") && <Tv className="w-4 h-4 text-muted-foreground" />}
                </div>
                <span className="text-sm text-muted-foreground">•</span>
                <span className="text-sm text-success">⭐ {bus.rating} Rating</span>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        /* Seat Selection */
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => setSelectedBus(null)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Change Bus
            </Button>
            <h3 className="text-lg font-semibold">Select Your Seats</h3>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 justify-center">
            {[
              { status: "available", label: "Available" },
              { status: "booked", label: "Booked" },
              { status: "selected", label: "Selected" },
              { status: "women", label: "Women Only" },
            ].map((item) => (
              <div key={item.status} className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-md border-2 ${getSeatColor(item.status as SeatStatus)}`} />
                <span className="text-sm text-muted-foreground">{item.label}</span>
              </div>
            ))}
          </div>

          {/* Bus Layout */}
          <div className="bg-muted/50 rounded-3xl p-8">
            {/* Driver Area */}
            <div className="flex justify-end mb-6">
              <div className="w-12 h-12 rounded-xl bg-foreground/10 flex items-center justify-center">
                <span className="text-xs text-muted-foreground">Driver</span>
              </div>
            </div>

            {/* Seats Grid */}
            <div className="flex flex-col items-center gap-3">
              {seats.map((row, rowIndex) => (
                <div key={rowIndex} className="flex items-center gap-2">
                  <div className="flex gap-2">
                    {row.slice(0, 2).map((seat, seatIndex) => (
                      <motion.button
                        key={seat.id}
                        whileHover={{ scale: seat.status !== "booked" ? 1.1 : 1 }}
                        whileTap={{ scale: seat.status !== "booked" ? 0.95 : 1 }}
                        onClick={() => handleSeatClick(rowIndex, seatIndex)}
                        className={`w-10 h-10 rounded-lg border-2 text-xs font-medium transition-colors ${getSeatColor(seat.status)}`}
                      >
                        {seat.id}
                      </motion.button>
                    ))}
                  </div>
                  <div className="w-8" /> {/* Aisle */}
                  <div className="flex gap-2">
                    {row.slice(2, 4).map((seat, seatIndex) => (
                      <motion.button
                        key={seat.id}
                        whileHover={{ scale: seat.status !== "booked" ? 1.1 : 1 }}
                        whileTap={{ scale: seat.status !== "booked" ? 0.95 : 1 }}
                        onClick={() => handleSeatClick(rowIndex, seatIndex + 2)}
                        className={`w-10 h-10 rounded-lg border-2 text-xs font-medium transition-colors ${getSeatColor(seat.status)}`}
                      >
                        {seat.id}
                      </motion.button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Booking Summary */}
          {selectedSeats.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-primary to-ocean-light rounded-2xl p-6 text-white"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">Selected Seats</p>
                  <p className="text-xl font-bold">{selectedSeats.join(", ")}</p>
                </div>
                <div className="text-right">
                  <p className="text-white/80 text-sm">Total Amount</p>
                  <p className="text-3xl font-bold">₹{totalPrice}</p>
                </div>
              </div>
              <Button
                onClick={() => setShowTicket(true)}
                className="w-full mt-4 bg-white text-primary hover:bg-white/90 font-semibold py-6"
              >
                Proceed to Book
              </Button>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};

export default BusSeatSelector;
