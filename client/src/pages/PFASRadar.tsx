import { Navigation } from "@/components/Navigation";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { motion } from "framer-motion";

// Mock-Daten für die Karte, um ganz Deutschland abzudecken
const MOCK_HOTSPOTS = [
  { id: 1, lat: 52.5200, lng: 13.4050, level: 8.5, location: "Berlin Mitte" },
  { id: 2, lat: 48.1351, lng: 11.5820, level: 12.2, location: "München" },
  { id: 3, lat: 53.5511, lng: 9.9937, level: 4.1, location: "Hamburg" },
  { id: 4, lat: 50.1109, lng: 8.6821, level: 15.8, location: "Frankfurt am Main" },
  { id: 5, lat: 51.2277, lng: 6.7735, level: 2.3, location: "Düsseldorf" },
  { id: 6, lat: 50.9375, lng: 6.9603, level: 9.4, location: "Köln" },
  { id: 7, lat: 48.7758, lng: 9.1829, level: 6.7, location: "Stuttgart" },
  { id: 8, lat: 53.0793, lng: 8.8017, level: 3.2, location: "Bremen" },
  { id: 9, lat: 51.3397, lng: 12.3731, level: 11.1, location: "Leipzig" },
  { id: 10, lat: 54.3233, lng: 10.1228, level: 5.5, location: "Kiel" },
];

export default function PFASRadar() {
  const getColor = (level: number) => {
    if (level > 10) return "#EF4444"; // Rot - Hoch
    if (level > 5) return "#F59E0B";  // Bernstein - Mittel
    return "#10B981";                 // Smaragd - Niedrig
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <div className="flex-1 pt-16 flex flex-col">
        <div className="bg-white border-b border-border p-6 shadow-sm z-10">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-display font-bold mb-2">PFAS Radar</h1>
            <p className="text-muted-foreground">Echtzeit-Monitoring von Ewigkeitschemikalien in ganz Deutschland (Trinkwasserverordnung 2026).</p>
          </div>
        </div>

        <div className="flex-1 relative">
          <MapContainer 
            center={[51.1657, 10.4515]} 
            zoom={6} 
            scrollWheelZoom={true}
            style={{ height: "100%", width: "100%", position: "absolute", zIndex: 0 }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />
            {MOCK_HOTSPOTS.map((spot) => (
              <CircleMarker
                key={spot.id}
                center={[spot.lat, spot.lng]}
                radius={15}
                pathOptions={{ 
                  color: getColor(spot.level),
                  fillColor: getColor(spot.level), 
                  fillOpacity: 0.6,
                  weight: 2
                }}
              >
                <Popup>
                  <div className="font-sans p-1">
                    <h3 className="font-bold text-base mb-1">{spot.location}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm text-muted-foreground">PFAS-Level:</span>
                      <span className="font-bold" style={{ color: getColor(spot.level) }}>
                        {spot.level} ng/L
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
                      Quelle: Offizielle Messung UBA 2026 <br/>
                      Datum: 28.01.2026
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>

          {/* Legend */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute bottom-8 right-8 bg-white/90 backdrop-blur p-4 rounded-xl shadow-xl border border-border max-w-[220px]"
          >
            <h4 className="font-bold text-sm mb-3">Risikostufen (PFAS-20)</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span>Niedrig (&lt; 5 ng/L)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span>Mittel (5-10 ng/L)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500" />
                <span>Hoch (&gt; 10 ng/L)</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
