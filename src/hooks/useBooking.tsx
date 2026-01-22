import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

interface BookingData {
  booking_type: "bus" | "cab" | "car_rental" | "flight";
  from_location: string;
  to_location: string;
  travel_date: string;
  seat_numbers?: string[];
  vehicle_info?: Record<string, unknown>;
  base_price: number;
}

interface BookingResult {
  id: string;
  final_price: number;
  discount_percentage: number;
  is_student_discount: boolean;
  is_early_user_discount: boolean;
  qr_code_data: string;
}

export const useBooking = () => {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);

  const calculateDiscount = async () => {
    let discountPercentage = 0;
    let isStudentDiscount = false;
    let isEarlyUserDiscount = false;

    // Check if early user (first 3 bookings)
    const { data: isEarly } = await supabase.rpc("is_early_user");
    if (isEarly) {
      discountPercentage += 15; // 15% for first 3 users
      isEarlyUserDiscount = true;
    }

    // Check if student
    if (user) {
      const { data: isStudent } = await supabase.rpc("is_student_user", {
        _user_id: user.id,
      });
      if (isStudent) {
        discountPercentage += 10; // 10% student discount
        isStudentDiscount = true;
      }
    }

    return { discountPercentage, isStudentDiscount, isEarlyUserDiscount };
  };

  const createBooking = async (data: BookingData): Promise<{ result: BookingResult | null; error: Error | null }> => {
    if (!user) {
      return { result: null, error: new Error("Please login to book") };
    }

    setLoading(true);

    try {
      const { discountPercentage, isStudentDiscount, isEarlyUserDiscount } = await calculateDiscount();
      const finalPrice = data.base_price * (1 - discountPercentage / 100);
      
      // Generate QR code data
      const qrCodeData = JSON.stringify({
        booking_id: crypto.randomUUID(),
        user_id: user.id,
        user_name: profile?.full_name,
        user_phone: profile?.phone,
        type: data.booking_type,
        from: data.from_location,
        to: data.to_location,
        date: data.travel_date,
        seats: data.seat_numbers,
        price: finalPrice,
        timestamp: new Date().toISOString(),
      });

      const { data: booking, error } = await supabase
        .from("bookings")
        .insert([{
          user_id: user.id,
          booking_type: data.booking_type,
          from_location: data.from_location,
          to_location: data.to_location,
          travel_date: data.travel_date,
          seat_numbers: data.seat_numbers,
          vehicle_info: data.vehicle_info as any,
          base_price: data.base_price,
          discount_percentage: discountPercentage,
          final_price: finalPrice,
          is_student_discount: isStudentDiscount,
          is_early_user_discount: isEarlyUserDiscount,
          qr_code_data: qrCodeData,
        }])
        .select()
        .single();

      if (error) throw error;

      // Send confirmation email
      if (user.email) {
        try {
          await supabase.functions.invoke("send-email", {
            body: {
              to: user.email,
              type: "booking_confirmation",
              data: {
                bookingId: `GOUNIFIED-${booking.id.substring(0, 6).toUpperCase()}`,
                userName: profile?.full_name,
                bookingType: data.booking_type,
                from: data.from_location,
                to: data.to_location,
                travelDate: data.travel_date,
                seatNumbers: data.seat_numbers?.join(", "),
                finalPrice: finalPrice.toFixed(2),
              },
            },
          });
        } catch (emailError) {
          console.error("Failed to send confirmation email:", emailError);
          // Don't fail the booking if email fails
        }
      }

      return {
        result: {
          id: booking.id,
          final_price: finalPrice,
          discount_percentage: discountPercentage,
          is_student_discount: isStudentDiscount,
          is_early_user_discount: isEarlyUserDiscount,
          qr_code_data: qrCodeData,
        },
        error: null,
      };
    } catch (error) {
      return { result: null, error: error as Error };
    } finally {
      setLoading(false);
    }
  };

  const getBookings = async () => {
    if (!user) return { bookings: [], error: new Error("Not authenticated") };

    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    return { bookings: data || [], error: error as Error | null };
  };

  return {
    createBooking,
    getBookings,
    calculateDiscount,
    loading,
  };
};
