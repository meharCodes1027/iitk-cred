import React from 'react';
import { motion } from 'framer-motion';

const FloatingCard = ({ children, delay = 0, className = "" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotateX: -15 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ 
        duration: 0.8, 
        delay,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ 
        y: -10,
        rotateX: 5,
        transition: { duration: 0.3 }
      }}
      className={`transform-gpu perspective-1000 ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default FloatingCard;
