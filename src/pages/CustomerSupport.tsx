import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Headphones, MessageSquareWarning, Phone, Mail, Instagram, MapPin, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";

const faqs = [
  { q: "How do I cancel my booking?", a: "Go to My Bookings, select the booking and tap 'Cancel'. Refunds are processed within 3-5 business days." },
  { q: "How do I get a refund?", a: "Refunds are automatic upon cancellation. Check your payment method within 3-5 business days." },
  { q: "How do I change my travel date?", a: "Currently you need to cancel and rebook. Date modification feature is coming soon." },
  { q: "Is my payment secure?", a: "Yes, all payments are encrypted and processed through secure payment gateways." },
  { q: "How do I contact the driver?", a: "Once your cab is confirmed, the driver's contact details will appear in your booking." },
];

const complaintCategories = [
  "Booking Issue",
  "Payment Problem",
  "Driver Complaint",
  "Vehicle Condition",
  "Delay / Cancellation",
  "Refund Not Received",
  "App Issue",
  "Other",
];

const CustomerSupport = () => {
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get("tab") === "complaint" ? "complaint" : "support";
  const [activeTab, setActiveTab] = useState(defaultTab);

  const [complaintForm, setComplaintForm] = useState({
    name: "",
    email: "",
    phone: "",
    category: "",
    bookingId: "",
    description: "",
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "complaint") setActiveTab("complaint");
  }, [searchParams]);

  const handleComplaintSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintForm.name || !complaintForm.email || !complaintForm.category || !complaintForm.description) {
      toast.error("Please fill all required fields");
      return;
    }
    setSubmitted(true);
    toast.success("Complaint submitted successfully! We'll get back to you within 24 hours.");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-ocean-light text-white py-8">
        <div className="container mx-auto px-6">
          <Link to="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold font-display">Customer Support</h1>
          <p className="text-white/70 mt-1">We're here to help you 24/7</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-10 max-w-4xl">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-8">
            <TabsTrigger value="support" className="gap-2">
              <Headphones className="w-4 h-4" />
              Help & Support
            </TabsTrigger>
            <TabsTrigger value="complaint" className="gap-2">
              <MessageSquareWarning className="w-4 h-4" />
              Raise Complaint
            </TabsTrigger>
          </TabsList>

          {/* Support Tab */}
          <TabsContent value="support">
            <div className="space-y-8">
              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-4"
              >
                <div className="p-5 rounded-2xl bg-card border border-border text-center">
                  <Phone className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="font-semibold text-foreground">Call Us</p>
                  <p className="text-sm text-muted-foreground">044-45820258</p>
                </div>
                <div className="p-5 rounded-2xl bg-card border border-border text-center">
                  <Mail className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="font-semibold text-foreground">Email</p>
                  <p className="text-sm text-muted-foreground">support@gounified.in</p>
                </div>
                <a
                  href="https://instagram.com/go_unifed"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-5 rounded-2xl bg-card border border-border text-center hover:border-primary/50 transition-colors"
                >
                  <Instagram className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="font-semibold text-foreground">Instagram</p>
                  <p className="text-sm text-muted-foreground">@go_unifed</p>
                </a>
              </motion.div>

              {/* Address */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="p-5 rounded-2xl bg-card border border-border flex items-start gap-3"
              >
                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">Office Address</p>
                  <p className="text-sm text-muted-foreground">12, Anna Nagar, Chennai</p>
                </div>
              </motion.div>

              {/* FAQs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
                <div className="space-y-3">
                  {faqs.map((faq, i) => (
                    <details key={i} className="p-4 rounded-xl bg-card border border-border group">
                      <summary className="font-medium text-foreground cursor-pointer list-none flex items-center justify-between">
                        {faq.q}
                        <span className="text-muted-foreground group-open:rotate-180 transition-transform">▾</span>
                      </summary>
                      <p className="mt-3 text-sm text-muted-foreground">{faq.a}</p>
                    </details>
                  ))}
                </div>
              </motion.div>
            </div>
          </TabsContent>

          {/* Complaint Tab */}
          <TabsContent value="complaint">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mb-4">
                  <CheckCircle className="w-10 h-10 text-success" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Complaint Submitted!</h2>
                <p className="text-muted-foreground max-w-md mb-6">
                  Your complaint has been registered. Our team will review it and get back to you within 24 hours.
                </p>
                <Button onClick={() => { setSubmitted(false); setComplaintForm({ name: "", email: "", phone: "", category: "", bookingId: "", description: "" }); }}>
                  Submit Another
                </Button>
              </motion.div>
            ) : (
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleComplaintSubmit}
                className="space-y-5"
              >
                <h2 className="text-xl font-bold text-foreground">Raise a Complaint</h2>
                <p className="text-sm text-muted-foreground">Fill in the details below and we'll resolve your issue as soon as possible.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1.5">Full Name *</label>
                    <Input
                      value={complaintForm.name}
                      onChange={(e) => setComplaintForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1.5">Email *</label>
                    <Input
                      type="email"
                      value={complaintForm.email}
                      onChange={(e) => setComplaintForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1.5">Phone Number</label>
                    <Input
                      value={complaintForm.phone}
                      onChange={(e) => setComplaintForm(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="Your phone number"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1.5">Booking ID (optional)</label>
                    <Input
                      value={complaintForm.bookingId}
                      onChange={(e) => setComplaintForm(prev => ({ ...prev, bookingId: e.target.value }))}
                      placeholder="GOUNIFIED-XXXXXX"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">Complaint Category *</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {complaintCategories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setComplaintForm(prev => ({ ...prev, category: cat }))}
                        className={`p-2.5 rounded-xl border text-sm transition-all ${
                          complaintForm.category === cat
                            ? "border-primary bg-primary/10 text-primary font-medium"
                            : "border-border text-muted-foreground hover:border-primary/50"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">Describe your issue *</label>
                  <Textarea
                    value={complaintForm.description}
                    onChange={(e) => setComplaintForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Please describe your complaint in detail..."
                    rows={5}
                    required
                  />
                </div>

                <Button type="submit" className="w-full py-6 text-lg gap-2">
                  <Send className="w-5 h-5" />
                  Submit Complaint
                </Button>
              </motion.form>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CustomerSupport;
