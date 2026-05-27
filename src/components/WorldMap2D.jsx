import { useState, memo } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { motion, AnimatePresence } from 'framer-motion';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

const COUNTRIES = [
  { name: 'UAE', adoption: 70, lat: 24.4, lon: 54.6, color: '#00e676', tier: 'High' },
  { name: 'Singapore', adoption: 63, lat: 1.3, lon: 103.8, color: '#00e676', tier: 'High' },
  { name: 'South Korea', adoption: 52, lat: 37.6, lon: 127.0, color: '#00e676', tier: 'High' },
  { name: 'Denmark', adoption: 48, lat: 55.7, lon: 12.6, color: '#00e676', tier: 'High' },
  { name: 'Finland', adoption: 46, lat: 60.2, lon: 24.9, color: '#00e676', tier: 'High' },
  { name: 'UK', adoption: 42, lat: 51.5, lon: -0.1, color: '#FFD740', tier: 'Medium' },
  { name: 'India', adoption: 40, lat: 20.6, lon: 78.9, color: '#FFD740', tier: 'Medium' },
  { name: 'Philippines', adoption: 38, lat: 14.6, lon: 121.0, color: '#FFD740', tier: 'Medium' },
  { name: 'Germany', adoption: 36, lat: 51.2, lon: 10.4, color: '#FFD740', tier: 'Medium' },
  { name: 'USA', adoption: 34, lat: 39.8, lon: -98.6, color: '#FFD740', tier: 'Medium' },
  { name: 'Canada', adoption: 33, lat: 56.1, lon: -106.3, color: '#FFD740', tier: 'Medium' },
  { name: 'France', adoption: 30, lat: 46.6, lon: 2.2, color: '#FFD740', tier: 'Medium' },
  { name: 'Japan', adoption: 28, lat: 36.2, lon: 138.3, color: '#ff5252', tier: 'Low' },
  { name: 'Brazil', adoption: 22, lat: -14.2, lon: -51.9, color: '#ff5252', tier: 'Low' },
  { name: 'Nigeria', adoption: 18, lat: 9.1, lon: 8.7, color: '#ff5252', tier: 'Low' },
];

const MemoGeographies = memo(function MemoGeographies() {
  return (
    <Geographies geography={GEO_URL}>
      {({ geographies }) =>
        geographies.map((geo) => (
          <Geography
            key={geo.rsmKey}
            geography={geo}
            fill="#111"
            stroke="rgba(0,230,118,0.08)"
            strokeWidth={0.4}
            style={{
              default: { outline: 'none' },
              hover: { outline: 'none', fill: '#1a1a1a' },
              pressed: { outline: 'none' },
            }}
          />
        ))
      }
    </Geographies>
  );
});

export default function WorldMap2D() {
  const [hovered, setHovered] = useState(null);

  return (
    <div className="relative">
      <ComposableMap
        projection="geoNaturalEarth1"
        projectionConfig={{ scale: 150 }}
        style={{ width: '100%', height: 'auto', background: 'transparent' }}
      >
        <MemoGeographies />

        {COUNTRIES.map((country, i) => {
          const r = 4 + (country.adoption / 100) * 10;
          return (
            <Marker
              key={country.name}
              coordinates={[country.lon, country.lat]}
              onMouseEnter={() => setHovered(country)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Outer glow */}
              <motion.circle
                r={r * 2.2}
                fill={country.color}
                opacity={0}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 0.12, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 + i * 0.05 }}
              />
              {/* Pulse ring */}
              <motion.circle
                r={r * 1.5}
                fill="none"
                stroke={country.color}
                strokeWidth={0.5}
                opacity={0}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 0.2, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.35 + i * 0.05 }}
              />
              {/* Main dot */}
              <motion.circle
                r={r}
                fill={country.color}
                opacity={0}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 0.85, scale: 1 }}
                transition={{
                  duration: 0.5,
                  delay: 0.4 + i * 0.05,
                  type: 'spring',
                  stiffness: 200,
                }}
                style={{ cursor: 'pointer' }}
              />
              {/* Country label */}
              <motion.text
                textAnchor="middle"
                y={-r - 6}
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: 9,
                  fontWeight: 700,
                  fill: country.color,
                  pointerEvents: 'none',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.9 }}
                transition={{ duration: 0.4, delay: 0.6 + i * 0.05 }}
              >
                {country.name}
              </motion.text>
            </Marker>
          );
        })}
      </ComposableMap>

      {/* Hover tooltip */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.15 }}
            className="absolute top-4 right-4 p-3 rounded-xl border backdrop-blur-sm"
            style={{
              background: 'rgba(17,17,17,0.95)',
              borderColor: `${hovered.color}30`,
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: hovered.color }}
              />
              <span className="text-sm font-semibold text-white">{hovered.name}</span>
            </div>
            <div className="text-xs text-[#a0a0a0]">
              AI Adoption: <span className="font-mono font-bold" style={{ color: hovered.color }}>{hovered.adoption}%</span>
            </div>
            <div className="text-[10px] text-[#666] mt-0.5">
              Tier: {hovered.tier} ({hovered.tier === 'High' ? '>45%' : hovered.tier === 'Medium' ? '30-45%' : '<30%'})
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className="flex items-center justify-center gap-5 mt-4 text-xs text-[#a0a0a0]">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#00e676]" />
          <span>High (&gt;45%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#FFD740]" />
          <span>Medium (30-45%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff5252]" />
          <span>Low (&lt;30%)</span>
        </div>
      </div>
    </div>
  );
}
