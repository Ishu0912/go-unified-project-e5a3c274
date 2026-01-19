-- Enable realtime for bookings table to sync seat availability
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;