import { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Smartphone, Building2, Wallet, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export type PaymentMethod = "upi" | "card" | "netbanking" | "wallet";

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod;
  onSelect: (method: PaymentMethod) => void;
  onConfirm: () => void;
  amount: number;
  isProcessing?: boolean;
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

const PaymentMethodSelector = ({
  selectedMethod,
  onSelect,
  onConfirm,
  amount,
  isProcessing = false,
}: PaymentMethodSelectorProps) => {
  return (
    <div className="space-y-4">
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
              onClick={() => onSelect(method.id)}
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

      {/* Amount Display */}
      <div className="p-4 rounded-xl bg-muted/50 border border-border">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Total Amount</span>
          <span className="text-2xl font-bold text-primary">₹{amount.toFixed(0)}</span>
        </div>
      </div>

      {/* Pay Button */}
      <Button
        onClick={onConfirm}
        disabled={isProcessing}
        className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-primary to-ocean-light hover:opacity-90"
      >
        {isProcessing ? (
          <>
            <span className="animate-pulse">Processing...</span>
          </>
        ) : (
          <>Pay ₹{amount.toFixed(0)}</>
        )}
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        🔒 Secure payment powered by GO UNIFIED
      </p>
    </div>
  );
};

export default PaymentMethodSelector;
