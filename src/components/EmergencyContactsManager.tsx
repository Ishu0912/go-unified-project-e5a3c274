import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Plus, Trash2, User, Phone, Heart, Camera, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEmergencyContacts } from "@/hooks/useEmergencyContacts";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface EmergencyContactsManagerProps {
  compact?: boolean;
  onDone?: () => void;
}

const EmergencyContactsManager = ({ compact = false, onDone }: EmergencyContactsManagerProps) => {
  const { user } = useAuth();
  const { contacts, loading, addContact, removeContact } = useEmergencyContacts();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [relationship, setRelationship] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!name.trim() || !phone.trim()) return;

    const phoneRegex = /^[\d+\s-]{10,15}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ""))) {
      return;
    }

    setSubmitting(true);

    let photo_url: string | undefined;
    if (photoFile && user) {
      const ext = photoFile.name.split(".").pop();
      const path = `${user.id}/sos-${Date.now()}.${ext}`;
      const { error: uploadErr } = await supabase.storage.from("avatars").upload(path, photoFile, { upsert: true });
      if (!uploadErr) {
        const { data } = supabase.storage.from("avatars").getPublicUrl(path);
        photo_url = data.publicUrl;
      }
    }

    await addContact({ name: name.trim(), phone: phone.trim(), relationship: relationship.trim() || undefined, photo_url });
    setName("");
    setPhone("");
    setRelationship("");
    setPhotoFile(null);
    setPhotoPreview(null);
    setShowForm(false);
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2 className="w-5 h-5 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className={compact ? "space-y-3" : "space-y-4"}>
      {!compact && (
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-5 h-5 text-destructive" />
          <h3 className="font-semibold text-lg">SOS Emergency Contacts</h3>
        </div>
      )}

      <p className="text-sm text-muted-foreground">
        {contacts.length === 0
          ? "Add family members who will receive SOS alerts with your live location during emergencies."
          : `${contacts.length}/5 contacts added. They will receive SOS alerts.`}
      </p>

      {/* Contact list */}
      <div className="space-y-2">
        {contacts.map((contact) => (
          <motion.div
            key={contact.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 bg-muted/50 rounded-xl p-3"
          >
            {contact.photo_url ? (
              <img src={contact.photo_url} alt={contact.name} className="w-10 h-10 rounded-full object-cover border-2 border-primary/30" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{contact.name}</p>
              <p className="text-xs text-muted-foreground">{contact.phone}</p>
              {contact.relationship && (
                <p className="text-xs text-primary">{contact.relationship}</p>
              )}
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeContact(contact.id)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </motion.div>
        ))}
      </div>

      {/* Add form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3 overflow-hidden"
          >
            <div className="bg-muted/30 rounded-xl p-4 space-y-3 border border-border">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">New Contact</span>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setShowForm(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Photo upload */}
              <div className="flex items-center gap-3">
                <label className="cursor-pointer">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Preview" className="w-14 h-14 rounded-full object-cover border-2 border-primary" />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center border-2 border-dashed border-muted-foreground/30 hover:border-primary transition-colors">
                      <Camera className="w-5 h-5 text-muted-foreground" />
                    </div>
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                </label>
                <span className="text-xs text-muted-foreground">Add photo (optional)</span>
              </div>

              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <Input placeholder="Name *" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <Input placeholder="Phone number *" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-muted-foreground" />
                <Input placeholder="Relationship (e.g. Mother, Father)" value={relationship} onChange={(e) => setRelationship(e.target.value)} />
              </div>

              <Button onClick={handleSubmit} disabled={submitting || !name.trim() || !phone.trim()} className="w-full">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Add Contact
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!showForm && contacts.length < 5 && (
        <Button variant="outline" className="w-full gap-2" onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4" />
          Add Family Member
        </Button>
      )}

      {onDone && contacts.length > 0 && (
        <Button onClick={onDone} className="w-full">
          Continue to Booking
        </Button>
      )}
    </div>
  );
};

export default EmergencyContactsManager;
