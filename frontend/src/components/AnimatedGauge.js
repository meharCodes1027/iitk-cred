import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const AnimatedGauge = ({ value = 78, color = "#3b82f6", size = 160 }) => {
  const gaugeRef = useRef(null);
  const numberRef = useRef(null);
  
  useEffect(() => {
    if (!gaugeRef.current || !numberRef.current) return;
    
    // Animate the gauge
    gsap.fromTo(
      gaugeRef.current, 
      { strokeDashoffset: 283 }, // fully empty
      { 
        strokeDashoffset: 283 - (283 * value / 100),
        duration: 1.5,
        ease: "power2.out",
        delay: 0.5
      }
    );
    
    // Animate the number
    gsap.fromTo(
      numberRef.current,
      { innerHTML: 0 },
      {
        innerHTML: value,
        duration: 1.5,
        ease: "power2.out",
        delay: 0.5,
        snap: { innerHTML: 1 }
      }
    );
  }, [value]);
  
  return (
    <div className="relative">
      <svg width={size} height={size} viewBox="0 0 120 120" className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx="60"
          cy="60"
          r="45"
          fill="none"
          stroke="#1e293b"
          strokeWidth="8"
        />
        
        {/* Progress circle */}
        <circle
          ref={gaugeRef}
          cx="60"
          cy="60"
          r="45"
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray="283"
          strokeDashoffset="283"
        />
      </svg>
      
      {/* Value display */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="flex items-baseline">
          <span ref={numberRef} className="text-3xl font-bold text-white">0</span>
          <span className="text-lg font-medium text-gray-400 ml-0.5">%</span>
        </div>
        <span className="text-xs font-medium text-gray-400 mt-1">Score</span>
      </div>
    </div>
  );
};

export default AnimatedGauge;
