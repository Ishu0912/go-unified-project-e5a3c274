import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, Shield, Ticket, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import VoiceButton from "./VoiceButton";
import UserMenu from "./UserMenu";
import ThemeToggle from "./ThemeToggle";
import LanguageSelector from "./LanguageSelector";
import { useLanguage } from "@/hooks/useLanguage";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useLanguage();

  const navLinks = [
    { name: t("nav.home"), href: "#home" },
    { name: t("nav.bus"), href: "#booking" },
    { name: t("nav.cab"), href: "#booking" },
    { name: t("nav.car_rental"), href: "#booking" },
    { name: t("nav.flights"), href: "#booking" },
    { name: t("nav.track"), href: "#track" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="glass-card mx-4 mt-4 rounded-2xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-ocean-light flex items-center justify-center">
                <span className="text-white font-bold text-lg">G</span>
              </div>
              <div>
                <h1 className="font-display text-xl font-bold text-primary">
                  GO UNIFIED
                </h1>
                <p className="text-xs text-muted-foreground -mt-1">Tamil Nadu</p>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
                >
                  {link.name}
                </motion.a>
              ))}
            </nav>

            {/* Actions */}
            <div className="hidden lg:flex items-center gap-2">
              <Link to="/bookings">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Ticket className="w-4 h-4" />
                  {t("nav.my_bookings")}
                </Button>
              </Link>
              <Link to="/analytics">
                <Button variant="ghost" size="sm" className="gap-2">
                  <BarChart3 className="w-4 h-4" />
                  {t("nav.analytics")}
                </Button>
              </Link>
              <LanguageSelector />
              <ThemeToggle />
              <VoiceButton variant="header" />
              <Button
                variant="destructive"
                size="sm"
                className="bg-destructive hover:bg-destructive/90"
                data-sos-button
              >
                <Shield className="w-4 h-4 mr-2" />
                SOS
              </Button>
              <Button variant="ghost" size="sm">
                <Phone className="w-4 h-4 mr-2" />
                {t("nav.support")}
              </Button>
              <UserMenu />
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center gap-2">
              <LanguageSelector />
              <ThemeToggle />
              <button
                className="p-2"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6 text-foreground" />
                ) : (
                  <Menu className="w-6 h-6 text-foreground" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden glass-card mx-4 mt-2 rounded-2xl p-6"
          >
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-foreground/80 hover:text-primary transition-colors py-2"
                >
                  {link.name}
                </a>
              ))}
              <Link
                to="/bookings"
                onClick={() => setIsMenuOpen(false)}
                className="text-foreground/80 hover:text-primary transition-colors py-2 flex items-center gap-2"
              >
                <Ticket className="w-4 h-4" />
                {t("nav.my_bookings")}
              </Link>
              <Link
                to="/analytics"
                onClick={() => setIsMenuOpen(false)}
                className="text-foreground/80 hover:text-primary transition-colors py-2 flex items-center gap-2"
              >
                <BarChart3 className="w-4 h-4" />
                {t("nav.analytics")}
              </Link>
              <div className="flex gap-2 pt-4 border-t border-border">
                <Button variant="destructive" size="sm" className="flex-1" data-sos-button>
                  <Shield className="w-4 h-4 mr-2" />
                  SOS
                </Button>
                <VoiceButton variant="header" className="flex-1" />
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
