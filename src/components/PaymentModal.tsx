import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, CheckCircle, CreditCard, Smartphone, Building2, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export type PaymentMethod = "upi" | "card" | "netbanking" | "wallet";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  amount: number;
  bookingDetails: {
    from: string;
    to: string;
    date: string;
  };
}

const paymentMethods = [
  {
    id: "upi" as PaymentMethod,
    name: "UPI",
    description: "GPay, PhonePe, Paytm",
    icon: Smartphone,
    color: "from-green-500 to-emerald-600",
  },
  {
    id: "card" as PaymentMethod,
    name: "Card",
    description: "Credit/Debit Card",
    icon: CreditCard,
    color: "from-blue-500 to-indigo-600",
  },
  {
    id: "netbanking" as PaymentMethod,
    name: "Net Banking",
    description: "All major banks",
    icon: Building2,
    color: "from-purple-500 to-violet-600",
  },
  {
    id: "wallet" as PaymentMethod,
    name: "Wallet",
    description: "GO UNIFIED Wallet",
    icon: Wallet,
    color: "from-orange-500 to-amber-600",
  },
];

const banks = [
  "State Bank of India",
  "HDFC Bank",
  "ICICI Bank",
  "Axis Bank",
  "Kotak Mahindra Bank",
  "Punjab National Bank",
];

const PaymentModal = ({
  isOpen,
  onClose,
  onSuccess,
  amount,
  bookingDetails,
}: PaymentModalProps) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("upi");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState<"select" | "details" | "processing" | "success">("select");
  
  // Payment details state
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [selectedBank, setSelectedBank] = useState("");

  const validatePaymentDetails = (): boolean => {
    switch (selectedMethod) {
      case "upi":
        if (!upiId || !upiId.includes("@")) {
          toast.error("Please enter a valid UPI ID");
          return false;
        }
        break;
      case "card":
        if (!cardNumber || cardNumber.replace(/\s/g, "").length !== 16) {
          toast.error("Please enter a valid 16-digit card number");
          return false;
        }
        if (!cardExpiry || !/^\d{2}\/\d{2}$/.test(cardExpiry)) {
          toast.error("Please enter valid expiry (MM/YY)");
          return false;
        }
        if (!cardCvv || cardCvv.length !== 3) {
          toast.error("Please enter valid CVV");
          return false;
        }
        break;
      case "netbanking":
        if (!selectedBank) {
          toast.error("Please select a bank");
          return false;
        }
        break;
    }
    return true;
  };

  const handleProceed = () => {
    if (paymentStep === "select") {
      setPaymentStep("details");
    } else if (paymentStep === "details") {
      if (!validatePaymentDetails()) return;
      processPayment();
    }
  };

  const processPayment = async () => {
    setPaymentStep("processing");
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate success (in real app, this would be actual payment gateway response)
    setIsProcessing(false);
    setPaymentStep("success");
    
    // Wait a moment to show success, then complete
    await new Promise(resolve => setTimeout(resolve, 1500));
    onSuccess();
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(" ") : value;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-md bg-card rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Close Button */}
        {paymentStep !== "processing" && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-muted flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-primary to-ocean-light text-white">
          <h2 className="text-xl font-bold">
            {paymentStep === "success" ? "Payment Successful!" : "Complete Payment"}
          </h2>
          <p className="text-white/80 text-sm mt-1">
            {bookingDetails.from} → {bookingDetails.to}
          </p>
          <p className="text-white/60 text-xs">{bookingDetails.date}</p>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {paymentStep === "select" && (
              <motion.div
                key="select"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold text-foreground">Select Payment Method</h3>
                
                <div className="grid grid-cols-2 gap-3">
                  {paymentMethods.map((method) => {
                    const Icon = method.icon;
                    const isSelected = selectedMethod === method.id;
                    
                    return (
                      <motion.button
                        key={method.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedMethod(method.id)}
                        className={`
                          relative p-4 rounded-xl border-2 transition-all duration-200 text-left
                          ${isSelected 
                            ? "border-primary bg-primary/5 shadow-md" 
                            : "border-border bg-card hover:border-primary/50"
                          }
                        `}
                      >
                        {isSelected && (
                          <div className="absolute top-2 right-2">
                            <CheckCircle className="w-5 h-5 text-primary" />
                          </div>
                        )}
                        
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${method.color} flex items-center justify-center mb-2`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        
                        <p className="font-medium text-foreground">{method.name}</p>
                        <p className="text-xs text-muted-foreground">{method.description}</p>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {paymentStep === "details" && (
              <motion.div
                key="details"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <button 
                  onClick={() => setPaymentStep("select")}
                  className="text-sm text-primary hover:underline"
                >
                  ← Change payment method
                </button>
                
                {selectedMethod === "upi" && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Enter UPI Details</h3>
                    <Input
                      placeholder="yourname@upi"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">
                      Supported: Google Pay, PhonePe, Paytm, BHIM UPI
                    </p>
                  </div>
                )}

                {selectedMethod === "card" && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Enter Card Details</h3>
                    <Input
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      maxLength={19}
                      className="w-full"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                        maxLength={5}
                      />
                      <Input
                        placeholder="CVV"
                        type="password"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                        maxLength={3}
                      />
                    </div>
                  </div>
                )}

                {selectedMethod === "netbanking" && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Select Your Bank</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {banks.map((bank) => (
                        <button
                          key={bank}
                          onClick={() => setSelectedBank(bank)}
                          className={`p-3 rounded-lg border text-left text-sm transition-all ${
                            selectedBank === bank
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          {bank}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {selectedMethod === "wallet" && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">GO UNIFIED Wallet</h3>
                    <div className="p-4 rounded-xl bg-gradient-to-r from-gold/20 to-secondary/20 border border-gold/30">
                      <p className="text-sm text-foreground">Current Balance</p>
                      <p className="text-2xl font-bold text-primary">₹2,500</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Amount will be deducted from your GO UNIFIED wallet
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {paymentStep === "processing" && (
              <motion.div
                key="processing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-12"
              >
                <Loader2 className="w-16 h-16 text-primary animate-spin mb-4" />
                <p className="text-lg font-semibold">Processing Payment...</p>
                <p className="text-muted-foreground text-sm">Please do not close this window</p>
              </motion.div>
            )}

            {paymentStep === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-12"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mb-4"
                >
                  <CheckCircle className="w-10 h-10 text-success" />
                </motion.div>
                <p className="text-xl font-bold text-success">Payment Successful!</p>
                <p className="text-muted-foreground text-sm">Generating your ticket...</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Amount Display */}
          {(paymentStep === "select" || paymentStep === "details") && (
            <div className="mt-6 p-4 rounded-xl bg-muted/50 border border-border">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total Amount</span>
                <span className="text-2xl font-bold text-primary">₹{amount.toFixed(0)}</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {(paymentStep === "select" || paymentStep === "details") && (
            <Button
              onClick={handleProceed}
              disabled={isProcessing}
              className="w-full mt-4 py-6 text-lg font-semibold bg-gradient-to-r from-primary to-ocean-light hover:opacity-90"
            >
              {paymentStep === "select" ? "Proceed to Pay" : `Pay ₹${amount.toFixed(0)}`}
            </Button>
          )}

          <p className="text-xs text-center text-muted-foreground mt-4">
            🔒 Secure payment powered by GO UNIFIED
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PaymentModal;
