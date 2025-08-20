import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, Shield, Users, Zap, BarChart3 } from 'lucide-react';

const MetricCard = ({ icon: Icon, title, value, change, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8, y: 20 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    whileHover={{ scale: 1.05, y: -5 }}
    className="glass rounded-xl p-6 border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300"
  >
    <div className="flex items-center justify-between mb-4">
      <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-600/20">
        <Icon className="w-6 h-6 text-blue-400" />
      </div>
      <div className={`text-sm px-2 py-1 rounded-full ${change > 0 ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'}`}>
        {change > 0 ? '+' : ''}{change}%
      </div>
    </div>
    
    <div>
      <p className="text-2xl font-bold text-white mb-1">{value}</p>
      <p className="text-sm text-gray-400">{title}</p>
    </div>
  </motion.div>
);

const MetricsDashboard = () => {
  const metrics = [
    {
      icon: Shield,
      title: "Risk Score Average",
      value: "78.2",
      change: 5.2
    },
    {
      icon: DollarSign,
      title: "Portfolio Value",
      value: "$2.4B",
      change: 12.4
    },
    {
      icon: Users,
      title: "Active Issuers",
      value: "147",
      change: 8.1
    },
    {
      icon: BarChart3,
      title: "AI Accuracy",
      value: "94.8%",
      change: 2.3
    },
    {
      icon: Zap,
      title: "Processing Speed",
      value: "0.3s",
      change: -15.6
    },
    {
      icon: TrendingUp,
      title: "Success Rate",
      value: "97.1%",
      change: 1.8
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
    >
      {metrics.map((metric, index) => (
        <MetricCard
          key={index}
          {...metric}
          delay={index * 0.1}
        />
      ))}
    </motion.div>
  );
};

export default MetricsDashboard;
