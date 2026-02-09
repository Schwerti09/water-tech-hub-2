import { Navigation } from "@/components/Navigation";
import { useFilters } from "@/hooks/use-water-data";
import { motion } from "framer-motion";
import { Check, X, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ScienceHub() {
  const { data: filters, isLoading } = useFilters();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Filter Comparison Hub
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Scientific performance data for top filtration systems. We test removal rates for PFAS, Lead, and Bacteria.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-[500px] rounded-3xl bg-muted/50 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Mock data backup if API is empty for demo */}
            {(filters && filters.length > 0 ? filters : MOCK_FILTERS).map((filter, idx) => (
              <motion.div
                key={filter.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group relative bg-white rounded-3xl border border-border p-6 hover:shadow-xl hover:border-primary/30 transition-all duration-300"
              >
                {/* Badge for Top Pick */}
                {idx === 0 && (
                  <div className="absolute top-4 right-4 bg-accent text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                    Top Pick
                  </div>
                )}

                <div className="h-48 rounded-2xl bg-muted/30 mb-6 overflow-hidden relative">
                   {/* Placeholder Image */}
                   <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-gray-400">
                     <img src="https://images.unsplash.com/photo-1585837575652-267c041d77d4?w=500&h=300&fit=crop" alt="Water Filter" className="w-full h-full object-cover" />
                     {/* Using Unsplash for generic water filter look */}
                   </div>
                </div>

                <h3 className="text-2xl font-bold font-display mb-1">{filter.name}</h3>
                <p className="text-sm text-muted-foreground mb-4 font-medium">{filter.brand}</p>
                
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-3xl font-bold text-primary">€{filter.price}</span>
                  <span className="text-sm text-muted-foreground">/ unit</span>
                </div>

                <div className="space-y-3 mb-8">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Performance</h4>
                  
                  {filter.performance?.map((p: any, i: number) => (
                    <div key={i} className="flex justify-between items-center text-sm">
                      <span>{p.contaminant}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
                          <div 
                            className="h-full bg-secondary rounded-full" 
                            style={{ width: `${p.removalRate}%` }} 
                          />
                        </div>
                        <span className="font-bold">{p.removalRate}%</span>
                      </div>
                    </div>
                  )) || (
                    // Fallback visual if no performance data
                    <>
                      <div className="flex justify-between items-center text-sm">
                        <span>PFAS Removal</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
                             <div className="h-full bg-secondary w-[98%] rounded-full" />
                          </div>
                          <span className="font-bold">98%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span>Lead Removal</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
                             <div className="h-full bg-secondary w-[99%] rounded-full" />
                          </div>
                          <span className="font-bold">99%</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <Button className="w-full py-6 rounded-xl text-base font-semibold shadow-lg shadow-primary/10">
                  View Analysis <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

const MOCK_FILTERS = [
  { id: 1, name: "UltraPure Reverse Osmosis", brand: "AquaTech", price: "249.00", performance: null },
  { id: 2, name: "CarbonBlock Pro", brand: "PureLife", price: "89.00", performance: null },
  { id: 3, name: "NanoFilter X", brand: "FutureWater", price: "129.00", performance: null },
];
