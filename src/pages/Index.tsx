import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import BookingTabs from "@/components/BookingTabs";
import GoogleMapTracking from "@/components/GoogleMapTracking";
import AIAssistant from "@/components/AIAssistant";
import SOSButton from "@/components/SOSButton";
import VoiceButton from "@/components/VoiceButton";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Instagram, Headphones, MessageSquareWarning } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <BookingTabs />
      <GoogleMapTracking />
      
      {/* Footer */}
      <footer className="bg-ocean-dark text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
            {/* Brand & Address */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold to-secondary flex items-center justify-center">
                  <span className="text-ocean-dark font-bold text-lg">G</span>
                </div>
                <h3 className="font-display text-2xl font-bold">GO UNIFIED</h3>
              </div>
              <p className="text-white/60 mb-4">Your trusted travel partner across Tamil Nadu</p>
              <div className="space-y-2 text-white/70 text-sm">
                <p className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-gold" />
                  12, Anna Nagar, Chennai
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 shrink-0 text-gold" />
                  044-45820258
                </p>
                <a
                  href="https://instagram.com/go_unifed"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-gold transition-colors"
                >
                  <Instagram className="w-4 h-4 shrink-0 text-gold" />
                  @go_unifed
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-2 text-white/60 text-sm">
                <li><a href="#home" className="hover:text-gold transition-colors">Home</a></li>
                <li><a href="#booking" className="hover:text-gold transition-colors">Book a Ride</a></li>
                <li><a href="#track" className="hover:text-gold transition-colors">Live Tracking</a></li>
                <li><Link to="/bookings" className="hover:text-gold transition-colors">My Bookings</Link></li>
                <li><Link to="/analytics" className="hover:text-gold transition-colors">Trip Analytics</Link></li>
              </ul>
            </div>

            {/* Customer Support */}
            <div>
              <h4 className="font-semibold text-lg mb-4">Customer Support</h4>
              <div className="space-y-3">
                <Link
                  to="/support"
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                >
                  <Headphones className="w-5 h-5 text-gold" />
                  <div>
                    <p className="text-sm font-medium">Help Center</p>
                    <p className="text-xs text-white/50">Get help with your bookings</p>
                  </div>
                </Link>
                <Link
                  to="/support?tab=complaint"
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                >
                  <MessageSquareWarning className="w-5 h-5 text-destructive" />
                  <div>
                    <p className="text-sm font-medium">Raise a Complaint</p>
                    <p className="text-xs text-white/50">We'll resolve it quickly</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 text-center">
            <p className="text-white/40 text-sm">© 2026 GO UNIFIED. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Floating Components */}
      <AIAssistant />
      <SOSButton />
      <VoiceButton variant="floating" />
    </div>
  );
};

export default Index;
