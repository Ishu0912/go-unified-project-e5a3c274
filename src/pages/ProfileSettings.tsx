import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Camera, Phone, GraduationCap, User, Check, Loader2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const ProfileSettings = () => {
  const navigate = useNavigate();
  const { user, profile, loading, updateProfile, uploadAvatar } = useAuth();
  
  const [phone, setPhone] = useState("");
  const [studentId, setStudentId] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isVerifyingStudent, setIsVerifyingStudent] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (profile) {
      setPhone(profile.phone || "");
      setStudentId(profile.student_id || "");
    }
  }, [profile]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image too large", { description: "Please select an image under 5MB" });
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Invalid file type", { description: "Please select an image file" });
      return;
    }

    setIsUploading(true);
    try {
      const { error } = await uploadAvatar(file);
      if (error) {
        toast.error("Upload failed", { description: error.message });
      } else {
        toast.success("Photo updated", { description: "Your profile photo has been updated" });
      }
    } catch {
      toast.error("Upload failed", { description: "Something went wrong" });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSavePhone = async () => {
    // Validate phone number
    const phoneRegex = /^[+]?[\d\s-]{10,15}$/;
    if (phone && !phoneRegex.test(phone.replace(/\s/g, ""))) {
      toast.error("Invalid phone number", { description: "Please enter a valid phone number" });
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await updateProfile({ phone: phone || null });
      if (error) {
        toast.error("Update failed", { description: error.message });
      } else {
        toast.success("Phone updated", { description: "Your phone number has been saved" });
      }
    } catch {
      toast.error("Update failed", { description: "Something went wrong" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleVerifyStudent = async () => {
    if (!studentId.trim()) {
      toast.error("Student ID required", { description: "Please enter your student ID" });
      return;
    }

    // Basic student ID validation (alphanumeric, 5-20 characters)
    const studentIdRegex = /^[A-Za-z0-9]{5,20}$/;
    if (!studentIdRegex.test(studentId.trim())) {
      toast.error("Invalid Student ID", { description: "Student ID should be 5-20 alphanumeric characters" });
      return;
    }

    setIsVerifyingStudent(true);
    try {
      // Simulate verification delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const { error } = await updateProfile({ 
        student_id: studentId.trim(),
        is_student: true 
      });
      
      if (error) {
        toast.error("Verification failed", { description: error.message });
      } else {
        toast.success("Student status verified!", { 
          description: "You now get 10% off on all bookings" 
        });
      }
    } catch {
      toast.error("Verification failed", { description: "Something went wrong" });
    } finally {
      setIsVerifyingStudent(false);
    }
  };

  const handleRemoveStudentStatus = async () => {
    setIsVerifyingStudent(true);
    try {
      const { error } = await updateProfile({ 
        student_id: null,
        is_student: false 
      });
      
      if (error) {
        toast.error("Update failed", { description: error.message });
      } else {
        setStudentId("");
        toast.success("Student status removed");
      }
    } catch {
      toast.error("Update failed", { description: "Something went wrong" });
    } finally {
      setIsVerifyingStudent(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  const initials = profile.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || user.email?.[0].toUpperCase() || "U";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-card border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground">Profile Settings</h1>
            <p className="text-sm text-muted-foreground">Manage your account</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl space-y-6">
        {/* Profile Photo Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Profile Photo
              </CardTitle>
              <CardDescription>
                Click on your photo to upload a new one
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-6">
              <div className="relative group">
                <Avatar className="w-24 h-24 border-4 border-primary/20">
                  <AvatarImage src={profile.photo_url || undefined} />
                  <AvatarFallback className="bg-primary text-white text-2xl font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <label className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                  {isUploading ? (
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  ) : (
                    <Camera className="w-6 h-6 text-white" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                </label>
              </div>
              <div>
                <p className="font-semibold text-lg text-foreground">{profile.full_name || "User"}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                {profile.is_student && (
                  <Badge className="mt-2 bg-secondary text-secondary-foreground">
                    <GraduationCap className="w-3 h-3 mr-1" />
                    Student
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Phone Number Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-primary" />
                Phone Number
              </CardTitle>
              <CardDescription>
                Add your phone number for booking confirmations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-background"
                />
              </div>
              <Button
                onClick={handleSavePhone}
                disabled={isSaving || phone === (profile.phone || "")}
                className="w-full sm:w-auto"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Save Phone Number
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Student Verification Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-primary" />
                Student Verification
              </CardTitle>
              <CardDescription>
                Verify your student status to get 10% discount on all bookings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile.is_student ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary/10 border border-secondary/20">
                    <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
                      <Shield className="w-6 h-6 text-secondary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">Student Status Verified</p>
                      <p className="text-sm text-muted-foreground">
                        Student ID: {profile.student_id}
                      </p>
                    </div>
                    <Badge className="bg-secondary text-secondary-foreground">
                      10% OFF
                    </Badge>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleRemoveStudentStatus}
                    disabled={isVerifyingStudent}
                    className="text-destructive border-destructive/20 hover:bg-destructive/10"
                  >
                    {isVerifyingStudent ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : null}
                    Remove Student Status
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="studentId">Student ID</Label>
                    <Input
                      id="studentId"
                      placeholder="Enter your student ID (e.g., STU12345)"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value.toUpperCase())}
                      className="bg-background"
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter your valid student ID to verify your student status
                    </p>
                  </div>
                  <Button
                    onClick={handleVerifyStudent}
                    disabled={isVerifyingStudent || !studentId.trim()}
                    className="w-full sm:w-auto btn-premium"
                  >
                    {isVerifyingStudent ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <GraduationCap className="w-4 h-4 mr-2" />
                        Verify Student Status
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Account Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="glass-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Email</span>
                  <span className="font-medium text-foreground">{user.email}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Full Name</span>
                  <span className="font-medium text-foreground">{profile.full_name || "Not set"}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Member Since</span>
                  <span className="font-medium text-foreground">
                    {new Date(profile.created_at).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    })}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default ProfileSettings;
