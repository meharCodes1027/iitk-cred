import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';

const AnimatedGauge = ({ initialValue = 78, size = 320 }) => {
  const [value, setValue] = useState(initialValue);
  const [riskLevel, setRiskLevel] = useState('');
  const [riskColor, setRiskColor] = useState('');
  const gaugeRef = useRef(null);
  const numberRef = useRef(null);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  
  // Calculate circumference
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  
  // Update risk level based on value
  useEffect(() => {
    if (value <= 33) {
      setRiskLevel('Low Risk');
      setRiskColor('#10B981'); // green
    } else if (value <= 66) {
      setRiskLevel('Medium Risk');
      setRiskColor('#FBBF24'); // yellow
    } else {
      setRiskLevel('High Risk');
      setRiskColor('#EF4444'); // red
    }
  }, [value]);
  
  // Animate gauge on initial render and when value changes
  useEffect(() => {
    if (!gaugeRef.current || !numberRef.current) return;
    
    // Animate the gauge
    gsap.fromTo(
      gaugeRef.current, 
      { strokeDashoffset: circumference }, // fully empty
      { 
        strokeDashoffset: circumference - (circumference * value / 100),
        duration: 1.5,
        ease: "power2.out",
        delay: 0.2
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
        delay: 0.2,
        snap: { innerHTML: 1 }
      }
    );
    
    // Add pulsating glow effect to container
    if (containerRef.current) {
      gsap.to(containerRef.current, {
        boxShadow: `0 0 25px rgba(${riskColor === '#10B981' ? '16, 185, 129' : 
                             riskColor === '#FBBF24' ? '251, 191, 36' : 
                             '239, 68, 68'}, 0.3)`,
        repeat: -1,
        yoyo: true,
        duration: 2,
        ease: "sine.inOut"
      });
    }
    
    // Randomize value for demo purposes
    const interval = setInterval(() => {
      setValue(Math.floor(Math.random() * 100));
    }, 5000);
    
    return () => clearInterval(interval);
  }, [value, circumference, riskColor]);
  
  return (
    <div ref={containerRef} className="relative mx-auto w-80 h-80 flex items-center justify-center">
      {/* Glowing backdrop */}
      <motion.div 
        className="absolute inset-0 rounded-full opacity-20 blur-xl"
        style={{ backgroundColor: riskColor }}
        animate={{ 
          scale: [1, 1.05, 1],
          opacity: [0.2, 0.3, 0.2] 
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Rotating accent ring */}
      <motion.div 
        className="absolute inset-0 rounded-full border-2 border-blue-500/20"
        animate={{ rotate: 360 }}
        transition={{ 
          duration: 20, 
          repeat: Infinity, 
          ease: "linear" 
        }}
      >
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-500" />
      </motion.div>
      
      {/* Gauge SVG */}
      <div className="relative z-10">
        <svg width={size} height={size} viewBox="0 0 120 120" className="transform -rotate-90">
          {/* Backdrop blur for gauge */}
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
              <feComposite in="SourceGraphic" in2="coloredBlur" operator="over"/>
            </filter>
          </defs>
          
          {/* Background circle with gradient */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="url(#bgGradient)"
            strokeWidth="10"
            opacity="0.3"
          />
          
          {/* Progress circle with gradient */}
          <circle
            ref={gaugeRef}
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke={`url(#${value <= 33 ? 'lowRiskGradient' : value <= 66 ? 'medRiskGradient' : 'highRiskGradient'})`}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            filter="url(#glow)"
          />
          
          {/* Gradient definitions */}
          <defs>
            <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>
            
            <linearGradient id="lowRiskGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#34D399" />
            </linearGradient>
            
            <linearGradient id="medRiskGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FBBF24" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
            
            <linearGradient id="highRiskGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="100%" stopColor="#DC2626" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Value display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="flex items-baseline">
            <span ref={numberRef} className="text-4xl font-bold text-white">0</span>
            <span className="text-xl font-medium text-gray-400 ml-0.5">%</span>
          </div>
          <motion.span 
            className="text-lg font-medium mt-1"
            style={{ color: riskColor }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {riskLevel}
          </motion.span>
        </div>
      </div>
      
      {/* Mini data points around gauge */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="w-3 h-3 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50"
        />
      </div>
      
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="w-3 h-3 rounded-full bg-red-500 shadow-lg shadow-red-500/50"
        />
      </div>
      
      <div className="absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.4, duration: 0.5 }}
          className="w-3 h-3 rounded-full bg-purple-500 shadow-lg shadow-purple-500/50"
        />
      </div>
      
      <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2">
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.6, duration: 0.5 }}
          className="w-3 h-3 rounded-full bg-green-500 shadow-lg shadow-green-500/50"
        />
      </div>
    </div>
  );
};

export default AnimatedGauge;
