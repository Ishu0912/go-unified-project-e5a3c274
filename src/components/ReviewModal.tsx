import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  bookingId: string;
  userId: string;
  tripDetails: {
    from: string;
    to: string;
    date: string;
    vehicleType: string;
  };
  existingReview?: {
    id: string;
    rating: number;
    review_text: string | null;
  };
}

const reviewSchema = z.object({
  rating: z.number().min(1, "Please select a rating").max(5),
  review_text: z.string().max(500, "Review must be less than 500 characters").optional(),
});

const ReviewModal = ({
  isOpen,
  onClose,
  onSuccess,
  bookingId,
  userId,
  tripDetails,
  existingReview,
}: ReviewModalProps) => {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState(existingReview?.review_text || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    const validation = reviewSchema.safeParse({ rating, review_text: reviewText || undefined });
    
    if (!validation.success) {
      toast.error(validation.error.errors[0]?.message || "Invalid input");
      return;
    }

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setIsSubmitting(true);

    try {
      if (existingReview) {
        // Update existing review
        const { error } = await supabase
          .from("reviews")
          .update({
            rating,
            review_text: reviewText.trim() || null,
          })
          .eq("id", existingReview.id);

        if (error) throw error;
        toast.success("Review updated successfully!");
      } else {
        // Create new review
        const { error } = await supabase
          .from("reviews")
          .insert({
            booking_id: bookingId,
            user_id: userId,
            rating,
            review_text: reviewText.trim() || null,
          });

        if (error) throw error;
        toast.success("Thank you for your review!");
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const ratingLabels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md bg-card rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-gold/20 to-secondary/20 border-b border-border">
            <h2 className="text-xl font-bold text-foreground">
              {existingReview ? "Edit Your Review" : "Rate Your Trip"}
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              {tripDetails.from} → {tripDetails.to}
            </p>
            <p className="text-muted-foreground text-xs">
              {tripDetails.date} • {tripDetails.vehicleType}
            </p>
          </div>

          <div className="p-6 space-y-6">
            {/* Star Rating */}
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground mb-3">
                How was your experience?
              </p>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-10 h-10 transition-colors ${
                        star <= (hoverRating || rating)
                          ? "text-gold fill-gold"
                          : "text-muted-foreground/30"
                      }`}
                    />
                  </motion.button>
                ))}
              </div>
              {(hoverRating || rating) > 0 && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-lg font-semibold text-gold mt-2"
                >
                  {ratingLabels[hoverRating || rating]}
                </motion.p>
              )}
            </div>

            {/* Review Text */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Share your experience (optional)
              </label>
              <Textarea
                placeholder="Tell us about your trip..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                maxLength={500}
                className="min-h-[120px] resize-none"
              />
              <p className="text-xs text-muted-foreground text-right">
                {reviewText.length}/500 characters
              </p>
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || rating === 0}
              className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-gold to-secondary text-primary-foreground hover:opacity-90"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  {existingReview ? "Update Review" : "Submit Review"}
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ReviewModal;
