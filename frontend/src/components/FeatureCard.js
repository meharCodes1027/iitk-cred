import React from 'react';
import { motion } from 'framer-motion';

const FeatureCard = ({ 
  title, 
  description, 
  icon: Icon, 
  delay = 0,
  gradient = "from-blue-500 to-indigo-600"
}) => {
  return (
    <motion.div 
      className="relative p-6 rounded-xl bg-gray-900/60 backdrop-blur-md border border-gray-800 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
    >
      {/* Background glow */}
      <div className={`absolute -inset-1 opacity-20 bg-gradient-to-r ${gradient} blur-xl rounded-xl`} />
      
      {/* Icon */}
      <div className={`relative mb-4 w-12 h-12 rounded-lg bg-gradient-to-r ${gradient} flex items-center justify-center shadow-lg`}>
        <Icon size={24} className="text-white" />
      </div>
      
      {/* Content */}
      <h3 className="relative text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="relative text-sm text-gray-300">{description}</p>
      
      {/* Shine effect */}
      <motion.div 
        className="absolute inset-0 bg-white/5"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.8 }}
      />
    </motion.div>
  );
};

export default FeatureCard;
