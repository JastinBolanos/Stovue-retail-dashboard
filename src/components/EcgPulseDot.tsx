import React, { useId } from 'react';

interface EcgPulseDotProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const EcgPulseDot: React.FC<EcgPulseDotProps> = ({ size = 'md', className = '' }) => {
  const uniqueId = useId().replace(/:/g, '');
  const pathId = `ecgPath_${uniqueId}`;
  const glowId = `ecgGlow_${uniqueId}`;
  const gradId = `ecgGrad_${uniqueId}`;

  const dimensions = {
    sm: { width: 44, height: 16, strokeWidth: 1.5, dotR: 2 },
    md: { width: 58, height: 20, strokeWidth: 1.75, dotR: 2.5 },
    lg: { width: 72, height: 22, strokeWidth: 2, dotR: 3 },
  }[size];

  // Exact ECG pulse wave coordinates (Start at 4,10 -> straight line -> downward dip -> high sharp peak -> deep trough -> recovery peak -> baseline -> end 56,10)
  const pathD = "M 4 10 L 14 10 L 18 13 L 23 2 L 29 18 L 34 5 L 39 10 L 56 10";

  return (
    <div 
      className={`relative inline-flex items-center select-none overflow-visible ${className}`} 
      style={{ width: dimensions.width, height: dimensions.height }}
      title="Live Telemetry Heartbeat Stream"
    >
      <svg
        viewBox="0 0 60 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible"
      >
        <defs>
          {/* Neon Green Glow Filter */}
          <filter id={glowId} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="1.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Linear Gradient for dynamic trail */}
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00FF41" stopOpacity="0.3" />
            <stop offset="60%" stopColor="#00FF41" stopOpacity="1" />
            <stop offset="100%" stopColor="#00FF41" stopOpacity="0.4" />
          </linearGradient>

          {/* Reusable Path definition for animateMotion */}
          <path id={pathId} d={pathD} />
        </defs>

        {/* Faint ambient guide baseline */}
        <path
          d={pathD}
          stroke="#00FF41"
          strokeWidth="0.75"
          strokeOpacity="0.18"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Dynamic Heartbeat Path drawing in rhythm */}
        <path
          d={pathD}
          stroke={`url(#${gradId})`}
          strokeWidth={dimensions.strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={`url(#${glowId})`}
          className="ecg-heartbeat-line"
        />

        {/* Origin Anchor Dot (fixed at starting node (4,10)) */}
        <circle
          cx="4"
          cy="10"
          r={dimensions.dotR}
          fill="#00FF41"
          filter={`url(#${glowId})`}
        />

        {/* Traveling Spark Dot - 100% mathematically locked to the SVG path via animateMotion */}
        <g filter={`url(#${glowId})`}>
          <circle
            cx="0"
            cy="0"
            r={dimensions.dotR + 0.6}
            fill="#FFFFFF"
            stroke="#00FF41"
            strokeWidth="1.2"
          >
            {/* Native SVG Motion along the path */}
            <animateMotion
              dur="2.4s"
              repeatCount="indefinite"
              calcMode="spline"
              keyTimes="0; 0.65; 0.85; 1"
              keySplines="0.4 0 0.2 1; 0.25 0.1 0.25 1; 0.25 0.1 0.25 1"
            >
              <mpath href={`#${pathId}`} />
            </animateMotion>

            {/* Synchronized Opacity Animation */}
            <animate
              attributeName="opacity"
              dur="2.4s"
              repeatCount="indefinite"
              values="0; 1; 1; 0.8; 0; 0"
              keyTimes="0; 0.08; 0.65; 0.75; 0.82; 1"
            />

            {/* Synchronized Scale Pulse on Peak Hit */}
            <animate
              attributeName="r"
              dur="2.4s"
              repeatCount="indefinite"
              values={`${dimensions.dotR}; ${dimensions.dotR + 1.2}; ${dimensions.dotR + 1.6}; ${dimensions.dotR + 0.5}; ${dimensions.dotR}`}
              keyTimes="0; 0.25; 0.45; 0.7; 1"
            />
          </circle>
        </g>
      </svg>

      <style>{`
        .ecg-heartbeat-line {
          stroke-dasharray: 85;
          stroke-dashoffset: 85;
          animation: ecgStrokeLoop 2.4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }

        @keyframes ecgStrokeLoop {
          0% {
            stroke-dashoffset: 85;
            opacity: 0.15;
          }
          10% {
            opacity: 1;
          }
          65% {
            stroke-dashoffset: 0;
            opacity: 1;
          }
          80% {
            stroke-dashoffset: -85;
            opacity: 0.7;
          }
          85%, 100% {
            stroke-dashoffset: -85;
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};
export default EcgPulseDot;

