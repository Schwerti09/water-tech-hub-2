import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useUserScans } from "@/hooks/use-water-data";
import { Navigation } from "@/components/Navigation";
import { motion } from "framer-motion";
import { MapPin, Calendar, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";

export default function Dashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const { data: scans, isLoading: scansLoading } = useUserScans();

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      window.location.href = "/api/login";
    }
  }, [user, authLoading]);

  if (authLoading || !user) return null;

  return (
    <div className="min-h-screen bg-muted/20">
      <Navigation />

      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <header className="mb-12">
          <h1 className="text-3xl font-display font-bold mb-2">Welcome back, {user.firstName || "User"}</h1>
          <p className="text-muted-foreground">Track your local water quality history and alerts.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Scan History */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold font-display flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" /> Recent Scans
            </h2>

            {scansLoading ? (
              <div className="space-y-4">
                {[1, 2].map(i => <div key={i} className="h-24 bg-white rounded-2xl animate-pulse" />)}
              </div>
            ) : scans && scans.length > 0 ? (
              <div className="space-y-4">
                {scans.map((scan) => (
                  <motion.div
                    key={scan.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow flex justify-between items-center"
                  >
                    <div>
                      <div className="text-2xl font-bold font-display text-primary mb-1">{scan.plz}</div>
                      <div className="flex items-center text-sm text-muted-foreground gap-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {scan.scannedAt ? format(new Date(scan.scannedAt), 'PPp') : 'Just now'}
                        </span>
                      </div>
                    </div>
                    <Link href={`/?plz=${scan.plz}`}>
                      <button className="p-3 rounded-xl bg-muted/50 hover:bg-primary/10 hover:text-primary transition-colors">
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-8 rounded-2xl border border-dashed text-center">
                <p className="text-muted-foreground mb-4">No scans saved yet.</p>
                <Link href="/">
                  <button className="text-primary font-medium hover:underline">Start Scanning</button>
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar - Recommendations */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold font-display">Recommended Actions</h2>
            <div className="bg-gradient-to-br from-primary to-secondary p-6 rounded-2xl text-white shadow-xl">
              <h3 className="font-bold text-lg mb-2">Upgrade Your Filter</h3>
              <p className="text-blue-100 text-sm mb-4">
                Based on your recent scans in 10115, we recommend an RO system for optimal lead removal.
              </p>
              <Link href="/science-hub">
                <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-semibold backdrop-blur-sm transition-colors border border-white/20">
                  Compare Filters
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
