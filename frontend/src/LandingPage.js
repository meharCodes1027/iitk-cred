import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import { 
  Brain, 
  Shield, 
  Bell, 
  ArrowRight, 
  Zap,
  TrendingUp,
  Eye,
  BarChart3,
  LineChart,
  AlertTriangle,
  CheckCircle2,
  FileBarChart
} from 'lucide-react';
import gsap from 'gsap';
import AnimatedGauge from './components/AnimatedGauge';

// Animated Background Component
const AnimatedBackground = () => {
  const backgroundRef = useRef(null);
  const gridRef = useRef(null);
  
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
    
    // Animate the grid
    const grid = gridRef.current;
    if (grid) {
      gsap.to(grid, {
        backgroundPosition: '0 100%',
        duration: 30,
        ease: 'linear',
        repeat: -1
      });
    }
  }, []);
  
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Deep gradient background */}
      <div 
        ref={backgroundRef} 
        className="absolute inset-0 bg-gradient-to-br from-blue-950 via-purple-900 to-indigo-950 animate-aurora"
      />
      
      {/* Neon grid overlay */}
      <div 
        ref={gridRef}
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          perspective: '1000px',
          transform: 'rotateX(60deg)',
          backgroundPosition: '0 0',
          maskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,1) 30%)'
        }}
      />
      
      {/* Aurora waves */}
      <div className="absolute inset-x-0 top-0 h-full overflow-hidden">
        <div className="aurora-wave"></div>
        <div className="aurora-wave aurora-wave-2"></div>
      </div>
      
      {/* Floating orbs/glows */}
      <motion.div
        className="absolute top-20 left-10 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl"
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          opacity: [0.4, 0.7, 0.4]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl"
        animate={{
          x: [0, -150, 0],
          y: [0, 100, 0],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"
        animate={{
          x: [-100, 100, -100],
          y: [-100, 50, -100],
          opacity: [0.2, 0.5, 0.2]
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      {/* Glowing particles */}
      <div className="absolute inset-0" aria-hidden="true">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div 
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight,
              opacity: 0.2 + Math.random() * 0.5,
              scale: 0.2 + Math.random() * 1
            }}
            animate={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight,
              opacity: [0.2 + Math.random() * 0.5, 0.8, 0.2 + Math.random() * 0.5]
            }}
            transition={{ 
              duration: 5 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              boxShadow: '0 0 10px 2px rgba(59, 130, 246, 0.5)'
            }}
          />
        ))}
      </div>
    </div>
  );
};

// Local gauge visualization has been removed since we're now using the imported AnimatedGauge component

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
      whileHover={{ y: -10 }}
      className="group relative z-10"
    >
      {/* Card highlight glow */}
      <motion.div
        className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl opacity-0 group-hover:opacity-70 blur-xl transition-all duration-500 group-hover:duration-200"
        animate={{
          opacity: [0, 0.4, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Main card */}
      <div className="relative backdrop-blur-xl bg-gray-900/80 border border-white/10 rounded-xl p-8 h-full transition-all duration-300 shadow-lg shadow-blue-900/20">
        {/* Gradient line accent */}
        <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 opacity-50 group-hover:opacity-100 transition-opacity"></div>
        
        {/* Hover state glow */}
        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-b from-blue-500/10 via-transparent to-transparent"></div>
        
        {/* Icon with animated glow */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-blue-500/20 rounded-xl blur-xl transform scale-110 opacity-0 group-hover:opacity-70 transition-opacity"></div>
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center group-hover:scale-105 transition-transform duration-300 relative z-10">
            <Icon className="w-8 h-8 text-white" />
          </div>
          
          {/* Orbit effect on hover */}
          <motion.div 
            className="absolute top-0 right-0 h-3 w-3 rounded-full bg-blue-400/50 opacity-0 group-hover:opacity-100"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "center center", translateX: "15px", translateY: "-5px" }}
          />
        </div>
        
        {/* Content */}
        <h3 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4 group-hover:from-blue-300 group-hover:to-cyan-200 transition-all">
          {title}
        </h3>
        <p className="text-gray-300 leading-relaxed">
          {description}
        </p>
        
        {/* Bottom accent */}
        <div className="mt-6 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="h-0.5 bg-gradient-to-r from-blue-500/40 to-transparent w-16"></div>
          <div className="text-blue-400 text-xs font-medium">EXPLORE</div>
        </div>
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

const LandingPage = ({ onNavigateToDashboard, onNavigateToReports }) => {
  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-hidden">
      <AnimatedBackground />
      
      {/* Hero Section */}
      <Section className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div className="max-w-6xl mx-auto text-center">
          {/* Glowing accent */}
          <motion.div 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] -z-10"
            animate={{ 
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* Main headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6"
          >
            <span className="text-sm uppercase tracking-[0.3em] text-blue-400 font-medium">CredTech AI Platform</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-6xl md:text-8xl font-bold mb-8 relative"
          >
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
              Credit Risk
            </span>
            <br />
            <span className="text-white relative">
              Redefined
              <motion.span 
                className="absolute -right-16 top-0 text-5xl text-blue-300 opacity-25"
                animate={{ opacity: [0.25, 0.5, 0.25] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                ×
              </motion.span>
            </span>
            
            {/* Floating elements */}
            <motion.div 
              className="absolute -top-10 -right-10 h-20 w-20 rounded-full border border-blue-500/30 flex items-center justify-center"
              animate={{ 
                rotate: 360,
                opacity: [0.4, 0.8, 0.4]
              }}
              transition={{
                rotate: {
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                },
                opacity: {
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
            >
              <div className="h-14 w-14 rounded-full border border-purple-500/30" />
            </motion.div>
            
            <motion.div 
              className="absolute -bottom-10 -left-10 h-16 w-16 rounded-md border border-cyan-500/30"
              animate={{ 
                rotate: -360,
                opacity: [0.3, 0.7, 0.3]
              }}
              transition={{
                rotate: {
                  duration: 15,
                  repeat: Infinity,
                  ease: "linear"
                },
                opacity: {
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
            />
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
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              onClick={onNavigateToDashboard}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-blue-500/20"
            >
              Access Dashboard
              <ArrowRight className="w-5 h-5" />
            </motion.button>
            

          </motion.div>
          
          {/* Stats Counter */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {[
              { value: "94%", label: "Accuracy", icon: CheckCircle2 },
              { value: "0.3s", label: "Response Time", icon: Zap },
              { value: "24/7", label: "Monitoring", icon: Eye },
              { value: "147+", label: "Active Issuers", icon: BarChart3 }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                whileHover={{ y: -5 }}
                className="glass rounded-lg p-4 border border-white/10"
              >
                <stat.icon className="w-5 h-5 text-blue-400 mb-2 mx-auto" />
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* Features Section */}
      <Section className="relative z-10 py-32 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section accent */}
          <motion.div 
            className="absolute top-1/2 right-0 transform -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] -z-10"
            animate={{ 
              opacity: [0.2, 0.5, 0.2],
              x: [0, 50, 0]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-4"
            >
              <span className="inline-block py-1 px-3 rounded-full text-xs text-blue-300 bg-blue-900/30 border border-blue-500/20 uppercase tracking-wide">Core Features</span>
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-6xl font-bold mb-6"
            >
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Powered by Intelligence
              </span>
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-300 max-w-3xl mx-auto"
            >
              Advanced AI algorithms working around the clock to protect your financial interests
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting lines */}
            <div className="absolute top-1/2 left-1/2 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent -translate-y-1/2 -translate-x-1/2 hidden md:block"></div>
            
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
      <Section className="relative z-10 py-32 px-6 overflow-hidden">
        {/* Background accent */}
        <div className="absolute inset-0 opacity-50 overflow-hidden">
          <div className="absolute w-full h-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0,rgba(139,92,246,0.05)_25%,transparent_50%)]"></div>
          
          {/* Abstract grid lines */}
          <div className="absolute inset-0" 
               style={{
                 backgroundImage: 'linear-gradient(90deg, rgba(59, 130, 246, 0.07) 1px, transparent 1px), linear-gradient(rgba(59, 130, 246, 0.07) 1px, transparent 1px)', 
                 backgroundSize: '80px 80px',
                 opacity: 0.3
               }}
          ></div>
        </div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-4"
          >
            <span className="inline-block py-1 px-3 rounded-full text-xs text-purple-300 bg-purple-900/30 border border-purple-500/20 uppercase tracking-wide">Interactive Analytics</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
              Risk Visualization
            </span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-300 mb-16"
          >
            Advanced analytics dashboard with real-time risk monitoring
          </motion.p>
          
          {/* Dashboard Preview */}
          <div className="relative">
            {/* Highlight glow */}
            <motion.div 
              className="absolute inset-0 bg-blue-500/20 rounded-2xl blur-2xl"
              animate={{ 
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Animated Gauge */}
            <div className="relative backdrop-blur-lg bg-gray-900/50 border border-white/10 rounded-2xl p-10 shadow-2xl">
              <AnimatedGauge />
              
              {/* Floating metrics with improved design */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 2, duration: 0.7 }}
                className="absolute top-10 left-10 backdrop-blur-xl bg-gray-800/70 rounded-lg p-4 border border-blue-500/30 shadow-lg shadow-blue-500/20"
              >
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-full bg-green-500/10">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Performance</div>
                    <div className="text-sm font-bold text-white">+12.4%</div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 2.5, duration: 0.7 }}
                className="absolute top-10 right-10 backdrop-blur-xl bg-gray-800/70 rounded-lg p-4 border border-blue-500/30 shadow-lg shadow-blue-500/20"
              >
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-full bg-blue-500/10">
                    <Eye className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Monitoring</div>
                    <div className="text-sm font-bold text-white">Live</div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 3, duration: 0.7 }}
                className="absolute bottom-10 left-1/2 transform -translate-x-1/2 backdrop-blur-xl bg-gray-800/70 rounded-lg p-4 border border-yellow-500/30 shadow-lg shadow-yellow-500/20"
              >
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-full bg-yellow-500/10">
                    <Zap className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Response Time</div>
                    <div className="text-sm font-bold text-white">0.3ms</div>
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Connection lines */}
            <svg className="absolute inset-0 w-full h-full z-0" style={{ pointerEvents: 'none' }}>
              <motion.path 
                d="M100,100 C150,150 250,150 300,100" 
                stroke="url(#blueGradient)" 
                strokeWidth="1" 
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 0.5 }}
                viewport={{ once: true }}
                transition={{ delay: 3.5, duration: 1.5 }}
              />
              <motion.path 
                d="M500,100 C450,150 350,150 300,100" 
                stroke="url(#purpleGradient)" 
                strokeWidth="1" 
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 0.5 }}
                viewport={{ once: true }}
                transition={{ delay: 3.5, duration: 1.5 }}
              />
              <defs>
                <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.7" />
                </linearGradient>
                <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.1" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          
          {/* Call to action */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 4 }}
            className="mt-12"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(139, 92, 246, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              onClick={onNavigateToDashboard}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-medium text-white transition-all duration-300 flex items-center justify-center gap-2 mx-auto"
            >
              <LineChart className="w-4 h-4" />
              Explore Dashboard
            </motion.button>
          </motion.div>
        </div>
      </Section>

      {/* Footer */}
      <Section className="relative z-10 py-20 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <motion.h3 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
              >
                CredTech
              </motion.h3>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-gray-400"
              >
                Built for the future of credit risk assessment. Leveraging cutting-edge AI to deliver insights that matter.
              </motion.p>
            </div>
            
            <div>
              <motion.h4 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-lg font-semibold mb-4 text-white"
              >
                Features
              </motion.h4>
              <motion.ul 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="space-y-2 text-gray-400"
              >
                <li className="hover:text-blue-400 transition-colors">Real-time Monitoring</li>
                <li className="hover:text-blue-400 transition-colors">AI Risk Assessment</li>
                <li className="hover:text-blue-400 transition-colors">Interactive Dashboard</li>
                <li className="hover:text-blue-400 transition-colors">Early Warning Alerts</li>
              </motion.ul>
            </div>
            
            <div>
              <motion.h4 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-lg font-semibold mb-4 text-white"
              >
                About
              </motion.h4>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-gray-400"
              >
                <p className="mb-4">CredTech is an AI-powered credit risk assessment platform developed by Team M-2.5.</p>
                <p className="text-blue-400 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>Hackathon Edition 2025</span>
                </p>
              </motion.div>
            </div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="border-t border-white/10 mt-12 pt-6 text-center text-gray-500 text-sm"
          >
            CredTech - AI-Powered Credit Risk Assessment Platform | Team M-2.5 | &copy; 2025
          </motion.div>
        </div>
      </Section>
    </div>
  );
};

export default LandingPage;
