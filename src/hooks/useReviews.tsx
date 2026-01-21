import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Review {
  id: string;
  booking_id: string;
  user_id: string;
  rating: number;
  review_text: string | null;
  created_at: string;
  updated_at: string;
}

export const useReviews = () => {
  const [loading, setLoading] = useState(false);

  const getReviewForBooking = useCallback(async (bookingId: string): Promise<Review | null> => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("booking_id", bookingId)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error fetching review:", error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getReviewsForUser = useCallback(async (userId: string): Promise<Review[]> => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching reviews:", error);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteReview = useCallback(async (reviewId: string): Promise<boolean> => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("reviews")
        .delete()
        .eq("id", reviewId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error deleting review:", error);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const getAverageRating = useCallback(async (): Promise<{ average: number; count: number }> => {
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("rating");

      if (error) throw error;

      if (!data || data.length === 0) {
        return { average: 0, count: 0 };
      }

      const sum = data.reduce((acc, r) => acc + r.rating, 0);
      return {
        average: sum / data.length,
        count: data.length,
      };
    } catch (error) {
      console.error("Error calculating average:", error);
      return { average: 0, count: 0 };
    }
  }, []);

  return {
    getReviewForBooking,
    getReviewsForUser,
    deleteReview,
    getAverageRating,
    loading,
  };
};
