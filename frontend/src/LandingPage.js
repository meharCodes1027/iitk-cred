import React, { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import { 
  Brain, 
  Shield, 
  Bell, 
  ArrowRight, 
  Play,
  Zap,
  TrendingUp,
  Eye,
  BarChart3,
  LineChart,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import gsap from 'gsap';

// Animated Background Component
const AnimatedBackground = () => {
  const backgroundRef = useRef(null);
  
  useEffect(() => {
    const bg = backgroundRef.current;
    if (!bg) return;
    
    gsap.to(bg, {
      backgroundPosition: '100% 100%',
      duration: 20,
      ease: 'linear',
      repeat: -1,
      yoyo: true
    });
  }, []);
  
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div 
        ref={backgroundRef} 
        className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 animate-aurora"
      />
      
      {/* Floating orbs */}
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
        animate={{
          x: [0, -150, 0],
          y: [0, 100, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl"
        animate={{
          x: [-100, 100, -100],
          y: [-100, 50, -100],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>
  );
};

// Animated Gauge Chart Component
const AnimatedGauge = () => {
  const [score, setScore] = React.useState(0);
  const targetScore = 78;

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setScore(targetScore);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const circumference = 2 * Math.PI * 120;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-64 h-64 mx-auto">
      {/* Glowing border */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 p-1 animate-pulse">
        <div className="w-full h-full rounded-full bg-gray-900/90 backdrop-blur-sm" />
      </div>
      
      {/* SVG Gauge */}
      <svg className="absolute inset-4 w-56 h-56 transform -rotate-90" viewBox="0 0 250 250">
        {/* Background circle */}
        <circle
          cx="125"
          cy="125"
          r="120"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="8"
          fill="none"
        />
        {/* Progress circle */}
        <motion.circle
          cx="125"
          cy="125"
          r="120"
          stroke="url(#gaugeGradient)"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 2, ease: "easeOut" }}
          style={{
            filter: 'drop-shadow(0 0 10px rgba(59, 130, 246, 0.5))'
          }}
        />
        {/* Gradient definition */}
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.5, duration: 0.5 }}
          >
            {score}
          </motion.div>
          <div className="text-gray-400 text-sm mt-1">Risk Score</div>
        </div>
      </div>
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ icon: Icon, title, description, delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -10, scale: 1.02 }}
      className="group relative"
    >
      {/* Glassmorphism card */}
      <div className="relative backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300">
        {/* Gradient border on hover */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
        
        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-8 h-8 text-white" />
        </div>
        
        {/* Content */}
        <h3 className="text-xl font-bold text-white mb-4 group-hover:text-blue-300 transition-colors">
          {title}
        </h3>
        <p className="text-gray-300 leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
};

// Section Component with Scroll Animation
const Section = ({ children, className = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 100 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
      className={className}
    >
      {children}
    </motion.section>
  );
};

const LandingPage = ({ onNavigateToDashboard }) => {
  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-hidden">
      <AnimatedBackground />
      
      {/* Hero Section */}
      <Section className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div className="max-w-6xl mx-auto text-center">
          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-6xl md:text-8xl font-bold mb-8"
          >
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
              Credit Risk
            </span>
            <br />
            <span className="text-white">Redefined</span>
          </motion.h1>
          
          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Harness the power of AI to monitor, assess, and predict credit risks in real-time. 
            Experience the future of financial intelligence.
          </motion.p>
          
          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onNavigateToDashboard}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full font-semibold text-lg hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 flex items-center justify-center gap-3"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 border border-white/20 rounded-full font-semibold text-lg hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-3"
            >
              <Play className="w-5 h-5" />
              Watch Demo
            </motion.button>
          </motion.div>
        </div>
      </Section>

      {/* Features Section */}
      <Section className="relative z-10 py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Powered by Intelligence
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Advanced AI algorithms working around the clock to protect your financial interests
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={Brain}
              title="Realtime AI Risk Scores"
              description="Advanced machine learning algorithms continuously analyze market conditions and borrower behavior to provide real-time risk assessments with unprecedented accuracy."
              delay={0.1}
            />
            <FeatureCard
              icon={BarChart3}
              title="Agency vs Model Comparison"
              description="Compare traditional rating agency scores with our proprietary AI models to identify discrepancies and opportunities for better risk management."
              delay={0.2}
            />
            <FeatureCard
              icon={Bell}
              title="Automated Alerts"
              description="Intelligent notification system that learns your preferences and alerts you to critical changes in risk profiles before they impact your portfolio."
              delay={0.3}
            />
          </div>
        </div>
      </Section>

      {/* Visualizer Section */}
      <Section className="relative z-10 py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Risk Visualization
            </span>
          </h2>
          <p className="text-xl text-gray-300 mb-16">
            Advanced analytics dashboard with real-time risk monitoring
          </p>
          
          {/* Animated Gauge */}
          <div className="relative">
            <AnimatedGauge />
            
            {/* Floating metrics */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2, duration: 0.5 }}
              className="absolute top-0 left-0 backdrop-blur-lg bg-white/10 rounded-lg p-4 border border-white/20"
            >
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <span className="text-sm">+12% Performance</span>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2.5, duration: 0.5 }}
              className="absolute top-0 right-0 backdrop-blur-lg bg-white/10 rounded-lg p-4 border border-white/20"
            >
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-blue-400" />
                <span className="text-sm">Live Monitoring</span>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 3, duration: 0.5 }}
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 backdrop-blur-lg bg-white/10 rounded-lg p-4 border border-white/20"
            >
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span className="text-sm">0.3ms Response</span>
              </div>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* Footer */}
      <Section className="relative z-10 py-20 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-2xl font-light text-gray-300"
          >
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Built for the future of credit risk
            </span>
          </motion.p>
        </div>
      </Section>
    </div>
  );
};

export default LandingPage;
