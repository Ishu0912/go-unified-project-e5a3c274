import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export interface EmergencyContact {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  photo_url: string | null;
  relationship: string | null;
  created_at: string;
  updated_at: string;
}

export const useEmergencyContacts = () => {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchContacts = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("emergency_contacts")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });

    if (!error && data) {
      setContacts(data as EmergencyContact[]);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const addContact = async (contact: { name: string; phone: string; photo_url?: string; relationship?: string }) => {
    if (!user) return { error: new Error("Not authenticated") };
    if (contacts.length >= 5) {
      toast.error("Maximum 5 emergency contacts allowed");
      return { error: new Error("Max contacts reached") };
    }

    const { data, error } = await supabase
      .from("emergency_contacts")
      .insert({ ...contact, user_id: user.id })
      .select()
      .single();

    if (!error && data) {
      setContacts((prev) => [...prev, data as EmergencyContact]);
      toast.success("Emergency contact added");
    }
    return { error };
  };

  const removeContact = async (id: string) => {
    const { error } = await supabase.from("emergency_contacts").delete().eq("id", id);
    if (!error) {
      setContacts((prev) => prev.filter((c) => c.id !== id));
      toast.success("Contact removed");
    }
    return { error };
  };

  const updateContact = async (id: string, updates: Partial<EmergencyContact>) => {
    const { error } = await supabase
      .from("emergency_contacts")
      .update(updates)
      .eq("id", id);
    if (!error) {
      setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
    }
    return { error };
  };

  return { contacts, loading, fetchContacts, addContact, removeContact, updateContact };
};
