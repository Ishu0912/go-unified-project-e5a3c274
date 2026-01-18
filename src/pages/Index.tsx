import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import BookingTabs from "@/components/BookingTabs";
import LiveTracking from "@/components/LiveTracking";
import AIAssistant from "@/components/AIAssistant";
import SOSButton from "@/components/SOSButton";
import VoiceButton from "@/components/VoiceButton";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <BookingTabs />
      <LiveTracking />
      
      {/* Footer */}
      <footer className="bg-ocean-dark text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold to-secondary flex items-center justify-center">
              <span className="text-ocean-dark font-bold text-lg">G</span>
            </div>
            <h3 className="font-display text-2xl font-bold">GO UNIFIED</h3>
          </div>
          <p className="text-white/60 mb-6">Your trusted travel partner across Tamil Nadu</p>
          <p className="text-white/40 text-sm">© 2026 GO UNIFIED. All rights reserved.</p>
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
