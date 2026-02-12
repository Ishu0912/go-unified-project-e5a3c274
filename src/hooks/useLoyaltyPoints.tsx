import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

interface LoyaltyPoints {
  points: number;
  total_earned: number;
  total_redeemed: number;
}

interface LoyaltyTransaction {
  id: string;
  points: number;
  type: string;
  description: string | null;
  booking_id: string | null;
  created_at: string;
}

export const useLoyaltyPoints = () => {
  const { user } = useAuth();
  const [loyaltyPoints, setLoyaltyPoints] = useState<LoyaltyPoints>({ points: 0, total_earned: 0, total_redeemed: 0 });
  const [transactions, setTransactions] = useState<LoyaltyTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPoints = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("loyalty_points")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (data) {
      setLoyaltyPoints({ points: data.points, total_earned: data.total_earned, total_redeemed: data.total_redeemed });
    }
  }, [user]);

  const fetchTransactions = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("loyalty_transactions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20);

    if (data) setTransactions(data as LoyaltyTransaction[]);
  }, [user]);

  const earnPoints = useCallback(async (points: number, description: string, bookingId?: string) => {
    if (!user) return;

    // Upsert loyalty points
    const { data: existing } = await supabase
      .from("loyalty_points")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (existing) {
      await supabase
        .from("loyalty_points")
        .update({
          points: existing.points + points,
          total_earned: existing.total_earned + points,
        })
        .eq("user_id", user.id);
    } else {
      await supabase
        .from("loyalty_points")
        .insert({ user_id: user.id, points, total_earned: points });
    }

    // Record transaction
    await supabase.from("loyalty_transactions").insert({
      user_id: user.id,
      points,
      type: "earned",
      description,
      booking_id: bookingId || null,
    });

    await fetchPoints();
    await fetchTransactions();
  }, [user, fetchPoints, fetchTransactions]);

  useEffect(() => {
    if (user) {
      setLoading(true);
      Promise.all([fetchPoints(), fetchTransactions()]).finally(() => setLoading(false));
    }
  }, [user, fetchPoints, fetchTransactions]);

  return { loyaltyPoints, transactions, earnPoints, loading, refetch: fetchPoints };
};
