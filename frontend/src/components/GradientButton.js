import React from 'react';
import { motion } from 'framer-motion';

const GradientButton = ({ 
  children, 
  onClick, 
  className = "",
  icon: Icon,
  variant = "primary", // primary, secondary, outline
  size = "md" // sm, md, lg
}) => {
  const sizeClasses = {
    sm: "py-1.5 px-3 text-sm",
    md: "py-2.5 px-5 text-base",
    lg: "py-3 px-6 text-lg"
  };
  
  const variantClasses = {
    primary: "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/30",
    secondary: "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/30",
    outline: "bg-transparent border-2 border-blue-500 text-blue-500 hover:bg-blue-500/10"
  };
  
  return (
    <motion.button
      className={`relative rounded-lg font-medium flex items-center justify-center gap-2 transition-all overflow-hidden ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Subtle shimmer effect */}
      <motion.div 
        className="absolute inset-0 bg-white/20"
        initial={{ x: '-100%' }}
        animate={{ x: '200%' }}
        transition={{ 
          repeat: Infinity, 
          duration: 1.5, 
          ease: "linear",
          repeatDelay: 0.5
        }}
      />
      
      {Icon && <Icon size={size === 'sm' ? 16 : size === 'md' ? 18 : 20} />}
      {children}
    </motion.button>
  );
};

export default GradientButton;
