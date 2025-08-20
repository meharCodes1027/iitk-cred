import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, Building2 } from "lucide-react";
import GlareCard from "./components/GlareCard";
import ScoreIndicator from "./components/ScoreIndicator";
import ShinyText from "./components/ShinyText";

function getScoreColor(score) {
  if (!score) return '#64748b'; // grey for no score
  if (score >= 70) return '#10b981'; // green for safe
  if (score >= 40) return '#f59e0b'; // orange for caution
  return '#ef4444'; // red for risk
}

function getOutlookIcon(outlook) {
  switch (outlook?.toLowerCase()) {
    case 'positive': return <TrendingUp className="w-4 h-4 text-green-400" />;
    case 'negative': return <TrendingDown className="w-4 h-4 text-red-400" />;
    default: return <Minus className="w-4 h-4 text-gray-400" />;
  }
}

function formatTimestamp(timestamp) {
  if (!timestamp) return 'N/A';
  try {
    return new Date(timestamp).toLocaleString();
  } catch {
    return timestamp.slice(0, 19).replace('T', ' ');
  }
}

export default function IssuerTable({ issuers, onRowClick }) {
  if (!issuers || issuers.length === 0) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg text-gray-400">
          No issuers found. Click "Trigger Refresh" to generate sample data.
        </h3>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="gradient-border">
        <div className="gradient-border-content">
          <div className="flex items-center gap-3 mb-6">
            <Building2 className="w-6 h-6 text-blue-400" />
            <ShinyText text="Credit Portfolio" className="text-2xl font-bold" />
          </div>
          
          <div className="space-y-3">
            {issuers.map((issuer, index) => (
              <motion.div
                key={issuer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <GlareCard onClick={() => onRowClick(issuer)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{issuer.name}</h3>
                        <p className="text-sm text-gray-400">{issuer.sector}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-xs text-gray-400">Baseline Rating</p>
                        <p className="text-sm font-mono text-white">{issuer.baseline_rating}</p>
                      </div>
                      
                      {issuer.score ? (
                        <div className="text-center">
                          <p className="text-xs text-gray-400">Credit Score</p>
                          <ScoreIndicator score={issuer.score} />
                        </div>
                      ) : (
                        <div className="text-center">
                          <p className="text-xs text-gray-400">Credit Score</p>
                          <p className="text-sm text-gray-500">No Score</p>
                        </div>
                      )}
                      
                      <div className="text-center">
                        <p className="text-xs text-gray-400">Outlook</p>
                        <div className="flex items-center gap-1 mt-1">
                          {getOutlookIcon(issuer.outlook)}
                          <span className="text-sm text-white">{issuer.outlook || 'Unknown'}</span>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <p className="text-xs text-gray-400">Last Updated</p>
                        <p className="text-sm text-white">{formatTimestamp(issuer.timestamp)}</p>
                      </div>
                    </div>
                  </div>
                </GlareCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
