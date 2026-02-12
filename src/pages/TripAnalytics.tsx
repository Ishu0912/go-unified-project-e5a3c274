import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, TrendingUp, Wallet, Percent, MapPin, Award, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useBooking } from "@/hooks/useBooking";
import { useLoyaltyPoints } from "@/hooks/useLoyaltyPoints";
import { useLanguage } from "@/hooks/useLanguage";
import Header from "@/components/Header";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface Booking {
  id: string;
  booking_type: string;
  from_location: string;
  to_location: string;
  travel_date: string;
  base_price: number;
  final_price: number;
  discount_percentage: number | null;
  created_at: string;
}

const COLORS = ["hsl(215, 80%, 25%)", "hsl(38, 90%, 55%)", "hsl(16, 85%, 55%)", "hsl(142, 70%, 45%)"];

const TripAnalytics = () => {
  const { user, loading: authLoading } = useAuth();
  const { getBookings } = useBooking();
  const { loyaltyPoints, transactions } = useLoyaltyPoints();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
      return;
    }
    if (user) {
      getBookings().then(({ bookings: data }) => {
        setBookings(data as Booking[]);
        setLoading(false);
      });
    }
  }, [user, authLoading]);

  const stats = useMemo(() => {
    const totalSpent = bookings.reduce((sum, b) => sum + b.final_price, 0);
    const totalSaved = bookings.reduce((sum, b) => sum + (b.base_price - b.final_price), 0);

    // Monthly spending
    const monthlyMap: Record<string, number> = {};
    bookings.forEach((b) => {
      const month = new Date(b.created_at).toLocaleString("default", { month: "short", year: "2-digit" });
      monthlyMap[month] = (monthlyMap[month] || 0) + b.final_price;
    });
    const monthlyData = Object.entries(monthlyMap).map(([name, amount]) => ({ name, amount }));

    // By type
    const typeMap: Record<string, number> = {};
    bookings.forEach((b) => {
      typeMap[b.booking_type] = (typeMap[b.booking_type] || 0) + 1;
    });
    const typeData = Object.entries(typeMap).map(([name, value]) => ({ name: name.replace("_", " "), value }));

    // Favorite route
    const routeMap: Record<string, number> = {};
    bookings.forEach((b) => {
      const route = `${b.from_location} → ${b.to_location}`;
      routeMap[route] = (routeMap[route] || 0) + 1;
    });
    const favoriteRoute = Object.entries(routeMap).sort((a, b) => b[1] - a[1])[0];

    return { totalSpent, totalSaved, monthlyData, typeData, favoriteRoute };
  }, [bookings]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-6 py-8 pt-28">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">{t("analytics.title")}</h1>
            <p className="text-muted-foreground">Your travel insights & loyalty rewards</p>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: TrendingUp, label: t("analytics.total_trips"), value: bookings.length.toString(), color: "text-primary bg-primary/10" },
            { icon: Wallet, label: t("analytics.total_spent"), value: `₹${stats.totalSpent.toFixed(0)}`, color: "text-accent bg-accent/10" },
            { icon: Percent, label: t("analytics.savings"), value: `₹${stats.totalSaved.toFixed(0)}`, color: "text-success bg-success/10" },
            { icon: Award, label: t("loyalty.points"), value: loyaltyPoints.points.toString(), color: "text-secondary bg-secondary/10" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-2xl p-6 border border-border"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Favorite Route */}
        {stats.favoriteRoute && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="bg-gradient-to-r from-primary to-ocean-light text-white rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-3 mb-2">
              <MapPin className="w-5 h-5" />
              <p className="text-white/80 text-sm">{t("analytics.favorite_route")}</p>
            </div>
            <p className="text-2xl font-bold">{stats.favoriteRoute[0]}</p>
            <p className="text-white/60 text-sm">{stats.favoriteRoute[1]} trips</p>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Monthly Spending Chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="bg-card rounded-2xl p-6 border border-border">
            <h3 className="text-lg font-semibold mb-4">{t("analytics.monthly_spending")}</h3>
            {stats.monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={stats.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px" }}
                    formatter={(value: number) => [`₹${value}`, "Amount"]}
                  />
                  <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-muted-foreground py-12">{t("common.no_data")}</p>
            )}
          </motion.div>

          {/* Trips by Type */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            className="bg-card rounded-2xl p-6 border border-border">
            <h3 className="text-lg font-semibold mb-4">{t("analytics.by_type")}</h3>
            {stats.typeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={stats.typeData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name} (${value})`}>
                    {stats.typeData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-muted-foreground py-12">{t("common.no_data")}</p>
            )}
          </motion.div>
        </div>

        {/* Loyalty Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
          className="bg-card rounded-2xl p-6 border border-border mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Gift className="w-6 h-6 text-secondary" />
            <h3 className="text-lg font-semibold">{t("loyalty.points")} & Rewards</h3>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 rounded-xl bg-success/10">
              <p className="text-2xl font-bold text-success">{loyaltyPoints.total_earned}</p>
              <p className="text-xs text-muted-foreground">{t("loyalty.earned")}</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-accent/10">
              <p className="text-2xl font-bold text-accent">{loyaltyPoints.total_redeemed}</p>
              <p className="text-xs text-muted-foreground">{t("loyalty.redeemed")}</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-primary/10">
              <p className="text-2xl font-bold text-primary">{loyaltyPoints.points}</p>
              <p className="text-xs text-muted-foreground">{t("loyalty.available")}</p>
            </div>
          </div>

          {/* Recent Transactions */}
          {transactions.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-muted-foreground mb-3">Recent Activity</h4>
              <div className="space-y-2">
                {transactions.slice(0, 5).map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                    <div>
                      <p className="text-sm font-medium">{tx.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(tx.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`font-bold ${tx.type === "earned" ? "text-success" : "text-accent"}`}>
                      {tx.type === "earned" ? "+" : "-"}{tx.points} pts
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default TripAnalytics;
