import React from 'react';

const ScoreIndicator = ({ score, maxScore = 100 }) => {
  const percentage = (score / maxScore) * 100;
  
  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const getScoreGradient = (score) => {
    if (score >= 80) return 'from-green-400 to-emerald-600';
    if (score >= 60) return 'from-yellow-400 to-orange-600';
    return 'from-red-400 to-red-600';
  };

  return (
    <div className="relative w-20 h-20">
      {/* Background circle */}
      <div className="absolute inset-0 rounded-full bg-gray-700/30"></div>
      
      {/* Progress circle */}
      <svg 
        className="absolute inset-0 w-full h-full transform -rotate-90" 
        viewBox="0 0 80 80"
      >
        <circle
          cx="40"
          cy="40"
          r="32"
          stroke="rgba(75, 85, 99, 0.3)"
          strokeWidth="6"
          fill="none"
        />
        <circle
          cx="40"
          cy="40"
          r="32"
          stroke={getScoreColor(score)}
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${(percentage / 100) * 201.06} 201.06`}
          className="transition-all duration-1000 ease-out"
          style={{
            filter: `drop-shadow(0 0 8px ${getScoreColor(score)}40)`
          }}
        />
      </svg>
      
      {/* Score text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div 
            className={`text-lg font-bold bg-gradient-to-br ${getScoreGradient(score)} bg-clip-text text-transparent`}
          >
            {score}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreIndicator;
