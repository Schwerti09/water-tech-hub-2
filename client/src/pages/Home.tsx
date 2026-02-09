import { useState } from "react";
import { Link } from "wouter";
import { useWaterQuality, useCreateScan } from "@/hooks/use-water-data";
import { useAuth } from "@/hooks/use-auth";
import { Navigation } from "@/components/Navigation";
import { HydroAssistent } from "@/components/HydroAssistent";
import { WaterQualityCard } from "@/components/WaterQualityCard";
import { motion } from "framer-motion";
import { Search, Loader2, MapPin, FlaskConical, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [plz, setPlz] = useState("");
  const [searchedPlz, setSearchedPlz] = useState("");
  const { data: waterData, isLoading, error } = useWaterQuality(searchedPlz);
  const { user } = useAuth();
  const createScan = useCreateScan();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (plz.length !== 5) return;
    setSearchedPlz(plz);

    // Save scan if user is logged in
    if (user) {
      createScan.mutate({ userId: user.id, plz, isSaved: true });
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/20">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none opacity-40">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[100px]" />
          <div className="absolute top-[20%] right-[0%] w-[40%] h-[60%] rounded-full bg-secondary/20 blur-[100px]" />
          <div className="absolute bottom-[0%] left-[20%] w-[30%] h-[30%] rounded-full bg-accent/20 blur-[80px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl md:text-8xl font-display font-bold text-foreground tracking-tight mb-8 leading-[1.1]"
            >
              Wissen, was man <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-sci-500">
                wirklich trinkt.
              </span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl mx-auto"
            >
              Die wissenschaftliche Autorität zur Trinkwasserverordnung 2026. PFAS-Radar, Filter-Benchmarks & Mieter-Rechtsschutz.
            </motion.p>
          </div>

          {/* Search Box */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-xl mx-auto"
          >
            <form onSubmit={handleSearch} className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-brand-500 to-sci-500 rounded-[2rem] blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
              <div className="relative flex items-center bg-white dark:bg-slate-900 rounded-[2rem] p-3 shadow-2xl border border-border/50">
                <div className="ml-4 p-3 rounded-full bg-brand-500/10 text-brand-500">
                  <MapPin className="w-6 h-6" />
                </div>
                <input
                  type="text"
                  value={plz}
                  onChange={(e) => setPlz(e.target.value)}
                  placeholder="Postleitzahl eingeben..."
                  className="flex-1 bg-transparent border-none focus:ring-0 px-5 py-4 text-xl placeholder:text-muted-foreground font-medium"
                  maxLength={5}
                />
                <Button 
                  type="submit" 
                  disabled={plz.length !== 5 || isLoading}
                  className="rounded-full px-10 py-8 bg-brand-500 hover:bg-brand-600 text-white shadow-xl shadow-brand-500/20 transition-all hover:scale-105 text-lg font-bold"
                >
                  {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Analyse starten"}
                </Button>
              </div>
            </form>
            <div className="flex justify-center gap-6 mt-8 text-sm font-medium text-muted-foreground">
              <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Echtzeit-Daten</span>
              <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500" /> UBA-Referenz 2026</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="pb-24 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-xs font-bold tracking-widest uppercase text-muted-foreground mb-12">Wissenschaftlich zertifiziert & anerkannt von</p>
          <div className="flex flex-wrap justify-center items-center gap-12 grayscale opacity-50">
            <div className="flex items-center gap-2 font-display font-bold text-xl">UBA 2026</div>
            <div className="flex items-center gap-2 font-display font-bold text-xl">DIN-ZERT</div>
            <div className="flex items-center gap-2 font-display font-bold text-xl">LAB-VERIFIED</div>
            <div className="flex items-center gap-2 font-display font-bold text-xl">EU-REACH</div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">Tools für deine Wassersicherheit</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Vom PFAS-Radar bis zum wissenschaftlichen Filter-Benchmark – wir liefern die Fakten.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <div className="group p-10 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-border/50 hover:border-brand-500/50 transition-all duration-500 shadow-xl shadow-black/[0.02] hover:shadow-brand-500/5 hover:-translate-y-2">
              <div className="w-16 h-16 rounded-2xl bg-brand-500 text-white flex items-center justify-center mb-8 shadow-lg shadow-brand-500/20 group-hover:rotate-12 transition-transform">
                <MapPin className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold font-display mb-4">PFAS-Radar</h3>
              <p className="text-muted-foreground leading-relaxed text-lg mb-6">
                Visualisierung von Kontaminations-Hotspots basierend auf der Trinkwasserverordnung 2026.
              </p>
              <Link href="/pfas-radar">
                <Button variant="ghost" className="p-0 text-brand-500 font-bold group-hover:translate-x-2 transition-transform h-auto">Zum Radar →</Button>
              </Link>
            </div>

            {/* Feature 2 */}
            <div className="group p-10 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-border/50 hover:border-emerald-500/50 transition-all duration-500 shadow-xl shadow-black/[0.02] hover:shadow-emerald-500/5 hover:-translate-y-2">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mb-8 shadow-lg shadow-emerald-500/20 group-hover:rotate-12 transition-transform">
                <FlaskConical className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold font-display mb-4">Science Hub</h3>
              <p className="text-muted-foreground leading-relaxed text-lg mb-6">
                Laborgeprüfte Filter-Benchmarks. Transparente Leistungswerte statt Marketing-Versprechen.
              </p>
              <Link href="/science-hub">
                <Button variant="ghost" className="p-0 text-emerald-500 font-bold group-hover:translate-x-2 transition-transform h-auto">Benchmarks ansehen →</Button>
              </Link>
            </div>

            {/* Feature 3 */}
            <div className="group p-10 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-border/50 hover:border-accent/50 transition-all duration-500 shadow-xl shadow-black/[0.02] hover:shadow-accent/5 hover:-translate-y-2">
              <div className="w-16 h-16 rounded-2xl bg-accent text-white flex items-center justify-center mb-8 shadow-lg shadow-accent/20 group-hover:rotate-12 transition-transform">
                <Bot className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold font-display mb-4">HydroAssistent</h3>
              <p className="text-muted-foreground leading-relaxed text-lg mb-6">
                KI-Experte für Mietrecht & Technik. Sofortige Analyse deiner Messwerte und rechtliche Einordnung.
              </p>
              <Button variant="ghost" className="p-0 text-accent font-bold group-hover:translate-x-2 transition-transform h-auto">Assistent öffnen →</Button>
            </div>
          </div>
        </div>
      </section>

      <HydroAssistent />
    </div>
  );
}
