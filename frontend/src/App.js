import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  RefreshCw, 
  TrendingUp, 
  Shield, 
  AlertTriangle, 
  Brain,
  Sparkles,
  Activity,
  Rocket,
  Home,
  BarChart3,
  FileBarChart
} from "lucide-react";
import { getIssuersWithScores, getIssuerDetails, triggerRefresh } from "./api";
import IssuerTable from "./IssuerTable";
import IssuerDetail from "./IssuerDetail";
import SplitText from "./components/SplitText";
import AnimatedButton from "./components/AnimatedButton";
import LoadingDots from "./components/LoadingDots";
import ParticleBackground from "./components/ParticleBackground";
import TypewriterText from "./components/TypewriterText";
import MetricsDashboard from "./components/MetricsDashboard";
import FloatingCard from "./components/FloatingCard";
import LandingPage from "./LandingPage";
import ReportsAnalytics from "./ReportsAnalytics";
import "./styles.css";

function App() {
  const [currentView, setCurrentView] = useState("landing"); // "landing", "dashboard", or "reports"
  const [issuers, setIssuers] = useState([]);
  const [selectedIssuer, setSelectedIssuer] = useState(null);
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (currentView === "dashboard") {
      fetchIssuers();
    }
  }, [currentView]);

  const fetchIssuers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getIssuersWithScores();
      setIssuers(data);
    } catch (err) {
      setError("Failed to fetch issuers. Make sure the backend is running on http://localhost:8000");
      console.error("Error fetching issuers:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = async (issuer) => {
    try {
      setSelectedIssuer(issuer);
      setError(null);
      const det = await getIssuerDetails(issuer.id);
      setDetails(det);
    } catch (err) {
      setError("Failed to fetch issuer details");
      console.error("Error fetching details:", err);
    }
  };

  const handleRefresh = async () => {
    try {
      console.log("Refresh button clicked");
      setRefreshing(true);
      setError(null);
      
      // Call the backend to refresh the data
      console.log("Calling triggerRefresh API...");
      const refreshResult = await triggerRefresh();
      console.log("Refresh result:", refreshResult);
      
      // Fetch updated issuers after the refresh
      console.log("Fetching updated issuers...");
      await fetchIssuers();
      
      if (selectedIssuer) {
        console.log("Updating selected issuer details...");
        const det = await getIssuerDetails(selectedIssuer.id);
        setDetails(det);
      }
      
      console.log("Refresh completed successfully");
      setRefreshing(false);
    } catch (err) {
      const errorMessage = `Failed to refresh data: ${err.message}`;
      setError(errorMessage);
      console.error("Error refreshing:", err);
      setRefreshing(false);
    }
  };

  // Show landing page
  if (currentView === "landing") {
    return <LandingPage 
      onNavigateToDashboard={() => setCurrentView("dashboard")}
      onNavigateToReports={() => setCurrentView("reports")}
    />;
  }
  
  // Show reports & analytics page
  if (currentView === "reports") {
    return (
      <div className="min-h-screen">
        {/* Aurora Background */}
        <div className="aurora-bg"></div>
        <ParticleBackground />
        
        {/* Navigation */}
        <div className="fixed top-6 right-6 z-50 flex gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentView("landing")}
            className="glass rounded-lg px-4 py-2 text-white hover:bg-white/20 transition-all duration-300 flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentView("dashboard")}
            className="glass rounded-lg px-4 py-2 text-white hover:bg-white/20 transition-all duration-300 flex items-center gap-2"
          >
            <BarChart3 className="w-4 h-4" />
            <span>Dashboard</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentView("reports")}
            className="glass rounded-lg px-4 py-2 text-white bg-blue-500/20 border border-blue-400/30 flex items-center gap-2"
          >
            <FileBarChart className="w-4 h-4" />
            <span>Reports</span>
          </motion.button>
        </div>
        
        <ReportsAnalytics />
      </div>
    );
  }

  // Show dashboard
  return (
    <div className="min-h-screen">
      {/* Aurora Background */}
      <div className="aurora-bg"></div>
      <ParticleBackground />
      
      {/* Navigation */}
      <div className="fixed top-6 right-6 z-50 flex gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setCurrentView("landing")}
          className="glass rounded-lg px-4 py-2 text-white hover:bg-white/20 transition-all duration-300 flex items-center gap-2"
        >
          <Home className="w-4 h-4" />
          <span>Home</span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setCurrentView("dashboard")}
          className="glass rounded-lg px-4 py-2 text-white bg-blue-500/20 border border-blue-400/30 flex items-center gap-2"
        >
          <BarChart3 className="w-4 h-4" />
          <span>Dashboard</span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setCurrentView("reports")}
          className="glass rounded-lg px-4 py-2 text-white hover:bg-white/20 transition-all duration-300 flex items-center gap-2"
        >
          <FileBarChart className="w-4 h-4" />
          <span>Reports</span>
        </motion.button>
      </div>
      
      <div className="relative z-10 container mx-auto px-6 py-8 max-w-7xl">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="mb-4">
            <SplitText 
              text="CredTech" 
              className="text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent"
              delay={100}
              duration={0.8}
            />
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mb-4"
          >
            <TypewriterText 
              text="AI-Powered Credit Risk Assessment Platform"
              className="text-xl text-gray-300"
              delay={80}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="mb-8"
          >
            <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
              <Rocket className="w-4 h-4 text-blue-400" />
              <span>Hackathon Edition - Built to Win</span>
              <Sparkles className="w-4 h-4 text-purple-400" />
            </div>
          </motion.div>

          {/* Metrics Dashboard */}
          <MetricsDashboard />

          {/* Stats Row */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex justify-center gap-8 mb-8"
          >
            <FloatingCard delay={0.1}>
              <div className="glass rounded-lg px-6 py-3 text-center">
                <div className="flex items-center gap-2 justify-center">
                  <Brain className="w-5 h-5 text-purple-400" />
                  <span className="text-sm text-gray-300">AI-Powered</span>
                </div>
              </div>
            </FloatingCard>
            
            <FloatingCard delay={0.2}>
              <div className="glass rounded-lg px-6 py-3 text-center">
                <div className="flex items-center gap-2 justify-center">
                  <Shield className="w-5 h-5 text-green-400" />
                  <span className="text-sm text-gray-300">Risk Assessment</span>
                </div>
              </div>
            </FloatingCard>
            
            <FloatingCard delay={0.3}>
              <div className="glass rounded-lg px-6 py-3 text-center">
                <div className="flex items-center gap-2 justify-center">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                  <span className="text-sm text-gray-300">Real-time Analytics</span>
                </div>
              </div>
            </FloatingCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            <AnimatedButton 
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-3"
            >
              {refreshing ? (
                <>
                  <LoadingDots />
                  <span>Refreshing...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-5 h-5" />
                  <span>Trigger Refresh</span>
                </>
              )}
            </AnimatedButton>
          </motion.div>
        </motion.div>

        {/* Error Alert */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300"
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        {loading ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <LoadingDots />
            <p className="text-gray-400 mt-4">Loading portfolio data...</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <IssuerTable issuers={issuers} onRowClick={handleRowClick} />
            <AnimatePresence>
              {details && (
                <IssuerDetail details={details} />
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="mt-16 text-center"
        >
          <div className="glass rounded-lg px-6 py-4 inline-block">
            <div className="flex flex-col items-center gap-2 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-400" />
                <span>CredTech - AI-Powered Credit Risk Assessment Platform</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>Developed by Team M-2.5 | Hackathon Edition 2025</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default App;
