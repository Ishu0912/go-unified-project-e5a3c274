# GO UNIFIED — Project Documentation
## Tamil Nadu Unified Travel Booking Platform

**Version:** 1.0  
**Date:** February 2026  
**Platform:** Web Application (React + Vite)  
**Live URL:** https://id-preview--5411c67f-eebd-4746-a2d2-f507df01594d.lovable.app

---

# TABLE OF CONTENTS

| Section | Page |
|---------|------|
| **PART I — EXECUTIVE OVERVIEW** | |
| 1. Project Overview | 3 |
| 2. Vision & Mission | 4 |
| 3. Key Features Summary | 5 |
| 4. Target Audience | 6 |
| **PART II — TECHNICAL ARCHITECTURE** | |
| 5. Technology Stack | 7 |
| 6. Project Structure | 9 |
| 7. Design System & Theming | 12 |
| 8. Routing Architecture | 16 |
| 9. State Management | 17 |
| **PART III — FRONTEND COMPONENTS** | |
| 10. Header & Navigation | 18 |
| 11. Hero Section | 20 |
| 12. Booking System (BookingTabs) | 22 |
| 13. Bus Seat Selector | 28 |
| 14. Payment Modal | 33 |
| 15. Enhanced Ticket (E-Ticket) | 36 |
| 16. Google Maps Live Tracking | 39 |
| 17. AI Travel Assistant | 42 |
| 18. SOS Emergency System | 45 |
| 19. Voice Assistant | 50 |
| 20. User Menu & Authentication | 54 |
| 21. Theme Toggle (Dark Mode) | 57 |
| 22. Language Selector (i18n) | 58 |
| **PART IV — PAGES** | |
| 23. Home Page (Index) | 60 |
| 24. Authentication Page | 61 |
| 25. My Bookings Page | 63 |
| 26. Profile Settings Page | 66 |
| 27. Trip Analytics Page | 68 |
| 28. Not Found (404) Page | 70 |
| **PART V — BACKEND & DATABASE** | |
| 29. Database Schema | 71 |
| 30. Row-Level Security (RLS) Policies | 74 |
| 31. Database Functions | 77 |
| 32. Edge Functions (Backend APIs) | 78 |
| **PART VI — CUSTOM HOOKS** | |
| 33. useAuth Hook | 82 |
| 34. useBooking Hook | 84 |
| 35. useLoyaltyPoints Hook | 86 |
| 36. useEmergencyContacts Hook | 87 |
| 37. useRealtimeSeats Hook | 88 |
| 38. useReviews Hook | 89 |
| 39. useVoiceAssistant Hook | 90 |
| 40. useLanguage Hook | 91 |
| **PART VII — UTILITIES & CONFIGURATION** | |
| 41. Ticket Download Utility | 92 |
| 42. Tailwind Configuration | 93 |
| 43. Vite Configuration | 94 |
| 44. Environment Variables | 94 |
| **PART VIII — DEPLOYMENT & SECURITY** | |
| 45. Deployment Guide | 95 |
| 46. Security Architecture | 96 |
| 47. Future Roadmap | 97 |

---

# PART I — EXECUTIVE OVERVIEW

---

## 1. Project Overview

**GO UNIFIED** is a comprehensive, multi-modal travel booking platform exclusively designed for Tamil Nadu, India. The platform enables users to book buses, cabs, car rentals, and flights across 10+ Tamil Nadu cities with real-time seat tracking, AI-powered assistance, women safety features, and a loyalty rewards system.

### Key Highlights
- **Multi-modal transport:** Bus, Cab, Car Rental, Flight booking in one platform
- **Real-time tracking:** Google Maps integration with live vehicle tracking
- **AI Assistant:** Powered by Google Gemini for travel recommendations
- **Women Safety:** SOS emergency system with SMS alerts, WhatsApp sharing, and GPS tracking
- **Voice Commands:** Natural language voice navigation in English and Tamil
- **Smart Pricing:** Distance-based pricing (₹1/km for buses) with student & early-user discounts
- **Loyalty System:** Points earned on every booking, redeemable for future discounts
- **Multi-language:** English, Tamil (தமிழ்), and Hindi (हिन्दी) support
- **Dark Mode:** Full dark/light theme toggle
- **E-Tickets:** Downloadable HTML tickets with QR codes

---

## 2. Vision & Mission

### Vision
To become Tamil Nadu's #1 unified travel platform, offering seamless multi-modal transportation with safety-first design.

### Mission
- Simplify travel booking across all transport modes in Tamil Nadu
- Prioritize women's safety with emergency SOS features
- Make travel accessible through voice commands and multi-language support
- Reward loyal travelers with points and discounts

---

## 3. Key Features Summary

| Feature | Status | Description |
|---------|--------|-------------|
| Bus Booking | ✅ Live | Real-time seat selection, 3 bus types, women-only seats |
| Cab Booking | ✅ Live | 4 cab types (Mini, Sedan, SUV, Premium) |
| Car Rental | ✅ Live | 4 vehicle categories with daily pricing |
| Flight Booking | ✅ Live | Economy, Business, First Class |
| Live Tracking | ✅ Live | Google Maps embed with real-time progress |
| AI Assistant | ✅ Live | Gemini-powered chatbot for travel help |
| SOS System | ✅ Live | SMS, WhatsApp, browser notifications, GPS |
| Voice Commands | ✅ Live | Speech recognition with Tamil support |
| Loyalty Points | ✅ Live | 10% of booking price as points |
| Student Discount | ✅ Live | 10% off for verified students |
| Early User Discount | ✅ Live | 15% off for first 3 bookings |
| E-Ticket Download | ✅ Live | HTML ticket with QR code |
| Dark Mode | ✅ Live | Full dark/light theme |
| Multi-language | ✅ Live | EN, TA, HI |
| Email Notifications | ✅ Live | Booking confirmation, reminders, SOS |
| Trip Analytics | ✅ Live | Charts, spending analysis, loyalty dashboard |
| Reviews & Ratings | ✅ Live | Star ratings on past trips |
| Payment Gateway | 🔲 Planned | Razorpay integration |

---

## 4. Target Audience

| Segment | Description |
|---------|-------------|
| **Daily Commuters** | People traveling between Tamil Nadu cities for work |
| **Students** | College students eligible for 10% discount |
| **Tourists** | Visitors exploring Tamil Nadu destinations |
| **Women Travelers** | Safety-focused features for solo women travelers |
| **Business Travelers** | Premium cab and flight booking options |

---

# PART II — TECHNICAL ARCHITECTURE

---

## 5. Technology Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | 18.3.1 | UI library |
| **TypeScript** | Latest | Type safety |
| **Vite** | Latest | Build tool & dev server |
| **Tailwind CSS** | Latest | Utility-first styling |
| **Framer Motion** | 12.26.2 | Animations & transitions |
| **React Router DOM** | 6.30.1 | Client-side routing |
| **TanStack React Query** | 5.83.0 | Server state management |
| **shadcn/ui** | Latest | UI component library |
| **Recharts** | 2.15.4 | Charts & data visualization |
| **Lucide React** | 0.462.0 | Icon library |
| **Zod** | 3.25.76 | Schema validation |
| **React Hook Form** | 7.61.1 | Form handling |
| **qrcode.react** | 4.2.0 | QR code generation |

### Backend (Lovable Cloud / Supabase)
| Technology | Purpose |
|-----------|---------|
| **Supabase (PostgreSQL)** | Database with RLS policies |
| **Supabase Auth** | Email-based authentication |
| **Supabase Storage** | Avatar/profile image storage |
| **Supabase Realtime** | Live seat availability updates |
| **Edge Functions (Deno)** | Serverless backend logic |
| **Lovable AI Gateway** | AI chatbot (Gemini model) |

### External Services
| Service | Purpose |
|---------|---------|
| **Google Maps Embed API** | Map display & directions |
| **Twilio** | SOS SMS alerts |
| **Resend** | Transactional emails |
| **Web Speech API** | Voice recognition |
| **SpeechSynthesis API** | Text-to-speech responses |

---

## 6. Project Structure

```
go-unified/
├── public/
│   ├── favicon.ico
│   ├── placeholder.svg
│   └── robots.txt
│
├── src/
│   ├── assets/
│   │   └── hero-tamilnadu.jpg          # Hero background image
│   │
│   ├── components/
│   │   ├── ui/                          # shadcn/ui components (50+ files)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── toast.tsx
│   │   │   └── ... (accordion, avatar, badge, etc.)
│   │   │
│   │   ├── AIAssistant.tsx              # Gemini-powered chat widget
│   │   ├── BookingTabs.tsx              # Main booking form (bus/cab/rental/flight)
│   │   ├── BusSeatSelector.tsx          # Interactive seat map with realtime
│   │   ├── EmergencyContactsManager.tsx # CRUD for emergency contacts
│   │   ├── EnhancedTicket.tsx           # Premium e-ticket display
│   │   ├── GoogleMapTracking.tsx        # Live tracking with Google Maps
│   │   ├── Header.tsx                   # Main navigation header
│   │   ├── HeroSection.tsx              # Landing hero with search
│   │   ├── LanguageSelector.tsx         # EN/TA/HI language switcher
│   │   ├── LiveTracking.tsx             # Tracking component
│   │   ├── NavLink.tsx                  # Navigation link component
│   │   ├── PaymentMethodSelector.tsx    # Payment method picker
│   │   ├── PaymentModal.tsx             # Payment flow (UPI/Card/NetBanking/Wallet)
│   │   ├── PremiumTicket.tsx            # Alternative ticket design
│   │   ├── ReviewModal.tsx              # Star rating & review submission
│   │   ├── SOSButton.tsx               # Emergency SOS system
│   │   ├── SOSNotification.tsx          # Push notification for SOS
│   │   ├── ThemeToggle.tsx              # Dark/Light mode switch
│   │   ├── UserMenu.tsx                 # User dropdown (avatar, bookings, settings)
│   │   └── VoiceButton.tsx              # Voice command trigger button
│   │
│   ├── hooks/
│   │   ├── useAuth.tsx                  # Authentication context & methods
│   │   ├── useBooking.tsx               # Booking CRUD & discount logic
│   │   ├── useEmergencyContacts.tsx      # Emergency contacts CRUD
│   │   ├── useLanguage.tsx              # i18n translations
│   │   ├── useLoyaltyPoints.tsx         # Points earn/redeem logic
│   │   ├── useRealtimeSeats.tsx         # Realtime seat availability
│   │   ├── useReviews.tsx               # Review CRUD
│   │   ├── useVoiceAssistant.tsx        # Speech recognition logic
│   │   ├── use-mobile.tsx               # Mobile viewport detection
│   │   └── use-toast.ts                 # Toast notification hook
│   │
│   ├── integrations/
│   │   └── supabase/
│   │       ├── client.ts                # Supabase client (auto-generated)
│   │       └── types.ts                 # Database types (auto-generated)
│   │
│   ├── lib/
│   │   └── utils.ts                     # Utility functions (cn, etc.)
│   │
│   ├── pages/
│   │   ├── Auth.tsx                     # Login/Signup page
│   │   ├── Index.tsx                    # Home page
│   │   ├── MyBookings.tsx               # Booking history & management
│   │   ├── NotFound.tsx                 # 404 page
│   │   ├── ProfileSettings.tsx          # Profile & student verification
│   │   └── TripAnalytics.tsx            # Analytics dashboard
│   │
│   ├── utils/
│   │   └── ticketDownload.ts            # HTML ticket generation & download
│   │
│   ├── App.tsx                          # Root component with routing
│   ├── App.css                          # Additional styles
│   ├── index.css                        # Design system tokens
│   └── main.tsx                         # Entry point
│
├── supabase/
│   ├── config.toml                      # Supabase project config
│   ├── functions/
│   │   ├── ai-assistant/
│   │   │   └── index.ts                 # AI chatbot edge function
│   │   ├── send-email/
│   │   │   ├── index.ts                 # Email notification function
│   │   │   └── deno.json                # Deno config for Resend
│   │   └── send-sos-sms/
│   │       └── index.ts                 # Twilio SOS SMS function
│   └── migrations/                      # Database migration files
│
├── tailwind.config.ts                   # Tailwind CSS configuration
├── vite.config.ts                       # Vite build configuration
├── tsconfig.json                        # TypeScript configuration
├── components.json                      # shadcn/ui configuration
└── package.json                         # Dependencies
```

---

## 7. Design System & Theming

### 7.1 Color Palette

The design system uses HSL-based CSS custom properties for full theme support.

#### Light Mode
| Token | HSL Value | Usage |
|-------|-----------|-------|
| `--primary` | `215 80% 25%` | Deep Ocean Blue — buttons, links, primary actions |
| `--secondary` | `38 90% 55%` | Temple Gold — accents, highlights, rewards |
| `--accent` | `16 85% 55%` | Coral Orange — CTAs, call-to-action buttons |
| `--destructive` | `0 72% 51%` | Safety Red — SOS, errors, warnings |
| `--success` | `142 70% 45%` | Green — confirmations, active states |
| `--gold` | `38 90% 55%` | Gold — premium elements, prices |
| `--ocean-light` | `200 80% 65%` | Light blue — gradients, secondary elements |
| `--ocean-dark` | `215 85% 18%` | Dark navy — hero backgrounds, footer |
| `--background` | `210 20% 98%` | Page background |
| `--foreground` | `215 50% 12%` | Text color |
| `--card` | `0 0% 100%` | Card backgrounds |
| `--muted` | `210 20% 94%` | Muted backgrounds |
| `--border` | `215 25% 88%` | Border color |

#### Dark Mode
| Token | HSL Value | Usage |
|-------|-----------|-------|
| `--background` | `215 50% 8%` | Dark page background |
| `--foreground` | `210 20% 95%` | Light text |
| `--primary` | `200 80% 60%` | Brighter blue for dark mode |
| `--card` | `215 45% 12%` | Dark card background |
| `--muted` | `215 40% 18%` | Dark muted background |
| `--border` | `215 40% 22%` | Dark border |

### 7.2 Typography

| Font | Weight Range | Usage |
|------|-------------|-------|
| **Poppins** | 300–800 | Body text, UI elements |
| **Playfair Display** | 600–700 | Headings (h1, h2, h3) |

### 7.3 Gradient System

```css
--gradient-hero: linear-gradient(135deg, ocean-dark → ocean-light → gold)
--gradient-primary: linear-gradient(135deg, primary → ocean-light)
--gradient-gold: linear-gradient(135deg, gold → coral)
--gradient-accent: linear-gradient(135deg, accent → warm-orange)
--gradient-glass: linear-gradient(135deg, white/15% → white/5%)
```

### 7.4 Shadow System

| Shadow | Usage |
|--------|-------|
| `--shadow-sm` | Subtle card elevation |
| `--shadow-md` | Standard card shadow |
| `--shadow-lg` | Modal/popup shadow |
| `--shadow-glow` | Gold glow effect for premium elements |
| `--shadow-accent` | Orange glow for CTA buttons |

### 7.5 Component Classes

| Class | Description |
|-------|-------------|
| `.glass-card` | Glassmorphism card (white/80 bg, backdrop-blur, border) |
| `.glass-dark` | Dark glassmorphism (black/20 bg) |
| `.gradient-text` | Gradient text effect (primary → ocean → gold) |
| `.btn-hero` | Hero CTA button with accent gradient & shadow |
| `.btn-glass` | Transparent glass button |
| `.input-premium` | Styled input with focus animation |
| `.card-hover` | Card with hover lift effect |
| `.pulse-glow` | Gold pulsing glow animation |
| `.float-animation` | Floating up/down animation |
| `.shimmer` | Loading shimmer effect |

### 7.6 Border Radius

Base radius: `0.75rem` (12px)

---

## 8. Routing Architecture

| Route | Component | Auth Required | Description |
|-------|-----------|---------------|-------------|
| `/` | `Index` | No | Home page with hero, booking, tracking |
| `/auth` | `Auth` | No | Login/signup (redirects if authenticated) |
| `/profile` | `ProfileSettings` | Yes | Profile photo, phone, student verification |
| `/bookings` | `MyBookings` | Yes | Booking history, download tickets, reviews |
| `/analytics` | `TripAnalytics` | Yes | Spending charts, loyalty points dashboard |
| `*` | `NotFound` | No | 404 page |

### Provider Hierarchy
```
QueryClientProvider
  └── AuthProvider
       └── LanguageProvider
            └── TooltipProvider
                 └── BrowserRouter
                      └── Routes
```

---

## 9. State Management

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Server State** | TanStack React Query | API data caching & sync |
| **Auth State** | React Context (AuthProvider) | User session, profile |
| **Language State** | React Context (LanguageProvider) | i18n translations |
| **Local State** | React useState | Component-level UI state |
| **Real-time State** | Supabase Realtime | Live seat availability |
| **Form State** | React Hook Form + Zod | Form validation |

---

# PART III — FRONTEND COMPONENTS

---

## 10. Header & Navigation

**File:** `src/components/Header.tsx`

### Description
Fixed-position glassmorphism header with responsive navigation, supporting desktop and mobile layouts.

### Features
- **Logo:** "GO UNIFIED" with gradient icon
- **Desktop Nav:** Home, Bus, Cab, Car Rental, Flights, Track — anchor links to sections
- **Quick Actions:** My Bookings, Analytics, Language Selector, Theme Toggle, Voice, SOS, Support, UserMenu
- **Mobile Nav:** Hamburger menu with AnimatePresence transitions
- **i18n:** All nav labels translated via `useLanguage()`

### Navigation Links
| Link | Target | Translation Key |
|------|--------|----------------|
| Home | `#home` | `nav.home` |
| Bus | `#booking` | `nav.bus` |
| Cab | `#booking` | `nav.cab` |
| Car Rental | `#booking` | `nav.car_rental` |
| Flights | `#booking` | `nav.flights` |
| Track | `#track` | `nav.track` |

### Child Components
- `VoiceButton` (variant="header")
- `UserMenu`
- `ThemeToggle`
- `LanguageSelector`

---

## 11. Hero Section

**File:** `src/components/HeroSection.tsx`

### Description
Full-screen hero section with Tamil Nadu landscape background, animated particles, quick search form, and statistics.

### Visual Elements
- **Background:** `hero-tamilnadu.jpg` with dual gradient overlays (left-to-right + bottom-to-top)
- **Particles:** 20 animated gold dots floating upward (Framer Motion)
- **Badge:** "Serving Tamil Nadu with Pride" with live indicator
- **Heading:** "Travel Tamil Nadu / Your Way" (gold accent)
- **Quick Search:** From, To, Date, Search button
- **Stats:** 500+ Routes, 10K+ Travelers, 50+ Cities, 24/7 Support
- **Scroll Indicator:** Animated bouncing scroll indicator

### Inputs
- From: Text input (placeholder: "Chennai")
- To: Text input (placeholder: "Madurai")
- Date: Date input
- Search: CTA button with arrow icon

---

## 12. Booking System (BookingTabs)

**File:** `src/components/BookingTabs.tsx` (599 lines)

### Description
The core booking engine with tabbed interface for 4 transport modes. Handles form inputs, price calculation, payment flow, and ticket generation.

### Transport Types

| Mode | Icon | Color Gradient | Pricing Model |
|------|------|---------------|---------------|
| Bus | 🚌 | Blue → Cyan | ₹1/km + service charge (₹30–75) |
| Cab | 🚗 | Yellow → Orange | ₹12–25/km based on cab type |
| Car Rental | 🚙 | Green → Emerald | ₹1,500–5,000/day based on vehicle |
| Flight | ✈️ | Purple → Pink | ₹8/km × class multiplier (1x–4x) |

### Supported Cities (10)
Chennai, Coimbatore, Madurai, Tiruchirappalli, Salem, Tirunelveli, Erode, Vellore, Thanjavur, Pondicherry

### Distance Matrix
Pre-defined city-to-city distances (in km) for all 10 cities. Example:
- Chennai → Madurai: 460 km
- Chennai → Coimbatore: 500 km
- Madurai → Coimbatore: 210 km

### Cab Types
| Type | Price/km | Capacity |
|------|---------|----------|
| Mini | ₹12 | 4 |
| Sedan | ₹15 | 4 |
| SUV | ₹20 | 6 |
| Premium | ₹25 | 4 |

### Rental Options
| Type | Price/Day | Capacity |
|------|----------|----------|
| Hatchback | ₹1,500 | 4 |
| Sedan | ₹2,500 | 4 |
| SUV | ₹3,500 | 7 |
| Luxury | ₹5,000 | 4 |

### Flight Classes
| Class | Multiplier |
|-------|-----------|
| Economy | 1x |
| Business | 2.5x |
| First Class | 4x |

### Booking Flow
1. User selects transport type (tab)
2. Fills form: From, To, Date, Passengers
3. For Bus: clicks "Search" → opens BusSeatSelector
4. For Cab/Rental/Flight: clicks "Book" → opens PaymentModal
5. Payment success → creates booking via `useBooking`
6. Shows EnhancedTicket with QR code

### Form Validation
- Origin and destination required & must be different
- Travel date required
- Login required (redirects to /auth if not logged in)

---

## 13. Bus Seat Selector

**File:** `src/components/BusSeatSelector.tsx` (641 lines)

### Description
Interactive bus seat selection with real-time availability, discount preview, emergency contacts setup, and payment integration.

### Bus Options (3 buses)

| Bus | Departure | Duration | Service Charge | Rating | Amenities |
|-----|-----------|----------|---------------|--------|-----------|
| GO UNIFIED Premium AC | 06:00 AM | 6h 30m | ₹50 | 4.8 | WiFi, AC, Entertainment |
| GO UNIFIED Express | 08:30 AM | 5h 30m | ₹30 | 4.5 | AC |
| GO UNIFIED Night Rider | 10:00 PM | 7h 30m | ₹75 | 4.9 | WiFi, AC, Entertainment |

### Pricing Formula
```
Seat Price = (Distance × ₹1/km) + Service Charge
Example: Chennai → Madurai = 460km × ₹1 + ₹50 = ₹510/seat
```

### Seat Layout
- **10 rows × 4 columns** = 40 seats total
- Seat IDs: A1–D10
- **Columns A & B:** Women-only seats (pink)
- **Columns C & D:** General seats (green)

### Seat Statuses
| Status | Color | Interaction |
|--------|-------|-------------|
| Available | Green | Clickable |
| Booked | Gray (disabled) | Not clickable |
| Selected | Primary blue | Toggleable |
| Women-only | Pink | Clickable (available) |

### Real-time Features
- Uses `useRealtimeSeats` hook for live seat updates
- Live indicator: "Live seat availability • Updates in real-time"
- Refresh button to manually refetch
- Supabase Realtime subscription on bookings table

### Discount Preview
Shows applicable discounts before booking:
- 🎉 Early User -15% (first 3 bookings platform-wide)
- 🎓 Student -10% (verified student status)
- Discounts stack (max 25% off)

### Emergency Contacts Setup
- Prompts users to set up emergency contacts before booking
- EmergencyContactsManager component embedded
- Max 5 contacts with photo, name, phone, relationship

---

## 14. Payment Modal

**File:** `src/components/PaymentModal.tsx`

### Description
Multi-step payment flow supporting 4 payment methods. Currently simulates payment processing (Razorpay integration planned).

### Payment Methods
| Method | Icon | Description |
|--------|------|-------------|
| UPI | 📱 | GPay, PhonePe, Paytm — requires valid UPI ID (`name@upi`) |
| Card | 💳 | Credit/Debit — 16-digit number, MM/YY expiry, 3-digit CVV |
| Net Banking | 🏦 | SBI, HDFC, ICICI, Axis, Kotak, PNB |
| Wallet | 👛 | GO UNIFIED Wallet (simulated ₹2,500 balance) |

### Payment Steps
1. **Select** — Choose payment method (2×2 grid)
2. **Details** — Enter payment-specific information
3. **Processing** — Animated spinner (simulated 2s delay)
4. **Success** — Animated checkmark → triggers `onSuccess` callback

### Validations
| Method | Validation |
|--------|-----------|
| UPI | Must contain `@` character |
| Card Number | Exactly 16 digits (auto-formatted with spaces) |
| Card Expiry | MM/YY format (regex validated) |
| Card CVV | Exactly 3 digits |
| Net Banking | Bank must be selected |

### Card Number Formatting
Auto-formats as `XXXX XXXX XXXX XXXX` while typing.

---

## 15. Enhanced Ticket (E-Ticket)

**File:** `src/components/EnhancedTicket.tsx`

### Description
Premium e-ticket display with passenger photo, QR code, discount details, and download/print capabilities.

### Ticket Layout
```
┌─────────────────────────────┐
│ Header (gradient blue)      │
│ ┌─────────┬──────────────┐  │
│ │ G Logo  │ Ticket ID    │  │
│ ├─────────┴──────────────┤  │
│ │ [Photo] Name           │  │
│ │         Phone          │  │
│ │         🎓 Student     │  │
│ └────────────────────────┘  │
├── ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ──┤
│ FROM ──── 📍 ──── TO       │
│                             │
│ Date | Departure | Seats    │
│ Bus Name                    │
│                             │
│ ⭐ Discounts Applied!       │
│ 🎉 Early User -15%          │
│ 🎓 Student -10%             │
│                             │
│ ┌─────────┬──────────────┐  │
│ │ [QR]    │  ₹510        │  │
│ │         │  ✓ Confirmed │  │
│ └─────────┴──────────────┘  │
│                             │
│ 🛡️ SOS: 112 | 181          │
│                             │
│ [Download] [Print]          │
└─────────────────────────────┘
```

### Ticket ID Format
`GOUNIFIED-XXXXXX` (6 random alphanumeric characters)

### Actions
- **Download:** Generates full HTML ticket file and downloads as `.html`
- **Print:** Opens new window with ticket HTML and triggers `window.print()`

---

## 16. Google Maps Live Tracking

**File:** `src/components/GoogleMapTracking.tsx`

### Description
Live vehicle tracking section with Google Maps embed, simulated vehicle movement, and journey progress visualization.

### Supported Cities (15)
Chennai, Coimbatore, Madurai, Tiruchirappalli, Salem, Tirunelveli, Erode, Vellore, Thanjavur, Pondicherry, Kanyakumari, Ooty, Kodaikanal, Rameswaram, Mahabalipuram

### Features
- **Search Box:** Enter ticket ID (GOUNIFIED-XXXXXX) to track
- **Google Maps Embed:** Displays driving directions between cities
- **Vehicle Indicator:** Animated vehicle icon with type color
- **Progress Bar:** Visual journey completion percentage
- **ETA:** Estimated time of arrival based on progress
- **Vehicle Legend:** Color-coded vehicle type icons

### Vehicle Colors
| Type | Color |
|------|-------|
| Bus | Blue (#3B82F6) |
| Cab | Yellow (#F59E0B) |
| Car Rental | Green (#10B981) |
| Flight | Purple (#8B5CF6) |

### Tracking Simulation
- Progress starts at 20–70% (random)
- Increases by 0.5% every 2 seconds
- Vehicle position linearly interpolated between cities

### Ticket ID Matching
1. Searches bookings by QR code data containing the ticket ID
2. Matches by booking ID substring
3. Falls back to most recent booking for demo purposes

---

## 17. AI Travel Assistant

**File:** `src/components/AIAssistant.tsx`

### Description
Floating chat widget powered by Google Gemini (via Lovable AI Gateway) for travel assistance.

### UI Elements
- **Trigger:** Floating blue circle (bottom-right) with MessageCircle icon
- **Chat Window:** 396px wide, glassmorphism card
- **Header:** Gradient blue with bot avatar, title, clear/close buttons
- **Quick Actions:** "Book Bus", "Track", "Help" chips
- **Messages:** Bubble-style messages with avatars
- **Input:** Text input with send button

### AI Configuration
- **Model:** `google/gemini-3-flash-preview`
- **System Prompt:** Tamil Nadu travel assistant persona
- **Context:** Last 10 messages sent for conversation history
- **Greeting:** "வணக்கம்! Welcome to GO UNIFIED!"

### Error Handling
- Retry up to 2 times on connection failure
- Fallback message suggesting voice commands or direct navigation
- Console error logging

### Edge Function
- **Endpoint:** `supabase/functions/ai-assistant/index.ts`
- **Auth:** `verify_jwt = false` (public access)
- **API:** Lovable AI Gateway (`ai.gateway.lovable.dev/v1/chat/completions`)

---

## 18. SOS Emergency System

**File:** `src/components/SOSButton.tsx` (403 lines)

### Description
Comprehensive women's safety system with multi-channel emergency alerts, GPS tracking, and emergency contacts management.

### Components
1. **SOSButton** — Floating red shield button (bottom-left)
2. **SOSNotification** — Push notification display
3. **EmergencyContactsManager** — CRUD for family contacts

### Features

#### Emergency Contacts
- Add up to 5 family contacts (name, phone, photo, relationship)
- Stored in `emergency_contacts` table with RLS
- Required before sending SOS alerts

#### GPS Location
- Uses `navigator.geolocation` with high accuracy
- Displays latitude, longitude, accuracy
- Shows map preview via Google Maps embed

#### Alert Channels (5)
| Channel | Method |
|---------|--------|
| **SMS** | Twilio API via edge function (fallback: native SMS app) |
| **WhatsApp** | `wa.me` deep link with pre-filled message |
| **Share** | `navigator.share()` API (fallback: clipboard) |
| **Browser Notification** | `Notification` API with require interaction |
| **In-App Notification** | SOSNotification component |

#### Predefined Quick Call Numbers
| Service | Number |
|---------|--------|
| Police | 100 |
| Women Helpline | 181 |
| Emergency | 112 |
| Ambulance | 108 |

#### SOS Message Format
```
🚨 SOS EMERGENCY ALERT 🚨

I need immediate help!

📍 My Location:
https://www.google.com/maps?q=LAT,LNG

Coordinates: LAT, LNG
Accuracy: Xm

⏰ Time: DD/MM/YYYY, HH:MM:SS AM/PM

Sent via GO UNIFIED Safety Feature
```

### Edge Function (send-sos-sms)
- **Endpoint:** `supabase/functions/send-sos-sms/index.ts`
- **Service:** Twilio SMS API
- **Auth:** `verify_jwt = false`
- **Required Secrets:** `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`
- **Fallback:** Opens native SMS app if Twilio fails

---

## 19. Voice Assistant

**Files:** `src/components/VoiceButton.tsx`, `src/hooks/useVoiceAssistant.tsx`

### Description
Natural language voice command system using Web Speech API with support for English, Tamil, and natural language variations.

### Supported Commands

| Command | Keywords (sample) | Action |
|---------|-------------------|--------|
| Book Bus | "book bus", "i want a bus", "பேருந்து வேண்டும்" | Scrolls to booking, clicks Bus tab |
| Book Cab | "book cab", "taxi", "கேப் புக்" | Scrolls to booking, clicks Cab tab |
| Book Flight | "flight", "airplane", "விமானம்" | Scrolls to booking, clicks Flight tab |
| Rent Car | "rent car", "car rental", "கார் வாடகை" | Scrolls to booking, clicks Rental tab |
| Emergency | "emergency", "sos", "help me", "ஆபத்து" | Opens SOS modal |
| Track | "track bus", "where is my bus", "எங்கே" | Scrolls to tracking section |
| My Bookings | "my bookings", "booking history", "என் புக்கிங்ஸ்" | Navigates to /bookings |
| Login | "login", "sign in", "உள்நுழை" | Navigates to /auth |
| Profile | "profile", "settings", "சுயவிவரம்" | Navigates to /profile |
| Go Home | "go home", "home page", "முகப்பு பக்கம்" | Navigates to / |

### Voice Recognition Settings
| Setting | Value |
|---------|-------|
| Language | `en-IN` (Indian English) |
| Continuous | `true` |
| Interim Results | `true` |
| Max Alternatives | 3 |

### Command Matching Algorithm
1. **Exact match** → Score 100 (immediate action)
2. **Contains keyword** → Score proportional to keyword length
3. **Partial match** → Score for inputs >3 characters
4. **Threshold:** Score must exceed 30 to execute

### Text-to-Speech Response
- Uses `SpeechSynthesis` API
- Language: `en-IN`
- Rate: 0.9, Pitch: 1
- Prefers Indian English voice if available

### Button Variants
| Variant | Location | Description |
|---------|----------|-------------|
| `header` | Top nav bar | Small button with Mic icon |
| `floating` | Bottom-left (fixed) | Circular button with wave animation feedback |

---

## 20. User Menu & Authentication

**File:** `src/components/UserMenu.tsx`

### Description
User dropdown menu with avatar, profile info, navigation links, student discount badge, and logout.

### States
1. **Not Logged In:** Shows "Login" button → navigates to `/auth`
2. **Logged In:** Shows avatar with initials → dropdown menu

### Dropdown Contents
- **User Info:** Avatar (with photo upload hover), name, email, phone
- **Menu Items:**
  - 🎫 My Bookings → `/my-bookings`
  - ⚙️ Profile Settings → `/profile`
- **Student Badge:** Shows if `profile.is_student` is true
- **Logout:** Red destructive button

### Avatar
- Falls back to initials from `full_name`
- Upload on hover (Camera icon overlay)
- Supports `uploadAvatar()` from useAuth

---

## 21. Theme Toggle (Dark Mode)

**File:** `src/components/ThemeToggle.tsx`

### Description
Toggle button for dark/light mode using `class` strategy on `<html>` element.

### Implementation
- Stores preference in `localStorage` key `"theme"`
- Defaults to system preference (`prefers-color-scheme: dark`)
- Toggles `.dark` class on `document.documentElement`
- Icons: Sun (light mode) / Moon (dark mode)

---

## 22. Language Selector (i18n)

**File:** `src/components/LanguageSelector.tsx`

### Description
Dropdown language picker supporting 3 languages.

### Languages
| Code | Label | Flag |
|------|-------|------|
| `en` | English | 🇬🇧 |
| `ta` | தமிழ் | 🇮🇳 |
| `hi` | हिन्दी | 🇮🇳 |

### Translation Hook (`useLanguage`)
- Context-based with `LanguageProvider`
- Stores preference in `localStorage` key `"language"`
- Translation keys organized by section:
  - `nav.*` — Navigation labels
  - `hero.*` — Hero section text
  - `analytics.*` — Analytics page labels
  - `loyalty.*` — Loyalty system labels
  - `common.*` — Common strings

---

# PART IV — PAGES

---

## 23. Home Page (Index)

**File:** `src/pages/Index.tsx`

### Layout
```
┌──────────────────────────────────┐
│ Header (fixed, glassmorphism)    │
├──────────────────────────────────┤
│ HeroSection (full-screen)        │
│ - Background image + overlays    │
│ - Quick search form              │
│ - Stats (500+ routes, etc.)      │
├──────────────────────────────────┤
│ BookingTabs (#booking)           │
│ - Bus / Cab / Rental / Flight    │
│ - Dynamic forms                  │
│ - Seat selection (bus)           │
├──────────────────────────────────┤
│ GoogleMapTracking (#track)       │
│ - Ticket ID search               │
│ - Google Maps embed              │
│ - Progress bar                   │
├──────────────────────────────────┤
│ Footer                           │
│ - Logo + "Your trusted partner"  │
│ - © 2026 GO UNIFIED              │
├──────────────────────────────────┤
│ Floating Components:             │
│ - AIAssistant (bottom-right)     │
│ - SOSButton (bottom-left)        │
│ - VoiceButton (bottom-left)      │
└──────────────────────────────────┘
```

---

## 24. Authentication Page

**File:** `src/pages/Auth.tsx`

### Description
Combined login/signup page with gradient background, form validation, and student discount promotion.

### Login Form
| Field | Type | Validation |
|-------|------|-----------|
| Email | email | Zod: valid email |
| Password | password | Zod: min 6 characters |

### Signup Form
| Field | Type | Validation |
|-------|------|-----------|
| Full Name | text | Zod: min 2 characters |
| Email | email | Zod: valid email |
| Password | password | Zod: min 6 characters |
| Phone | tel | Optional |
| Is Student | checkbox | Boolean (enables 10% discount) |

### Special Offers (shown on signup)
- First 3 users get 15% discount
- Students get extra 10% discount
- Discounts can be combined!

### Error Handling
- "Invalid login" → "Invalid email or password"
- "Already registered" → "Please login instead"
- Generic errors shown via toast

### Post-Signup
- Updates profile with phone and student status after signup
- Redirects to home page on success

---

## 25. My Bookings Page

**File:** `src/pages/MyBookings.tsx` (653 lines)

### Description
Comprehensive booking management page with filtering, ticket downloads, reviews, and trip tracking.

### Stats Cards (top)
| Card | Data |
|------|------|
| Total Bookings | `bookings.length` |
| Active Trips | Future date + confirmed status |
| Completed | Past date trips |

### Tabs
| Tab | Filter |
|-----|--------|
| All | All bookings |
| Active | Travel date ≥ today + confirmed |
| Past | Travel date < today |

### Booking Card Layout
```
┌──────┬──────────────────────────────────┐
│ Icon │ FROM ────── TO                    │
│ Type │ Date | Seats | Vehicle | ₹Price  │
│      │ [Review Stars] (past trips)      │
│      │ [Track] [Download] [Review]      │
└──────┴──────────────────────────────────┘
```

### Booking Detail View
- Full route display
- Vehicle information
- QR code display (QRCodeSVG)
- Discount breakdown
- Download & Print buttons
- Delete review option

### Actions
| Action | Available On |
|--------|-------------|
| Track Trip | Active trips |
| Download Ticket | All bookings |
| Write Review | Past trips (no existing review) |
| Edit Review | Past trips (has review) |
| View Details | All bookings |

---

## 26. Profile Settings Page

**File:** `src/pages/ProfileSettings.tsx`

### Description
Profile management with avatar upload, phone number, student verification, and account info.

### Sections

#### Profile Photo Card
- Large avatar (96×96px) with hover upload
- Name, email, student badge display
- File validation: max 5MB, image only
- Uploads to Supabase Storage `avatars` bucket

#### Phone Number Card
- Phone input with +91 format
- Regex validation: `^[+]?[\d\s-]{10,15}$`
- Save button (disabled if unchanged)

#### Student Verification Card
- **Not Verified:** Student ID input + Verify button
- **Verified:** Green badge showing ID, 10% OFF label, Remove option
- Student ID validation: 5–20 alphanumeric characters
- Simulated 1.5s verification delay

#### Account Information Card
- Email (read-only)
- Full Name (read-only)
- Member Since (formatted date)

---

## 27. Trip Analytics Page

**File:** `src/pages/TripAnalytics.tsx`

### Description
Data visualization dashboard for travel statistics, spending analysis, and loyalty rewards.

### Stats Cards (4)
| Card | Icon | Data Source |
|------|------|------------|
| Total Trips | TrendingUp | `bookings.length` |
| Total Spent | Wallet | Sum of `final_price` |
| Savings | Percent | Sum of `(base_price - final_price)` |
| Loyalty Points | Award | `loyaltyPoints.points` |

### Charts

#### Monthly Spending (Bar Chart)
- Groups bookings by month/year
- X-axis: Month abbreviation + year
- Y-axis: Amount in ₹
- Tooltip: ₹ formatted

#### Trips by Type (Pie Chart)
- Segments: bus, cab, car_rental, flight
- Colors: Navy, Gold, Orange, Green
- Labels: Type name + count

### Favorite Route
- Gradient card showing most-traveled route
- Example: "Chennai → Madurai" (5 trips)

### Loyalty Section
| Metric | Display |
|--------|---------|
| Total Earned | Green background |
| Total Redeemed | Orange background |
| Available | Blue background |
| Recent Activity | List of last 5 transactions |

---

## 28. Not Found (404) Page

**File:** `src/pages/NotFound.tsx`

Simple 404 page with "Page not found" message and home link.

---

# PART V — BACKEND & DATABASE

---

## 29. Database Schema

### Tables Overview

| Table | Rows RLS | Purpose |
|-------|----------|---------|
| `profiles` | User-scoped | User profile data (name, phone, student status, photo) |
| `bookings` | User-scoped | All travel bookings |
| `emergency_contacts` | User-scoped | SOS emergency contacts (max 5) |
| `loyalty_points` | User-scoped | User's point balance |
| `loyalty_transactions` | User-scoped | Points earn/redeem history |
| `reviews` | Public read / User write | Booking reviews & ratings |

### Table: `profiles`

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | No | gen_random_uuid() | Primary key |
| user_id | uuid | No | — | Auth user reference |
| full_name | text | Yes | — | Display name |
| phone | text | Yes | — | Phone number |
| photo_url | text | Yes | — | Avatar URL |
| is_student | boolean | Yes | false | Student verification |
| student_id | text | Yes | — | Student ID number |
| created_at | timestamptz | No | now() | Creation timestamp |
| updated_at | timestamptz | No | now() | Last update |

### Table: `bookings`

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | No | gen_random_uuid() | Primary key |
| user_id | uuid | No | — | Booking owner |
| booking_type | text | No | — | bus/cab/car_rental/flight |
| from_location | text | No | — | Origin city |
| to_location | text | No | — | Destination city |
| travel_date | date | No | — | Date of travel |
| seat_numbers | text[] | Yes | — | Selected seats (bus only) |
| vehicle_info | jsonb | Yes | — | Vehicle-specific metadata |
| base_price | numeric | No | — | Pre-discount price |
| discount_percentage | numeric | Yes | 0 | Applied discount % |
| final_price | numeric | No | — | After-discount price |
| is_student_discount | boolean | Yes | false | Student discount applied |
| is_early_user_discount | boolean | Yes | false | Early user discount applied |
| qr_code_data | text | Yes | — | JSON string for QR code |
| status | text | Yes | 'confirmed' | Booking status |
| created_at | timestamptz | No | now() | Creation timestamp |
| updated_at | timestamptz | No | now() | Last update |

#### `vehicle_info` JSONB Structure

**Bus:**
```json
{
  "bus_id": "1",
  "bus_name": "GO UNIFIED Premium AC",
  "departure": "06:00 AM",
  "arrival": "12:30 PM"
}
```

**Cab:**
```json
{
  "cab_type": "sedan",
  "distance": 460,
  "passengers": 2
}
```

**Car Rental:**
```json
{
  "rental_type": "suv",
  "pickup_time": "09:00",
  "return_date": "2026-02-20"
}
```

**Flight:**
```json
{
  "flight_class": "business",
  "passengers": 1
}
```

### Table: `emergency_contacts`

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | No | gen_random_uuid() |
| user_id | uuid | No | — |
| name | text | No | — |
| phone | text | No | — |
| photo_url | text | Yes | — |
| relationship | text | Yes | — |
| created_at | timestamptz | No | now() |
| updated_at | timestamptz | No | now() |

### Table: `loyalty_points`

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | No | gen_random_uuid() |
| user_id | uuid | No | — |
| points | integer | No | 0 |
| total_earned | integer | No | 0 |
| total_redeemed | integer | No | 0 |
| created_at | timestamptz | No | now() |
| updated_at | timestamptz | No | now() |

### Table: `loyalty_transactions`

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | No | gen_random_uuid() |
| user_id | uuid | No | — |
| points | integer | No | — |
| type | text | No | — |
| description | text | Yes | — |
| booking_id | uuid | Yes | — |
| created_at | timestamptz | No | now() |

**Foreign Keys:** `booking_id → bookings.id`

### Table: `reviews`

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | No | gen_random_uuid() |
| user_id | uuid | No | — |
| booking_id | uuid | No | — |
| rating | integer | No | — |
| review_text | text | Yes | — |
| created_at | timestamptz | No | now() |
| updated_at | timestamptz | No | now() |

**Foreign Keys:** `booking_id → bookings.id`

---

## 30. Row-Level Security (RLS) Policies

All tables have RLS enabled. Below is the complete policy matrix.

### `profiles`
| Operation | Policy | Expression |
|-----------|--------|------------|
| SELECT | Users can view own profile | `auth.uid() = user_id` |
| INSERT | Users can insert own profile | `auth.uid() = user_id` |
| UPDATE | Users can update own profile | `auth.uid() = user_id` |
| DELETE | ❌ Not allowed | — |

### `bookings`
| Operation | Policy | Expression |
|-----------|--------|------------|
| SELECT | Users can view own bookings | `auth.uid() = user_id` |
| INSERT | Users can insert own bookings | `auth.uid() = user_id` |
| UPDATE | Users can update own bookings | `auth.uid() = user_id` |
| DELETE | ❌ Not allowed | — |

### `emergency_contacts`
| Operation | Policy | Expression |
|-----------|--------|------------|
| SELECT | Users can view own | `auth.uid() = user_id` |
| INSERT | Users can insert own | `auth.uid() = user_id` |
| UPDATE | Users can update own | `auth.uid() = user_id` |
| DELETE | Users can delete own | `auth.uid() = user_id` |

### `loyalty_points`
| Operation | Policy | Expression |
|-----------|--------|------------|
| SELECT | Users can view own | `auth.uid() = user_id` |
| INSERT | Users can insert own | `auth.uid() = user_id` |
| UPDATE | Users can update own | `auth.uid() = user_id` |
| DELETE | ❌ Not allowed | — |

### `loyalty_transactions`
| Operation | Policy | Expression |
|-----------|--------|------------|
| SELECT | Users can view own | `auth.uid() = user_id` |
| INSERT | Users can insert own | `auth.uid() = user_id` |
| UPDATE | ❌ Not allowed | — |
| DELETE | ❌ Not allowed | — |

### `reviews`
| Operation | Policy | Expression |
|-----------|--------|------------|
| SELECT | Anyone can view | `true` |
| INSERT | Users can create for own bookings | `auth.uid() = user_id AND EXISTS(booking owned by user)` |
| UPDATE | Users can update own | `auth.uid() = user_id` |
| DELETE | Users can delete own | `auth.uid() = user_id` |

---

## 31. Database Functions

### `is_early_user()`
- **Returns:** boolean
- **Logic:** Checks if total platform bookings ≤ 3
- **Used for:** 15% early user discount

### `is_student_user(_user_id uuid)`
- **Returns:** boolean
- **Logic:** Checks `profiles.is_student` for given user
- **Used for:** 10% student discount

### `get_total_booking_count()`
- **Returns:** integer
- **Logic:** Returns count of all bookings in the platform
- **Used for:** Early user eligibility check

---

## 32. Edge Functions (Backend APIs)

### 32.1 AI Assistant

**Path:** `supabase/functions/ai-assistant/index.ts`  
**Auth:** Public (verify_jwt = false)

**Request:**
```json
POST /ai-assistant
{
  "messages": [
    { "role": "user", "content": "I want to travel from Chennai to Madurai" }
  ]
}
```

**Response:**
```json
{
  "content": "Great choice! Chennai to Madurai is a popular route..."
}
```

**Implementation:**
- Uses Lovable AI Gateway (`ai.gateway.lovable.dev`)
- Model: `google/gemini-3-flash-preview`
- System prompt defines Tamil Nadu travel assistant persona
- Supports multilingual conversation

### 32.2 Send Email

**Path:** `supabase/functions/send-email/index.ts`  
**Auth:** Public (verify_jwt = false)  
**Dependency:** Resend npm package

**Email Types:**

| Type | Subject | Trigger |
|------|---------|---------|
| `booking_confirmation` | 🎫 Booking Confirmed | After successful booking |
| `trip_reminder` | ⏰ Trip Reminder | Day before travel (planned) |
| `sos_alert` | 🚨 EMERGENCY SOS ALERT | SOS activation |
| `review_thanks` | ⭐ Thanks for Your Review! | After review submission |

**Request:**
```json
POST /send-email
{
  "to": "user@email.com",
  "type": "booking_confirmation",
  "data": {
    "bookingId": "GOUNIFIED-ABC123",
    "userName": "John",
    "from": "Chennai",
    "to": "Madurai",
    "travelDate": "2026-02-20",
    "finalPrice": "510.00"
  }
}
```

**Required Secret:** `RESEND_API_KEY`

### 32.3 Send SOS SMS

**Path:** `supabase/functions/send-sos-sms/index.ts`  
**Auth:** Public (verify_jwt = false)

**Request:**
```json
POST /send-sos-sms
{
  "phoneNumbers": ["+919876543210", "+919876543211"],
  "latitude": 13.0827,
  "longitude": 80.2707,
  "accuracy": 20,
  "userName": "Priya"
}
```

**Response:**
```json
{
  "message": "SOS alerts sent to 2/2 contacts",
  "results": [
    { "phone": "+919876543210", "success": true, "sid": "SMxxx" },
    { "phone": "+919876543211", "success": true, "sid": "SMyyy" }
  ]
}
```

**Required Secrets:**
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_PHONE_NUMBER`

**Phone Formatting:** Auto-prepends `+91` if not present, strips leading `0`.

---

# PART VI — CUSTOM HOOKS

---

## 33. useAuth Hook

**File:** `src/hooks/useAuth.tsx`

### Context Values
| Value | Type | Description |
|-------|------|-------------|
| `user` | `User \| null` | Supabase auth user |
| `session` | `Session \| null` | Current auth session |
| `profile` | `Profile \| null` | User profile from profiles table |
| `loading` | `boolean` | Initial auth loading state |
| `signUp` | `function` | Register with email, password, name |
| `signIn` | `function` | Login with email, password |
| `signOut` | `function` | Logout and clear state |
| `updateProfile` | `function` | Update profile fields |
| `uploadAvatar` | `function` | Upload avatar to storage |

### Auth Flow
1. `onAuthStateChange` listener set up on mount
2. Existing session checked via `getSession()`
3. Profile fetched on auth state change (deferred with setTimeout)
4. Session persisted in localStorage

### Avatar Upload
- Bucket: `avatars`
- Path: `{user_id}/avatar.{ext}`
- Upsert: true (overwrites existing)
- Auto-updates profile `photo_url` after upload

---

## 34. useBooking Hook

**File:** `src/hooks/useBooking.tsx`

### Methods
| Method | Description |
|--------|-------------|
| `createBooking(data)` | Creates booking with discount calculation, email, loyalty points |
| `getBookings()` | Fetches all user bookings (descending by date) |
| `calculateDiscount()` | Returns applicable discount info |
| `loading` | Booking creation loading state |

### Discount Calculation
```
1. Check is_early_user() → +15%
2. Check is_student_user(user_id) → +10%
3. Total discount = sum (max 25%)
4. Final price = base_price × (1 - discount/100)
```

### QR Code Data (JSON)
```json
{
  "booking_id": "uuid",
  "user_id": "uuid",
  "user_name": "Name",
  "user_phone": "Phone",
  "type": "bus",
  "from": "Chennai",
  "to": "Madurai",
  "date": "2026-02-20",
  "seats": ["A1", "A2"],
  "price": 510,
  "timestamp": "ISO string"
}
```

### Post-Booking Actions
1. **Email:** Sends booking confirmation via `send-email` edge function
2. **Loyalty Points:** Awards `floor(finalPrice × 0.1)` points

---

## 35. useLoyaltyPoints Hook

**File:** `src/hooks/useLoyaltyPoints.tsx`

### State
| Value | Type | Description |
|-------|------|-------------|
| `loyaltyPoints` | `{points, total_earned, total_redeemed}` | Current balance |
| `transactions` | `Array` | Transaction history |

### Methods
| Method | Description |
|--------|-------------|
| `earnPoints(amount, description, bookingId)` | Add points + create transaction |
| `redeemPoints(amount, description)` | Deduct points (if sufficient balance) |
| `fetchPoints()` | Refresh points data |
| `fetchTransactions()` | Refresh transaction history |

### Points Earning Logic
- Creates or updates `loyalty_points` record (upsert)
- Increments `points` and `total_earned`
- Creates `loyalty_transactions` entry with type "earned"

---

## 36. useEmergencyContacts Hook

**File:** `src/hooks/useEmergencyContacts.tsx`

### Methods
| Method | Description |
|--------|-------------|
| `fetchContacts()` | Load user's emergency contacts |
| `addContact(data)` | Add contact (max 5 limit) |
| `removeContact(id)` | Delete contact |
| `updateContact(id, updates)` | Update contact fields |

---

## 37. useRealtimeSeats Hook

**File:** `src/hooks/useRealtimeSeats.tsx`

### Parameters
| Param | Type | Description |
|-------|------|-------------|
| `busId` | string | Bus identifier |
| `travelDate` | string | Travel date |
| `from` | string | Origin city |
| `to` | string | Destination city |

### Returns
| Value | Type | Description |
|-------|------|-------------|
| `bookedSeats` | `string[]` | List of booked seat IDs |
| `loading` | `boolean` | Fetch loading state |
| `refetch` | `function` | Manual refresh |

### Realtime Subscription
- Channel: `seats-{busId}-{travelDate}`
- Event: `postgres_changes` on `bookings` table
- Filter: `travel_date = travelDate`
- Action: Refetches all booked seats on any change

---

## 38. useReviews Hook

**File:** `src/hooks/useReviews.tsx`

### Methods
| Method | Description |
|--------|-------------|
| `getReviewForBooking(bookingId)` | Get single review for a booking |
| `getReviewsForUser(userId)` | Get all reviews by user |
| `deleteReview(reviewId)` | Delete a review |
| `getAverageRating()` | Calculate platform-wide average rating |

---

## 39. useVoiceAssistant Hook

**File:** `src/hooks/useVoiceAssistant.tsx`

### Returns
| Value | Type | Description |
|-------|------|-------------|
| `isListening` | boolean | Currently recording |
| `isSupported` | boolean | Browser supports Speech API |
| `transcript` | string | Final recognized text |
| `interimTranscript` | string | In-progress text |
| `startListening` | function | Begin recording |
| `stopListening` | function | Stop recording |
| `toggleListening` | function | Toggle on/off |
| `speak` | function | Text-to-speech output |

### 11 Voice Commands
Supports English, Tamil keywords, and natural language variations. See Section 19 for complete command list.

---

## 40. useLanguage Hook

**File:** `src/hooks/useLanguage.tsx`

### Supported Languages
- `en` — English (default)
- `ta` — Tamil (தமிழ்)
- `hi` — Hindi (हिन्दी)

### Translation Keys
| Key | EN | TA | HI |
|-----|----|----|-----|
| `nav.home` | Home | முகப்பு | होम |
| `nav.bus` | Bus | பேருந்து | बस |
| `nav.cab` | Cab | கேப் | कैब |
| `nav.car_rental` | Car Rental | கார் வாடகை | कार किराया |
| `nav.flights` | Flights | விமானங்கள் | उड़ानें |
| `nav.track` | Track | கண்காணி | ट्रैक |
| `nav.my_bookings` | My Bookings | என் புக்கிங்ஸ் | मेरी बुकिंग |
| `nav.analytics` | Analytics | பகுப்பாய்வு | विश्लेषण |
| `nav.support` | Support | ஆதரவு | सहायता |
| `analytics.title` | Trip Analytics | பயண பகுப்பாய்வு | यात्रा विश्लेषण |
| `analytics.total_trips` | Total Trips | மொத்த பயணங்கள் | कुल यात्राएं |
| `analytics.total_spent` | Total Spent | மொத்த செலவு | कुल खर्च |
| `analytics.savings` | Savings | சேமிப்பு | बचत |
| `analytics.monthly_spending` | Monthly Spending | மாதாந்திர செலவு | मासिक खर्च |
| `analytics.by_type` | Trips by Type | வகை வாரியாக | प्रकार अनुसार |
| `analytics.favorite_route` | Favorite Route | பிடித்த வழி | पसंदीदा मार्ग |
| `loyalty.points` | Loyalty Points | விசுவாச புள்ளிகள் | लॉयल्टी अंक |
| `loyalty.earned` | Earned | பெற்றது | अर्जित |
| `loyalty.redeemed` | Redeemed | பயன்படுத்தியது | भुनाया |
| `loyalty.available` | Available | கிடைக்கும் | उपलब्ध |
| `common.no_data` | No data available | தரவு இல்லை | कोई डेटा नहीं |

---

# PART VII — UTILITIES & CONFIGURATION

---

## 41. Ticket Download Utility

**File:** `src/utils/ticketDownload.ts`

### Functions
| Function | Description |
|----------|-------------|
| `generateTicketHTML(data)` | Creates complete HTML document for ticket |
| `downloadTicket(data)` | Downloads ticket as `.html` file |
| `printTicket(data)` | Opens new window and triggers print |

### Generated HTML Features
- Responsive design (max-width 500px)
- Print-friendly styles (`@media print`)
- Gradient header with GO UNIFIED branding
- Passenger photo or initials avatar
- Route visualization with dots and lines
- Discount badges (gold/cyan)
- QR code placeholder
- Price breakdown with strikethrough
- SOS emergency information
- Footer with electronic ticket disclaimer

---

## 42. Tailwind Configuration

**File:** `tailwind.config.ts`

### Custom Extensions
- **Fonts:** `poppins` (body), `display` (headings — Playfair Display)
- **Colors:** Full semantic token system (see Section 7)
- **Border Radius:** `lg` = 12px, `md` = 10px, `sm` = 8px
- **Box Shadows:** `glow` (gold), `accent` (orange)
- **Animations:** `fade-in`, `slide-in-right`, `scale-in`, `accordion-down/up`
- **Dark Mode:** Class-based strategy

---

## 43. Vite Configuration

- **Port:** Default (5173)
- **Path Alias:** `@` → `src/`
- **Plugins:** React, TanStack Router (if applicable)

---

## 44. Environment Variables

| Variable | Source | Description |
|----------|--------|-------------|
| `VITE_SUPABASE_URL` | Auto-generated | Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Auto-generated | Supabase anon key |
| `VITE_SUPABASE_PROJECT_ID` | Auto-generated | Supabase project ID |

### Edge Function Secrets
| Secret | Service | Purpose |
|--------|---------|---------|
| `LOVABLE_API_KEY` | Lovable AI Gateway | AI assistant |
| `RESEND_API_KEY` | Resend | Email notifications |
| `TWILIO_ACCOUNT_SID` | Twilio | SOS SMS |
| `TWILIO_AUTH_TOKEN` | Twilio | SOS SMS |
| `TWILIO_PHONE_NUMBER` | Twilio | SOS SMS sender |

---

# PART VIII — DEPLOYMENT & SECURITY

---

## 45. Deployment Guide

### Frontend
1. Code changes are live-previewed automatically
2. Click **Publish** in Lovable to deploy to production
3. Custom domain can be configured in Settings → Domains

### Backend
- Database migrations deploy automatically on approval
- Edge functions deploy automatically on code changes
- No manual deployment required

### URLs
- **Preview:** `https://id-preview--5411c67f-eebd-4746-a2d2-f507df01594d.lovable.app`
- **Production:** Set via Publish

---

## 46. Security Architecture

### Authentication
- Email/password authentication via Supabase Auth
- Session persisted in localStorage
- Auto-refresh tokens enabled
- Protected routes redirect to `/auth`

### Database Security
- All tables have RLS enabled
- User data scoped to `auth.uid() = user_id`
- No delete access on critical tables (profiles, bookings, loyalty_points)
- Reviews allow public read for transparency

### Edge Function Security
- Functions set to `verify_jwt = false` for public access
- Sensitive operations still require user context
- Twilio/Resend secrets stored in secure environment

### Client-Side Security
- API keys stored in environment variables (not hardcoded)
- No sensitive data exposed in client bundle
- Google Maps API key is publishable (domain-restricted)

---

## 47. Future Roadmap

| Feature | Priority | Status |
|---------|----------|--------|
| Razorpay Payment Gateway | High | 🔲 Planned |
| Push Notifications | Medium | 🔲 Planned |
| Group Booking | Medium | 🔲 Planned |
| Referral System | Medium | 🔲 Planned |
| Offline Mode (PWA) | Low | 🔲 Planned |
| Multi-city Itinerary | Low | 🔲 Planned |
| Hotel Booking Integration | Low | 🔲 Planned |
| Rating-based Bus Sorting | Low | 🔲 Planned |

---

# END OF DOCUMENTATION

**GO UNIFIED** — Tamil Nadu's Unified Travel Platform  
© 2026 GO UNIFIED. All rights reserved.

*Document generated: February 13, 2026*  
*Total sections: 47 | Total components: 20+ | Total hooks: 8 | Total edge functions: 3*
