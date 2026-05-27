import { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';

/*
  3D rotating globe with world map continent outlines.
  Countries plotted as glowing dots on actual geographic positions.
  Slow auto-rotation, draggable, hover labels.
*/

const COUNTRIES = [
  { name: 'UAE', adoption: 70, lat: 24.4, lon: 54.6, color: '#00e676' },
  { name: 'Singapore', adoption: 63, lat: 1.3, lon: 103.8, color: '#00e676' },
  { name: 'South Korea', adoption: 52, lat: 37.6, lon: 127.0, color: '#00e676' },
  { name: 'Denmark', adoption: 48, lat: 55.7, lon: 12.6, color: '#00e676' },
  { name: 'Finland', adoption: 46, lat: 60.2, lon: 24.9, color: '#00e676' },
  { name: 'UK', adoption: 42, lat: 51.5, lon: -0.1, color: '#FFD740' },
  { name: 'India', adoption: 40, lat: 20.6, lon: 78.9, color: '#FFD740' },
  { name: 'Philippines', adoption: 38, lat: 14.6, lon: 121.0, color: '#FFD740' },
  { name: 'Germany', adoption: 36, lat: 51.2, lon: 10.4, color: '#FFD740' },
  { name: 'USA', adoption: 34, lat: 39.8, lon: -98.6, color: '#FFD740' },
  { name: 'Canada', adoption: 33, lat: 56.1, lon: -106.3, color: '#FFD740' },
  { name: 'France', adoption: 30, lat: 46.6, lon: 2.2, color: '#ff5252' },
  { name: 'Japan', adoption: 28, lat: 36.2, lon: 138.3, color: '#ff5252' },
  { name: 'Brazil', adoption: 22, lat: -14.2, lon: -51.9, color: '#ff5252' },
  { name: 'Nigeria', adoption: 18, lat: 9.1, lon: 8.7, color: '#ff5252' },
];

// Simplified continent outlines as [lat, lon] arrays
const CONTINENTS = [
  // North America
  { name: 'North America', points: [
    [60,-140],[64,-139],[70,-141],[71,-156],[66,-164],[62,-167],[58,-153],[56,-133],[54,-130],
    [51,-128],[48,-124],[37,-122],[32,-117],[23,-110],[17,-100],[15,-88],[18,-88],[21,-87],
    [25,-81],[30,-81],[29,-89],[30,-90],[26,-97],[28,-97],[33,-97],[29,-95],[30,-88],
    [35,-75],[39,-74],[41,-70],[43,-66],[45,-61],[47,-53],[50,-56],[52,-56],[55,-60],
    [58,-62],[60,-65],[63,-69],[65,-62],[68,-53],[71,-55],[74,-60],[77,-69],[80,-85],
    [76,-90],[74,-95],[71,-97],[70,-115],[68,-134],[65,-141],[60,-140],
  ]},
  // South America
  { name: 'South America', points: [
    [12,-72],[10,-76],[8,-77],[4,-77],[1,-80],[-5,-81],[-6,-77],[-15,-75],[-18,-70],
    [-22,-70],[-27,-71],[-33,-72],[-42,-73],[-46,-76],[-52,-75],[-54,-69],[-55,-66],
    [-53,-64],[-52,-68],[-47,-66],[-42,-64],[-38,-57],[-35,-54],[-33,-52],[-23,-41],
    [-22,-40],[-13,-39],[-8,-35],[-5,-35],[-1,-50],[2,-52],[6,-60],[8,-60],[10,-68],
    [12,-72],
  ]},
  // Europe
  { name: 'Europe', points: [
    [36,-10],[37,-2],[38,0],[43,3],[44,8],[46,1],[48,-5],[51,-10],[54,-10],[57,-7],
    [59,-3],[61,5],[63,10],[66,14],[69,16],[71,26],[70,28],[67,26],[64,28],[62,30],
    [60,28],[57,24],[55,21],[54,14],[53,10],[51,4],[51,2],[49,2],[47,7],[46,14],
    [45,14],[44,12],[43,16],[41,20],[40,24],[41,29],[43,28],[45,30],[47,40],[44,40],
    [42,42],[40,26],[37,24],[35,24],[38,20],[40,16],[39,9],[38,1],[36,-6],[36,-10],
  ]},
  // Africa
  { name: 'Africa', points: [
    [37,-2],[36,0],[35,10],[32,12],[30,10],[25,35],[22,37],[15,43],[12,44],[11,50],
    [5,42],[2,42],[-1,42],[-5,40],[-10,40],[-15,41],[-25,35],[-27,33],[-34,26],
    [-34,18],[-30,17],[-22,14],[-17,12],[-12,14],[-5,12],[0,10],[5,2],[5,-5],
    [7,-15],[10,-16],[15,-17],[20,-17],[22,-16],[25,-14],[28,-10],[30,-10],[33,-8],
    [36,-5],[37,-2],
  ]},
  // Asia
  { name: 'Asia', points: [
    [42,42],[44,40],[47,40],[45,30],[43,28],[41,29],[40,30],[39,44],[32,48],[25,56],
    [22,60],[20,63],[17,73],[8,77],[6,80],[1,104],[3,104],[6,102],[8,105],[12,109],
    [17,108],[21,107],[22,114],[25,120],[30,122],[35,129],[38,128],[38,131],[40,130],
    [43,132],[45,143],[48,143],[50,140],[53,143],[56,138],[60,143],[62,150],[64,161],
    [67,170],[65,180],[68,180],[71,180],[72,-180],[70,-170],[65,-168],[63,-172],
    [58,-153],[56,-133],[54,-130],[60,-140],[64,-139],[70,-141],[71,-156],[66,-164],
  ]},
  // Asia (continued - mainland)
  { name: 'Asia2', points: [
    [42,42],[47,40],[50,44],[52,55],[55,60],[58,60],[62,60],[66,60],[68,70],[71,85],
    [75,90],[77,105],[76,110],[73,120],[70,136],[65,141],[60,143],[56,138],[53,143],
    [50,140],[48,143],[45,143],[43,132],[40,130],[38,131],[38,128],[35,129],[30,122],
    [25,120],[22,114],[21,107],[17,108],[12,109],[8,105],[6,102],[3,104],[1,104],
  ]},
  // Australia
  { name: 'Australia', points: [
    [-12,130],[-12,137],[-15,141],[-18,146],[-22,150],[-27,153],[-29,153],[-33,152],
    [-38,147],[-39,146],[-38,144],[-35,137],[-34,135],[-32,133],[-32,127],[-30,115],
    [-25,114],[-22,114],[-20,119],[-16,123],[-14,126],[-12,130],
  ]},
];

// Dot grid for land masses - gives a "digital map" look
const LAND_DOTS = [];
(() => {
  // Simple point-in-polygon test for land detection
  function pointInPoly(lat, lon, poly) {
    let inside = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const yi = poly[i][0], xi = poly[i][1];
      const yj = poly[j][0], xj = poly[j][1];
      if ((yi > lat) !== (yj > lat) && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) {
        inside = !inside;
      }
    }
    return inside;
  }

  for (let lat = -60; lat <= 75; lat += 4) {
    for (let lon = -180; lon <= 180; lon += 4) {
      for (const continent of CONTINENTS) {
        if (pointInPoly(lat, lon, continent.points)) {
          LAND_DOTS.push([lat, lon]);
          break;
        }
      }
    }
  }
})();

function latLonToSphere(lat, lon, radius, rotY, rotX) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + rotY) * (Math.PI / 180);

  let x = radius * Math.sin(phi) * Math.cos(theta);
  let y = -radius * Math.cos(phi);
  let z = radius * Math.sin(phi) * Math.sin(theta);

  const cosX = Math.cos(rotX * Math.PI / 180);
  const sinX = Math.sin(rotX * Math.PI / 180);
  const y2 = y * cosX - z * sinX;
  const z2 = y * sinX + z * cosX;

  return { x, y: y2, z: z2 };
}

export default function Globe3D() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: '-40px' });
  const [rotation, setRotation] = useState(0);
  const [hovered, setHovered] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef({ startX: 0, startRot: 0 });
  const animRef = useRef(null);
  const rotRef = useRef(0);

  const size = 420;
  const radius = size * 0.38;
  const center = size / 2;
  const tilt = 20;

  useEffect(() => {
    if (!isInView) return;
    let lastTime = 0;

    const animate = (time) => {
      if (!isDragging) {
        const delta = lastTime ? (time - lastTime) / 1000 : 0;
        rotRef.current += delta * 10;
        setRotation(rotRef.current);
      }
      lastTime = time;
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [isInView, isDragging]);

  const handleMouseMove = useCallback((e) => {
    const dx = e.clientX - dragRef.current.startX;
    rotRef.current = dragRef.current.startRot + dx * 0.5;
    setRotation(rotRef.current);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove]);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    dragRef.current = { startX: e.clientX, startRot: rotRef.current };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleTouchMove = useCallback((e) => {
    if (!e.touches[0]) return;
    const dx = e.touches[0].clientX - dragRef.current.startX;
    rotRef.current = dragRef.current.startRot + dx * 0.5;
    setRotation(rotRef.current);
  }, []);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);
  }, [handleTouchMove]);

  const handleTouchStart = (e) => {
    if (!e.touches[0]) return;
    setIsDragging(true);
    dragRef.current = { startX: e.touches[0].clientX, startRot: rotRef.current };
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd);
  };

  // Cleanup document listeners on unmount
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  // Project land dots onto sphere
  const landDotProjections = useMemo(() => {
    return LAND_DOTS.map(([lat, lon]) => {
      const pos = latLonToSphere(lat, lon, radius, rotation, tilt);
      return { x: center + pos.x, y: center + pos.y, z: pos.z, visible: pos.z > -5 };
    });
  }, [rotation, radius, center]);

  // Project continent outlines
  const continentPaths = useMemo(() => {
    return CONTINENTS.map((continent) => {
      const projected = continent.points.map(([lat, lon]) => {
        const pos = latLonToSphere(lat, lon, radius, rotation, tilt);
        return { x: center + pos.x, y: center + pos.y, z: pos.z };
      });

      // Build path, only drawing segments where both points are front-facing
      let d = '';
      for (let i = 0; i < projected.length; i++) {
        const p = projected[i];
        const prev = i > 0 ? projected[i - 1] : null;
        if (p.z > 0) {
          if (!prev || prev.z <= 0) {
            d += `M ${p.x.toFixed(1)} ${p.y.toFixed(1)} `;
          } else {
            d += `L ${p.x.toFixed(1)} ${p.y.toFixed(1)} `;
          }
        }
      }
      return { d, name: continent.name };
    });
  }, [rotation, radius, center]);

  // Project countries
  const projected = useMemo(() => {
    return COUNTRIES.map((c) => {
      const pos = latLonToSphere(c.lat, c.lon, radius, rotation, tilt);
      const scale = (pos.z + radius * 1.5) / (radius * 3);
      return {
        ...c,
        screenX: center + pos.x,
        screenY: center + pos.y,
        z: pos.z,
        scale,
        visible: pos.z > -radius * 0.15,
      };
    }).sort((a, b) => a.z - b.z);
  }, [rotation, radius, center]);

  // Latitude/longitude grid
  const gridLines = useMemo(() => {
    const lines = [];
    // Latitude
    for (let lat = -60; lat <= 60; lat += 30) {
      let d = '';
      for (let lon = 0; lon <= 360; lon += 3) {
        const pos = latLonToSphere(lat, lon, radius, rotation, tilt);
        if (pos.z > 0) {
          const cmd = d.length === 0 || d.endsWith('  ') ? 'M' : 'L';
          d += `${cmd} ${(center + pos.x).toFixed(1)} ${(center + pos.y).toFixed(1)} `;
        } else {
          d += '  ';
        }
      }
      lines.push(d.trim());
    }
    // Longitude
    for (let lon = 0; lon < 360; lon += 30) {
      let d = '';
      for (let lat = -90; lat <= 90; lat += 3) {
        const pos = latLonToSphere(lat, lon, radius, rotation, tilt);
        if (pos.z > 0) {
          const cmd = d.length === 0 || d.endsWith('  ') ? 'M' : 'L';
          d += `${cmd} ${(center + pos.x).toFixed(1)} ${(center + pos.y).toFixed(1)} `;
        } else {
          d += '  ';
        }
      }
      lines.push(d.trim());
    }
    return lines;
  }, [rotation, radius, center]);

  return (
    <div ref={containerRef} className="flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1, type: 'spring', stiffness: 60 }}
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className={`${isDragging ? 'cursor-grabbing' : 'cursor-grab'} select-none`}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          <defs>
            <radialGradient id="globe-bg" cx="40%" cy="35%">
              <stop offset="0%" stopColor="#0f1f14" />
              <stop offset="70%" stopColor="#0a0f0a" />
              <stop offset="100%" stopColor="#050805" />
            </radialGradient>
            <filter id="glow-globe">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <clipPath id="globe-clip">
              <circle cx={center} cy={center} r={radius} />
            </clipPath>
          </defs>

          {/* Globe body */}
          <circle cx={center} cy={center} r={radius} fill="url(#globe-bg)" stroke="#00e676" strokeWidth={1} strokeOpacity={0.15} />

          {/* Atmospheric glow */}
          <circle cx={center} cy={center} r={radius + 6} fill="none" stroke="#00e676" strokeWidth={1.5} strokeOpacity={0.06} />
          <circle cx={center} cy={center} r={radius + 14} fill="none" stroke="#00e676" strokeWidth={0.8} strokeOpacity={0.03} />

          <g clipPath="url(#globe-clip)">
            {/* Grid lines */}
            {gridLines.map((d, i) => d && (
              <path key={`grid-${i}`} d={d} fill="none" stroke="#00e676" strokeWidth={0.3} strokeOpacity={0.06} />
            ))}

            {/* Land dots - digital map style */}
            {landDotProjections.map((dot, i) => dot.visible && (
              <circle
                key={`land-${i}`}
                cx={dot.x}
                cy={dot.y}
                r={1.1}
                fill="#00e676"
                fillOpacity={Math.max(0.08, (dot.z / radius) * 0.25)}
              />
            ))}

            {/* Continent outlines */}
            {continentPaths.map((cp, i) => cp.d && (
              <path
                key={`cont-${i}`}
                d={cp.d}
                fill="none"
                stroke="#00e676"
                strokeWidth={0.8}
                strokeOpacity={0.2}
                strokeLinejoin="round"
              />
            ))}
          </g>

          {/* Country markers */}
          {projected.map((c) => {
            if (!c.visible) return null;
            const dotSize = 2.5 + (c.adoption / 70) * 4.5;
            const opacity = Math.max(0.3, c.scale);
            const isHov = hovered === c.name;

            return (
              <g
                key={c.name}
                onMouseEnter={() => setHovered(c.name)}
                onMouseLeave={() => setHovered(null)}
                className="cursor-pointer"
              >
                {/* Glow behind */}
                <circle
                  cx={c.screenX}
                  cy={c.screenY}
                  r={dotSize * 3}
                  fill={c.color}
                  fillOpacity={isHov ? 0.15 : 0.04}
                />
                {/* Main dot */}
                <circle
                  cx={c.screenX}
                  cy={c.screenY}
                  r={isHov ? dotSize * 1.4 : dotSize}
                  fill={c.color}
                  fillOpacity={opacity * (isHov ? 1 : 0.85)}
                  stroke={isHov ? '#fff' : c.color}
                  strokeWidth={isHov ? 1.5 : 0.5}
                  strokeOpacity={isHov ? 0.8 : 0.4}
                  filter={isHov ? 'url(#glow-globe)' : undefined}
                />
                {/* Pulse on hover */}
                {isHov && (
                  <circle cx={c.screenX} cy={c.screenY} r={dotSize * 2} fill="none" stroke={c.color} strokeWidth={1}>
                    <animate attributeName="r" from={dotSize * 1.5} to={dotSize * 3.5} dur="1.5s" repeatCount="indefinite" />
                    <animate attributeName="stroke-opacity" from="0.5" to="0" dur="1.5s" repeatCount="indefinite" />
                  </circle>
                )}
                {/* Label */}
                {isHov && c.z > 0 && (
                  <g>
                    <line x1={c.screenX} y1={c.screenY - dotSize * 1.5} x2={c.screenX} y2={c.screenY - dotSize * 1.5 - 14} stroke={c.color} strokeWidth={0.8} strokeOpacity={0.5} />
                    <rect
                      x={c.screenX - 48}
                      y={c.screenY - dotSize * 1.5 - 38}
                      width={96}
                      height={24}
                      rx={6}
                      fill="#0d0d0d"
                      fillOpacity={0.92}
                      stroke={c.color}
                      strokeWidth={0.8}
                      strokeOpacity={0.5}
                    />
                    <text
                      x={c.screenX}
                      y={c.screenY - dotSize * 1.5 - 22}
                      textAnchor="middle"
                      fill={c.color}
                      fontSize={11}
                      fontWeight={700}
                      fontFamily="'Plus Jakarta Sans', sans-serif"
                    >
                      {c.name} — {c.adoption}%
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </motion.div>

      <p className="text-xs text-[#666] mt-2 select-none">Drag to rotate · Hover for details</p>

      {/* Legend */}
      <div className="flex gap-5 mt-3">
        {[
          { label: 'High (>45%)', color: '#00e676' },
          { label: 'Medium (30-45%)', color: '#FFD740' },
          { label: 'Low (<30%)', color: '#ff5252' },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5 text-xs text-[#a0a0a0]">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}
