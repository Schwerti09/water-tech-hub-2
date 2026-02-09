import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, Info, Scale } from "lucide-react";
import { motion } from "framer-motion";
import type { WaterQualityMetric } from "@shared/schema";

interface WaterQualityCardProps {
  data: WaterQualityMetric;
}

export function WaterQualityCard({ data }: WaterQualityCardProps) {
  const isHigh = data.riskLevel === "high" || data.riskLevel === "critical";
  const isMedium = data.riskLevel === "medium";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`overflow-hidden rounded-[2rem] border-border/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl shadow-2xl shadow-black/[0.02] transition-all hover:shadow-brand-500/5 ${isHigh ? 'ring-2 ring-tox-500/20' : ''}`}>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${isHigh ? 'bg-tox-500/10 text-tox-500' : isMedium ? 'bg-amber-500/10 text-amber-500' : 'bg-safe-500/10 text-safe-500'}`}>
              {isHigh ? <AlertCircle className="w-5 h-5" /> : isMedium ? <Info className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
            </div>
            <h3 className="font-bold text-lg">{data.contaminationType}</h3>
          </div>
          <Badge 
            variant={isHigh ? "destructive" : isMedium ? "outline" : "secondary"}
            className="rounded-full px-3 py-0.5 text-xs font-bold uppercase tracking-wider"
          >
            {isHigh ? "Gefahr" : isMedium ? "Warnung" : "Sicher"}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-baseline gap-1">
            <span className={`text-4xl font-black tracking-tighter ${isHigh ? 'text-tox-500' : isMedium ? 'text-amber-500' : 'text-safe-500'}`}>
              {Number(data.measuredValue).toFixed(2)}
            </span>
            <span className="text-muted-foreground font-bold text-sm">{data.unit}</span>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground">
              <span>Grenzwert 2026</span>
              <span className="text-foreground">{Number(data.limitValue).toFixed(2)} {data.unit}</span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((Number(data.measuredValue) / Number(data.limitValue)) * 100, 100)}%` }}
                className={`h-full rounded-full ${isHigh ? 'bg-tox-500' : isMedium ? 'bg-amber-500' : 'bg-safe-500'}`}
              />
            </div>
          </div>

          {data.legalAdvice && (
            <div className="p-4 rounded-2xl bg-brand-500/5 border border-brand-500/10 flex gap-3 items-start">
              <Scale className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" />
              <p className="text-xs font-medium text-brand-700 dark:text-brand-300 leading-relaxed">
                {data.legalAdvice}
              </p>
            </div>
          )}

          <div className="pt-4 border-t border-border/50 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            <span>Quelle: {data.dataSource}</span>
            <span className="px-2 py-0.5 rounded bg-muted">Labor-Verifiziert</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
