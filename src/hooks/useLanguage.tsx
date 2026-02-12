import { createContext, useContext, useState, ReactNode } from "react";

export type Language = "en" | "ta" | "hi";

const translations: Record<string, Record<Language, string>> = {
  // Header
  "nav.home": { en: "Home", ta: "முகப்பு", hi: "होम" },
  "nav.bus": { en: "Bus", ta: "பேருந்து", hi: "बस" },
  "nav.cab": { en: "Cab", ta: "கேப்", hi: "कैब" },
  "nav.car_rental": { en: "Car Rental", ta: "கார் வாடகை", hi: "कार किराया" },
  "nav.flights": { en: "Flights", ta: "விமானம்", hi: "उड़ानें" },
  "nav.track": { en: "Track", ta: "நிலை", hi: "ट्रैक" },
  "nav.my_bookings": { en: "My Bookings", ta: "என் புக்கிங்", hi: "मेरी बुकिंग" },
  "nav.support": { en: "Support", ta: "உதவி", hi: "सहायता" },
  "nav.analytics": { en: "Analytics", ta: "பகுப்பாய்வு", hi: "विश्लेषण" },

  // Hero
  "hero.title": { en: "Travel Tamil Nadu", ta: "தமிழ்நாடு பயணம்", hi: "तमिलनाडु यात्रा" },
  "hero.subtitle": { en: "Book your journey across Tamil Nadu", ta: "தமிழ்நாடு முழுவதும் பயணம் புக் செய்யுங்கள்", hi: "तमिलनाडु भर में यात्रा बुक करें" },
  "hero.search": { en: "Search", ta: "தேடு", hi: "खोजें" },
  "hero.from": { en: "From", ta: "எங்கிருந்து", hi: "कहाँ से" },
  "hero.to": { en: "To", ta: "எங்கு", hi: "कहाँ तक" },
  "hero.date": { en: "Date", ta: "தேதி", hi: "तारीख" },

  // Booking
  "booking.book_now": { en: "Book Now", ta: "இப்போதே புக் செய்", hi: "अभी बुक करें" },
  "booking.select_seat": { en: "Select Seat", ta: "இருக்கை தேர்வு", hi: "सीट चुनें" },
  "booking.total": { en: "Total", ta: "மொத்தம்", hi: "कुल" },
  "booking.pay": { en: "Pay", ta: "பணம் செலுத்து", hi: "भुगतान" },
  "booking.confirmed": { en: "Confirmed", ta: "உறுதி செய்யப்பட்டது", hi: "पुष्टि" },

  // Analytics
  "analytics.title": { en: "Trip Analytics", ta: "பயண பகுப்பாய்வு", hi: "यात्रा विश्लेषण" },
  "analytics.total_trips": { en: "Total Trips", ta: "மொத்த பயணங்கள்", hi: "कुल यात्राएँ" },
  "analytics.total_spent": { en: "Total Spent", ta: "மொத்த செலவு", hi: "कुल खर्च" },
  "analytics.savings": { en: "Total Savings", ta: "மொத்த சேமிப்பு", hi: "कुल बचत" },
  "analytics.favorite_route": { en: "Favorite Route", ta: "பிடித்த பாதை", hi: "पसंदीदा मार्ग" },
  "analytics.monthly_spending": { en: "Monthly Spending", ta: "மாதாந்த செலவு", hi: "मासिक खर्च" },
  "analytics.by_type": { en: "Trips by Type", ta: "வகை வாரியாக பயணம்", hi: "प्रकार अनुसार" },

  // Loyalty
  "loyalty.points": { en: "Loyalty Points", ta: "விசுவாச புள்ளிகள்", hi: "लॉयल्टी पॉइंट्स" },
  "loyalty.earned": { en: "Earned", ta: "பெற்றது", hi: "अर्जित" },
  "loyalty.redeemed": { en: "Redeemed", ta: "பயன்படுத்தியது", hi: "रिडीम किया" },
  "loyalty.available": { en: "Available", ta: "கிடைக்கும்", hi: "उपलब्ध" },

  // Common
  "common.loading": { en: "Loading...", ta: "ஏற்றுகிறது...", hi: "लोड हो रहा है..." },
  "common.no_data": { en: "No data available", ta: "தகவல் இல்லை", hi: "कोई डेटा नहीं" },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: (key: string) => key,
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("language") as Language;
    return saved || "en";
  });

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
  };

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
