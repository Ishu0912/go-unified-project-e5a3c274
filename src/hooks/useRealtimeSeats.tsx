import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface BookedSeat {
  busId: string;
  date: string;
  seatNumber: string;
}

export const useRealtimeSeats = (busId: string, travelDate: string, from: string, to: string) => {
  const [bookedSeats, setBookedSeats] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch initial booked seats
  const fetchBookedSeats = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select("seat_numbers, vehicle_info")
        .eq("booking_type", "bus")
        .eq("travel_date", travelDate)
        .eq("from_location", from)
        .eq("to_location", to)
        .eq("status", "confirmed");

      if (error) {
        console.error("Error fetching booked seats:", error);
        return;
      }

      // Filter by bus_id from vehicle_info and collect all booked seats
      const allBookedSeats: string[] = [];
      data?.forEach((booking) => {
        const vehicleInfo = booking.vehicle_info as { bus_id?: string } | null;
        if (vehicleInfo?.bus_id === busId && booking.seat_numbers) {
          allBookedSeats.push(...booking.seat_numbers);
        }
      });

      setBookedSeats(allBookedSeats);
    } catch (err) {
      console.error("Error in fetchBookedSeats:", err);
    } finally {
      setLoading(false);
    }
  }, [busId, travelDate, from, to]);

  // Set up realtime subscription
  useEffect(() => {
    fetchBookedSeats();

    // Subscribe to realtime changes on bookings table
    const channel = supabase
      .channel(`seats-${busId}-${travelDate}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookings",
          filter: `travel_date=eq.${travelDate}`,
        },
        (payload) => {
          console.log("Realtime update received:", payload);
          // Refetch to get updated seat availability
          fetchBookedSeats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [busId, travelDate, from, to, fetchBookedSeats]);

  return { bookedSeats, loading, refetch: fetchBookedSeats };
};
