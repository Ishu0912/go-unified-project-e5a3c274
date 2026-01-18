import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { User, LogOut, Ticket, Settings, Camera, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, profile, signOut, uploadAvatar } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    setIsOpen(false);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadAvatar(file);
    }
  };

  if (!user) {
    return (
      <Button
        onClick={() => navigate("/auth")}
        className="btn-premium"
        size="sm"
      >
        <User className="w-4 h-4 mr-2" />
        Login
      </Button>
    );
  }

  const initials = profile?.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || user.email?.[0].toUpperCase() || "U";

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 rounded-full hover:bg-primary/10 transition-colors"
      >
        <Avatar className="w-9 h-9 border-2 border-primary/20">
          <AvatarImage src={profile?.photo_url || undefined} />
          <AvatarFallback className="bg-primary text-white text-sm font-medium">
            {initials}
          </AvatarFallback>
        </Avatar>
        {profile?.is_student && (
          <Badge variant="secondary" className="hidden sm:flex items-center gap-1 text-xs">
            <GraduationCap className="w-3 h-3" />
            Student
          </Badge>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 top-full mt-2 w-72 z-50 glass-card rounded-2xl p-4 border border-border shadow-xl"
            >
              {/* User Info */}
              <div className="flex items-center gap-3 pb-4 border-b border-border">
                <div className="relative group">
                  <Avatar className="w-14 h-14 border-2 border-primary/20">
                    <AvatarImage src={profile?.photo_url || undefined} />
                    <AvatarFallback className="bg-primary text-white text-lg font-medium">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                    <Camera className="w-5 h-5 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground truncate">
                    {profile?.full_name || "User"}
                  </p>
                  <p className="text-sm text-muted-foreground truncate">
                    {user.email}
                  </p>
                  {profile?.phone && (
                    <p className="text-xs text-muted-foreground">
                      {profile.phone}
                    </p>
                  )}
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-2 space-y-1">
                <button
                  onClick={() => {
                    navigate("/my-bookings");
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-foreground hover:bg-primary/10 transition-colors"
                >
                  <Ticket className="w-4 h-4 text-primary" />
                  <span className="text-sm">My Bookings</span>
                </button>
                <button
                  onClick={() => {
                    navigate("/profile");
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-foreground hover:bg-primary/10 transition-colors"
                >
                  <Settings className="w-4 h-4 text-primary" />
                  <span className="text-sm">Profile Settings</span>
                </button>
              </div>

              {/* Discount Badge */}
              {profile?.is_student && (
                <div className="py-3 border-t border-border">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/10 border border-secondary/20">
                    <GraduationCap className="w-5 h-5 text-secondary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Student Discount</p>
                      <p className="text-xs text-muted-foreground">10% off on all bookings</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Logout */}
              <div className="pt-2 border-t border-border">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">Logout</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserMenu;
